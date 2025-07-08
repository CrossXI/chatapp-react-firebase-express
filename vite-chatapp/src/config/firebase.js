// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "react-chatapp-a55ec.firebaseapp.com",
  projectId: "react-chatapp-a55ec",
  storageBucket: "react-chatapp-a55ec.firebasestorage.app",
  messagingSenderId: "683396805018",
  appId: "1:683396805018:web:6381a50fc7344f662e8a23",
  measurementId: "G-FF2Z5LW3Q8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);