import React, { useEffect, useState } from 'react';
import useSEO from "../hooks/useSEO";
import { trackEvent } from "../utils/analytics";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import mflogo from "../assets/mflogo20.png";
// Iconos: Agregamos HeartIcon
import { ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, TicketIcon, CalendarDaysIcon, MapPinIcon, GlobeAltIcon, LockClosedIcon, HeartIcon } from '@heroicons/react/24/outline';

const MisFestivales = () => {
    const [festivales, setFestivales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useSEO({
        title: 'Mis Festivales | MiFestival',
        description: 'Gestiona y edita tus festivales creados en MiFestival.',
        noindex: true,
    });

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
                trackEvent('festival_deleted', { festival_id: festivalId });
            } catch (error) {
                console.error("Error deleting festival:", error);
                alert('Error al eliminar el festival. Inténtalo de nuevo.');
            }
        }
    };

    const handleTogglePublic = async (festival) => {
        if (!usuario) return;
        const newState = !festival.isPublic;

        const updatedFestivales = festivales.map(f =>
            f.id === festival.id ? { ...f, isPublic: newState } : f
        );
        setFestivales(updatedFestivales);

        try {
            const docRef = doc(db, "festivals", festival.id);
            await updateDoc(docRef, {
                isPublic: newState,
                userName: usuario.displayName || "Anónimo",
                likes: festival.likes || 0
            });
            trackEvent('festival_visibility_toggled', {
                festival_id: festival.id,
                festival_name: festival.name || festival.nombre,
                is_public: newState
            });
        } catch (error) {
            console.error("Error actualizando estado público:", error);
            setFestivales(festivales);
            alert("No se pudo actualizar el estado público.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-brutal-base font-inter">
            <p className="text-black font-bold animate-pulse text-2xl uppercase border-4 border-black bg-yellow-400 p-4 shadow-[8px_8px_0_#000]">Cargando...</p>
        </div>
    );

    if (!usuario && !loading) return (
        <div className="min-h-screen flex flex-col bg-brutal-base font-inter items-center justify-center p-4">
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_#000] max-w-md w-full text-center transform -rotate-2">
                <img src={mflogo} alt="" className="w-20 h-20 mb-6 mx-auto border-4 border-black shadow-[4px_4px_0_#000] grayscale" />
                <p className="text-black font-extrabold uppercase text-xl mb-6 brutal-title">Debes iniciar sesión <br />para ver tus festivales</p>
                <Link to="/login" className="bg-[#FF90E8] brutal-btn px-6 py-4 block w-full text-xl">
                    LOG IN AHORA
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-brutal-base text-[#050510] font-inter selection:bg-yellow-400 selection:text-black relative overflow-hidden border-x-4 border-black max-w-[1600px] mx-auto">
            {/* Fondo Textura */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

            {/* --- HEADER --- */}
            <header className="w-full px-4 sm:px-6 py-4 border-b-4 border-black sticky top-0 z-50 bg-brutal-base">
                <div className="container mx-auto flex justify-between items-center max-w-7xl">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="relative border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
                            <img src={mflogo} alt="MiFestival Logo" className="relative w-8 h-8 sm:w-9 sm:h-9 object-cover" />
                        </div>
                        <h1 className="text-lg sm:text-xl brutal-title hidden sm:inline bg-yellow-400 px-2 mt-1">Mis Festivales</h1>
                    </div>

                    <button
                        onClick={handleVolver}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black border-2 border-black hover:bg-white shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-[#00E5FF]"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Atrás
                    </button>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 md:py-16 max-w-7xl relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                    <span className="text-black text-xl font-bold bg-[#FF90E8] border-2 border-black px-4 py-2 shadow-[2px_2px_0_#000]">
                        {festivales.length} {festivales.length === 1 ? 'FESTIVAL' : 'FESTIVALES'}
                    </span>
                    <button
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#00FF66] brutal-btn text-lg px-6 py-3"
                        onClick={() => navigate('/crear-festival')}
                    >
                        <PlusIcon className="w-6 h-6 border-2 border-black rounded-full bg-white p-1" />
                        CREAR NUEVO
                    </button>
                </div>

                {/* Lista de Festivales */}
                {festivales.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {festivales.map(festival => (
                            <div
                                key={festival.id}
                                className="group brutal-card bg-white overflow-hidden flex flex-col relative transform transition-transform duration-200 hover:-translate-y-2 hover:translate-x-2"
                            >
                                {/* HEADER DE LA TARJETA (Estado Público/Privado) */}
                                <div className="absolute top-4 right-4 z-20">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleTogglePublic(festival);
                                        }}
                                        className={`flex items-center gap-1.5 px-3 py-1 text-xs brutal-title border-2 border-black transition-all shadow-[2px_2px_0_#000] active:shadow-[0_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] ${festival.isPublic
                                            ? 'bg-[#00FF66] text-black'
                                            : 'bg-white text-gray-500 line-through'
                                            }`}
                                        title={festival.isPublic ? "Público: Visible en Explorar" : "Privado: Solo tú puedes verlo"}
                                    >
                                        {festival.isPublic ? <GlobeAltIcon className="w-4 h-4" /> : <LockClosedIcon className="w-4 h-4" />}
                                        {festival.isPublic ? "Público" : "Privado"}
                                    </button>
                                </div>

                                <div className="p-6 pt-10 flex-grow relative bg-[#00E5FF] border-b-4 border-black">
                                    <h3
                                        className="text-4xl brutal-title mb-4 cursor-pointer hover:underline break-words whitespace-normal relative z-10 pr-10 bg-yellow-400 inline-block px-3 py-1 border-2 border-black shadow-[4px_4px_0_#000] -rotate-2"
                                        style={{ maxWidth: '100%', display: 'inline-block' }}
                                        onClick={() => navigate(`/festival/${festival.id}/artistas`)}
                                        title={festival.nombre || festival.name || 'Festival sin nombre'}
                                    >
                                        {festival.nombre || festival.name || 'SIN NOMBRE'}
                                    </h3>

                                    {/* --- STATS DEL FESTIVAL --- */}
                                    <div className="flex items-center gap-3 text-sm text-black font-bold mt-6 relative z-10 flex-wrap">
                                        <span className="inline-flex items-center gap-1.5 bg-white border-2 border-black shadow-[2px_2px_0_#000] px-3 py-1">
                                            <HeartIcon className="w-4 h-4 text-red-500 fill-red-500" />
                                            {festival.likes || 0}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 bg-white border-2 border-black shadow-[2px_2px_0_#000] px-3 py-1">
                                            <CalendarDaysIcon className="w-4 h-4 text-black" />
                                            {festival.days || '?'}d
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 bg-white border-2 border-black shadow-[2px_2px_0_#000] px-3 py-1">
                                            <MapPinIcon className="w-4 h-4 text-black" />
                                            {festival.stages?.length || 0}e
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white px-5 py-4 flex justify-between items-center gap-4 relative z-20">
                                    <button
                                        type="button"
                                        title="Eliminar Festival"
                                        className="text-black hover:bg-red-500 border-2 border-black p-2 shadow-[2px_2px_0_#000] transition-colors cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleEliminarFestival(festival.id);
                                        }}
                                    >
                                        <TrashIcon className="w-6 h-6 pointer-events-none" />
                                    </button>
                                    <button
                                        type="button"
                                        title="Editar Festival"
                                        className="flex items-center gap-2 text-lg font-black text-black border-4 border-black bg-yellow-400 hover:bg-white flex-1 justify-center py-2 shadow-[4px_4px_0_#000] active:shadow-[0_0_0_#000] active:translate-x-[4px] active:translate-y-[4px] transition-all uppercase tracking-wider cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(`/editarFestival/${festival.id}`);
                                        }}
                                    >
                                        <PencilSquareIcon className="w-5 h-5 pointer-events-none" />
                                        EDITAR
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Estado Vacío
                    <div className="text-center py-20 px-6 brutal-card bg-[#FF90E8] transform rotate-1">
                        <div className="bg-white border-4 border-black w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0_#000] transform -rotate-6">
                            <TicketIcon className="w-12 h-12 text-black" />
                        </div>
                        <h3 className="text-4xl brutal-title mb-4">Aún no tienes festivales</h3>
                        <p className="text-black text-xl font-bold mb-8 max-w-md mx-auto border-t-4 border-black pt-4">
                            ¡El escenario está vacío! Empieza a crear tu primer lineup legendario ahora mismo.
                        </p>
                        <button
                            className="bg-[#00FF66] brutal-btn text-xl px-10 py-5 inline-flex items-center gap-2"
                            onClick={() => navigate('/crear-festival')}
                        >
                            <PlusIcon className="w-8 h-8" />
                            CREAR EL PRIMERO
                        </button>
                    </div>
                )}
            </main>

            <footer className="w-full py-8 text-center text-sm font-black uppercase tracking-widest text-black border-t-4 border-black bg-white mt-10">
                <div className="container mx-auto px-4">
                    © {new Date().getFullYear()} MiFestival. HAZ RUIDO.
                </div>
            </footer>
        </div>
    );
};

export default MisFestivales;