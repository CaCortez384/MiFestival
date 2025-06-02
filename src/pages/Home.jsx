import React from "react";
import mflogo from "../assets/mflogo20.png";

const features = [
  {
    title: "Crea tu festival",
    desc: "Personaliza los días, escenarios y elige el nombre de tu evento.",
    icon: "🎤",
  },
  {
    title: "Organiza artistas",
    desc: "Arrastra y suelta artistas en tu line up, desde cualquier dispositivo.",
    icon: "🎸",
  },
  {
    title: "Comparte tu póster",
    desc: "Descarga y comparte tu line up personalizado en redes sociales.",
    icon: "📲",
  },
];

const Home = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
    {/* Header */}
    <header className="w-full px-6 py-4 flex justify-between items-center bg-white bg-opacity-80 shadow-lg sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <img src={mflogo} alt="MiFestival Logo" className="w-12 h-12 rounded-2xl shadow-lg" />
        <span className="text-3xl font-black text-purple-700 tracking-tight">MiFestival</span>
      </div>
      <nav className="hidden md:flex gap-6">
        <a href="/login" className="text-purple-700 font-semibold hover:underline transition">Iniciar sesión</a>
        <a href="/register" className="text-pink-600 font-semibold hover:underline transition">Regístrate</a>
      </nav>
    </header>

    {/* Hero */}
    <section className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 gap-10">
      {/* Ilustración */}
      <div className="flex-1 flex justify-center">
        <img
          src="https://undraw.co/api/illustrations/undraw_concert_re_1b36.svg"
          alt="Festival Ilustración"
          className="w-80 md:w-96 drop-shadow-xl"
        />
      </div>
      {/* Texto principal */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 mb-4 leading-tight">
          ¡Crea tu propio <span className="text-pink-500">festival</span> musical!
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-xl">
          Diseña line ups, organiza artistas y comparte tu experiencia única con amigos. Todo desde tu móvil o PC.
        </p>
        <div className="flex gap-4">
          <a
            href="/register"
            className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition"
          >
            ¡Empieza gratis!
          </a>
          <a
            href="/login"
            className="bg-white text-purple-700 border-2 border-purple-500 font-bold py-3 px-8 rounded-full shadow hover:bg-purple-50 transition"
          >
            Ya tengo cuenta
          </a>
        </div>
      </div>
    </section>

    {/* Características */}
    <section className="py-12 bg-white bg-opacity-80">
      <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">¿Cómo funciona?</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition"
          >
            <div className="text-5xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-bold text-purple-700 mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Llamado a la acción */}
    <section className="py-10 flex flex-col items-center">
      <h3 className="text-2xl font-bold text-purple-700 mb-2">¿Listo para crear tu festival?</h3>
      <a
        href="/register"
        className="bg-pink-500 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-pink-600 transition text-lg"
      >
        Regístrate ahora
      </a>
      <p className="mt-4 text-gray-500 text-sm">
        ¿Ya tienes cuenta? <a href="/login" className="text-purple-700 hover:underline">Inicia sesión aquí</a>
      </p>
    </section>

    {/* Footer */}
    <footer className="w-full py-6 text-center text-sm text-gray-500 bg-white bg-opacity-70 backdrop-blur border-t">
      <div className="mb-2">
        © {new Date().getFullYear()} <span className="font-bold text-purple-700">MiFestival</span> · Crea tu experiencia musical
      </div>
      <div>
        <a href="/about" className="hover:underline mx-2">Acerca de</a>·
        <a href="/contact" className="hover:underline mx-2">Contacto</a>·
        <a href="/privacy" className="hover:underline mx-2">Privacidad</a>
      </div>
    </footer>
  </div>
);

export default Home;