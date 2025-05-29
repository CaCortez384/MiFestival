import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300">
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center">
                <p className="text-lg text-purple-700 font-semibold">Cargando festivales...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 px-4">
            <div className="bg-white bg-opacity-90 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center border-4 border-purple-200">
                <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-500 mb-8 drop-shadow-lg">
                    Mis Festivales
                </h2>
                {usuario ? (
                    <>
                        <button
                            className="mb-8 px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-lg hover:scale-105 hover:from-green-500 hover:to-green-700 transition-all font-bold text-lg"
                            onClick={() => navigate('/crear-festival')}
                        >
                            + Crear Festival
                        </button>
                        {festivales.length > 0 ? (
                            <ul className="space-y-5">
                                {festivales.map(festival => (
                                    <li
                                        key={festival.id}
                                        className="bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-2xl px-8 py-5 shadow-md hover:shadow-xl hover:bg-opacity-90 transition flex items-center justify-between group"
                                    >
                                        <span
                                            className="text-xl font-semibold text-purple-800 cursor-pointer group-hover:underline"
                                            onClick={() => navigate(`/festival/${festival.id}/artistas`)}
                                        >
                                            {festival.nombre || festival.name}
                                        </span>
                                        <button
                                            className="ml-6 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow hover:from-red-600 hover:to-pink-600 hover:scale-105 transition-all text-base font-semibold"
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
                                    </li>
                                ))}
                            </ul>
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
                <button
                    className="mt-10 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:scale-105 hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-lg"
                    onClick={() => window.location.href = '/inicio'}
                >
                    Volver a inicio
                </button>
            </div>
        </div>
    );
};

export default MisFestivales;