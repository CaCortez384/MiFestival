import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import mflogo from "../assets/mflogo20.png";
import { Link } from "react-router-dom";

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: nombre });
      navigate('/login');
    } catch (err) {
      setError('Error al crear cuenta: ' + err.message);
    }
  };

  // --- Registro con Google ---
  const handleGoogleRegister = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/login');
    } catch (err) {
      setError('Error con Google: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white bg-opacity-80 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src={mflogo} alt="MiFestival Logo" className="w-12 h-12 rounded-2xl shadow-lg" />
          <span className="text-3xl font-black text-purple-700 tracking-tight">MiFestival</span>
        </div>
        <button
          onClick={() => navigate('/home')}
          className="bg-white text-purple-700 border-2 border-purple-500 font-bold py-2 px-6 rounded-full shadow hover:bg-purple-50 transition"
        >
          Volver
        </button>
      </header>
      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center">
          <img
            src={mflogo}
            alt="Ilustración registro"
            className="w-32 mb-4 drop-shadow"
          />
          <h1 className="text-3xl font-extrabold text-purple-700 mb-2 text-center">¡Únete a MiFestival!</h1>
          <p className="text-md text-gray-600 mb-6 text-center">Crea tu cuenta y comienza a diseñar tu propio festival.</p>
          {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
          <form onSubmit={handleRegister} className="w-full space-y-4">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-purple-50"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-purple-50"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-purple-50"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition"
            >
              Registrarse
            </button>
          </form>
          <div className="w-full flex items-center my-4">
            <div className="flex-grow h-px bg-purple-200"></div>
            <span className="mx-3 text-gray-400 text-sm">o</span>
            <div className="flex-grow h-px bg-purple-200"></div>
          </div>
          <button
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full py-3 font-bold text-gray-700 shadow hover:bg-gray-50 transition"
            type="button"
          >
            <svg width="22" height="22" viewBox="0 0 48 48" className="mr-2"><g><path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-10.3 7-6.1 0-11-4.9-11-11s4.9-11 11-11c2.6 0 5 .9 6.9 2.6l6.6-6.6C34.5 6.5 29.6 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c10.5 0 19.5-8.5 19.5-19 0-1.3-.1-2.2-.3-3z" /><path fill="#34A853" d="M6.3 14.7l6.6 4.8C15.1 16.1 19.2 13 24 13c2.6 0 5 .9 6.9 2.6l6.6-6.6C34.5 6.5 29.6 4.5 24 4.5c-7.3 0-13.5 4.1-16.7 10.2z" /><path fill="#FBBC05" d="M24 45.5c5.6 0 10.5-1.9 14.4-5.2l-6.7-5.5c-2 1.4-4.5 2.2-7.7 2.2-4.6 0-8.7-2.7-10.3-7H6.3c3.2 6.1 9.4 10.5 17.7 10.5z" /><path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-10.3 7-6.1 0-11-4.9-11-11s4.9-11 11-11c2.6 0 5 .9 6.9 2.6l6.6-6.6C34.5 6.5 29.6 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c10.5 0 19.5-8.5 19.5-19 0-1.3-.1-2.2-.3-3z" /></g></svg>
            Registrarse con Google
          </button>
          <p className="text-sm text-center text-gray-600 mt-6">
            ¿Ya tienes cuenta? <Link to="/login" className="text-pink-600 font-bold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm text-gray-500 bg-white bg-opacity-70 backdrop-blur border-t">
        © {new Date().getFullYear()} <span className="font-bold text-purple-700">MiFestival</span> · Crea tu experiencia musical
        <div className="mt-2">
          Desarrollado por <a href="https://github.com/CaCortez384" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline">Carlos Cortez</a>
        </div>
      </footer>
    </div>
  );
}

export default Register;