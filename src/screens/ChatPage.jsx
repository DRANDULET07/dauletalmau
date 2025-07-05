import React, { useState, useEffect, useRef } from "react";
import "./ChatPage.css";
import "../components/ui/navbar.css";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiSend, FiPaperclip } from "react-icons/fi";

const ChatPage = () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [allMessages, setAllMessages] = useState({});
  const [userStatuses, setUserStatuses] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [chatList, setChatList] = useState([]);
  const bottomRef = useRef(null);
  const [allUsers, setAllUsers] = useState([]);

  const messages = selectedUser ? allMessages[selectedUser] || [] : [];

  const getChatId = (user1, user2) => {
    const users = [user1.toLowerCase(), user2.toLowerCase()].sort();
    return `${users[0]}_${users[1]}`;
  };

  useEffect(() => {
    if (!loggedUser?.username) return;
    const q = query(
      collection(db, "messages"),
      orderBy("time")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = new Set();
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.sender === loggedUser.username) {
          chats.add(data.receiver);
        } else if (data.receiver === loggedUser.username) {
          chats.add(data.sender);
        }
      });
      setChatList(Array.from(chats));
    });
    return () => unsubscribe();
  }, [loggedUser?.username]);

  useEffect(() => {
    if (!selectedUser || !loggedUser?.username) return;
    const chatId = getChatId(loggedUser.username, selectedUser);
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("time")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((doc) => doc.data());
      setAllMessages((prev) => ({
        ...prev,
        [selectedUser]: loaded,
      }));
      console.log('messages:', loaded);
    });
    return () => unsubscribe();
  }, [selectedUser, loggedUser?.username]);

  useEffect(() => {
    const fetchStatuses = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const statusMap = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const username = data.username || data.name || doc.id;
        statusMap[username] = {
          isOnline: data.isOnline,
          lastActive: data.lastActive?.toDate(),
          avatar: data.avatar || "https://i.pravatar.cc/40?img=8",
        };
      });
      setUserStatuses(statusMap);
      console.log('userStatuses:', statusMap);
    };
    fetchStatuses();
    const interval = setInterval(fetchStatuses, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const users = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if ((data.username || data.name || doc.id) !== loggedUser?.username) {
          users.push({
            username: data.username || data.name || doc.id,
            avatar: data.avatar || "https://i.pravatar.cc/40?img=8",
          });
        }
      });
      setAllUsers(users);
    };
    fetchAllUsers();
  }, [loggedUser?.username]);

  const handleSend = async () => {
    if ((!input && !file) || !selectedUser || isSending) return;
    setIsSending(true);
    let fileUrl = null;
    if (file) {
      try {
        const fileRef = ref(storage, `messages/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      } catch (err) {
        setIsSending(false);
        return;
      }
    }
    const chatId = getChatId(loggedUser.username, selectedUser);
    const newMessage = {
      sender: loggedUser.username,
      receiver: selectedUser,
      text: input,
      fileUrl,
      time: new Date().toISOString(),
      status: "отправлено",
      chatId: chatId,
    };
    try {
      await addDoc(collection(db, "messages"), newMessage);
      setInput("");
      setFile(null);
    } finally {
      setIsSending(false);
    }
  };

  const getStatusText = (user) => {
    const status = userStatuses[user];
    if (!status) return "";
    if (status.isOnline) return "🟢 в сети";
    if (status.lastActive) {
      const date = status.lastActive.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `⚪️ был(а) в ${date}`;
    }
    return "⚪️ оффлайн";
  };

  const filteredUsers = allUsers.filter((user) =>
    typeof user.username === 'string' && user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="chat-container">
        <h2>{selectedUser ? `Чат с ${selectedUser}` : "Выберите пользователя"}</h2>
        <div className="chat-window">
          {messages.map((msg, index) => {
            const isOwnMessage = msg.sender === loggedUser.username;
            return (
              <div
                className={`chat-bubble ${isOwnMessage ? "right" : "left"}`}
                key={index}
              >
                <img
                  src={userStatuses[msg.sender]?.avatar || "https://i.pravatar.cc/40?img=8"}
                  alt="avatar"
                  className="avatar"
                />
                <div className="bubble-content">
                  <p>{msg.text}</p>
                  {msg.fileUrl && (
                    <a href={msg.fileUrl} download className="file-link">
                      📎 Скачать файл
                    </a>
                  )}
                  <div className="meta">
                    <span className="time">
                      {new Date(msg.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="status">{msg.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        {selectedUser && (
          <div className="input-area">
            <label className="icon-button">
              <FiPaperclip size={18} />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ display: "none" }}
              />
            </label>
            <textarea
              placeholder="Введите сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isSending}
            />
            <button
              onClick={handleSend}
              className="icon-button"
              disabled={isSending}
            >
              {isSending ? (
                <div className="loading-spinner"></div>
              ) : (
                <FiSend size={18} />
              )}
            </button>
          </div>
        )}
      </div>
      <div className="chat-sidebar">
        <h3>Пользователи</h3>
        <input
          type="text"
          placeholder="Поиск..."
          className="chat-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="chat-list">
          {filteredUsers.map((user) => (
            <li
              key={user.username}
              className={user.username === selectedUser ? "active" : ""}
              onClick={() => setSelectedUser(user.username)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <img src={userStatuses[user.username]?.avatar || "https://i.pravatar.cc/40?img=8"} alt="avatar" className="avatar" style={{ width: 32, height: 32, marginRight: 8 }} />
                  {user.username}
                </span>
                <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                  {getStatusText(user.username)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatPage;
