// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../firebase";


export const AuthContext = createContext(); // <-- AGREGA ESTA LÍNEA

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    // El usuario ya estará autenticado y tu AuthContext lo detectará
  } catch (error) {
    alert("Error al iniciar sesión con Google");
  }
};

export function useAuth() {
  return useContext(AuthContext);
}


