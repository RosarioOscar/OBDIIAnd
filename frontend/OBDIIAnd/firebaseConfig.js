// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "obd2proj.firebaseapp.com",
  databaseURL: "https://obd2proj-default-rtdb.firebaseio.com",
  projectId: "obd2proj",
  storageBucket: "obd2proj.firebasestorage.app",
  messagingSenderId: "34103430668",
  appId: "1:34103430668:web:68b61f43baa7523121a829"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);