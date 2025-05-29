import { useState, useContext, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, loginWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import GLogo from "../assets/GLogo.png"; // Asegúrate de que la ruta sea correcta


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
      // No necesitas navegar aquí, el useEffect lo hará
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-500 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-extrabold text-center text-indigo-700 mb-6">🎵 MiFestival</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Iniciar sesión</h2>
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-black text-black rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-black text-black rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
          >
            Iniciar sesión
          </button>
        </form>
        <br />
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
        >
          <img src={GLogo} alt="Google" className="w-5 h-5" />
          Iniciar sesión con Google
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          ¿No tienes cuenta? <a href="/register" className="text-indigo-700 hover:underline">Regístrate</a>
        </p>
      </div>
      <button
        onClick={() => navigate('/home')}
        className="absolute top-4 left-4 bg-white text-purple-700 border border-purple-600 px-4 py-2 rounded-md shadow hover:bg-purple-100 transition"
      >
        Volver a Home
      </button>
    </div>
  );
}

export default Login;
