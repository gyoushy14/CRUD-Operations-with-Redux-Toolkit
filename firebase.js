// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyBoyZNsfnE6sk1eL3ebj71yEvbgSk2EslE",
    authDomain: "ideanest-crud.firebaseapp.com",
    databaseURL: "https://ideanest-crud-default-rtdb.firebaseio.com",
    projectId: "ideanest-crud",
    storageBucket: "ideanest-crud.appspot.com",
    messagingSenderId: "577701351553",
    appId: "1:577701351553:web:fda8ea551eb6d464ba3d80"
  };

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // استخدم هذه الجملة لـ Realtime Database
const storage = getStorage(app)
export { storage , db };
