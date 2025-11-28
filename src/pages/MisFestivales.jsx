import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import mflogo from "../assets/mflogo20.png";
// Iconos
import { ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, TicketIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

const MisFestivales = () => {
    const [festivales, setFestivales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    // --- NUEVA FUNCIÓN: Volver Atrás ---
    const handleVolver = () => {
        // Si hay historial (más de 2 entradas), vuelve atrás. Si no, va a inicio.
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/inicio');
        }
    };

    // Lógica Original para cargar festivales
    useEffect(() => {
        setLoading(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUsuario(user);
                try {
                    const q = query(collection(db, 'festivals'), where('userId', '==', user.uid));
                    const querySnapshot = await getDocs(q);
                    const festivalesData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    // Ordenar por fecha de creación
                    festivalesData.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
                    setFestivales(festivalesData);
                } catch (error) {
                    console.error("Error fetching festivals:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setUsuario(null);
                setFestivales([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Lógica Original para eliminar festival
    const handleEliminarFestival = async (festivalId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este festival? Esta acción no se puede deshacer.')) {
            try {
                await deleteDoc(doc(db, 'festivals', festivalId));
                setFestivales(prev => prev.filter(f => f.id !== festivalId));
            } catch (error) {
                console.error("Error deleting festival:", error);
                alert('Error al eliminar el festival. Inténtalo de nuevo.');
            }
        }
    };

    // --- Renderizado ---

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 animate-pulse">Cargando tus festivales...</p>
        </div>
    );

    if (!usuario && !loading) return (
        <div className="min-h-screen flex flex-col bg-gray-50 items-center justify-center p-4">
            <img src={mflogo} alt="" className="w-16 h-16 mb-4 rounded-lg opacity-80" />
            <p className="text-center text-gray-600 mb-6">Debes iniciar sesión para ver tus festivales.</p>
            <Link to="/login" className="px-5 py-2 rounded-md font-semibold text-white bg-cyan-500 hover:bg-cyan-600 shadow-sm transition">
                Iniciar Sesión
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
            {/* Header consistente */}
            <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md" />
                        <h1 className="text-lg font-bold text-gray-900">Mis Festivales</h1>
                    </div>
                    
                    {/* BOTÓN VOLVER (Reemplazando el Link anterior) */}
                    <button
                        onClick={handleVolver}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Volver
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-gray-500 text-sm">
                        {festivales.length} {festivales.length === 1 ? 'festival creado' : 'festivales creados'}
                    </span>
                    <button
                        className="inline-flex items-center gap-2 bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-cyan-600 transition duration-150"
                        onClick={() => navigate('/crear-festival')}
                    >
                        <PlusIcon className="w-4 h-4" />
                        Crear Nuevo Festival
                    </button>
                </div>

                {/* Lista de Festivales */}
                {festivales.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {festivales.map(festival => (
                            <div
                                key={festival.id}
                                className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden flex flex-col group transition duration-200 hover:shadow-md"
                            >
                                <div className="p-5 flex-grow">
                                    <h3
                                        className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-cyan-600 truncate"
                                        onClick={() => navigate(`/festival/${festival.id}/artistas`)} // Ajusta la ruta según tu router
                                        title={festival.nombre || festival.name || 'Festival sin nombre'}
                                    >
                                        {festival.nombre || festival.name || 'Festival sin nombre'}
                                    </h3>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                        <span className="inline-flex items-center gap-1">
                                            <CalendarDaysIcon className="w-3.5 h-3.5" />
                                            {festival.days || '?'} {festival.days === 1 ? 'día' : 'días'}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <MapPinIcon className="w-3.5 h-3.5" />
                                            {festival.stages?.length || 0} {festival.stages?.length === 1 ? 'escenario' : 'escenarios'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex justify-end items-center gap-3">
                                    <button
                                        title="Eliminar Festival"
                                        className="text-gray-400 hover:text-red-500 transition p-1 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                                        onClick={() => handleEliminarFestival(festival.id)}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        title="Editar Festival"
                                        className="flex items-center gap-1 text-sm font-medium text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-md transition"
                                        onClick={() => navigate(`/editarFestival/${festival.id}`)}
                                    >
                                        <PencilSquareIcon className="w-4 h-4" />
                                        Editar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-lg shadow border border-gray-100">
                        <TicketIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Aún no tienes festivales</h3>
                        <p className="text-gray-500 mb-6">
                            ¡Empieza a crear tu primer lineup ahora mismo!
                        </p>
                        <button
                            className="inline-flex items-center gap-2 bg-cyan-500 text-white text-sm font-semibold py-2 px-5 rounded-md shadow-sm hover:bg-cyan-600 transition"
                            onClick={() => navigate('/crear-festival')}
                        >
                            <PlusIcon className="w-4 h-4" />
                            Crear Mi Primer Festival
                        </button>
                    </div>
                )}
            </main>

            <footer className="w-full py-5 text-center text-xs text-gray-400 border-t border-gray-100 mt-auto">
                <div className="container mx-auto px-4 sm:px-6">
                    © {new Date().getFullYear()} MiFestival por Carlos Cortez.
                </div>
            </footer>
        </div>
    );
};

export default MisFestivales;