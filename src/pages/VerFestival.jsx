import React, { useEffect, useState, useRef, useContext } from "react";
import useSEO from "../hooks/useSEO";
import { trackEvent } from "../utils/analytics";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toPng } from "html-to-image";
import PosterFestival from "./PosterFestival";
import mflogo from "../assets/mflogo20.png";
import { AuthContext } from "../context/AuthContext";
// Iconos
import { ArrowLeftIcon, PencilSquareIcon, ArrowDownTrayIcon, ShareIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Festival = () => {
    // --- 1. VALIDACIÓN ROBUSTA DE URL ---
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const paramValue = params.slugId || params.id;
    const id = paramValue ? (paramValue.includes('-') ? paramValue.split('-').pop() : paramValue) : null;

    const [festival, setFestival] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [artistas, setArtistas] = useState([]);
    const [fondoPoster, setFondoPoster] = useState("city");

    useSEO({
        title: festival ? `${festival.name} | MiFestival` : 'Festival | MiFestival',
        description: festival ? `Mira el lineup de ${festival.name} en MiFestival. ${festival.days || ''} días de música increíble.` : 'Visualiza lineups de festivales en MiFestival.',
        canonical: id ? `https://mifestival.web.app/verfestival/${id}` : undefined,
    });

    // REFS
    const posterRef = useRef(null);
    const previewContainerRef = useRef(null);
    const [previewScale, setPreviewScale] = useState(0.3);

    // --- 2. LÓGICA BOTÓN VOLVER INTELIGENTE ---
    const handleVolver = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/inicio');
        }
    };

    // --- 3. ESCALA DINÁMICA ---
    useEffect(() => {
        const calculateScale = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.offsetWidth;
                const scale = containerWidth / 1080;
                setPreviewScale(scale);
            }
        };
        calculateScale();
        window.addEventListener('resize', calculateScale);
        const timer = setTimeout(calculateScale, 100);
        return () => {
            window.removeEventListener('resize', calculateScale);
            clearTimeout(timer);
        };
    }, [loading]);

    // --- FUNCIONES DE DESCARGA/COMPARTIR ---
    const generarSlug = (nombre) => nombre.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    const handleDescargarPoster = async () => {
        if (!posterRef.current || !festival) return;
        const node = posterRef.current.firstChild;
        if (!node) return;

        try {
            const dataUrl = await toPng(node, { pixelRatio: 1, cacheBust: true });
            const link = document.createElement("a");
            link.download = `${generarSlug(festival.name || 'mi-festival')}-poster.png`;
            link.href = dataUrl;
            link.click();
            trackEvent('poster_downloaded', { festival_name: festival.name });
        } catch (err) {
            console.error(err);
            alert("No se pudo generar imagen.");
        }
    };

    const handleSharePoster = async () => {
        if (!posterRef.current || !navigator.share || !festival) return;
        const node = posterRef.current.firstChild;
        if (!node) return;

        try {
            const dataUrl = await toPng(node, { pixelRatio: 1, cacheBust: true });
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const file = new File([blob], `${generarSlug(festival.name || 'mi-festival')}.png`, { type: 'image/png' });
            const shareUrl = window.location.href;

            const shareData = {
                title: festival.name || 'Poster',
                text: `¡Mira mi lineup para ${festival.name || 'mi festival'}!`,
                url: shareUrl
            };

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ ...shareData, files: [file] });
            } else {
                await navigator.share({ ...shareData, text: `${shareData.text}\n${shareUrl}` });
            }
            trackEvent('poster_shared', { festival_name: festival.name });
        } catch (err) {
            if (err.name !== 'AbortError') alert('No se pudo compartir.');
            console.error(err);
        }
    };

    // --- CARGA DE DATOS ---
    useEffect(() => {
        let isMounted = true;
        const fetchFestival = async () => {
            if (!id) {
                setError("ID de festival no válido.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError('');
            try {
                const docRef = doc(db, "festivals", id);
                const docSnap = await getDoc(docRef);
                if (isMounted) {
                    if (docSnap.exists()) {
                        setFestival({ id: docSnap.id, ...docSnap.data() });
                        setArtistas(docSnap.data().artistas || []);
                        setFondoPoster(docSnap.data().fondoPoster || "city");
                        trackEvent('festival_viewed', { festival_id: docSnap.id, festival_name: docSnap.data().name });
                    } else {
                        setError("Festival no encontrado.");
                        setFestival(null);
                    }
                }
            } catch (err) {
                if (isMounted) { setError("Error al cargar el festival."); console.error(err); }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchFestival();
        return () => { isMounted = false };
    }, [id]);

    // --- RENDERIZADO CONDICIONAL ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brutal-base font-inter border-x-4 border-black max-w-[1600px] mx-auto">
                <div className="bg-white border-4 border-black shadow-[8px_8px_0_#000] p-8 flex items-center gap-4">
                    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xl brutal-title">CARGANDO FESTIVAL...</span>
                </div>
            </div>
        );
    }

    if (error || !festival) {
        return (
            <div className="min-h-screen flex flex-col bg-brutal-base font-inter border-x-4 border-black max-w-[1600px] mx-auto">
                <header className="w-full px-4 sm:px-6 py-4 border-b-4 border-black bg-white">
                    <div className="container mx-auto flex justify-between items-center max-w-[1400px]">
                        <Link to="/inicio" className="flex items-center gap-3 shrink-0">
                            <div className="relative border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
                                <img src={mflogo} alt="MiFestival Logo" className="relative w-8 h-8 sm:w-9 sm:h-9 object-cover" />
                            </div>
                            <span className="text-lg sm:text-xl brutal-title hidden sm:inline bg-[#FF90E8] px-2 mt-1 border-2 border-black">MIFESTIVAL</span>
                        </Link>
                        <button onClick={handleVolver} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black border-2 border-black hover:bg-yellow-400 shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white"><ArrowLeftIcon className="w-5 h-5" />Volver</button>
                    </div>
                </header>
                <main className="flex-grow flex items-center justify-center px-4 py-12">
                    <div className="bg-[#FF90E8] border-4 border-black p-8 shadow-[8px_8px_0_#000] max-w-lg text-center transform -rotate-1">
                        <h2 className="text-3xl brutal-title mb-4 bg-white border-4 border-black inline-block px-4 py-2 rotate-2">ERROR</h2>
                        <p className="text-black font-semibold mb-6 text-lg">{error || "Festival no encontrado"}</p>
                        <button onClick={handleVolver} className="inline-block bg-[#00E5FF] brutal-btn py-3 px-8 text-xl">VOLVER AL INICIO</button>
                    </div>
                </main>
            </div>
        );
    }

    const dias = Array.from({ length: festival.days || 0 }, (_, i) => `Día ${i + 1}`);
    const escenarios = festival.stages || [];
    const isOwner = user && (festival.userId === user.uid || (user.isGuest && festival.userId === 'invitado'));

    return (
        <div className="min-h-screen flex flex-col bg-brutal-base text-[#050510] font-inter selection:bg-yellow-400 selection:text-black relative overflow-x-hidden border-x-4 border-black max-w-[1600px] mx-auto">
            {/* Fondo Textura */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

            {/* --- HEADER --- */}
            <header className="w-full px-4 sm:px-6 py-4 border-b-4 border-black sticky top-0 z-50 bg-white">
                <div className="container mx-auto flex justify-between items-center max-w-[1400px]">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link to="/inicio" className="relative flex-shrink-0 border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
                            <img src={mflogo} alt="MiFestival Logo" className="relative w-8 h-8 sm:w-9 sm:h-9 object-cover" />
                        </Link>
                        <span className="text-lg sm:text-lg brutal-title truncate hidden sm:inline bg-[#00FF66] px-2 mt-1 border-2 border-black max-w-[200px] bg-[#FFD500] rotate-1">{festival.name || 'Detalle'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleVolver}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black border-2 border-black hover:bg-yellow-400 shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white whitespace-nowrap"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Volver</span>
                        </button>

                        {isOwner && (
                            <Link
                                to={`/editarFestival/${id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-black uppercase tracking-widest text-black border-2 border-black bg-[#FF90E8] shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap"
                            >
                                <PencilSquareIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">Editar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* --- LAYOUT PRINCIPAL BRUTALISTA --- */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-8 items-start max-w-[1400px] relative z-10">

                {/* Columna Izquierda: Grilla */}
                <section className="flex-grow w-full bg-white border-4 border-black shadow-[8px_8px_0_#000] p-6 lg:p-8 overflow-hidden min-h-[600px] flex flex-col">
                    <div className="mb-6 border-b-4 border-black border-dashed pb-6">
                        <h1 className="text-3xl md:text-5xl font-outfit font-black uppercase text-black mb-4 truncate transform -rotate-1 bg-[#00E5FF] inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0_#000] max-w-full">{festival.name || 'Festival'}</h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm font-black text-black tracking-widest uppercase">
                            <span className="inline-flex items-center gap-1 bg-[#FFD500] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0_#000] rotate-1"><CalendarDaysIcon className="w-5 h-5" />{dias.length} {dias.length === 1 ? 'DÍA' : 'DÍAS'}</span>
                            <span className="inline-flex items-center gap-1 bg-[#00FF66] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0_#000] -rotate-1"><MapPinIcon className="w-5 h-5" />{escenarios.length} ESC.</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto flex-grow custom-scrollbar pb-4 bg-[#f5f5f0] border-4 border-black p-2">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    {dias.map((dia) => (
                                        <th key={dia} className="px-4 py-4 text-lg font-black text-black uppercase tracking-widest border-b-4 border-black border-r-4 border-black last:border-r-0 text-center min-w-[200px] bg-[#00E5FF]">{dia}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y-4 divide-black divide-dashed bg-white">
                                {escenarios.map((escenario) => (
                                    <tr key={escenario} className="hover:bg-yellow-50 transition-colors group">
                                        {dias.map((dia) => {
                                            const artistasEnCelda = artistas.filter(a => a.dia === dia && a.escenario === escenario);
                                            return (
                                                <td key={`${dia}-${escenario}`} className="px-3 py-3 text-sm border-r-4 border-black last:border-r-0 align-top h-32">
                                                    <div className="space-y-2">
                                                        {artistasEnCelda.map((a, i) => (
                                                            <div key={i} className="bg-[#FFD500] border-2 border-black px-3 py-2 text-black text-sm font-bold truncate shadow-[2px_2px_0_#000] transform hover:-rotate-1 transition-transform cursor-default">
                                                                {a.nombre}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {artistasEnCelda.length === 0 && <span className="text-gray-400 italic font-bold text-xs block text-center mt-4">_</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Columna Derecha: Vista Previa */}
                <aside className="w-full lg:w-80 xl:w-96 bg-white border-4 border-black shadow-[8px_8px_0_#000] p-5 lg:sticky lg:top-24 flex-shrink-0 space-y-6">
                    <div>
                        <h2 className="text-lg brutal-title mb-4 bg-yellow-400 inline-block px-2 border-2 border-black -rotate-2">PÓSTER OFICIAL</h2>


                        {/* PREVIEW CONTAINER BRUTALISTA */}
                        <div
                            ref={previewContainerRef}
                            className="overflow-hidden bg-black border-4 border-black shadow-[4px_4px_0_#000] relative group flex items-center justify-center"
                            style={{
                                width: "100%",
                                aspectRatio: "9/16",
                            }}
                        >
                            <div style={{
                                width: 1080,
                                height: 1920,
                                transform: `scale(${previewScale})`,
                                transformOrigin: "top left",
                                position: "absolute",
                                top: 0,
                                left: 0
                            }}>
                                <PosterFestival
                                    festival={{ ...festival, artistas: artistas }}
                                    backgroundType={fondoPoster}
                                />
                            </div>
                            {/* Overlay Brutalista */}
                            <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    {/* HD RENDER (HIDDEN) */}
                    <div style={{ position: "absolute", left: "-99999px", top: 0 }}>
                        <div ref={posterRef}>
                            <PosterFestival
                                festival={{ ...festival, artistas: artistas }}
                                backgroundType={fondoPoster}
                            />
                        </div>
                    </div>

                    {/* Botones de acción Brutalistas */}
                    <div className="space-y-4 pt-4 border-t-4 border-black border-dashed">
                        <button
                            onClick={handleDescargarPoster}
                            className="w-full flex items-center justify-center gap-2 bg-[#00FF66] brutal-btn py-4 text-xl"
                        >
                            <ArrowDownTrayIcon className="w-6 h-6 border-2 border-black bg-white rounded-none p-0.5" />
                            DESCARGAR
                        </button>
                        {navigator.share && (
                            <button
                                onClick={handleSharePoster}
                                className="w-full flex items-center justify-center gap-2 bg-white brutal-btn py-4 text-xl"
                            >
                                <ShareIcon className="w-6 h-6" />
                                COMPARTIR
                            </button>
                        )}
                    </div>

                    <div className="text-center bg-[#f5f5f0] border-4 border-black p-4 mt-6 transform rotate-1">
                        <p className="text-xs font-black uppercase tracking-widest text-black mb-2">¿QUIERES ESTAR AQUÍ?</p>
                        <Link to="/register" className="text-lg font-bold text-black border-b-4 border-black hover:bg-yellow-400 transition-colors inline-block pb-1">ARMA TU LINEUP →</Link>
                    </div>
                </aside>
            </main>

            <footer className="w-full py-8 text-center text-sm font-black uppercase tracking-widest text-black border-t-4 border-black bg-white mt-10 relative z-10">
                <div className="container mx-auto px-4">© {new Date().getFullYear()} MiFestival. HAZ RUIDO.</div>
            </footer>
        </div>
    );
};

export default Festival;