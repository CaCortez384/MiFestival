import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white bg-opacity-80 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/logo192.png" alt="MiFestival Logo" className="w-12 h-12 rounded-2xl shadow-lg" />
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
            src="https://undraw.co/api/illustrations/undraw_party_re_nmwj.svg"
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
          <p className="text-sm text-center text-gray-600 mt-6">
            ¿Ya tienes cuenta? <a href="/login" className="text-pink-600 font-bold hover:underline">Inicia sesión</a>
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

export default Register;