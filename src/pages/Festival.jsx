import React, { useEffect, useState, useRef, useContext } from "react";
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
    // 1. Obtenemos todos los parámetros para ver qué está llegando
    const params = useParams();
    
    // 2. Intentamos obtener slugId, o 'id' como respaldo por si tu ruta se llama diferente
    const paramValue = params.slugId || params.id;

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    // 3. FIX: Validación defensiva. Si no hay parámetro, id es null (y luego manejamos el error)
    const id = paramValue ? (paramValue.includes('-') ? paramValue.split('-').pop() : paramValue) : null;

    const [festival, setFestival] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [artistas, setArtistas] = useState([]);
    const [fondoPoster, setFondoPoster] = useState("city");
    
    // REFS PARA EL DOBLE RENDERIZADO
    const posterRef = useRef(null); // Referencia al póster oculto (HD) para descarga
    const previewContainerRef = useRef(null); // Referencia al contenedor visible para calcular escala
    const [previewScale, setPreviewScale] = useState(0.3); // Escala dinámica

    // --- 1. LÓGICA DE ESCALA DINÁMICA (Igual que en el editor) ---
    useEffect(() => {
        const calculateScale = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.offsetWidth;
                // El ancho real del póster es 1080px
                const scale = containerWidth / 1080;
                setPreviewScale(scale);
            }
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);
        
        // Pequeño delay para asegurar que el DOM se pintó
        const timer = setTimeout(calculateScale, 100);

        return () => {
            window.removeEventListener('resize', calculateScale);
            clearTimeout(timer);
        };
    }, [loading]); // Recalcular cuando termine de cargar

    // --- 2. LÓGICA DE DESCARGA HD ---
    const generarSlug = (nombre) => nombre.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    const handleDescargarPoster = async () => {
        if (!posterRef.current || !festival) return;
        
        // Seleccionamos el DIV oculto de tamaño real
        const node = posterRef.current.firstChild; 
        
        if (!node) return;

        try {
            // pixelRatio: 1 es suficiente porque el div ya mide 1080x1920
            const dataUrl = await toPng(node, { pixelRatio: 1, cacheBust: true });
            const link = document.createElement("a");
            link.download = `${generarSlug(festival.name || 'mi-festival')}-poster.png`;
            link.href = dataUrl;
            link.click();
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
            // Reconstruimos la URL para compartir (asumiendo que slugId es lo correcto o festival.slug)
            const shareUrl = `${window.location.origin}/verfestival/${slugId}`;
            
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
        } catch (err) {
            if (err.name !== 'AbortError') alert('No se pudo compartir.');
            console.error(err);
        }
    };

    const handleVolver = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/inicio');
        }
    };

    // --- CARGA DE DATOS ---
    useEffect(() => {
        let isMounted = true;
        const fetchFestival = async () => {
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 animate-pulse">Cargando festival...</p>
            </div>
        );
    }

    if (error || !festival) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 bg-white">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link to="/inicio" className="flex items-center gap-2"><img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md" /><span className="text-lg font-bold text-gray-900">MiFestival</span></Link>
                        <Link to="/inicio" className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100"><ArrowLeftIcon className="w-4 h-4" />Volver a Inicio</Link>
                    </div>
                </header>
                <main className="flex-grow flex items-center justify-center px-4">
                    <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
                        <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-600 mb-6">{error || "Festival no encontrado"}</p>
                        <Link to="/inicio" className="inline-block bg-cyan-500 text-white font-medium py-2 px-5 rounded-md hover:bg-cyan-600 transition">Ir a Inicio</Link>
                    </div>
                </main>
            </div>
        );
    }

    const dias = Array.from({ length: festival.days || 0 }, (_, i) => `Día ${i + 1}`);
    const escenarios = festival.stages || [];

    // Verificamos si es el dueño para mostrar botón de editar
    const isOwner = user && (festival.userId === user.uid || (user.isGuest && festival.userId === 'invitado'));

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
            {/* Header consistente con Editor */}
            <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm">
                 <div className="container mx-auto flex justify-between items-center">
                     <div className="flex items-center gap-2 min-w-0">
                         <img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md flex-shrink-0" />
                         <span className="text-lg font-bold text-gray-900 truncate">{festival.name || 'Detalle del Festival'}</span>
                     </div>
                     
                     {/* Botones de Navegación */}
                     {isOwner ? (
                         <Link
                             to={`/editarFestival/${id}`}
                             className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-cyan-600 bg-cyan-50 hover:bg-cyan-100 transition whitespace-nowrap"
                         >
                             <PencilSquareIcon className="w-4 h-4" />
                             Editar
                         </Link>
                     ) : (
                         <button
                             onClick={handleVolver}
                             className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition whitespace-nowrap"
                         >
                             <ArrowLeftIcon className="w-4 h-4" />
                             Volver
                         </button>
                     )}
                 </div>
             </header>

            {/* Layout Principal (2 columnas) */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-8 items-start">

                {/* Columna Izquierda: Información y Grilla */}
                <section className="flex-grow w-full bg-white rounded-lg shadow border border-gray-100 p-4 md:p-6 overflow-hidden">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                         <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{festival.name || 'Festival'}</h1>
                         <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                             <span className="inline-flex items-center gap-1"><CalendarDaysIcon className="w-4 h-4"/>{dias.length} {dias.length === 1 ? 'día' : 'días'}</span>
                             <span className="inline-flex items-center gap-1"><MapPinIcon className="w-4 h-4"/>{escenarios.length} {escenarios.length === 1 ? 'escenario' : 'escenarios'}</span>
                         </div>
                    </div>

                    {/* Tabla de Horarios (Solo lectura) */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="sticky left-0 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 text-left z-10">Escenario</th>
                                    {dias.map((dia) => (
                                        <th key={dia} className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 text-center">{dia}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {escenarios.map((escenario) => (
                                    <tr key={escenario}>
                                        <td className="sticky left-0 bg-white px-3 py-2 text-sm font-semibold text-gray-800 border-b border-gray-100 whitespace-nowrap z-10">{escenario}</td>
                                        {dias.map((dia) => {
                                            const artistasEnCelda = artistas.filter(a => a.dia === dia && a.escenario === escenario);
                                            return (
                                                <td key={`${dia}-${escenario}`} className="px-2 py-2 text-xs border-b border-gray-100 align-top min-w-[120px] md:min-w-[140px] h-24">
                                                    <div className="space-y-1">
                                                        {artistasEnCelda.map((a, i) => (
                                                            <div key={i} className="bg-gray-100 rounded px-2 py-1 text-gray-700 text-xs font-medium truncate">
                                                                {a.nombre}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {artistasEnCelda.length === 0 && <span className="text-gray-300 italic text-xs">Vacío</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Columna Derecha: Vista Previa y Descarga */}
                <aside className="w-full lg:w-80 xl:w-96 bg-white rounded-lg shadow border border-gray-100 p-4 lg:sticky lg:top-20 flex-shrink-0 space-y-4">
                    <h2 className="text-base font-semibold text-gray-900">Póster Oficial</h2>

                    {/* Selector de fondo (Opcional en vista pública, pero útil si el usuario quiere ver variantes) */}
                    <div className="w-full">
                        <label htmlFor="fondo-poster" className="text-sm font-medium text-gray-700 mb-1 block">
                            Fondo:
                        </label>
                        <select
                            id="fondo-poster"
                            value={fondoPoster}
                            onChange={e => setFondoPoster(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            <option value="city">Ciudad</option>
                            <option value="beach">Playa</option>
                            <option value="desert">Desierto</option>
                        </select>
                    </div>

                    {/* --- PREVIEW ESCALABLE --- */}
                    <div 
                        ref={previewContainerRef} // Aquí medimos el ancho disponible
                        className="border border-gray-200 rounded-md overflow-hidden bg-gray-100"
                        style={{
                            width: "100%",
                            aspectRatio: "9/16", // Mantiene la proporción 1080/1920
                            position: "relative",
                        }}
                    >
                        {/* Contenedor interno transformado */}
                        <div style={{
                            width: 1080, // Tamaño REAL
                            height: 1920,
                            transform: `scale(${previewScale})`, // Escala calculada
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
                    </div>

                    {/* --- PÓSTER OCULTO (HD) --- */}
                    <div style={{ position: "absolute", left: "-99999px", top: 0 }}>
                        <div ref={posterRef}>
                            <PosterFestival
                                festival={{ ...festival, artistas: artistas }}
                                backgroundType={fondoPoster}
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleDescargarPoster}
                            className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-cyan-600 transition"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            Descargar póster
                        </button>
                        {navigator.share && (
                            <button
                                onClick={handleSharePoster}
                                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 transition"
                            >
                                <ShareIcon className="w-4 h-4" />
                                Compartir
                            </button>
                        )}
                    </div>
                </aside>
            </main>

            <footer className="w-full py-5 text-center text-xs text-gray-400 border-t border-gray-100 mt-auto">
                 <div className="container mx-auto px-4 sm:px-6">© {new Date().getFullYear()} MiFestival por Carlos Cortez.</div>
            </footer>
        </div>
    );
};

export default Festival;