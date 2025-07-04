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
  const bottomRef = useRef(null);

  const handleSend = async () => {
    if ((!input && !file) || !selectedUser) return;

    let fileUrl = null;

    if (file) {
      try {
        const fileRef = ref(storage, `messages/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      } catch (err) {
        console.error("Ошибка загрузки файла:", err);
      }
    }

    const newMessage = {
      sender: loggedUser?.username || "student",
      text: input,
      fileUrl,
      time: new Date().toISOString(),
      status: "отправлено",
      avatar: loggedUser?.avatar || "https://i.pravatar.cc/40?img=5",
      user: selectedUser,
    };

    try {
      await addDoc(collection(db, "messages"), newMessage);
      setInput("");
      setFile(null);
    } catch (err) {
      console.error("Ошибка при отправке:", err);
    }
  };

  useEffect(() => {
    if (!selectedUser) return;

    const q = query(
      collection(db, "messages"),
      where("user", "==", selectedUser),
      orderBy("time")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((doc) => doc.data());
      setAllMessages((prev) => ({
        ...prev,
        [selectedUser]: loaded,
      }));
    });

    return () => unsubscribe();
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  useEffect(() => {
    const fetchStatuses = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const statusMap = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        statusMap[data.name || doc.id] = {
          isOnline: data.isOnline,
          lastActive: data.lastActive?.toDate(),
          avatar: data.avatar || "https://i.pravatar.cc/40?img=8",
        };
      });
      setUserStatuses(statusMap);
    };

    fetchStatuses();
    const interval = setInterval(fetchStatuses, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const allUsers =
    Object.keys(userStatuses).length > 0
      ? Object.keys(userStatuses)
      : [
          "Айдана Ахметова",
          "Нурлан Сагатов",
          "Жансая Елеусизова",
          "Бахытжан Абдрахманов",
          "Данияр Кабдрашев",
        ];

  const filteredUsers = allUsers.filter((user) =>
    user.toLowerCase().includes(search.toLowerCase())
  );

  const messages = selectedUser ? allMessages[selectedUser] || [] : [];

  return (
    <div className="page-wrapper">
      <div className="chat-container">
        <h2>{selectedUser ? `Чат с ${selectedUser}` : "Выберите пользователя"}</h2>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              className={`chat-bubble ${msg.sender === loggedUser?.username ? "right" : "left"}`}
              key={index}
            >
              <img
                src={
                  msg.sender === loggedUser?.username
                    ? loggedUser.avatar
                    : userStatuses[msg.sender]?.avatar || "https://i.pravatar.cc/40?img=8"
                }
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
          ))}
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
            />

            <button onClick={handleSend} className="icon-button">
              <FiSend size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="chat-sidebar">
        <h3>Чаты</h3>

        <input
          type="text"
          placeholder="Добавить собеседника и начать чат..."
          className="chat-add"
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              const newName = e.target.value.trim();
              if (!newName) return;
              if (Object.keys(userStatuses).includes(newName)) {
                setSelectedUser(newName);
              } else {
                try {
                  await addDoc(collection(db, "users"), {
                    name: newName,
                    isOnline: true,
                    lastActive: new Date(),
                  });
                  setSelectedUser(newName);
                } catch (err) {
                  console.error("Ошибка добавления пользователя:", err);
                }
              }
              e.target.value = "";
            }
          }}
        />

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
              key={user}
              className={user === selectedUser ? "active" : ""}
              onClick={() => setSelectedUser(user)}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{user}</span>
                <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                  {getStatusText(user)}
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
