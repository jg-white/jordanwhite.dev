// filepath: c:\repos\jordanwhite.dev\daily-devops\firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Load Firebase config from environment variable or file
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG || "{}");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
