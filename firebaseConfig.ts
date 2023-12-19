// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAwjP8vlequeHrXiZYOR2J9EQFSOlTdKw",
  authDomain: "insightiadocs.firebaseapp.com",
  projectId: "insightiadocs",
  storageBucket: "insightiadocs.appspot.com",
  messagingSenderId: "635941664429",
  appId: "1:635941664429:web:f71a4d66d4cb6b8a0e7824",
  measurementId: "G-FN8Y756NYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);