// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC_9xeGTxjepbgqe9GaehoyUgY-h7-TL4",
  authDomain: "side-quest-5f019.firebaseapp.com",
  projectId: "side-quest-5f019",
  storageBucket: "side-quest-5f019.firebasestorage.app",
  messagingSenderId: "681417060931",
  appId: "1:681417060931:web:2574156e7ccce882cb5af6",
  measurementId: "G-GHVPGKNLY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
