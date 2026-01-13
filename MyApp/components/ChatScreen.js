import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { db } from "../configs/firebaseConfig";
import { ref, set, get, child, push, onValue } from "firebase/database";
import { MyUserContext } from "../configs/MyContext";
import { useNavigation } from "@react-navigation/native";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const user = useContext(MyUserContext);
  const navigation = useNavigation();
  const userId = user?.id || null;
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!user || !userId) return;
    const messagesRef = ref(db, `chats/${userId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([id, msg]) => ({
          id,
          ...msg,
        }));
        const sortedMessages = data.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(sortedMessages);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, [userId, user]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!user || !userId) {
      navigation.navigate("Login");
      return;
    }
    if (!text.trim()) return;
    const roomRef = ref(db, `chats/${userId}`);
    const messagesRef = ref(db, `chats/${userId}/messages`);

    const newMessage = {
      id: Date.now().toString(), 
      senderId: userId,
      senderName: `${user.firstName} ${user.lastName}`,
      senderAvatar: user.avatar || null,
      text: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]); // Optimistic update
    setText("");

    try {
      const snapshot = await get(child(ref(db), `chats/${userId}`));
      if (!snapshot.exists()) {
        await set(roomRef, {
          userId,
          userName: `${user.firstName} ${user.lastName}`,
          avatar: user.avatar || null,
        });
      }

      await push(messagesRef, {
        senderId: userId,
        senderName: `${user.firstName} ${user.lastName}`,
        senderAvatar: user.avatar || null,
        text: text.trim(),
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id)); // Rollback on error
    }
  };

  if (!user) {
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={{ marginBottom: 12, color: "#374151" }}>
          Vui lòng đăng nhập để sử dụng chat hỗ trợ.
        </Text>
        <Button
          title="Đăng nhập"
          onPress={() => navigation.navigate("Login")}
        />
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isMe = item.senderId === userId;
          return (
            <View
              style={{
                flexDirection: isMe ? "row-reverse" : "row",
                alignItems: "flex-end",
                marginVertical: 4,
                paddingHorizontal: 8,
              }}
            >
              {item.senderAvatar && (
                <Image
                  source={{ uri: item.senderAvatar }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    marginHorizontal: 6,
                  }}
                />
              )}
              <View
                style={{
                  backgroundColor: isMe ? "#DCF8C6" : "#FFF",
                  padding: 8,
                  borderRadius: 12,
                  borderTopRightRadius: isMe ? 0 : 12,
                  borderTopLeftRadius: isMe ? 12 : 0,
                  maxWidth: "75%",
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                {!isMe && (
                  <Text style={{ fontWeight: "bold", marginBottom: 2 }}>
                    {item.senderName}
                  </Text>
                )}
                <Text>{item.text}</Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: "gray",
                    marginTop: 4,
                    textAlign: "right",
                  }}
                >
                  {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          );
        }}
      />
      <View
        style={{
          flexDirection: "row",
          padding: 8,
          borderTopWidth: 1,
          borderColor: "#ddd",
          backgroundColor: "#fff",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
            marginRight: 8,
          }}
          value={text}
          onChangeText={setText}
          placeholder="Nhập tin nhắn..."
        />
        <Button title="Gửi" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}