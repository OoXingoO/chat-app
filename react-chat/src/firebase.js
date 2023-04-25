import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBLMIhwHmWjwKTAF_E6YyrHea-xnLG4CHU",
    authDomain: "chat-app-f4efc.firebaseapp.com",
    projectId: "chat-app-f4efc",
    storageBucket: "chat-app-f4efc.appspot.com",
    messagingSenderId: "526506844454",
    appId: "1:526506844454:web:627ddf9238347a3602e1e7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(); //To upload image to cloud storage
export const db = getFirestore(); //To add data to cloud database