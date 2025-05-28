import React from "react";

const Home = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-yellow-300">
        <h1 className="text-4xl md:text-6xl font-bold text-white shadow-lg">
            Bienvenido a Mi Festival
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white">
            ¡Disfruta de la mejor música y eventos!
        </p>
        <div className="mt-8">
            <a
                href="/register"
                className="bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-100 transition"
            >
                Regístrate
            </a>
            <a
                href="/login"
                className="ml-4 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 transition"
            >
                Iniciar sesión
            </a>
        </div>
    </div>
);

export default Home;