import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import mflogo from "../assets/mflogo20.png";

const quickActions = [
  {
    title: "Crea tu festival",
    desc: "Personaliza fechas, escenarios y artistas.",
    icon: "🎤",
    href: "/crear-festival",
    color: "from-pink-400 to-yellow-300"
  },
  {
    title: "Mis festivales",
    desc: "Consulta y edita tus festivales guardados.",
    icon: "🎟️",
    href: "/mis-festivales",
    color: "from-purple-400 to-pink-300"
  },
  {
    title: "Mi perfil",
    desc: "Gestiona tu cuenta y tus entradas.",
    icon: "🧑‍🎤",
    href: "/perfil",
    color: "from-yellow-300 to-pink-400",
    disabled: true // <--- Desactivado
  }
];

const tips = [
  "¡Arrastra y suelta artistas para armar tu line up!",
  "Comparte tu póster en redes sociales con un solo clic.",
  "Puedes editar tus festivales en cualquier momento.",
  "Accede desde cualquier dispositivo, ¡todo es responsive!"
];

const Inicio = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/home" />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white bg-opacity-80 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src={mflogo} alt="MiFestival Logo" className="w-12 h-12 rounded-2xl shadow-lg" />
          <span className="text-3xl font-black text-purple-700 tracking-tight">MiFestival</span>
        </div>
        <button
          onClick={async () => { await auth.signOut(); }}
          className="bg-white text-purple-700 border-2 border-purple-500 font-bold py-2 px-6 rounded-full shadow hover:bg-purple-50 transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 w-full">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-10 max-w-2xl w-full flex flex-col items-center">
          <img
            src="https://undraw.co/api/illustrations/undraw_concert_re_1b36.svg"
            alt="Ilustración bienvenida"
            className="w-40 mb-6 drop-shadow"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-4 text-center">
            ¡Hola, {user.displayName || "usuario"}!
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 text-center">
            Bienvenido a <span className="text-pink-500 font-bold">MiFestival</span>. Crea festivales, organiza artistas y comparte tu experiencia musical.
          </p>
          {/* Acciones rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full">
            {quickActions.map((action, i) => (
              <a
                key={i}
                href={action.disabled ? undefined : action.href}
                className={`flex flex-col items-center justify-center bg-gradient-to-br ${action.color} rounded-2xl shadow-lg p-6 transition
                  ${action.disabled
                    ? "opacity-50 pointer-events-none grayscale"
                    : "hover:scale-105"
                  }`}
                tabIndex={action.disabled ? -1 : 0}
                aria-disabled={action.disabled ? "true" : "false"}
              >
                <span className="text-4xl mb-2">{action.icon}</span>
                <span className="text-lg font-bold text-purple-700 mb-1">{action.title}</span>
                <span className="text-sm text-gray-600 text-center">{action.desc}</span>
              </a>
            ))}
          </div>
          {/* Tips y ayuda */}
          <div className="w-full bg-purple-50 rounded-xl p-4 mb-6 shadow flex flex-col items-center">
            <h2 className="text-pink-500 font-bold mb-2 text-lg">Tips para aprovechar MiFestival:</h2>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              {tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
          <p className="text-base text-gray-600 text-center">
            ¿Ya tienes entradas? Revisa tu perfil y accede a tus festivales.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm text-gray-500 bg-white bg-opacity-70 backdrop-blur border-t">
        © {new Date().getFullYear()} <span className="font-bold text-purple-700">MiFestival</span> · Crea tu experiencia musical
      </footer>
    </div>
  );
};

export default Inicio;