import React, { useEffect, useState, useContext } from 'react';
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import mflogo from "../assets/mflogo20.png";
import PosterFestival from "./PosterFestival";
import {
    FireIcon,
    ClockIcon,
    HeartIcon,
    ArrowLeftIcon,
    CalendarDaysIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const Explorar = () => {
    const [festivales, setFestivales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [filtro, setFiltro] = useState('trending');
    const { user } = useContext(AuthContext);

    // Cargar Festivales
    useEffect(() => {
        const fetchFestivales = async () => {
            setLoading(true);
            setFetchError(null);
            try {
                const festivalsRef = collection(db, "festivals");
                let q;

                if (filtro === 'trending') {
                    q = query(festivalsRef, where("isPublic", "==", true), orderBy("likes", "desc"), limit(20));
                } else {
                    q = query(festivalsRef, where("isPublic", "==", true), orderBy("createdAt", "desc"), limit(20));
                }

                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFestivales(data);
            } catch (error) {
                console.error("Error cargando feed:", error);
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchFestivales();
    }, [filtro]);

    // Manejar Like
    const handleLike = async (e, festival) => {
        e.preventDefault();
        if (!user) return alert("Inicia sesión para dar like");

        const isLiked = festival.likesBy?.includes(user.uid);
        const festivalRef = doc(db, "festivals", festival.id);

        const updatedFestivales = festivales.map(f => {
            if (f.id === festival.id) {
                return {
                    ...f,
                    likes: isLiked ? (f.likes - 1) : (f.likes + 1),
                    likesBy: isLiked
                        ? f.likesBy.filter(id => id !== user.uid)
                        : [...(f.likesBy || []), user.uid]
                };
            }
            return f;
        });
        setFestivales(updatedFestivales);

        try {
            if (isLiked) {
                await updateDoc(festivalRef, {
                    likes: increment(-1),
                    likesBy: arrayRemove(user.uid)
                });
            } else {
                await updateDoc(festivalRef, {
                    likes: increment(1),
                    likesBy: arrayUnion(user.uid)
                });
            }
        } catch (error) {
            console.error("Error al dar like:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-brutal-base text-[#050510] font-inter selection:bg-yellow-400 selection:text-black relative overflow-x-hidden border-x-4 border-black max-w-[1600px] mx-auto">
            {/* Fondo Textura */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

            {/* --- HEADER --- */}
            <header className="w-full px-4 sm:px-6 py-4 border-b-4 border-black sticky top-0 z-50 bg-white">
                <div className="container mx-auto flex justify-between items-center max-w-[1400px]">
                    <Link to="/inicio" className="flex items-center gap-3 shrink-0">
                        <div className="relative border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
                            <img src={mflogo} alt="MiFestival Logo" className="relative w-8 h-8 sm:w-9 sm:h-9 object-cover" />
                        </div>
                        <span className="text-lg sm:text-xl brutal-title hidden sm:inline bg-[#FF90E8] px-2 mt-1 border-2 border-black">EXPLORAR</span>
                    </Link>
                    <Link
                        to="/inicio"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black border-2 border-black hover:bg-yellow-400 shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white"
                    >
                        <ArrowLeftIcon className="w-5 h-5" /> Volver
                    </Link>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 max-w-7xl">

                {/* Titulo Sección */}
                <div className="text-center mb-10 bg-white border-4 border-black p-6 shadow-[8px_8px_0_#000] transform -rotate-1 max-w-2xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl brutal-title mb-4 bg-yellow-400 inline-block px-4 py-2 border-4 border-black">DESCUBRIR</h1>
                    <p className="text-lg text-black font-semibold uppercase tracking-widest">
                        Los mejores lineups creados por la comunidad.
                    </p>
                </div>

                {/* Filtros */}
                <div className="flex justify-center mb-12 gap-4 flex-wrap">
                    <button
                        onClick={() => setFiltro('trending')}
                        className={`flex items-center gap-2 px-6 py-3 text-lg brutal-btn shadow-[4px_4px_0_#000] ${filtro === 'trending'
                            ? 'bg-[#FF90E8] translate-x-[4px] translate-y-[4px] shadow-[0px_0px_0_#000]'
                            : 'bg-white hover:bg-gray-100'
                            }`}
                    >
                        <FireIcon className="w-6 h-6" /> TENDENCIAS
                    </button>
                    <button
                        onClick={() => setFiltro('recent')}
                        className={`flex items-center gap-2 px-6 py-3 text-lg brutal-btn shadow-[4px_4px_0_#000] ${filtro === 'recent'
                            ? 'bg-[#00E5FF] translate-x-[4px] translate-y-[4px] shadow-[0px_0px_0_#000]'
                            : 'bg-white hover:bg-gray-100'
                            }`}
                    >
                        <ClockIcon className="w-6 h-6" /> RECIENTES
                    </button>
                </div>

                {/* Grid de Festivales */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="bg-white border-4 border-black shadow-[8px_8px_0_#000] p-8 flex items-center gap-4">
                            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xl brutal-title">BUSCANDO...</span>
                        </div>
                    </div>
                ) : fetchError ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                        <div className="bg-[#FF90E8] border-4 border-black p-8 shadow-[8px_8px_0_#000] max-w-lg">
                            <FireIcon className="w-16 h-16 text-black mx-auto mb-4 border-2 border-black p-2 bg-white" />
                            <h2 className="text-3xl brutal-title mb-4">¡UPS! ALGO SALIÓ MAL</h2>
                            <p className="text-black font-semibold mb-6 text-lg">No pudimos cargar los festivales. Culpa nuestra, no tuya.</p>
                            <button
                                onClick={() => { setFiltro(filtro === 'trending' ? 'recent' : 'trending'); setTimeout(() => setFiltro(filtro), 100); }}
                                className="bg-[#00FF66] brutal-btn py-3 px-8 text-xl"
                            >
                                INTENTAR DE NUEVO
                            </button>
                        </div>
                    </div>
                ) : festivales.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_#000] text-center transform rotate-1 max-w-lg">
                            <p className="text-2xl brutal-title">AÚN NO HAY FESTIVALES PÚBLICOS.</p>
                            <p className="text-black font-semibold mt-4">¡Sé el primero en crear y compartir tu lineup!</p>
                            <Link to="/crear" className="inline-block mt-6 bg-[#00E5FF] brutal-btn py-3 px-8 text-xl">CREAR AHORA</Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {festivales.map((festival) => {
                            const isLiked = user ? festival.likesBy?.includes(user.uid) : false;

                            return (
                                <Link
                                    to={`/VerFestival/${festival.id}`}
                                    key={festival.id}
                                    className="group relative bg-white border-4 border-black shadow-[8px_8px_0_#000] hover:shadow-[12px_12px_0_#000] hover:-translate-y-1 transition-all flex flex-col overflow-hidden"
                                >
                                    {/* --- IMAGEN CON FORMATO VERTICAL --- */}
                                    <div className="relative w-full aspect-[9/16] overflow-hidden bg-black border-b-4 border-black flex items-center justify-center">
                                        <div
                                            className="absolute top-0 left-1/2 -translate-x-1/2 origin-top pointer-events-none select-none"
                                            style={{
                                                transform: 'scale(0.3)', // Escala para ajustar en la tarjeta
                                                width: '1080px',
                                                height: '1920px'
                                            }}
                                        >
                                            <PosterFestival
                                                festival={festival}
                                                backgroundType={festival.fondoPoster || 'city'}
                                            />
                                        </div>

                                        {/* Tag de Autor Brutalista */}
                                        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#FFD500] border-2 border-black px-3 py-1 shadow-[2px_2px_0_#000] transform -rotate-2 z-10">
                                            <span className="text-black font-black uppercase tracking-widest text-xs">POR:</span>
                                            <span className="capitalize text-black font-bold truncate max-w-[100px] text-sm">
                                                {festival.userName || 'Anónimo'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* --- INFO CARD BRUTALISTA --- */}
                                    <div className="p-5 flex-grow flex flex-col justify-between bg-white relative z-10 transition-colors group-hover:bg-yellow-50">
                                        <div>
                                            <h3 className="brutal-title text-2xl text-black mb-3 truncate group-hover:underline decoration-4 underline-offset-4">
                                                {festival.name}
                                            </h3>

                                            {/* Badges de Info */}
                                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                                <span className="inline-flex items-center gap-1 bg-[#00E5FF] border-2 border-black text-black px-2 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0_#000] rotate-1">
                                                    <CalendarDaysIcon className="w-4 h-4" /> {festival.days} DÍAS
                                                </span>
                                                <span className="inline-flex items-center gap-1 bg-[#00FF66] border-2 border-black text-black px-2 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0_#000] -rotate-1">
                                                    <MapPinIcon className="w-4 h-4" /> {festival.stages?.length || 1} ESC
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer Tarjeta */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t-4 border-black border-dashed">
                                            <span className="text-xs font-black text-black uppercase tracking-widest px-2 bg-gray-200 border-2 border-black">
                                                {festival.createdAt?.toDate().toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>

                                            <button
                                                onClick={(e) => handleLike(e, festival)}
                                                className={`flex items-center gap-2 px-3 py-2 border-2 border-black shadow-[2px_2px_0_#000] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0_#000] ${isLiked
                                                    ? 'bg-[#FF90E8] text-black'
                                                    : 'bg-white text-black hover:bg-gray-100'
                                                    }`}
                                            >
                                                {isLiked ? <HeartIconSolid className="w-5 h-5 text-red-600" /> : <HeartIcon className="w-5 h-5" />}
                                                <span className="font-black text-sm">{festival.likes || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
            <footer className="w-full py-8 text-center text-sm font-black uppercase tracking-widest text-black border-t-4 border-black bg-white mt-10 relative z-10">
                <div className="container mx-auto px-4">© {new Date().getFullYear()} MiFestival. HAZ RUIDO.</div>
            </footer>
        </div>
    );
};

export default Explorar;