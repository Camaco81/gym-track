// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Si usas autenticación

  const firebaseConfig = {
    apiKey: "AIzaSyAPbhoZh3XdgAbzZm6p7JHgMczRS__B_QY",
    authDomain: "gym-app-ca9ae.firebaseapp.com",
    projectId: "gym-app-ca9ae",
    storageBucket: "gym-app-ca9ae.firebasestorage.app",
    messagingSenderId: "821853328281",
    appId: "1:821853328281:web:5bbcc64dac7bef8b59b908"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Si usas autenticación

export { db, auth }; // Exporta lo que necesites