import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Cambiado Navigate por useNavigate
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toPng } from "html-to-image";
import PosterFestival from "./PosterFestival";
import mflogo from "../assets/mflogo20.png";
import { AuthContext } from "../context/AuthContext";
// Iconos
import { ArrowLeftIcon, PencilSquareIcon, ArrowDownTrayIcon, ShareIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Nombre original del componente
const Festival = () => {
    // --- Estados y Hooks Originales ---
    const { id } = useParams();
    const navigate = useNavigate(); // agregado
    const { user } = useContext(AuthContext);
    const [festival, setFestival] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // Estado de error
    // Mantenemos estados separados originales aunque podríamos derivarlos
    const [artistas, setArtistas] = useState([]);
    const [fondoPoster, setFondoPoster] = useState("city"); // Mantenemos estado original, aunque podríamos usar festival.fondoPoster
    const posterRef = useRef(null);

    // nuevo: manejar volver atrás o al inicio
    const handleVolver = () => {
        try {
            if (window.history.length > 2) {
                navigate(-1);
            } else {
                navigate('/inicio');
            }
        } catch (err) {
            navigate('/inicio');
        }
    };

    // --- Funciones Originales ---
    const generarSlug = (nombre) => nombre.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""); // Función auxiliar

    const handleDescargarPoster = async () => { /* ...código original con mejoras calidad/nombre... */
        if (!posterRef.current || !festival) return; const node = posterRef.current.querySelector(':scope > div'); if (!node) return; try { const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true }); const link = document.createElement("a"); link.download = `${generarSlug(festival.name || 'mi-festival')}-poster.png`; link.href = dataUrl; link.click(); } catch (err) { console.error(err); alert("No se pudo generar imagen."); }
     };

    const handleSharePoster = async () => { /* ...código original con mejoras datos compartidos... */
        if (!posterRef.current || !navigator.share || !festival) return; const node = posterRef.current.querySelector(':scope > div'); if (!node) return; try { const dataUrl = await toPng(node, { pixelRatio: 1.5, cacheBust: true }); const res = await fetch(dataUrl); const blob = await res.blob(); const file = new File([blob], `${generarSlug(festival.name || 'mi-festival')}.png`, { type: 'image/png' }); const shareUrl = `${window.location.origin}/verfestival/${festival.slug || id}`; if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: festival.name || 'Poster', text:`Mira mi lineup para ${festival.name || 'mi festival'}!`, url: shareUrl }); } else { await navigator.share({ title: festival.name || 'Poster', text: `Mira mi lineup para ${festival.name || 'mi festival'}!\n${shareUrl}`, url: shareUrl }); } } catch (err) { if (err.name !== 'AbortError') alert('No se pudo compartir.'); console.error(err); }
    };


    // useEffect Carga Original (con manejo de error añadido)
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
                        // Lógica original de setear estados separados
                        setFestival({ id: docSnap.id, ...docSnap.data() });
                        setArtistas(docSnap.data().artistas || []);
                        setFondoPoster(docSnap.data().fondoPoster || "city"); // Usa valor del doc o 'city'
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
    }, [id]); // Solo depende de ID

    // --- Renderizado Condicional Original ---
     if (loading) {
         return ( // MODIFICADO: Estilo carga consistente
             <div className="min-h-screen flex items-center justify-center bg-gray-50">
                 <p className="text-gray-500 animate-pulse">Cargando festival...</p>
             </div>
         );
     }

     if (error) { // MODIFICADO: Pantalla de error consistente
         return (
             <div className="min-h-screen flex flex-col bg-gray-50">
                  <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 bg-white"> {/* Header simple */}
                     <div className="container mx-auto flex justify-between items-center">
                         <Link to="/inicio" className="flex items-center gap-2"><img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md" /><span className="text-lg font-bold text-gray-900">MiFestival</span></Link>
                         <Link to="/inicio" className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100"><ArrowLeftIcon className="w-4 h-4" />Volver a Inicio</Link>
                     </div>
                 </header>
                 <main className="flex-grow flex items-center justify-center px-4"><div className="bg-white rounded-lg shadow p-8 text-center max-w-md"><h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2><p className="text-gray-600 mb-6">{error}</p><Link to="/inicio" className="inline-block bg-cyan-500 text-white font-medium py-2 px-5 rounded-md hover:bg-cyan-600 transition">Ir a Inicio</Link></div></main>
                 <footer className="w-full py-5 text-center text-xs text-gray-400 border-t border-gray-100 mt-auto"><div className="container mx-auto px-4 sm:px-6">© {new Date().getFullYear()} MiFestival por Carlos Cortez.</div></footer>
             </div>
         );
     }

    if (!festival) { // MODIFICADO: Estado "no encontrado" consistente
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-500">Festival no encontrado.</p></div>;
    }

    // -- Lógica de Permisos Original (Mantenida) --
    // !! De nuevo, si esta página es PÚBLICA, deberías QUITAR esta validación !!
    if (!user || (festival.userId !== "invitado" && festival.userId !== user?.uid)) {
       console.warn("Validación de permiso activa en página de visualización.");
         return ( // MODIFICADO: Estilo error consistente
             <div className="min-h-screen flex flex-col bg-gray-50 items-center justify-center p-4">
                  <img src={mflogo} alt="" className="w-16 h-16 mb-4 rounded-lg opacity-80" />
                  <p className="text-center text-red-600 font-semibold mb-6">No tienes permiso para ver este festival.</p>
                  <Link to="/inicio" className="px-5 py-2 rounded-md font-semibold text-white bg-cyan-500 hover:bg-cyan-600 shadow-sm transition">Volver a Inicio</Link>
              </div>
         );
    }
    // -- Fin Lógica de Permisos --

    // Variables para Render (Originales)
    const dias = Array.from({ length: festival.days || 0 }, (_, i) => `Día ${i + 1}`);
    const escenarios = festival.stages || [];


    // --- JSX Principal (Nuevo Diseño) ---
    return (
        // Layout general limpio
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
            {/* Header consistente */}
            <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm">
                 <div className="container mx-auto flex justify-between items-center">
                     <div className="flex items-center gap-2 min-w-0"> {/* min-w-0 para truncar texto */}
                         <img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md flex-shrink-0" />
                         <span className="text-lg font-bold text-gray-900 truncate">{festival.name || 'Detalle del Festival'}</span>
                     </div>
                     {/* Botón Volver o Editar según contexto (Lógica original) */}
                      {user && (festival.userId === user.uid || (user.isGuest && festival.userId === 'invitado')) ? ( // Si es el dueño
                          <Link
                              to={`/editarFestival/${id}`} // Enlace directo a editar
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-cyan-600 bg-cyan-50 hover:bg-cyan-100 transition whitespace-nowrap"
                          >
                              <PencilSquareIcon className="w-4 h-4" />
                              Editar
                          </Link>
                      ) : ( // Si no es el dueño (o no logueado)
                          <Link
                              to="/inicio" // O a /home
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition whitespace-nowrap"
                          >
                              <ArrowLeftIcon className="w-4 h-4" />
                              Volver
                          </Link>
                      )}
                 </div>
             </header>

            {/* Main Content Layout (2 columnas) */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-8 items-start">

                {/* Columna Izquierda: Grilla */}
                <section className="flex-grow w-full bg-white rounded-lg shadow border border-gray-100 p-4 md:p-6 overflow-hidden">
                    {/* Info básica (Estilo consistente) */}
                    <div className="mb-6 border-b border-gray-100 pb-4">
                         <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{festival.name || 'Festival'}</h1>
                         <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                              <span className="inline-flex items-center gap-1"><CalendarDaysIcon className="w-4 h-4"/>{dias.length} {dias.length === 1 ? 'día' : 'días'}</span>
                              <span className="inline-flex items-center gap-1"><MapPinIcon className="w-4 h-4"/>{escenarios.length} {escenarios.length === 1 ? 'escenario' : 'escenarios'}</span>
                         </div>
                    </div>

                    {/* Grilla de solo lectura (Estilo consistente) */}
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
                                            // Usamos el estado 'artistas' original aquí
                                            const artistasEnCelda = artistas.filter(a => a.dia === dia && a.escenario === escenario);
                                            const celdaVacia = artistasEnCelda.length === 0;
                                            return (
                                                <td key={`${dia}-${escenario}`} className="px-2 py-2 text-xs border-b border-gray-100 align-top min-w-[120px] md:min-w-[140px] h-24">
                                                    <div className="space-y-1">
                                                        {artistasEnCelda.map((a, i) => (
                                                            <div key={i} className="bg-gray-100 rounded px-2 py-1 text-gray-700 text-xs font-medium truncate">
                                                                {a.nombre}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {celdaVacia && <span className="text-gray-300 italic text-xs">Vacío</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {/* Sección Tips Original (con nuevo estilo) */}
                    <div className="mt-8 w-full bg-gray-50 rounded-lg border border-gray-200 p-4">
                       <h3 className="text-sm font-semibold text-cyan-700 mb-2">¿Te gusta este Lineup?</h3>
                       <ul className="list-disc list-inside text-gray-600 text-xs space-y-1 pl-2">
                           <li>Puedes descargar el póster o compartirlo.</li>
                           <li>Si eres el creador, puedes volver a editarlo.</li>
                       </ul>
                   </div>
                </section>

                {/* Columna Derecha: Preview del póster */}
                <aside className="w-full lg:w-80 xl:w-96 bg-white rounded-lg shadow border border-gray-100 p-4 lg:sticky lg:top-20 flex-shrink-0 space-y-4">
                    <h2 className="text-base font-semibold text-gray-900">Vista previa del póster</h2>

                    {/* Selector de fondo */}
                    <div className="w-full">
                        <label htmlFor="fondo-poster" className="text-sm font-medium text-gray-700 mb-1 block">
                            Fondo del póster:
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

                    {/* Preview del póster escalado */}
                    <div 
                        className="border border-gray-200 rounded-md overflow-hidden bg-gray-100"
                        style={{
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        <div style={{
                            width: "100%",
                            paddingBottom: "108%", // Ratio 1512/1400 = 1.08
                            position: "relative",
                        }}>
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                transform: "scale(0.27)", // Escala para que quepa en ~380px
                                transformOrigin: "top left",
                            }}>
                                <PosterFestival
                                    festival={{
                                        ...festival,
                                        artistas: artistas
                                    }}
                                    backgroundType={fondoPoster}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Póster para descarga (tamaño real, oculto) */}
                    <div style={{ position: "absolute", left: "-99999px", top: 0 }}>
                        <div ref={posterRef}>
                            <PosterFestival
                                festival={{
                                    ...festival,
                                    artistas: artistas
                                }}
                                backgroundType={fondoPoster}
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                        {/* Nuevo botón Volver */}
                        <button
                            onClick={handleVolver}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 transition"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Volver
                        </button>

                        <button
                            onClick={handleDescargarPoster}
                            className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-cyan-600 transition"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            Descargar póster
                        </button>
                        {navigator.share && (
                            <button
                                onClick={async () => {
                                    if (!posterRef.current) return;
                                    try {
                                        const dataUrl = await toPng(posterRef.current.firstChild, { pixelRatio: 1, cacheBust: true });
                                        const res = await fetch(dataUrl);
                                        const blob = await res.blob();
                                        const file = new File([blob], `${generarSlug(festival.name || 'mi-festival')}.png`, { type: 'image/png' });
                                        const shareUrl = `${window.location.origin}/verfestival/${festival.slug || id}`;
                                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                                            await navigator.share({
                                                files: [file],
                                                title: festival.name || 'Poster',
                                                text: `¡Mira mi lineup para ${festival.name || 'mi festival'}!`,
                                                url: shareUrl
                                            });
                                        } else {
                                            await navigator.share({
                                                title: festival.name || 'Poster',
                                                text: `¡Mira mi lineup para ${festival.name || 'mi festival'}!\n${shareUrl}`,
                                                url: shareUrl
                                            });
                                        }
                                    } catch (err) {
                                        if (err.name !== 'AbortError') {
                                            alert('No se pudo compartir.');
                                        }
                                        console.error(err);
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 transition"
                            >
                                <ShareIcon className="w-4 h-4" />
                                Compartir póster
                            </button>
                        )}
                    </div>
                    <span className="text-xs text-gray-400 mt-2 text-center block">
                        Vista previa generada automáticamente.
                    </span>
                </aside>

            </main>

            {/* Footer consistente */}
            <footer className="w-full py-5 text-center text-xs text-gray-400 border-t border-gray-100 mt-auto">
                 <div className="container mx-auto px-4 sm:px-6">© {new Date().getFullYear()} MiFestival por Carlos Cortez.</div>
            </footer>
        </div>
    );
};

export default Festival; // Mantenemos nombre original