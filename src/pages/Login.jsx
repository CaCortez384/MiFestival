import { useState, useContext, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import GLogo from "../assets/GLogo.png";
import { loginWithGoogle } from '../context/AuthContext';
import mflogo from "../assets/mflogo20.png";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/inicio");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Correo o contraseña incorrectos');
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
            alt="Ilustración login"
            className="w-32 mb-4 drop-shadow"
          />
          <h1 className="text-3xl font-extrabold text-purple-700 mb-2 text-center">¡Bienvenido de vuelta!</h1>
          <p className="text-md text-gray-600 mb-6 text-center">Inicia sesión para continuar creando tu festival.</p>
          {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="w-full space-y-4">
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
              Iniciar sesión
            </button>
          </form>
          <div className="my-4 w-full flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-3 text-gray-400 text-xs">o</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 transition font-semibold"
          >
            <img src={GLogo} alt="Google" className="w-5 h-5" />
            Iniciar sesión con Google
          </button>
          <p className="text-sm text-center text-gray-600 mt-6">
            ¿No tienes cuenta? <Link to="/register" className="text-pink-600 font-bold hover:underline">Regístrate</Link>
          </p>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm text-gray-500 bg-white bg-opacity-70 backdrop-blur border-t">
        © {new Date().getFullYear()} <span className="font-bold text-purple-700">MiFestival</span> · Crea tu experiencia musical
      </footer>
    </div>
  );
}

export default Login;