// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjIOJCQYCzAVVTj3SaXKgWifXRrkDdN6o",
  authDomain: "fineaseauth.firebaseapp.com",
  projectId: "fineaseauth",
  storageBucket: "fineaseauth.firebasestorage.app",
  messagingSenderId: "870360589255",
  appId: "1:870360589255:web:85813145b9723a0ce76fe2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);