import React from "react";

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 flex flex-col">
    {/* Header */}
    <header className="w-full py-6 px-4 flex justify-between items-center bg-white bg-opacity-70 backdrop-blur-md shadow-md">
      <div className="flex items-center gap-3">
        <img src="/logo192.png" alt="MiFestival Logo" className="w-10 h-10 rounded-xl shadow" />
        <span className="text-2xl font-extrabold text-purple-700 tracking-wide">MiFestival</span>
      </div>
      <nav className="hidden md:flex gap-6">
        <a href="/login" className="text-purple-700 font-semibold hover:underline">Iniciar sesión</a>
        <a href="/register" className="text-pink-600 font-semibold hover:underline">Regístrate</a>
      </nav>
    </header>

    {/* Espacio entre header y contenido */}
    <div className="h-6 md:h-10" />

    {/* Main Content */}
    <main className="flex-1 flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 max-w-3xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-4">
          Bienvenido a MiFestival
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">
          ¡Crea, organiza y comparte festivales únicos con tus amigos!
        </p>

        {/* ¿Cómo funciona? */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-pink-600 mb-2">¿Cómo funciona?</h2>
          <ul className="text-left text-gray-700 text-base md:text-lg space-y-2 mx-auto max-w-xl">
            <li>
              <span className="font-bold text-purple-600">1.</span> Regístrate o inicia sesión para comenzar.
            </li>
            <li>
              <span className="font-bold text-purple-600">2.</span> Crea tu propio festival, define los días y escenarios.
            </li>
            <li>
              <span className="font-bold text-purple-600">3.</span> Agrega y organiza artistas fácilmente con drag & drop o desde tu móvil.
            </li>
            <li>
              <span className="font-bold text-purple-600">4.</span> Descarga y comparte el póster de tu line up personalizado.
            </li>
            <li>
              <span className="font-bold text-purple-600">5.</span> Accede a tus festivales desde cualquier dispositivo.
            </li>
          </ul>
        </section>

        {/* Acciones principales */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
          <a
            href="/register"
            className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-purple-700 transition"
          >
            Regístrate
          </a>
          <a
            href="/login"
            className="bg-white text-purple-600 border border-purple-600 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-purple-100 transition"
          >
            Iniciar sesión
          </a>
        </div>

        {/* Info extra */}
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta? <a href="/login" className="text-indigo-700 hover:underline">Accede aquí</a>.<br />
            ¿Tienes entradas? Revisa tu perfil y accede a tus festivales.
          </p>
        </div>
      </div>
    </main>

    {/* Espacio entre contenido y footer */}
    <div className="h-6 md:h-10" />

    {/* Footer */}
    <footer className="w-full py-4 text-center text-xs text-gray-500 bg-white bg-opacity-60 backdrop-blur">
      © {new Date().getFullYear()} MiFestival · Crea tu experiencia musical
    </footer>
  </div>
);

export default Home;