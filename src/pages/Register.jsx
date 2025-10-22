import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../firebase'; // IMPORTANTE: Importa googleProvider desde firebase.js
import { useNavigate } from 'react-router-dom';
import mflogo from "../assets/mflogo20.png";
import { Link } from "react-router-dom";

// Icono de Google simple (SVG inline para no depender de imágenes externas)
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);


function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // NUEVO: Estado de carga
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre.');
      return;
    }
    setError(''); // Limpia errores previos
    setLoading(true); // Inicia carga
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: nombre });
      navigate('/inicio'); // Redirige a inicio tras registro exitoso
    } catch (err) {
      // Simplifica mensajes de error comunes
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Error al crear la cuenta. Inténtalo de nuevo.');
      }
      console.error("Error de registro:", err); // Loguea el error real para depuración
    } finally {
      setLoading(false); // Finaliza carga
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      // Usa el googleProvider importado
      await signInWithPopup(auth, googleProvider);
      navigate('/inicio'); // Redirige a inicio tras registro exitoso
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') { // No mostrar error si el usuario cierra el popup
          setError('Error al registrar con Google. Inténtalo de nuevo.');
      }
      console.error("Error Google Register:", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    // MODIFICADO: Fondo limpio consistente con Home
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      {/* MODIFICADO: Estilo consistente con Home */}
      <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md" />
            <span className="text-lg font-bold text-gray-900">MiFestival</span>
          </Link>
          {/* MODIFICADO: Enlace simple para "Volver" */}
          <Link
            to="/home" // Enlace directo a Home
            className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
          >
            Volver
          </Link>
        </div>
      </header>

      {/* Main */}
      {/* MODIFICADO: Centrado, padding, card limpia */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 max-w-md w-full">
          <div className="text-center mb-8">
            <img
              src={mflogo}
              alt="" // Alt vacío ya que el logo está en el header
              className="w-16 h-16 mx-auto mb-4 rounded-lg" // Logo más pequeño y centrado
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Crea tu Cuenta Gratis</h1>
            <p className="text-sm text-gray-500">
              Y empieza a diseñar el festival de tus sueños.
            </p>
          </div>

          {/* Mensaje de Error */}
          {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3 mb-4 text-center">
                  {error}
              </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required // Añadido required para validación HTML básica
                // MODIFICADO: Estilo de input moderno
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6} // Añadido minLength
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-150 ease-in-out"
              />
            </div>
            <button
              type="submit"
              disabled={loading} // Deshabilita mientras carga
              // MODIFICADO: Botón principal con color acento y estado de carga
              className={`w-full text-center bg-cyan-500 text-white font-semibold py-2.5 px-4 rounded-md shadow-sm transition duration-150 ease-in-out ${
                loading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-cyan-600'
              }`}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Divisor "o" */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-3 text-xs text-gray-400 font-medium">O</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Botón Google */}
          <button
            onClick={handleGoogleRegister}
            disabled={loading} // Deshabilita mientras carga
            // MODIFICADO: Botón secundario (Google) más sutil
            className={`w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm transition duration-150 ease-in-out ${
                loading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-gray-50'
            }`}
            type="button"
          >
            <GoogleIcon />
            Registrarse con Google
          </button>

          {/* Enlace a Login */}
          <p className="text-sm text-center text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-cyan-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      {/* MODIFICADO: Minimalista consistente con Home */}
      <footer className="w-full py-5 text-center text-xs text-gray-400 border-t border-gray-100 mt-auto"> {/* mt-auto para empujar al fondo */}
        <div className="container mx-auto px-4 sm:px-6">
          © {new Date().getFullYear()} MiFestival por Carlos Cortez.
        </div>
      </footer>
    </div>
  );
}

export default Register;