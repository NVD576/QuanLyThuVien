import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiLogIn, FiUser, FiLogOut, FiMenu, FiX, FiMessageCircle } from "react-icons/fi";
import { MyDispatcherContext, MyUserContext } from "../../configs/MyContexts";
import { ref, onValue } from "firebase/database";
import { db } from "../../configs/firebaseConfig";
import cookie from "js-cookie";

const Header = ({ toggleSidebar, sidebarCollapsed, showToggle }) => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatcherContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'Admin') return;

    const chatRef = ref(db, "chats");
    
    const unsubscribe = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const chats = snapshot.val();
        const newNotifications = [];
        let totalUnread = 0;

        Object.keys(chats).forEach(roomId => {
          if (chats[roomId].messages) {
            const messages = Object.values(chats[roomId].messages);
            const lastMessage = messages[messages.length - 1];
            
            if (
              lastMessage &&
              lastMessage.senderId !== "admin" &&
              Date.now() - lastMessage.timestamp < 300000
            ) {
              totalUnread++;
              newNotifications.push({
                id: roomId,
                userId: roomId,
                message: lastMessage.text,
                timestamp: lastMessage.timestamp,
                senderName: lastMessage.senderName || `User ${roomId}`,
                isNew: Date.now() - lastMessage.timestamp < 60000 
              });
            }
          }
        });

        setUnreadCount(totalUnread);
        setNotifications(newNotifications.sort((a, b) => b.timestamp - a.timestamp));
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = () => {
    cookie.remove("token");
    dispatch({ type: "logout" });
    navigate("/login");
    setShowMenu(false);
  };

  const handleNotificationClick = (notification) => {
    navigate(`/admin_chat?room=${notification.userId}`);
    setShowNotifications(false);
  };

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    return `${Math.floor(diff / 3600)} giờ trước`;
  };

  return (
    <header className="bg-gray-900 fixed sticky top-0 z-40 border-b">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
 
          <div className="flex items-center gap-4">
      
            {showToggle && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-gray-300 hover:text-white"
                aria-label={sidebarCollapsed ? "Mở sidebar" : "Đóng sidebar"}
              >
                {sidebarCollapsed ? (
                  <FiMenu className="w-5 h-5" />
                ) : (
                  <FiX className="w-5 h-5" />
                )}
              </button>
            )}
            
            <Link className="text-2xl text-indigo-600 font-bold tracking-wide no-underline" to="/">
              Library Management System
            </Link>
          </div>

          <div className="flex items-center gap-4 relative">
            {user ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-gray-500 hover:text-indigo-600 transition p-2 rounded-full hover:bg-gray-800 relative"
                  >
                    <FiBell size={20} />
                    {unreadCount > 0 && (
                      <>
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                        {notifications.some(n => n.isNew) && (
                          <span className="absolute -top-0.5 -right-0.5 bg-green-400 rounded-full h-3 w-3 animate-ping"></span>
                        )}
                      </>
                    )}
                  </button>

                  {showNotifications && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-50 border max-h-96 overflow-y-auto"
                      onMouseLeave={() => setShowNotifications(false)}
                    >
                      <div className="px-4 py-2 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <FiMessageCircle className="text-indigo-600" />
                          Tin nhắn mới ({unreadCount})
                        </h3>
                      </div>

                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <FiBell className="mx-auto mb-2" size={24} />
                          <p>Không có tin nhắn mới</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notification.isNew ? 'bg-green-400 animate-pulse' : 'bg-blue-400'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="font-medium text-sm text-gray-800 truncate">
                                    {notification.senderName}
                                  </p>
                                  <span className="text-xs text-gray-500 flex-shrink-0">
                                    {formatTime(notification.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {notification.message}
                                </p>
                                {notification.isNew && (
                                  <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    Mới
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}

                      {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t bg-gray-50">
                          <button
                            onClick={() => {
                              navigate('/admin_chat');
                              setShowNotifications(false);
                            }}
                            className="w-full text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Xem tất cả tin nhắn
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center focus:outline-none"
                  >
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 hover:border-indigo-500 transition"
                    />
                  </button>
                  {showMenu && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50 border"
                      onMouseLeave={() => setShowMenu(false)}
                    >
                      <div className="px-4 py-2 border-b mb-2">
                        <p className="text-sm font-semibold text-gray-800">{`${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`}</p>
                        <p className="text-xs text-gray-500">{user.role || user.user_role}</p>
                      </div>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                        onClick={() => {
                          navigate("/profile");
                          setShowMenu(false);
                        }}
                      >
                        <FiUser />
                        Thông tin cá nhân
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                        onClick={handleLogout}
                      >
                        <FiLogOut />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition no-underline text-sm"
              >
                <FiLogIn /> Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>


    </header>
  );
};

export default Header;