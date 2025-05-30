import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/login');
    } catch (err) {
      setError('Error al crear cuenta: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 flex justify-between items-center bg-white bg-opacity-70 backdrop-blur-md shadow-md relative">
        <div className="flex items-center gap-3">
          <img src="/logo192.png" alt="MiFestival Logo" className="w-10 h-10 rounded-xl shadow" />
          <span className="text-2xl font-extrabold text-purple-700 tracking-wide">MiFestival</span>
        </div>
        <button
          onClick={() => navigate('/home')}
          className="ml-4 bg-white text-purple-700 border border-purple-600 px-4 py-2 rounded-md shadow hover:bg-purple-100 transition"
        >
          Volver
        </button>
      </header>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-extrabold text-center text-purple-700 mb-6">🎵 MiFestival</h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Crear cuenta</h2>
          {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-black text-black rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-black text-black rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition"
            >
              Registrarse
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 mt-4">
            ¿Ya tienes cuenta? <a href="/login" className="text-purple-700 hover:underline">Inicia sesión</a>
          </p>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-gray-500 bg-white bg-opacity-60 backdrop-blur">
        © {new Date().getFullYear()} MiFestival · Crea tu experiencia musical
      </footer>
    </div>

  );
}

export default Register;
