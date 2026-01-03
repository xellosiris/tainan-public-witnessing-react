// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//正式的DB
// const firebaseConfig = {
//   apiKey: "AIzaSyBALlEUy9-6kixz6SxxZ1Gk7F69Bzu7eJ4",
//   authDomain: "tainan-public-witnessing-v2211.firebaseapp.com",
//   projectId: "tainan-public-witnessing-v2211",
//   storageBucket: "tainan-public-witnessing-v2211.firebasestorage.app",
//   messagingSenderId: "370049376124",
//   appId: "1:370049376124:web:e5456e982cc4ec24da4ef9",
//   measurementId: "G-MGWK2CSE5D",
// };

//開發的DB
const firebaseConfig = {
  apiKey: "AIzaSyBctAo4dEh7L22XmXqkW5iAnRyfDgvTlZQ",
  authDomain: "tainan-public-witnessing-dev.firebaseapp.com",
  projectId: "tainan-public-witnessing-dev",
  storageBucket: "tainan-public-witnessing-dev.firebasestorage.app",
  messagingSenderId: "1029341358770",
  appId: "1:1029341358770:web:a0647b48ffb0f4e0a977ab",
  measurementId: "G-9S7J6K0HJ8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
