// App.jsx — адаптированная версия с рабочим Sidebar
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./index.css";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Экраны
import Home from "./screens/Home";
import ScheduleScreen from "./screens/ScheduleScreen";
import GradesScreen from "./screens/GradesScreen";
import HomeworkScreen from "./screens/src/HomeworkScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AdminPanel from "./screens/AdminPanel";
import ChatPage from "./screens/ChatPage";
import NotificationScreen from "./screens/NotificationScreen";
import AllHomeworkScreen from "./screens/AllHomeworkScreen";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [isOpen, setIsOpen] = useState(false);

  const [loggedUser, setLoggedUser] = useState(() => {
    const stored = localStorage.getItem("loggedUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isLoggedIn = !!loggedUser;

  useEffect(() => {
    if (!loggedUser?.name) return;

    const userDocRef = doc(db, "users", loggedUser.name);

    const setOnlineStatus = async (online) => {
      try {
        await setDoc(
          userDocRef,
          {
            name: loggedUser.name,
            role: loggedUser.role || "student",
            isOnline: online,
            lastActive: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        console.error("Ошибка обновления статуса онлайн:", e);
      }
    };

    setOnlineStatus(true);

    const handleUnload = () => {
      navigator.sendBeacon(
        "/offline",
        JSON.stringify({ name: loggedUser.name })
      );
      setOnlineStatus(false);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      setOnlineStatus(false);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [loggedUser]);

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && (
          <>
            <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
              <Menu size={24} />
            </button>
            <Sidebar
              toggleTheme={toggleTheme}
              theme={theme}
              user={loggedUser}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </>
        )}

        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <Home user={loggedUser} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/notifications"
              element={
                isLoggedIn ? <NotificationScreen /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/login"
              element={<LoginScreen setLoggedUser={setLoggedUser} />}
            />
            <Route path="/register" element={<RegisterScreen />} />
            <Route
              path="/profile"
              element={
                isLoggedIn ? <ProfileScreen user={loggedUser} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/grades"
              element={isLoggedIn ? <GradesScreen /> : <Navigate to="/login" />}
            />
            <Route
              path="/homework"
              element={isLoggedIn ? <HomeworkScreen /> : <Navigate to="/login" />}
            />
            <Route
              path="/schedule"
              element={isLoggedIn ? <ScheduleScreen /> : <Navigate to="/login" />}
            />
            <Route
              path="/chat"
              element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={
                isLoggedIn && loggedUser.role === "admin" ? (
                  <AdminPanel user={loggedUser} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/all-homework"
              element={
                isLoggedIn && loggedUser.role === "admin" ? (
                  <AllHomeworkScreen />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
