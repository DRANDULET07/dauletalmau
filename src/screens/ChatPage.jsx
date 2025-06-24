import React, { useState } from "react";
import "./ChatPage.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  const handleSend = () => {
    if (!input && !file) return;

    const newMessage = {
      id: Date.now(),
      sender: "student",
      text: input,
      fileUrl: file ? URL.createObjectURL(file) : null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "отправлено",
      avatar: "https://i.pravatar.cc/40?img=5", // можно заменить на свои
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setFile(null);
  };

  return (
    <div className="chat-container">
      <h2>Чат с преподавателем</h2>
      <div className="chat-window">
        {messages.map((msg) => (
          <div
            className={`chat-bubble ${msg.sender === "student" ? "right" : "left"}`}
            key={msg.id}
          >
            <img src={msg.avatar} alt="avatar" className="avatar" />
            <div className="bubble-content">
              <p>{msg.text}</p>
              {msg.fileUrl && (
                <a href={msg.fileUrl} download className="file-link">📎 Скачать файл</a>
              )}
              <div className="meta">
                <span className="time">{msg.time}</span>
                <span className="status">{msg.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="input-area">
        <textarea
          placeholder="Введите сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={handleSend}>Отправить</button>
      </div>
    </div>
  );
};

export default ChatPage;
