import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import mflogo from "../assets/mflogo20.png";

const MisFestivales = () => {
    const [festivales, setFestivales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUsuario(user);
                const q = query(collection(db, 'festivals'), where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const festivalesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFestivales(festivalesData);
            } else {
                setUsuario(null);
                setFestivales([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center">
                <p className="text-lg text-purple-700 font-semibold">Cargando festivales...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
            {/* Header */}
            <header className="w-full px-6 py-4 flex justify-between items-center bg-white bg-opacity-80 shadow-lg sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <img src={mflogo} alt="MiFestival Logo" className="w-12 h-12 rounded-2xl shadow-lg" />
                    <span className="text-3xl font-black text-purple-700 tracking-tight">Mis Festivales</span>
                </div>
                <button
                    className="bg-white text-purple-700 border-2 border-purple-500 font-bold py-2 px-6 rounded-full shadow hover:bg-purple-50 transition"
                    onClick={() => navigate('/inicio')}
                >
                    Volver a inicio
                </button>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 w-full">
                <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-10 max-w-3xl w-full flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-8 text-center">
                        Tus Festivales
                    </h2>
                    {usuario ? (
                        <>
                            <button
                                className="mb-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-xl shadow-lg hover:scale-105 hover:from-pink-600 hover:to-yellow-500 transition-all font-bold text-lg"
                                onClick={() => navigate('/crear-festival')}
                            >
                                + Crear Festival
                            </button>
                            {festivales.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                    {festivales.map(festival => (
                                        <div
                                            key={festival.id}
                                            className="bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 rounded-2xl px-8 py-6 shadow-md hover:shadow-xl hover:scale-105 transition flex flex-col justify-between group border border-purple-100"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">🎉</span>
                                                <span
                                                    className="text-xl font-bold text-purple-800 cursor-pointer group-hover:underline"
                                                    onClick={() => navigate(`/festival/${festival.id}/artistas`)}
                                                >
                                                    {festival.nombre || festival.name}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 mb-4">
                                                <span className="bg-purple-200 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Días: {festival.days}
                                                </span>
                                                <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Escenarios: {festival.stages?.length || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-auto">
                                                <button
                                                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow hover:from-red-600 hover:to-pink-600 hover:scale-105 transition-all text-base font-semibold"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('¿Estás seguro de que deseas eliminar este festival?')) {
                                                            try {
                                                                const { deleteDoc, doc } = await import('firebase/firestore');
                                                                await deleteDoc(doc(db, 'festivals', festival.id));
                                                                setFestivales(prev => prev.filter(f => f.id !== festival.id));
                                                            } catch (error) {
                                                                alert('Error al eliminar el festival');
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all text-base font-semibold"
                                                    onClick={() => navigate(`/festival/${festival.id}/artistas`)}
                                                >
                                                    Editar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center mt-8">
                                    <svg className="w-16 h-16 text-purple-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-700 text-lg">No has creado ningún festival aún.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <svg className="w-14 h-14 text-red-300 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-600 text-lg font-semibold">Debes iniciar sesión para ver tus festivales.</p>
                        </div>
                    )}
                </div>
            </main>
            {/* Footer */}
            <footer className="w-full py-6 text-center text-sm text-gray-500 bg-white bg-opacity-70 backdrop-blur border-t">
                © {new Date().getFullYear()} <span className="font-bold text-purple-700">MiFestival</span> · Crea tu experiencia musical
            </footer>
        </div>
    );
};

export default MisFestivales;