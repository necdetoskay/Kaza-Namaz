import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - values from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSy...IwsA",
  authDomain: "auth-5fa37.firebaseapp.com",
  projectId: "auth-5fa37",
  storageBucket: "auth-5fa37.firebasestorage.app",
  messagingSenderId: "425002186284",
  appId: "1:425002186284:android:84abcf523e88fcc31b4389"
};

// Initialize Firebase (sadece app ve firestore - auth native plugin ile)
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
