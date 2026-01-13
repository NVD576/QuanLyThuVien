/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  ref,
  onValue,
  push,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";
import { db } from "../configs/firebaseConfig";
import { MyUserContext } from "../configs/MyContexts";
import { IoSend, IoAlertCircle } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomDetails, setRoomDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const listenersRef = useRef({});

  useEffect(() => {
    const chatRef = ref(db, "chats");
    const unsubscribeRooms = onValue(
      chatRef,
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const roomsData = Object.entries(data).map(([id, room]) => ({
              id,
              name: room.userName || `User ${id}`,
              avatar: room.avatar || null,
            }));
            setRooms(roomsData);

            roomsData.forEach((room) => {
              if (listenersRef.current[room.id]) return;

              const messagesRef = query(
                ref(db, `chats/${room.id}/messages`),
                orderByChild("timestamp"),
                limitToLast(1)
              );
              const unsubscribeMsg = onValue(messagesRef, (msgSnapshot) => {
                if (msgSnapshot.exists()) {
                  const lastMsg = Object.values(msgSnapshot.val())[0];
                  setRoomDetails((prev) => ({
                    ...prev,
                    [room.id]: {
                      lastMessage: lastMsg,
                    },
                  }));
                }
              });
              listenersRef.current[room.id] = unsubscribeMsg;
            });
          } else {
            setRooms([]);
          }
        } catch (err) {
          console.error("Error loading rooms:", err);
          setError("Không thể tải danh sách phòng chat");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firebase error:", err);
        setError("Lỗi kết nối Firebase");
        setLoading(false);
      }
    );

    return () => {
      unsubscribeRooms();
      Object.values(listenersRef.current).forEach((unsubscribe) =>
        unsubscribe()
      );
    };
  }, []);

  return { rooms, roomDetails, setRoomDetails, loading, error };
};

export default function AdminChat() {
  const {
    rooms,
    roomDetails,
    setRoomDetails,
    loading,
    error: roomsError,
  } = useRooms();
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [text, setText] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sending, setSending] = useState(false);
  const user = useContext(MyUserContext);
  const messagesContainerRef = useRef(null);
  const currentRoomListenerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      requestAnimationFrame(() => {
        const container = messagesContainerRef.current;
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    rooms.forEach((room) => {
      const details = roomDetails[room.id];
      if (
        details &&
        details.lastMessage &&
        details.lastMessage.senderId !== "admin" &&
        room.id !== currentRoom
      ) {
        setRoomDetails((prev) => ({
          ...prev,
          [room.id]: { ...prev[room.id], unread: true },
        }));
      }
    });
  }, [roomDetails, currentRoom, rooms]);

  const selectRoom = useCallback(
    (roomId) => {
      if (currentRoom === roomId) return;

      if (currentRoomListenerRef.current) {
        currentRoomListenerRef.current();
      }

      setCurrentRoom(roomId);
      setMessages([]);
      setMessagesError(null);
      setMessagesLoading(true);

      setRoomDetails((prev) => ({
        ...prev,
        [roomId]: { ...prev[roomId], unread: false },
      }));

      const messagesRef = query(
        ref(db, `chats/${roomId}/messages`),
        orderByChild("timestamp")
      );
      const unsubscribe = onValue(
        messagesRef,
        (snapshot) => {
          try {
            const loadedMessages = snapshot.exists()
              ? Object.values(snapshot.val())
              : [];
            setMessages(loadedMessages);
            requestAnimationFrame(() => {
              if (messagesContainerRef.current) {
                const container = messagesContainerRef.current;
                container.scrollTo({
                  top: container.scrollHeight,
                  behavior: "auto",
                });
              }
            });
          } catch (err) {
            console.error("Error loading messages:", err);
            setMessagesError("Không thể tải tin nhắn");
          } finally {
            setMessagesLoading(false);
          }
        },
        (error) => {
          console.error("Firebase error loading messages:", error);
          setMessagesError("Lỗi tải tin nhắn");
          setMessagesLoading(false);
        }
      );
      currentRoomListenerRef.current = unsubscribe;
    },
    [currentRoom]
  );

  const sendMessage = useCallback(async () => {
    if (!text.trim() || !currentRoom || sending) return;
    setSending(true);
    setMessagesError(null);

    const newMessage = {
      senderId: "admin",
      senderName: "Quản trị viên",
      senderAvatar: user?.avatar || null,
      text: text.trim(),
      timestamp: Date.now(),
    };

    setText("");

    try {
      await push(ref(db, `chats/${currentRoom}/messages`), newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessagesError("Không thể gửi tin nhắn. Vui lòng thử lại.");
      setText(newMessage.text);
    } finally {
      setSending(false);
    }
  }, [text, currentRoom, sending, user?.avatar]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const sortedRooms = React.useMemo(() => {
    return [...rooms].sort((a, b) => {
      const aUnread = roomDetails[a.id]?.unread ? 1 : 0;
      const bUnread = roomDetails[b.id]?.unread ? 1 : 0;
      if (bUnread !== aUnread) return bUnread - aUnread;

      const aTime = roomDetails[a.id]?.lastMessage?.timestamp || 0;
      const bTime = roomDetails[b.id]?.lastMessage?.timestamp || 0;
      return bTime - aTime;
    });
  }, [rooms, roomDetails]);

  const formatTime = useCallback((timestamp) => {
    if (!timestamp) return "";
    return dayjs(timestamp).fromNow(); // "vài giây trước", "3 phút trước"...
  }, []);

  const SkeletonLoader = () => (
    <div className="flex h-full bg-slate-100 font-sans">
      <div className="w-80 flex-shrink-0 border-r border-slate-200 bg-white p-2">
        <div className="h-16 bg-slate-200 rounded-lg animate-pulse mb-2"></div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2 my-1">
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-white border-b border-slate-200 animate-pulse"></div>
        <div className="flex-1 p-4"></div>
        <div className="h-20 bg-white border-t border-slate-200 animate-pulse"></div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="flex h-full bg-slate-50 font-sans text-slate-800">
      {/* Rooms List */}
      <div className="w-80 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-1">Hộp thư</h3>
          <p className="text-sm text-slate-500">
            {rooms.length} cuộc trò chuyện
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="p-4 text-center text-slate-500 mt-10">
              <FiMessageSquare className="mx-auto text-4xl text-slate-400 mb-3" />
              Chưa có cuộc trò chuyện nào.
            </div>
          ) : (
            sortedRooms.map((room) => {
              const details = roomDetails[room.id];
              const isUnread = details?.unread;
              return (
                <div
                  key={room.id}
                  onClick={() => selectRoom(room.id)}
                  className={`flex items-center gap-3 p-3 cursor-pointer border-b border-slate-100 transition-colors duration-200 ${
                    currentRoom === room.id
                      ? "bg-sky-50 border-l-4 border-l-sky-500"
                      : `hover:bg-slate-50 ${isUnread ? "bg-sky-50/50" : ""}`
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        room.avatar ||
                        "https://placehold.co/40x40/E2E8F0/475569?text=U"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/40x40/E2E8F0/475569?text=U";
                      }}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {isUnread && (
                      <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p
                        className={`truncate ${
                          isUnread
                            ? "font-bold text-slate-800"
                            : "font-semibold text-slate-700"
                        }`}
                      >
                        {room.name}
                      </p>
                      <p className="text-xs text-slate-400 flex-shrink-0 ml-2">
                        {formatTime(details?.lastMessage?.timestamp)}
                      </p>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        isUnread ? "text-slate-600" : "text-slate-500"
                      }`}
                    >
                      {details?.lastMessage?.text || "..."}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-100">
        {currentRoom ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-white shadow-sm flex items-center gap-3">
              <img
                src={
                  rooms.find((r) => r.id === currentRoom)?.avatar ||
                  "https://placehold.co/40x40/E2E8F0/475569?text=U"
                }
                alt="user avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h3 className="font-semibold text-slate-800">
                {rooms.find((r) => r.id === currentRoom)?.name || currentRoom}
              </h3>
            </div>
            {(messagesError || roomsError) && (
              <div className="p-3 bg-red-50 border-b border-red-200 flex items-center gap-2">
                <IoAlertCircle className="text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">
                  {messagesError || roomsError}
                </span>
              </div>
            )}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4"
              ref={messagesContainerRef}
            >
              {messagesLoading ? (
                <div className="text-center text-slate-500">
                  Đang tải tin nhắn...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-500 mt-8">
                  Chưa có tin nhắn nào. Bắt đầu cuộc trò chuyện!
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg.timestamp + "-" + index}
                    className={`flex items-end gap-3 max-w-xl ${
                      msg.senderId === "admin"
                        ? "ml-auto flex-row-reverse"
                        : "mr-auto"
                    }`}
                  >
                    <img
                      src={
                        msg.senderAvatar ||
                        "https://placehold.co/32x32/E2E8F0/475569?text=U"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/32x32/E2E8F0/475569?text=U";
                      }}
                      alt=""
                      className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                    />
                    <div
                      className={`p-3 rounded-2xl shadow-sm ${
                        msg.senderId === "admin"
                          ? "bg-sky-500 text-white rounded-br-none"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                      <p
                        className={`text-xs mt-2 text-right ${
                          msg.senderId === "admin"
                            ? "text-sky-200"
                            : "text-slate-400"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-center gap-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  disabled={sending}
                  className="flex-1 py-3 px-4 rounded-full bg-slate-100 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim() || sending}
                  className="p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <IoSend size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-500 p-8 text-center">
            <FiMessageSquare className="text-6xl text-slate-300 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-slate-700">
              Chào mừng đến Hộp thư
            </h3>
            <p>Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
