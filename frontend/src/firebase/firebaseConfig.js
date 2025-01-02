// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0745o36JyAOPhNNBqh2A2BxYNO-y8N4A",
  authDomain: "exclusiveideas-c9470.firebaseapp.com",
  projectId: "exclusiveideas-c9470",
  storageBucket: "exclusiveideas-c9470.appspot.com",
  messagingSenderId: "739256427347",
  appId: "1:739256427347:web:d1ad41f321ba6bbbe977a6",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore };
