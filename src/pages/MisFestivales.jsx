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

    const handleVolver = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/inicio');
        }
    };

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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
            <p className="text-gray-400 animate-pulse">Cargando tus festivales...</p>
        </div>
    );

    if (!usuario && !loading) return (
        <div className="min-h-screen flex flex-col bg-[#0B0F19] text-white items-center justify-center p-4">
            <img src={mflogo} alt="" className="w-16 h-16 mb-4 rounded-lg opacity-80 grayscale" />
            <p className="text-center text-gray-400 mb-6">Debes iniciar sesión para ver tus festivales.</p>
            <Link to="/login" className="px-6 py-2 rounded-full font-bold text-[#0B0F19] bg-white hover:bg-cyan-400 shadow-lg transition transform hover:-translate-y-0.5">
                Iniciar Sesión
            </Link>
        </div>
    );

    return (
        // FONDO OSCURO + LUCES
        <div className="min-h-screen flex flex-col bg-[#0B0F19] text-white font-sans selection:bg-cyan-500 selection:text-white relative overflow-hidden">
            
            {/* Blobs de luz */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px]"></div>
            </div>

            {/* --- HEADER --- */}
            <header className="w-full px-6 py-4 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-[#0B0F19]/80">
                <div className="container mx-auto flex justify-between items-center max-w-7xl">
                    <div className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200"></div>
                            <img src={mflogo} alt="MiFestival Logo" className="relative w-9 h-9 rounded-lg" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors hidden sm:inline">Mis Festivales</h1>
                    </div>
                    
                    <button
                        onClick={handleVolver}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition border border-transparent hover:border-white/10"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Volver
                    </button>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 md:py-16 max-w-7xl">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                    <span className="text-gray-400 text-sm font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {festivales.length} {festivales.length === 1 ? 'festival' : 'festivales'}
                    </span>
                    <button
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cyan-600 text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-cyan-900/20 hover:bg-cyan-500 hover:-translate-y-0.5 transition-all duration-200"
                        onClick={() => navigate('/crear-festival')}
                    >
                        <PlusIcon className="w-5 h-5" />
                        Crear Nuevo
                    </button>
                </div>

                {/* Lista de Festivales */}
                {festivales.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {festivales.map(festival => (
                            <div
                                key={festival.id}
                                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-900/10 transition-all duration-300 flex flex-col"
                            >
                                <div className="p-6 flex-grow relative">
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>
                                    
                                    <h3
                                        className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-cyan-400 truncate transition-colors relative z-10"
                                        onClick={() => navigate(`/festival/${festival.id}/artistas`)}
                                        title={festival.nombre || festival.name || 'Festival sin nombre'}
                                    >
                                        {festival.nombre || festival.name || 'Festival sin nombre'}
                                    </h3>

                                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2 relative z-10">
                                        <span className="inline-flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md">
                                            <CalendarDaysIcon className="w-4 h-4 text-purple-400" />
                                            {festival.days || '?'} {festival.days === 1 ? 'día' : 'días'}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md">
                                            <MapPinIcon className="w-4 h-4 text-pink-400" />
                                            {festival.stages?.length || 0} {festival.stages?.length === 1 ? 'escenario' : 'escenarios'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-black/20 border-t border-white/5 px-5 py-3 flex justify-end items-center gap-2">
                                    <button
                                        title="Eliminar Festival"
                                        className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                        onClick={() => handleEliminarFestival(festival.id)}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        title="Editar Festival"
                                        className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500 px-4 py-2 rounded-lg transition-all"
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
                    // Estado Vacío (Empty State)
                    <div className="text-center py-20 px-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                        <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <TicketIcon className="w-10 h-10 text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Aún no tienes festivales</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            ¡El escenario está vacío! Empieza a crear tu primer lineup legendario ahora mismo.
                        </p>
                        <button
                            className="inline-flex items-center gap-2 bg-cyan-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-cyan-500 hover:-translate-y-0.5 transition-all duration-200"
                            onClick={() => navigate('/crear-festival')}
                        >
                            <PlusIcon className="w-5 h-5" />
                            Crear Mi Primer Festival
                        </button>
                    </div>
                )}
            </main>

            {/* --- FOOTER --- */}
            <footer className="w-full py-6 text-center text-xs text-gray-500 border-t border-white/5 bg-[#0B0F19]">
                <div className="container mx-auto px-4">
                    © {new Date().getFullYear()} MiFestival. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
};

export default MisFestivales;