import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase"; // Asegúrate de que la ruta sea correcta

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
        <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 flex items-center justify-center px-4">
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-3xl w-full text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-4">
                    Bienvenido a MiFestival
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                    Crea festivales y compartelos con tus amigos para crear las mejores experiencias!.
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <a href="/crear-festival" className="...">+ Crear nuevo festival</a>
                </div>
                <div className="mt-8">
                    <p className="text-sm text-gray-600">¿Ya tienes entradas? Revisa tu perfil y accede a tus festivales.</p>
                </div>
                <button
                    onClick={async () => {
                        await auth.signOut(); // Esto cierra la sesión en Firebase
                    }}
                    className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default Home;