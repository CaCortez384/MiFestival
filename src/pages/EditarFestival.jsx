import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { collection, doc, getDoc, updateDoc, arrayUnion, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { toPng } from "html-to-image";
import PosterFestival from "./PosterFestival";
import mflogo from "../assets/mflogo20.png";
// Imágenes de fondo (se mantienen para la precarga)
import cityImg from "../assets/City.svg";
import beachImg from "../assets/Beach.svg";
import desertImg from "../assets/Desert.svg";
import { AuthContext } from "../context/AuthContext";
// Iconos (importados del nuevo set de diseño)
import {
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    ShareIcon,
    CalendarDaysIcon,
    MapPinIcon,
    LightBulbIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

// RENOMBRADO para claridad, aunque el nombre original era 'Festival'
const EditarFestival = () => {
    const { id } = useParams();
    const [festival, setFestival] = useState(null);
    const [loading, setLoading] = useState(true);
    const [artistas, setArtistas] = useState([]);
    const [nuevoArtista, setNuevoArtista] = useState("");
    const [draggedArtista, setDraggedArtista] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [artistasApi, setArtistasApi] = useState([]);
    const [artistaSeleccionado, setArtistaSeleccionado] = useState(null);
    const [showAsignarModal, setShowAsignarModal] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState('Día 1');
    const [escenarioSeleccionado, setEscenarioSeleccionado] = useState('');
    const [fondoPoster, setFondoPoster] = useState("city");
    const { user } = useContext(AuthContext);
    const [artistaExpandido, setArtistaExpandido] = useState(null);

    const posterRef = useRef(null);

    // --- Toda la lógica funcional se mantiene intacta ---

    function generarSlug(nombre) {
        return nombre
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
    }

    useEffect(() => {
        const fetchArtistasFirestore = async () => {
            try {
                const artistasCol = collection(db, "artistas");
                const artistasSnap = await getDocs(artistasCol);
                const artistas = artistasSnap.docs
                    .map(doc => doc.data())
                    .filter(data => data["Artist Name"])
                    .map(data => ({ nombre: data["Artist Name"] }));
                setArtistasApi(artistas);
            } catch (error) {
                console.error("No se pudo cargar la colección de artistas", error);
            }
        };
        fetchArtistasFirestore();
    }, []);

    useEffect(() => {
        if (festival && !festival.slug && festival.name) {
            const nuevoSlug = generarSlug(festival.name);
            const docRef = doc(db, "festivals", id);
            updateDoc(docRef, { slug: nuevoSlug });
            setFestival({ ...festival, slug: nuevoSlug });
        }
    }, [festival, id]);

    useEffect(() => {
        if (!festival) return;
        const docRef = doc(db, "festivals", id);
        updateDoc(docRef, { fondoPoster });
    }, [fondoPoster]);

    useEffect(() => {
        const fetchFestival = async () => {
            const docRef = doc(db, "festivals", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFestival({ id: docSnap.id, ...docSnap.data() });
                setArtistas(docSnap.data().artistas || []);
                setFondoPoster(docSnap.data().fondoPoster || "city");
            }
            setLoading(false);
        };
        fetchFestival();
    }, [id]);

    useEffect(() => {
        [cityImg, beachImg, desertImg].forEach(src => {
            const img = new window.Image();
            img.src = src;
        });
    }, []);

    const handleAgregarArtista = async () => {
        if (!nuevoArtista.trim()) return;
        const docRef = doc(db, "festivals", id);
        await updateDoc(docRef, {
            artistas: arrayUnion({ nombre: nuevoArtista, dia: null, escenario: null })
        });
        setArtistas([...artistas, { nombre: nuevoArtista, dia: null, escenario: null }]);
        setNuevoArtista("");
    };

    const onDragStart = (artista) => {
        setDraggedArtista(artista);
    };

    const onDrop = async (dia, escenario) => {
        if (!draggedArtista) return;
        let nuevosArtistas = artistas.filter(
            a => !(a.nombre === draggedArtista.nombre && a.dia === draggedArtista.dia && a.escenario === draggedArtista.escenario)
        );
        const artistaAsignado = { ...draggedArtista, dia, escenario };
        nuevosArtistas.push(artistaAsignado);
        const docRef = doc(db, "festivals", id);
        await updateDoc(docRef, { artistas: nuevosArtistas });
        setArtistas(nuevosArtistas);
        setDraggedArtista(null);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const handleEliminarArtista = async (artistaEliminar) => {
        const nuevosArtistas = artistas.filter(
            a =>
                !(
                    a.nombre === artistaEliminar.nombre &&
                    a.dia === artistaEliminar.dia &&
                    a.escenario === artistaEliminar.escenario
                )
        );
        const docRef = doc(db, "festivals", id);
        await updateDoc(docRef, { artistas: nuevosArtistas });
        setArtistas(nuevosArtistas);
    };

    const handleDescargarPoster = async () => {
        if (!posterRef.current) return;
        try {
            const dataUrl = await toPng(posterRef.current.firstChild, { pixelRatio: 2.5, cacheBust: true });
            const link = document.createElement("a");
            link.download = `${generarSlug(festival.name || 'mi-festival')}-poster.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error(err);
            alert("No se pudo generar la imagen.");
        }
    };

    const handleAsignarArtistaMobile = async () => {
        if (!artistaSeleccionado || !diaSeleccionado || !escenarioSeleccionado) return;
        const nuevosArtistas = [
            ...artistas.filter(a => a.nombre !== artistaSeleccionado.nombre),
            { ...artistaSeleccionado, dia: diaSeleccionado, escenario: escenarioSeleccionado }
        ];
        const docRef = doc(db, "festivals", id);
        await updateDoc(docRef, { artistas: nuevosArtistas });
        setArtistas(nuevosArtistas);
        setShowAsignarModal(false);
        setArtistaSeleccionado(null);
        setDiaSeleccionado('Día 1'); // Resetea al valor por defecto
        setEscenarioSeleccionado('');
    };

    // --- FIN Lógica funcional ---


    // --- Renderizado Condicional (Nuevo Estilo) ---

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 animate-pulse">Cargando festival...</p>
            </div>
        );
    }

    if (!festival) {
        // Pantalla de error/no encontrado simple
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 bg-white">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link to="/inicio" className="flex items-center gap-2"><img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md" /><span className="text-lg font-bold text-gray-900">MiFestival</span></Link>
                        <Link to="/inicio" className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100"><ArrowLeftIcon className="w-4 h-4" />Volver a Inicio</Link>
                    </div>
                </header>
                <main className="flex-grow flex items-center justify-center px-4"><div className="bg-white rounded-lg shadow p-8 text-center max-w-md"><h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2><p className="text-gray-600 mb-6">Festival no encontrado.</p><Link to="/inicio" className="inline-block bg-cyan-500 text-white font-medium py-2 px-5 rounded-md hover:bg-cyan-600 transition">Ir a Inicio</Link></div></main>
            </div>
        );
    }

    if (
        !user ||
        (
            (!user.isGuest && festival.userId !== user.uid) ||
            (user.isGuest && festival.userId !== "invitado")
        )
    ) {
        // Pantalla de permisos
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 items-center justify-center p-4">
                <img src={mflogo} alt="" className="w-16 h-16 mb-4 rounded-lg opacity-80" />
                <p className="text-center text-red-600 font-semibold mb-6">No tienes permiso para editar este festival.</p>
                <Link to="/inicio" className="px-5 py-2 rounded-md font-semibold text-white bg-cyan-500 hover:bg-cyan-600 shadow-sm transition">Volver a Inicio</Link>
            </div>
        );
    }

    // Variables para Render (Originales)
    const dias = Array.from({ length: festival.days }, (_, i) => `Día ${i + 1}`);
    const escenarios = festival.stages || [];

    const artistasSinAsignar = [
        ...artistas.filter(a => !a.dia && !a.escenario),
        ...artistasApi.filter(apiArtista => !artistas.some(a => a.nombre === apiArtista.nombre))
    ];

    // --- JSX Principal (Nuevo Diseño) ---
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
            {/* Header (Nuevo Estilo) */}
            <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 z-30 bg-white bg-opacity-95 backdrop-blur-sm">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md" />
                        <span className="text-lg font-bold text-gray-900">Editar Festival</span>
                    </div>
                    <Link
                        to="/inicio"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Volver a inicio
                    </Link>
                </div>
            </header>

            {/* Layout 3 Columnas (Nuevo Estilo) */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-8 items-start">

                {/* Columna Izquierda: Artistas */}
                <aside className="w-full lg:w-64 bg-white rounded-lg shadow border border-gray-100 p-4 flex-shrink-0 h-fit lg:sticky lg:top-20">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Artistas disponibles</h2>
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        placeholder="Buscar artista..."
                        className="mb-4 w-full px-3 py-2 rounded-md border border-gray-300 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <ul className="space-y-1.5 max-h-60 md:max-h-80 overflow-y-auto">
                        {artistasSinAsignar
                            .filter(artista => artista.nombre.toLowerCase().includes(busqueda.toLowerCase()))
                            .slice(0, 10) // Mantenemos límite por performance
                            .map((artista, idx) => (
                                <React.Fragment key={artista.nombre}>
                                    <li
                                        className="bg-gray-100 rounded-md px-3 py-2 text-gray-700 text-sm font-medium cursor-pointer md:cursor-move hover:bg-gray-200"
                                        draggable={window.innerWidth >= 768}
                                        onDragStart={window.innerWidth >= 768 ? () => onDragStart(artista) : undefined}
                                        onClick={window.innerWidth < 768 ? () => {
                                            setArtistaExpandido(artista.nombre === artistaExpandido ? null : artista.nombre);
                                            setDiaSeleccionado('Día 1'); // Lógica original
                                            setEscenarioSeleccionado(escenarios[0] || ''); // Pre-selecciona primer escenario
                                        } : undefined}
                                    >
                                        {artista.nombre}
                                    </li>

                                    {/* Lógica de asignación móvil (se mantiene), con nuevo estilo */}
                                    {window.innerWidth < 768 && artistaExpandido === artista.nombre && (
                                        <div className="bg-white rounded-md shadow border border-gray-200 p-3 mt-1 flex flex-col gap-2">
                                            <select
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                                                value={diaSeleccionado}
                                                onChange={e => setDiaSeleccionado(e.target.value)}
                                            >
                                                {dias.map(dia => (
                                                    <option key={dia} value={dia}>{dia}</option>
                                                ))}
                                            </select>
                                            <select
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                                                value={escenarioSeleccionado}
                                                onChange={e => setEscenarioSeleccionado(e.target.value)}
                                            >
                                                <option value="">Selecciona escenario</option>
                                                {escenarios.map(esc => (
                                                    <option key={esc} value={esc}>{esc}</option>
                                                ))}
                                            </select>
                                            <button
                                                className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-white text-sm font-semibold py-2 px-3 rounded-md shadow-sm hover:bg-cyan-600 transition disabled:opacity-50"
                                                disabled={!diaSeleccionado || !escenarioSeleccionado}
                                                onClick={async () => {
                                                    // Lógica original de asignación rápida
                                                    const nuevosArtistas = [
                                                        ...artistas.filter(a => a.nombre !== artista.nombre),
                                                        { ...artista, dia: diaSeleccionado, escenario: escenarioSeleccionado }
                                                    ];
                                                    const docRef = doc(db, "festivals", id);
                                                    await updateDoc(docRef, { artistas: nuevosArtistas });
                                                    setArtistas(nuevosArtistas);
                                                    setArtistaExpandido(null);
                                                    setDiaSeleccionado('Día 1');
                                                    setEscenarioSeleccionado('');
                                                }}
                                            >
                                                Asignar
                                            </button>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center">
                        <div className="flex flex-col gap-2 w-full">
                            <input
                                type="text"
                                value={nuevoArtista}
                                onChange={e => setNuevoArtista(e.target.value)}
                                placeholder="Nombre del artista"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                            <button
                                onClick={handleAgregarArtista}
                                className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-cyan-600 transition"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Agregar artista
                            </button>
                        </div>
                        <span className="text-xs text-gray-500 mt-2 text-center">
                            ¿No encuentras el artista? Agrégalo aquí.
                        </span>
                    </div>
                </aside>

                {/* Columna Central: Grilla de Edición */}
                <section className="flex-1 w-full bg-white rounded-lg shadow border border-gray-100 p-4 md:p-6 overflow-hidden">
                    <div className="border-b border-gray-100 pb-4 mb-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 mb-2">
                            Editar nombre
                        </span>
                        <input
                            type="text"
                            value={festival.name}
                            onChange={async (e) => {
                                const newName = e.target.value;
                                setFestival({ ...festival, name: newName });
                                const docRef = doc(db, "festivals", id);
                                await updateDoc(docRef, { name: newName });
                            }}
                            className="text-2xl md:text-3xl font-bold text-gray-900 outline-none border-b-2 border-transparent focus:border-cyan-500 focus:bg-gray-50 transition w-full px-2 py-1 -ml-2"
                            spellCheck={false}
                            autoComplete="off"
                        />
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                            <span className="inline-flex items-center gap-1"><CalendarDaysIcon className="w-4 h-4" />{dias.length} {dias.length === 1 ? 'día' : 'días'}</span>
                        </div>
                    </div>

                    {/* Grilla de edición (Nuevo Estilo) */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    {dias.map((dia, idx) => (
                                        <th key={idx} className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 text-center">{dia}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {escenarios.map((escenario, idxEsc) => (
                                    <tr key={idxEsc}>
                                        {dias.map((dia, idxDia) => (
                                            <td
                                                key={idxDia}
                                                className="px-2 py-2 text-xs border-b border-gray-100 align-top min-w-[120px] md:min-w-[140px] h-24 transition-colors hover:bg-gray-50"
                                                onDragOver={onDragOver}
                                                onDrop={() => onDrop(dia, escenario)}
                                            >
                                                <div className="space-y-1">
                                                    {artistas
                                                        .filter(a => a.dia === dia && a.escenario === escenario)
                                                        .map((a, i) => (
                                                            <div
                                                                key={i}
                                                                className="bg-gray-100 rounded px-2 py-1 text-gray-700 text-xs font-medium flex items-center justify-between cursor-move group"
                                                                draggable
                                                                onDragStart={() => onDragStart(a)}
                                                            >
                                                                <span className="truncate">{a.nombre}</span>
                                                                <button
                                                                    className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    title="Eliminar"
                                                                    onClick={() => handleEliminarArtista(a)}
                                                                >
                                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                </div>
                                                {artistas.filter(a => a.dia === dia && a.escenario === escenario).length === 0 && (
                                                    <span className="text-gray-300 italic text-xs">Soltar aquí</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Consejos (Nuevo Estilo) */}
                    <div className="mt-8 w-full bg-gray-50 rounded-lg border border-gray-200 p-4">
                        <h3 className="text-sm font-semibold text-cyan-700 mb-2 inline-flex items-center gap-1.5"><LightBulbIcon className="w-4 h-4" />Tips de edición</h3>
                        <ul className="list-disc list-inside text-gray-600 text-xs space-y-1 pl-2">
                            <li>Arrastra artistas desde la lista de la izquierda y suéltalos en la grilla.</li>
                            <li>Haz clic en el nombre del festival para editarlo.</li>
                            <li>Usa el '×' (que aparece al pasar el mouse) para quitar un artista.</li>
                            <li>¡No olvides descargar o compartir tu póster al terminar!</li>
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

                {/* Modal (Lógica original, Nuevo Estilo) */}
                {showAsignarModal && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">Asignar artista</h3>
                                <button onClick={() => setShowAsignarModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-2">
                                <span className="text-sm text-gray-500">Artista:</span>
                                <div className="font-semibold text-gray-800">{artistaSeleccionado?.nombre}</div>
                            </div>
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-cyan-500 focus:border-cyan-500"
                                value={diaSeleccionado}
                                onChange={e => setDiaSeleccionado(e.target.value)}
                            >
                                <option value="">Selecciona un día</option>
                                {dias.map(dia => (
                                    <option key={dia} value={dia}>{dia}</option>
                                ))}
                            </select>
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-cyan-500 focus:border-cyan-500"
                                value={escenarioSeleccionado}
                                onChange={e => setEscenarioSeleccionado(e.target.value)}
                            >
                                <option value="">Selecciona un escenario</option>
                                {escenarios.map(esc => (
                                    <option key={esc} value={esc}>{esc}</option>
                                ))}
                            </select>
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="flex-1 w-full flex items-center justify-center gap-2 bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-cyan-600 transition"
                                    onClick={handleAsignarArtistaMobile}
                                >
                                    Asignar
                                </button>
                                <button
                                    className="flex-1 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 transition"
                                    onClick={() => setShowAsignarModal(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer (Nuevo Estilo) */}
            <footer className="w-full py-5 text-center text-xs text-gray-400 border-t border-gray-100 mt-auto">
                <div className="container mx-auto px-4 sm:px-6">
                    © {new Date().getFullYear()} <span className="font-semibold text-gray-600">MiFestival</span> · Desarrollado por <a href="https://github.com/CaCortez384" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">Carlos Cortez</a>
                </div>
            </footer>
        </div>
    );
};

export default EditarFestival;