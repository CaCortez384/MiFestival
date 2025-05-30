// src/firebase.js
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // <-- Importa Firestore
// Asegúrate de que las dependencias de Firebase estén instaladas en tu proyecto  

const firebaseConfig = {
  apiKey: "AIzaSyBevzr195vLYGn0dZMbY6kHoXodhakMs8Q",
  authDomain: "mifestival.firebaseapp.com",
  projectId: "mifestival",
  storageBucket: "mifestival.firebasestorage.app",
  messagingSenderId: "187634126304",
  appId: "1:187634126304:web:9993f23dcad9281f8e6f85"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // <-- Agrega esta línea
export const loginWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
    // El usuario se autentica y tu AuthContext lo detecta automáticamente
  } catch (error) {
    alert("Error al iniciar sesión con Google");
  }
};