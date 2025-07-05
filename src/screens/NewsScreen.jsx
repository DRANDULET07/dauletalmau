// src/screens/NewsScreen.jsx
import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "./news.css";

export default function NewsScreen() {
  const [newsList, setNewsList] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", image: "" });
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    const q = query(collection(db, "news"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsList(list);
    });
    return () => unsub();
  }, []);

  const handleAddNews = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    await addDoc(collection(db, "news"), {
      ...form,
      author: user.name,
      timestamp: serverTimestamp(),
    });

    setForm({ title: "", content: "", image: "" });
    setShowForm(false);
  };

  return (
    <div className="news-screen">
      <h2>Новости AlmaU</h2>

      {user.role === "admin" && (
        <>
          <button onClick={() => setShowForm(!showForm)} className="add-news-btn">
            {showForm ? "Отмена" : "➕ Добавить новость"}
          </button>

          {showForm && (
            <form className="news-form" onSubmit={handleAddNews}>
              <input
                type="text"
                placeholder="Заголовок"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Содержание"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Ссылка на изображение (необязательно)"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <button type="submit">Опубликовать</button>
            </form>
          )}
        </>
      )}

      <div className="news-list">
        {newsList.length === 0 ? (
          <p>Нет новостей</p>
        ) : (
          newsList.map((news) => (
            <div key={news.id} className="news-card">
              {news.image && <img src={news.image} alt="img" />}
              <div className="news-content">
                <h3>{news.title}</h3>
                <p>{news.content}</p>
                <small>
                  {news.author} · {new Date(news.timestamp?.toDate()).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
