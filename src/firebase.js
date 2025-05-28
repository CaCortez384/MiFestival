// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
