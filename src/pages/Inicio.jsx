import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase"; // Asegúrate de que la ruta sea correcta
import mflogo from "../assets/mflogo20.png"; // Asegúrate de que la ruta sea correcta

const Home = () => {
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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 px-2 md:px-4 py-4 md:py-8 gap-4">
            {/* Header mejorado */}
            <header className="w-full flex flex-col md:flex-row items-center justify-between mb-4 md:mb-8 gap-2
                bg-gradient-to-r from-purple-600 via-pink-400 to-yellow-400
                rounded-3xl shadow-2xl px-6 py-4 border-2 border-white/70
            ">
                <div className="flex items-center gap-4">
                    <img src={mflogo} alt="MiFestival Logo" className="w-14 h-14 rounded-2xl shadow-lg border-2 border-white" />
                    <div>
                        <span className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg block">Bienvenido!</span>
                    </div>
                </div>
            </header>
            <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 flex items-center justify-center px-4">
                <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center border border-yellow-200">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 mb-6 drop-shadow-lg">
                        Bienvenido a <span className="underline decoration-wavy decoration-pink-400">MiFestival</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 mb-8 font-medium">
                        Crea festivales y compártelos con tus amigos para vivir las mejores experiencias.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
                        <a
                            href="/crear-festival"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white font-bold rounded-full shadow-xl hover:scale-105 hover:from-purple-600 hover:to-yellow-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Crear nuevo festival
                        </a>
                        <button
                            onClick={() => window.location.href = "/mis-festivales"}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-bold rounded-full shadow-xl hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Mis festivales
                        </button>
                    </div>
                    <div className="mb-8">
                        <p className="text-base text-gray-600">¿Ya tienes entradas? Revisa tu perfil y accede a tus festivales.</p>
                    </div>
                    <button
                        onClick={async () => {
                            await auth.signOut();
                        }}
                        className="mt-2 px-8 py-2 bg-red-500 text-white font-semibold rounded-full shadow hover:bg-red-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300"
                    >
                        Cerrar sesión
                    </button>
                </div>

            </div>
            {/* Footer agregado */}
            <footer className="w-full mt-8 py-4 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-t-3xl shadow-inner flex flex-col items-center text-center text-purple-700 text-sm font-medium border-t border-purple-200">
                <span>© {new Date().getFullYear()} MiFestival. Todos los derechos reservados.</span>
                <span className="text-xs text-gray-500 mt-1">Hecho con <span className="text-pink-500">♥</span> por tu equipo.</span>
            </footer>
        </div>
    );
};

export default Home;