import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((n) => n.userId?.toLowerCase() === user.name?.toLowerCase());

      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="main-screen">
      <h2>Уведомления</h2>
      {notifications.length === 0 ? (
        <p>Нет уведомлений</p>
      ) : (
        <ul className="notif-list">
          {notifications.map((notif) => (
            <li key={notif.id} className="notif-item">
              <p>{notif.text}</p>
              <small>{new Date(notif.timestamp?.toDate()).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
