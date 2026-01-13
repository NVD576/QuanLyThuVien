import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyDynCi5ieCeNbjxq90S5USgaA-_CoB4NIk",
  authDomain: "login-53f05.firebaseapp.com",
  databaseURL: "https://login-53f05-default-rtdb.firebaseio.com",
  projectId: "login-53f05",
  storageBucket: "login-53f05.firebasestorage.app",
  messagingSenderId: "414312040508",
  appId: "1:414312040508:web:31b34a07356365c9f75b39",
  measurementId: "G-8192YN2ND7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export {  db };