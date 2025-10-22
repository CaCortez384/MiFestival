import { useState, useContext, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; // Añadido signInWithPopup
import { auth, googleProvider } from '../firebase'; // IMPORTANTE: Importa googleProvider
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
// import GLogo from "../assets/GLogo.png"; // Ya no se necesita
// import { loginWithGoogle } from '../context/AuthContext'; // Usaremos signInWithPopup directamente aquí por simplicidad
import mflogo from "../assets/mflogo20.png";
import { Link } from "react-router-dom";

// Reutilizamos el icono de Google de Register.jsx
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // NUEVO: Estado de carga
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Redirige si el usuario ya está logueado
  useEffect(() => {
    if (user) {
      navigate("/inicio");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpia errores previos
    setLoading(true); // Inicia carga
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // La redirección ahora la maneja el useEffect al detectar el cambio en `user`
    } catch (err) {
      // Mensaje de error más genérico pero claro
       setError('Correo o contraseña incorrectos. Inténtalo de nuevo.');
       console.error("Error de login:", err);
    } finally {
        setLoading(false); // Finaliza carga
    }
  };

  // NUEVO: Manejador para login con Google
  const handleGoogleLogin = async () => {
      setError('');
      setLoading(true);
      try {
          await signInWithPopup(auth, googleProvider);
          // La redirección la maneja el useEffect
      } catch (err) {
          if (err.code !== 'auth/popup-closed-by-user') {
              setError('Error al iniciar sesión con Google.');
          }
          console.error("Error Google Login:", err);
      } finally {
          setLoading(false);
      }
  };


  return (
    // MODIFICADO: Fondo limpio consistente
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      {/* MODIFICADO: Estilo consistente */}
      <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md" />
            <span className="text-lg font-bold text-gray-900">MiFestival</span>
          </Link>
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
               alt=""
               className="w-16 h-16 mx-auto mb-4 rounded-lg"
             />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Bienvenido de Vuelta</h1>
            <p className="text-sm text-gray-500">
              Inicia sesión para acceder a tus festivales.
            </p>
          </div>

          {/* Mensaje de Error */}
          {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3 mb-4 text-center">
                  {error}
              </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-4">
             <div>
               <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
               <input
                 id="email-login" // ID único para el label
                 type="email"
                 placeholder="tu@correo.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 // MODIFICADO: Estilo de input moderno consistente
                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-150 ease-in-out"
               />
             </div>
             <div>
                <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
               <input
                 id="password-login" // ID único para el label
                 type="password"
                 placeholder="Tu contraseña"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-150 ease-in-out"
               />
               {/* Opcional: Enlace "¿Olvidaste tu contraseña?" */}
               {/* <div className="text-right mt-1">
                 <Link to="/reset-password" className="text-xs text-cyan-600 hover:underline">
                   ¿Olvidaste tu contraseña?
                 </Link>
               </div> */}
             </div>
            <button
              type="submit"
              disabled={loading} // Deshabilita mientras carga
              // MODIFICADO: Botón principal consistente
              className={`w-full text-center bg-cyan-500 text-white font-semibold py-2.5 px-4 rounded-md shadow-sm transition duration-150 ease-in-out ${
                 loading
                   ? 'opacity-70 cursor-not-allowed'
                   : 'hover:bg-cyan-600'
               }`}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
            onClick={handleGoogleLogin} // Usa el nuevo handler
            disabled={loading}
            // MODIFICADO: Botón secundario consistente
            className={`w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm transition duration-150 ease-in-out ${
                 loading
                   ? 'opacity-70 cursor-not-allowed'
                   : 'hover:bg-gray-50'
             }`}
            type="button"
          >
            <GoogleIcon />
            Continuar con Google
          </button>

          {/* Enlace a Registro */}
          <p className="text-sm text-center text-gray-500 mt-6">
            ¿Eres nuevo aquí?{' '}
            <Link to="/register" className="font-medium text-cyan-600 hover:underline">
              Crea una cuenta gratis
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      {/* MODIFICADO: Minimalista consistente */}
       <footer className="w-full py-5 text-center text-xs text-gray-400 border-t border-gray-100 mt-auto">
         <div className="container mx-auto px-4 sm:px-6">
           © {new Date().getFullYear()} MiFestival por Carlos Cortez.
         </div>
       </footer>
    </div>
  );
}

export default Login;