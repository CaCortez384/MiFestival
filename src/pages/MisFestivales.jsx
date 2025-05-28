import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

const MisFestivales = () => {
    const [festivales, setFestivales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);

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
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-6">Mis Festivales</h2>
                {usuario ? (
                    festivales.length > 0 ? (
                        <ul className="space-y-4">
                            {festivales.map(festival => (
                                <li
                                    key={festival.id}
                                    className="bg-purple-100 rounded-xl px-6 py-4 shadow hover:bg-purple-200 transition text-lg font-medium text-purple-800"
                                >
                                    {festival.nombre || festival.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 text-lg">No has creado ningún festival aún.</p>
                    )
                ) : (
                    <p className="text-red-600 text-lg font-semibold">Debes iniciar sesión para ver tus festivales.</p>
                )}
                <button
                    className="mt-8 px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition font-semibold"
                    onClick={() => window.location.href = '/inicio'}
                >
                    Volver a inicio
                </button>
            </div>
        </div>
    );
};

export default MisFestivales;