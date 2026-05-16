import { useState, useContext, useEffect } from 'react';
import useSEO from "../hooks/useSEO";
import { trackEvent } from "../utils/analytics";
// MODIFICADO: Importamos sendPasswordResetEmail
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import mflogo from "../assets/mflogo20.png";
import { Link } from "react-router-dom";
// MODIFICADO: Agregamos XMarkIcon para el modal
import { EnvelopeIcon, LockClosedIcon, ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
  const [loading, setLoading] = useState(false);

  // --- NUEVOS ESTADOS PARA RESET PASSWORD ---
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useSEO({
    title: 'Iniciar Sesión | MiFestival',
    description: 'Inicia sesión en MiFestival para gestionar tus lineups, votar festivales y competir en el ranking global.',
    canonical: 'https://mifestival.web.app/login',
  });

  useEffect(() => {
    if (user) {
      navigate("/inicio");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      trackEvent('login', { method: 'email' });
    } catch (err) {
      setError('Correo o contraseña incorrectos. Inténtalo de nuevo.');
      console.error("Error de login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      trackEvent('login', { method: 'google' });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Error al iniciar sesión con Google.');
      }
      console.error("Error Google Login:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- NUEVA FUNCIÓN: ENVIAR CORREO DE RESET ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError("Por favor ingresa tu correo.");
      return;
    }
    setResetLoading(true);
    setResetError('');
    setResetMessage('');

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      trackEvent('password_reset_requested', { source: 'login' });
      setResetMessage("¡Listo! Revisa tu bandeja de entrada (y spam) para restablecer tu contraseña.");
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        setResetError("No existe una cuenta con este correo.");
      } else if (error.code === 'auth/invalid-email') {
        setResetError("El correo no es válido.");
      } else {
        setResetError("Ocurrió un error. Inténtalo más tarde.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  // Pre-llenar el email del modal si el usuario ya escribió algo en el login
  const openResetModal = () => {
    setResetEmail(email);
    setShowResetModal(true);
    setResetError('');
    setResetMessage('');
  };

  return (
    // FONDO BRUTALISTA
    <div className="min-h-screen flex flex-col bg-brutal-base text-[#050510] font-inter selection:bg-yellow-400 selection:text-black relative overflow-hidden border-x-4 border-black max-w-[1600px] mx-auto">

      {/* Fondo Textura */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

      {/* --- HEADER --- */}
      <header className="w-full px-4 sm:px-6 py-4 border-b-4 border-black sticky top-0 z-50 bg-white">
        <div className="container mx-auto flex justify-between items-center max-w-[1400px]">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="relative border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
              <img src={mflogo} alt="MiFestival Logo" className="relative w-8 h-8 sm:w-9 sm:h-9 object-cover" />
            </div>
            <span className="text-lg sm:text-xl brutal-title hidden sm:inline bg-[#FF90E8] px-2 mt-1 border-2 border-black">MIFESTIVAL</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black border-2 border-black hover:bg-yellow-400 shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver
          </Link>
        </div>
      </header>

      {/* --- MAIN CARD --- */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 sm:py-16 relative z-10">
        <div className="bg-[#00E5FF] border-4 border-black p-8 sm:p-10 max-w-md w-full relative shadow-[8px_8px_0_#000] transform rotate-1">

          <div className="text-center mb-8 bg-white border-4 border-black p-4 shadow-[8px_8px_0_#000] transform -rotate-2">
            <h1 className="text-3xl brutal-title mb-2">BIENVENIDO DE VUELTA</h1>
            <p className="text-sm font-black uppercase tracking-widest text-black">
              INICIA SESIÓN PARA GESTIONAR TUS LINEUPS.
            </p>
          </div>

          {/* Mensaje de Error Login */}
          {error && (
            <div className="bg-red-500 border-4 border-black text-white text-sm font-bold uppercase tracking-widest p-4 mb-6 text-center transform rotate-1 shadow-[4px_4px_0_#000]">
              {error}
            </div>
          )}

          {/* Formulario Login */}
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Input Email */}
            <div>
              <label htmlFor="email-login" className="block text-sm font-black text-black uppercase tracking-widest mb-2 bg-yellow-400 inline-block px-1 border-2 border-black">CORREO</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                  <EnvelopeIcon className="h-6 w-6" />
                </div>
                <input
                  id="email-login"
                  type="email"
                  placeholder="TU@CORREO.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black focus:ring-4 focus:ring-yellow-400 focus:outline-none text-black font-bold placeholder-gray-500 shadow-[4px_4px_0_#000] transition-shadow uppercase"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label htmlFor="password-login" className="block text-sm font-black text-black uppercase tracking-widest mb-2 bg-[#FF90E8] inline-block px-1 border-2 border-black">CONTRASEÑA</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                  <LockClosedIcon className="h-6 w-6" />
                </div>
                <input
                  id="password-login"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black focus:ring-4 focus:ring-[#FF90E8] focus:outline-none text-black font-bold placeholder-gray-500 shadow-[4px_4px_0_#000] transition-shadow"
                />
              </div>

              {/* MODIFICADO: Enlace Olvidaste contraseña */}
              <div className="text-right mt-3">
                <button
                  type="button"
                  onClick={openResetModal}
                  className="text-xs font-black uppercase text-black hover:bg-yellow-400 border-b-2 border-black transition"
                >
                  ¿OLVIDASTE TU CONTRASEÑA?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-xl py-4 brutal-btn mt-4 ${loading
                ? 'bg-gray-300 cursor-not-allowed text-black opacity-70 border-4 border-black shadow-[4px_4px_0_#000]'
                : 'bg-[#00FF66] text-black shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#000]'
                }`}
            >
              {loading ? 'INICIANDO SESIÓN...' : 'ENTRAR'}
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t-4 border-black border-dashed"></div>
            <span className="mx-4 text-sm font-black text-black uppercase tracking-widest bg-white border-2 border-black px-2">O</span>
            <div className="flex-grow border-t-4 border-black border-dashed"></div>
          </div>

          {/* Botón Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 bg-white text-black border-4 border-black py-4 text-xl font-bold uppercase transition-all shadow-[6px_6px_0_#000] mb-8 ${loading
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-gray-100 hover:shadow-[8px_8px_0_#000]'
              }`}
            type="button"
          >
            <GoogleIcon />
            Google
          </button>

          {/* Enlace Registro */}
          <div className="text-center bg-white border-4 border-black p-4 transform rotate-1">
            <p className="text-sm font-black text-black uppercase tracking-widest mb-2">
              ¿ERES NUEVO AQUÍ?
            </p>
            <Link to="/register" className="font-bold text-black border-b-4 border-black hover:bg-yellow-400 transition-colors inline-block pb-1 text-lg">
              CREA UNA CUENTA GRATIS →
            </Link>
          </div>
        </div>
      </main>

      {/* --- MODAL DE RECUPERACIÓN DE CONTRASEÑA --- */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#FF90E8] border-4 border-black p-8 w-full max-w-sm relative shadow-[16px_16px_0_#000] transform -rotate-2">

            {/* Botón cerrar */}
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-black border-2 border-black bg-white hover:bg-red-500 p-1 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-2xl brutal-title mb-4 bg-white border-4 border-black inline-block px-4 py-2 rotate-2">RECUPERAR</h3>
            <p className="text-black font-semibold text-sm mb-6 bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000] uppercase tracking-widest">
              Ingresa tu correo y te enviaremos un enlace.
            </p>

            {resetMessage ? (
              <div className="bg-[#00FF66] border-4 border-black text-black font-bold uppercase p-4 text-center mb-4 shadow-[4px_4px_0_#000] rotate-1">
                {resetMessage}
                <button
                  onClick={() => setShowResetModal(false)}
                  className="block w-full mt-4 bg-white brutal-btn py-3 text-lg"
                >
                  CERRAR
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-black uppercase tracking-widest mb-2 bg-yellow-400 inline-block px-1 border-2 border-black">CORREO</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-white border-4 border-black px-4 py-3 text-black font-bold uppercase focus:ring-4 focus:ring-yellow-400 focus:outline-none placeholder-gray-500 shadow-[4px_4px_0_#000]"
                    placeholder="TU@CORREO.COM"
                    required
                  />
                </div>

                {resetError && (
                  <p className="bg-red-500 text-white font-bold p-2 text-center border-2 border-black uppercase text-xs">{resetError}</p>
                )}

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-white brutal-btn py-4 text-xl"
                >
                  {resetLoading ? "ENVIANDO..." : "ENVIAR ENLACE"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="w-full py-8 text-center text-sm font-black uppercase tracking-widest text-black border-t-4 border-black bg-white mt-10 relative z-10">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} MiFestival. HAZ RUIDO.
        </div>
      </footer>
    </div>
  );
}

export default Login;