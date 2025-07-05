// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 👈 добавлено

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxyPAAgG7h9pn6SN0DROATHJRK3LurdF4",
  authDomain: "almauplatonus.firebaseapp.com",
  projectId: "almauplatonus",
  storageBucket: "almauplatonus.appspot.com", // 👈 исправлено на правильный адрес
  messagingSenderId: "1018939379512",
  appId: "1:1018939379512:web:3bee0fce08728afa397bcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app); // 👈 экспорт Firebase Storage
