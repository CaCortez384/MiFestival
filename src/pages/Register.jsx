import { useState } from 'react';
import useSEO from "../hooks/useSEO";
import { trackEvent } from "../utils/analytics";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import mflogo from "../assets/mflogo20.png";
import { Link } from "react-router-dom";
// Iconos para darle un toque visual a los inputs
import { UserIcon, EnvelopeIcon, LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Icono de Google (Mantenemos el SVG original)
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useSEO({
    title: 'Crear Cuenta | MiFestival',
    description: 'Regístrate gratis en MiFestival para crear tus propios lineups de festivales, compartirlos con la comunidad y competir por likes.',
    canonical: 'https://mifestival.web.app/register',
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: nombre });
      trackEvent('sign_up', { method: 'email' });
      navigate('/inicio');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Error al crear la cuenta. Inténtalo de nuevo.');
      }
      console.error("Error de registro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      trackEvent('sign_up', { method: 'google' });
      navigate('/inicio');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Error al registrar con Google. Inténtalo de nuevo.');
      }
      console.error("Error Google Register:", err);
    } finally {
      setLoading(false);
    }
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
        <div className="bg-[#FF90E8] border-4 border-black p-8 sm:p-10 max-w-md w-full relative shadow-[8px_8px_0_#000] transform -rotate-1">

          <div className="text-center mb-8 bg-white border-4 border-black p-4 shadow-[8px_8px_0_#000] transform rotate-2">
            <h1 className="text-3xl brutal-title mb-2">ÚNETE AL BACKSTAGE</h1>
            <p className="text-sm font-black uppercase tracking-widest text-black">
              CREA TU CUENTA GRATIS Y EMPIEZA A DISEÑAR.
            </p>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-500 border-4 border-black text-white text-sm font-bold uppercase tracking-widest p-4 mb-6 text-center transform -rotate-1 shadow-[4px_4px_0_#000]">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleRegister} id='register-form' className="space-y-6">

            {/* Input Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-black text-black uppercase tracking-widest mb-2 bg-[#00E5FF] inline-block px-1 border-2 border-black">NOMBRE</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                  <UserIcon className="h-6 w-6" />
                </div>
                <input
                  id="nombre"
                  type="text"
                  placeholder="TU NOMBRE"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black focus:ring-4 focus:ring-[#00E5FF] focus:outline-none text-black font-bold placeholder-gray-500 shadow-[4px_4px_0_#000] transition-shadow uppercase"
                />
              </div>
            </div>

            {/* Input Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-black text-black uppercase tracking-widest mb-2 bg-yellow-400 inline-block px-1 border-2 border-black">CORREO</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                  <EnvelopeIcon className="h-6 w-6" />
                </div>
                <input
                  id="email"
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
              <label htmlFor="password" className="block text-sm font-black text-black uppercase tracking-widest mb-2 bg-[#00FF66] inline-block px-1 border-2 border-black">CONTRASEÑA</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                  <LockClosedIcon className="h-6 w-6" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="MÍN. 6 CARACTERES"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black focus:ring-4 focus:ring-[#00FF66] focus:outline-none text-black font-bold placeholder-gray-500 shadow-[4px_4px_0_#000] transition-shadow"
                />
              </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-xl brutal-btn mt-4 ${loading
                ? 'bg-gray-300 cursor-not-allowed text-black opacity-70 border-4 border-black shadow-[4px_4px_0_#000]'
                : 'bg-[#FFD500] text-black shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#000]'
                }`}
            >
              {loading ? 'CREANDO...' : 'CREAR CUENTA'}
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
            onClick={handleGoogleRegister}
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

          {/* Link Login */}
          <div className="text-center bg-white border-4 border-black p-4 transform rotate-1">
            <p className="text-sm font-black text-black uppercase tracking-widest mb-2">
              ¿YA TIENES CUENTA?
            </p>
            <Link to="/login" className="font-bold text-black border-b-4 border-black hover:bg-yellow-400 transition-colors inline-block pb-1 text-lg">
              INICIA SESIÓN AQUÍ →
            </Link>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full py-8 text-center text-sm font-black uppercase tracking-widest text-black border-t-4 border-black bg-white mt-10 relative z-10">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} MiFestival. HAZ RUIDO.
        </div>
      </footer>
    </div>
  );
}

export default Register;