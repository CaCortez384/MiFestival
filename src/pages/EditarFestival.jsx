import React, { useEffect, useState, useRef, useContext } from "react";
import useSEO from "../hooks/useSEO";
import { trackEvent } from "../utils/analytics";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { toPng } from "html-to-image";
import PosterFestival from "./PosterFestival";
import mflogo from "../assets/mflogo20.png";
import { AuthContext } from "../context/AuthContext";
// Iconos
import {
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    ShareIcon,
    CalendarDaysIcon,
    XMarkIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const EditarFestival = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    useSEO({
        title: 'Editar Festival | MiFestival',
        description: 'Editor de lineup de MiFestival. Arrastra artistas, personaliza fondos y descarga tu cartel en HD.',
        noindex: true,
    });

    const [festival, setFestival] = useState(null);
    const [loading, setLoading] = useState(true);
    const [artistas, setArtistas] = useState([]);
    const [nuevoArtista, setNuevoArtista] = useState("");
    const [draggedArtista, setDraggedArtista] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [artistasApi, setArtistasApi] = useState([]);

    // Estados para lógica móvil
    const [artistaSeleccionado, setArtistaSeleccionado] = useState(null);
    const [showAsignarModal, setShowAsignarModal] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState('Día 1');
    const [escenarioSeleccionado, setEscenarioSeleccionado] = useState('');

    const [fondoPoster, setFondoPoster] = useState("city");
    const [artistaExpandido, setArtistaExpandido] = useState(null);
    const [isPublic, setIsPublic] = useState(false); // Estado para publicación

    // REFS PARA EL PÓSTER
    const posterRef = useRef(null);
    const previewContainerRef = useRef(null);
    const [previewScale, setPreviewScale] = useState(0.3);

    // --- LÓGICA DE ESCALADO DINÁMICO ---
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

    function generarSlug(nombre) {
        return nombre.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }

    // --- CARGAR DATOS ---
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
                console.error("Error cargando artistas", error);
            }
        };
        fetchArtistasFirestore();
    }, []);

    useEffect(() => {
        const fetchFestival = async () => {
            const docRef = doc(db, "festivals", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFestival({ id: docSnap.id, ...data });
                setArtistas(data.artistas || []);
                setFondoPoster(data.fondoPoster || "city");
                setIsPublic(data.isPublic || false); // Cargar estado público
                trackEvent('festival_editor_opened', { festival_id: docSnap.id, festival_name: data.name });

                // Actualizar slug si cambió el nombre
                if (!data.slug && data.name) {
                    const nuevoSlug = generarSlug(data.name);
                    updateDoc(docRef, { slug: nuevoSlug });
                }
            }
            setLoading(false);
        };
        fetchFestival();
    }, [id]);

    // --- ACTUALIZACIONES A FIREBASE ---
    useEffect(() => {
        if (!festival) return;
        const docRef = doc(db, "festivals", id);
        updateDoc(docRef, { fondoPoster });
    }, [fondoPoster, id, festival]);

    const togglePublic = async () => {
        if (!user) return;
        const newState = !isPublic;
        setIsPublic(newState);
        const docRef = doc(db, "festivals", id);
        await updateDoc(docRef, {
            isPublic: newState,
            userName: user.displayName || "Anónimo",
            likes: festival.likes || 0
        });
        trackEvent('festival_visibility_toggled', {
            festival_id: id,
            festival_name: festival.name,
            is_public: newState
        });
    };

    // --- HANDLERS ---
    const handleAgregarArtista = async () => {
        if (!nuevoArtista.trim()) return;
        const docRef = doc(db, "festivals", id);
        await updateDoc(docRef, {
            artistas: arrayUnion({ nombre: nuevoArtista, dia: null, escenario: null })
        });
        setArtistas([...artistas, { nombre: nuevoArtista, dia: null, escenario: null }]);
        trackEvent('artist_added', { festival_id: id, artist_name: nuevoArtista });
        setNuevoArtista("");
    };

    const onDragStart = (artista) => { setDraggedArtista(artista); };

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

    const onDragOver = (e) => { e.preventDefault(); };

    const handleEliminarArtista = async (artistaEliminar) => {
        const nuevosArtistas = artistas.filter(
            a => !(a.nombre === artistaEliminar.nombre && a.dia === artistaEliminar.dia && a.escenario === artistaEliminar.escenario)
        );
        const docRef = doc(db, "festivals", id);
        await updateDoc(docRef, { artistas: nuevosArtistas });
        setArtistas(nuevosArtistas);
    };

    const handleDescargarPoster = async () => {
        if (!posterRef.current) return;
        try {
            const dataUrl = await toPng(posterRef.current.firstChild, { pixelRatio: 1, cacheBust: true });
            const link = document.createElement("a");
            link.download = `${generarSlug(festival.name || 'mi-festival')}-poster.png`;
            link.href = dataUrl;
            link.click();
            trackEvent('poster_downloaded', { festival_name: festival.name, source: 'editor' });
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
        setDiaSeleccionado('Día 1');
        setEscenarioSeleccionado('');
    };

    // --- RENDERIZADO CONDICIONAL ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brutal-base">
                <p className="text-black font-bold animate-pulse text-2xl uppercase border-4 border-black bg-yellow-400 p-4 shadow-[8px_8px_0_#000]">Cargando editor...</p>
            </div>
        );
    }

    if (!festival) {
        return (
            <div className="min-h-screen flex flex-col bg-brutal-base text-black justify-center items-center p-4">
                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_#000] text-center transform -rotate-2">
                    <h2 className="text-4xl brutal-title mb-6">Festival no encontrado</h2>
                    <Link to="/inicio" className="bg-[#00E5FF] brutal-btn px-6 py-4 block w-full text-xl mt-4">VOLVER A INICIO</Link>
                </div>
            </div>
        );
    }

    if (!user || ((!user.isGuest && festival.userId !== user.uid) || (user.isGuest && festival.userId !== "invitado"))) {
        return (
            <div className="min-h-screen flex flex-col bg-brutal-base text-black items-center justify-center p-4">
                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_#000] text-center transform rotate-2">
                    <p className="text-black font-extrabold uppercase text-2xl mb-6 brutal-title">No tienes permiso <br />para editar este festival.</p>
                    <Link to="/inicio" className="bg-[#FF90E8] brutal-btn px-6 py-4 block w-full text-xl mt-4">IR A INICIO</Link>
                </div>
            </div>
        );
    }

    const dias = Array.from({ length: festival.days }, (_, i) => `Día ${i + 1}`);
    const escenarios = festival.stages || [];
    const artistasSinAsignar = [
        ...artistas.filter(a => !a.dia && !a.escenario),
        ...artistasApi.filter(apiArtista => !artistas.some(a => a.nombre === apiArtista.nombre))
    ];

    return (
        <div className="min-h-screen flex flex-col bg-brutal-base text-[#050510] font-inter selection:bg-yellow-400 selection:text-black relative overflow-x-hidden border-x-4 border-black max-w-[1600px] mx-auto">
            {/* Fondo Textura */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

            {/* --- HEADER --- */}
            <header className="w-full px-4 sm:px-6 py-4 border-b-4 border-black sticky top-0 z-30 bg-white">
                <div className="container mx-auto flex justify-between items-center max-w-[1400px]">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="relative border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
                            <img src={mflogo} alt="MiFestival Logo" className="relative w-8 h-8 sm:w-9 sm:h-9 object-cover" />
                        </div>
                        <span className="text-lg sm:text-xl brutal-title hidden sm:inline bg-[#00FF66] px-2 mt-1 border-2 border-black">EDITOR</span>
                    </div>
                    <Link
                        to="/inicio"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black border-2 border-black hover:bg-yellow-400 shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Volver
                    </Link>
                </div>
            </header>

            {/* --- EDITOR LAYOUT --- */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-8 items-start max-w-[1400px] relative z-10">

                {/* 1. SIDEBAR IZQUIERDO: ARTISTAS */}
                <aside className="w-full lg:w-72 bg-white border-4 border-black shadow-[8px_8px_0_#000] p-5 flex-shrink-0 h-[80vh] lg:sticky lg:top-24 flex flex-col">
                    <h2 className="text-lg brutal-title mb-4 bg-yellow-400 inline-block px-2 border-2 border-black -rotate-2">ARTISTAS</h2>

                    <div className="relative mb-4">
                        <MagnifyingGlassIcon className="w-6 h-6 absolute left-3 top-3 text-black" />
                        <input
                            type="text"
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            placeholder="Buscar..."
                            className="w-full pl-12 pr-4 py-3 bg-[#f5f5f0] border-2 border-black text-black font-bold placeholder-gray-500 focus:outline-none focus:bg-yellow-100 focus:ring-4 focus:ring-black rounded-none shadow-[2px_2px_0_#000]"
                        />
                    </div>

                    <ul className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar border-y-4 border-dashed border-black my-2 py-2">
                        {artistasSinAsignar
                            .filter(artista => artista.nombre.toLowerCase().includes(busqueda.toLowerCase()))
                            .slice(0, 20)
                            .map((artista) => (
                                <React.Fragment key={artista.nombre}>
                                    <li
                                        className="bg-white hover:bg-[#00E5FF] border-2 border-black rounded-none px-3 py-3 text-sm font-bold cursor-pointer md:cursor-move transition-transform hover:-translate-y-1 hover:translate-x-1 shadow-[4px_4px_0_#000] hover:shadow-[0_0_0_#000] flex items-center justify-between group"
                                        draggable={window.innerWidth >= 768}
                                        onDragStart={window.innerWidth >= 768 ? () => onDragStart(artista) : undefined}
                                        onClick={window.innerWidth < 768 ? () => {
                                            setArtistaExpandido(artista.nombre === artistaExpandido ? null : artista.nombre);
                                            setDiaSeleccionado('Día 1');
                                            setEscenarioSeleccionado(escenarios[0] || '');
                                        } : undefined}
                                    >
                                        <span className="truncate text-black">{artista.nombre}</span>
                                        <div className="w-3 h-3 border-2 border-black bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </li>

                                    {window.innerWidth < 768 && artistaExpandido === artista.nombre && (
                                        <div className="bg-[#f5f5f0] border-4 border-black p-3 my-2 flex flex-col gap-2 shadow-[4px_4px_0_#000]">
                                            <span className="text-xs font-black uppercase text-center mb-1 bg-[#FF90E8] w-fit mx-auto px-2 border-2 border-black">¿DÓNDE TOCA?</span>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {dias.map(dia => (
                                                    <button
                                                        key={dia}
                                                        className="bg-[#00E5FF] border-2 border-black py-2 px-1 text-black font-black text-sm uppercase shadow-[2px_2px_0_#000] active:shadow-[0_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] hover:bg-yellow-400 focus:outline-none"
                                                        onClick={async (e) => {
                                                            e.stopPropagation(); // Evita colapsar
                                                            const escenarioPorDefecto = escenarios[0] || 'Main Stage';
                                                            const nuevos = [...artistas.filter(a => a.nombre !== artista.nombre), { ...artista, dia: dia, escenario: escenarioPorDefecto }];
                                                            await updateDoc(doc(db, "festivals", id), { artistas: nuevos });
                                                            setArtistas(nuevos);
                                                            setArtistaExpandido(null);

                                                            // Opcional: Feedback visual súper rápido
                                                            const toast = document.createElement('div');
                                                            toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#00FF66] text-black font-black uppercase border-4 border-black px-4 py-2 z-[100] shadow-[4px_4px_0_#000] animate-bounce';
                                                            toast.innerText = `¡${artista.nombre} AÑADIDO! ✨`;
                                                            document.body.appendChild(toast);
                                                            setTimeout(() => toast.remove(), 1500);
                                                        }}
                                                    >
                                                        {dia}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                    </ul>

                    <div className="mt-4 pt-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={nuevoArtista}
                                onChange={e => setNuevoArtista(e.target.value)}
                                placeholder="Añadir Propio..."
                                className="flex-grow min-w-0 bg-[#f5f5f0] border-2 border-black px-3 py-2 text-sm text-black font-bold placeholder-gray-500 focus:outline-none focus:bg-yellow-100 focus:ring-2 focus:ring-black shadow-[2px_2px_0_#000]"
                            />
                            <button
                                onClick={handleAgregarArtista}
                                className="bg-[#FF90E8] brutal-btn px-4 py-2 hover:bg-white"
                            >
                                <PlusIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* 2. COLUMNA CENTRAL: GRILLA */}
                <section className="flex-1 w-full bg-white border-4 border-black shadow-[8px_8px_0_#000] p-6 flex flex-col min-h-[600px] overflow-hidden">

                    <div className="border-b-4 border-black border-dashed pb-6 mb-6">
                        <label className="text-sm font-black text-black uppercase tracking-widest mb-2 block bg-[#00E5FF] w-fit px-2 border-2 border-black -rotate-1">Nombre Libre</label>
                        <input
                            type="text"
                            value={festival.name}
                            onChange={async (e) => {
                                const newName = e.target.value;
                                setFestival({ ...festival, name: newName });
                                await updateDoc(doc(db, "festivals", id), { name: newName });
                            }}
                            className="text-4xl md:text-5xl brutal-title font-bold text-black bg-transparent border-none outline-none placeholder-gray-400 w-full p-0 focus:ring-0 focus:bg-yellow-50"
                            spellCheck={false}
                        />
                        <div className="flex gap-4 mt-2 text-sm font-bold text-black">
                            <span className="flex items-center gap-1 bg-yellow-400 border-2 border-black px-2 shadow-[2px_2px_0_#000]"><CalendarDaysIcon className="w-5 h-5" /> {dias.length} DÍAS</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto flex-grow custom-scrollbar pb-4 bg-[#f5f5f0] border-4 border-black">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    {dias.map((dia, idx) => (
                                        <th key={idx} className="px-4 py-4 text-lg font-black text-black uppercase tracking-widest border-b-4 border-black border-r-4 border-black last:border-r-0 text-center min-w-[200px] bg-[#FF90E8]">{dia}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y-4 divide-black divide-dashed bg-white">
                                {escenarios.map((escenario, idxEsc) => (
                                    <tr key={idxEsc} className="group/row flex-col sm:table-row">
                                        {dias.map((dia, idxDia) => (
                                            <td
                                                key={idxDia}
                                                className="px-4 py-4 border-r-4 border-black last:border-r-0 align-top h-40 transition-colors bg-white hover:bg-yellow-50 relative"
                                                onDragOver={onDragOver}
                                                onDrop={() => onDrop(dia, escenario)}
                                            >
                                                <div className="text-sm font-black text-black mb-3 text-center uppercase tracking-widest bg-[#00FF66] border-2 border-black py-1 px-2 mx-auto w-fit shadow-[2px_2px_0_#000] transform -rotate-2">
                                                    {escenario}
                                                </div>

                                                <div className="space-y-3 min-h-[100px]">
                                                    {artistas
                                                        .filter(a => a.dia === dia && a.escenario === escenario)
                                                        .map((a, i) => (
                                                            <div
                                                                key={i}
                                                                className="bg-white border-2 border-black hover:bg-black hover:text-[#00E5FF] px-3 py-2 text-black font-bold flex items-center justify-between cursor-move group/item shadow-[4px_4px_0_#000] hover:shadow-[0_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
                                                                draggable
                                                                onDragStart={() => onDragStart(a)}
                                                            >
                                                                <span className="truncate mr-2 uppercase text-sm">{a.nombre}</span>
                                                                <button
                                                                    className="text-red-500 hover:text-white transition-colors bg-white hover:bg-red-500 border-2 border-transparent group-hover/item:border-current p-1"
                                                                    title="Eliminar"
                                                                    onClick={() => handleEliminarArtista(a)}
                                                                >
                                                                    <XMarkIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}

                                                    {artistas.filter(a => a.dia === dia && a.escenario === escenario).length === 0 && (
                                                        <div className="h-full w-full flex items-center justify-center border-4 border-dashed border-gray-300 bg-gray-50 min-h-[60px]">
                                                            <span className="text-xl font-bold text-gray-400 uppercase tracking-widest">+ SOLTAR AQUÍ</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 3. SIDEBAR DERECHO: PREVIEW & ACTIONS */}
                <aside className="w-full lg:w-80 xl:w-96 bg-white border-4 border-black shadow-[8px_8px_0_#000] p-5 lg:sticky lg:top-24 flex-shrink-0 flex flex-col gap-8">

                    <div>
                        <label className="text-lg brutal-title mb-4 bg-[#FF90E8] inline-block px-2 border-2 border-black rotate-1">ESTILO PÓSTER</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['city', 'beach', 'desert', 'cyber', 'retro', 'minimal', 'neon'].map((style) => (
                                <button
                                    key={style}
                                    onClick={() => setFondoPoster(style)}
                                    className={`px-3 py-2 text-sm font-black uppercase tracking-wider transition border-2 border-black shadow-[2px_2px_0_#000] active:shadow-[0_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] ${fondoPoster === style
                                        ? 'bg-yellow-400 text-black'
                                        : 'bg-white text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* VISTA PREVIA RESPONSIVA */}
                    <div className="bg-[#f5f5f0] border-4 border-black p-4 -mx-2 shadow-[inset_4px_4px_0_rgba(0,0,0,0.1)]">
                        <div
                            ref={previewContainerRef}
                            className="bg-black border-4 border-black shadow-[4px_4px_0_#000] relative group mx-auto"
                            style={{ width: "100%", aspectRatio: "9/16", maxWidth: "300px" }}
                        >
                            <div style={{
                                width: 1080, height: 1920,
                                transform: `scale(${previewScale})`, transformOrigin: "top left",
                                position: "absolute", top: 0, left: 0
                            }}>
                                <PosterFestival
                                    festival={{ ...festival, artistas: artistas }}
                                    backgroundType={fondoPoster}
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                                <span className="text-black bg-yellow-400 text-2xl brutal-title px-4 py-2 border-4 border-black shadow-[4px_4px_0_#000] -rotate-3">PREVIEW HD</span>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="space-y-4">
                        {/* SWITCH PUBLICAR */}
                        <div className="bg-[#00E5FF] border-4 border-black p-4 flex items-center justify-between hover:bg-cyan-200 transition-colors shadow-[4px_4px_0_#000]">
                            <div>
                                <span className="text-lg brutal-title tracking-wide text-black block mb-1">HACER PÚBLICO</span>
                                <span className="text-xs font-bold text-black border-t-2 border-black border-dashed pt-1 block">Aparecer en Galería Global</span>
                            </div>
                            <button
                                onClick={togglePublic}
                                className={`w-16 h-8 border-4 border-black p-0.5 transition-colors duration-300 ease-in-out ${isPublic ? 'bg-[#00FF66] shadow-[2px_2px_0_#000]' : 'bg-white shadow-[inset_2px_2px_0_rgba(0,0,0,0.2)]'}`}
                            >
                                <div className={`bg-black w-5 h-5 border-2 border-black shadow-none transform transition-transform duration-300 ${isPublic ? 'translate-x-8' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDescargarPoster}
                                className="w-full flex items-center justify-center gap-2 bg-[#FF90E8] brutal-btn py-4 text-xl"
                            >
                                <ArrowDownTrayIcon className="w-6 h-6 border-2 border-black p-1 bg-white rounded-full" />
                                DESCARGAR CARTEL
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
                                            trackEvent('poster_shared', { festival_name: festival.name, source: 'editor' });
                                            await navigator.share({
                                                files: [file],
                                                title: festival.name,
                                                text: `¡Mira mi lineup en MiFestival!`,
                                                url: shareUrl
                                            });
                                        } catch (err) { console.error(err); }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 bg-white brutal-btn py-4 text-lg hover:bg-yellow-400"
                                    title="Compartir enlace"
                                >
                                    <ShareIcon className="w-5 h-5" />
                                    COMPARTIR LINK
                                </button>
                            )}
                        </div>
                    </div>
                </aside>

                {/* MODAL MÓVIL */}
                {showAsignarModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white border-4 border-black shadow-[8px_8px_0_#000] p-6 w-full max-w-sm flex flex-col gap-6 transform -rotate-1">
                            <div className="flex justify-between items-center border-b-4 border-black pb-4 border-dashed">
                                <h3 className="text-2xl brutal-title">Asignar</h3>
                                <button onClick={() => setShowAsignarModal(false)} className="text-black hover:bg-red-500 border-2 border-black p-1 transition bg-gray-200"><XMarkIcon className="w-6 h-6" /></button>
                            </div>
                            <div className="text-center py-2">
                                <span className="text-xs font-black text-gray-500 uppercase tracking-widest block bg-[#FF90E8] w-fit mx-auto px-2 border-2 border-black mb-2">Artista</span>
                                <div className="text-3xl brutal-title text-black truncate py-2 bg-yellow-100 border-2 border-black border-dashed">{artistaSeleccionado?.nombre}</div>
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button className="flex-1 bg-[#00FF66] brutal-btn text-lg py-4" onClick={handleAsignarArtistaMobile}>OK</button>
                                <button className="flex-1 bg-white brutal-btn text-lg py-4 hover:bg-gray-200" onClick={() => setShowAsignarModal(false)}>X</button>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* PÓSTER OCULTO (HD) */}
            <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                <div ref={posterRef}>
                    <PosterFestival festival={{ ...festival, artistas: artistas }} backgroundType={fondoPoster} />
                </div>
            </div>

            <footer className="w-full py-8 text-center text-sm font-black uppercase tracking-widest text-black border-t-4 border-black bg-white mt-10">
                <div className="container mx-auto px-4">© {new Date().getFullYear()} MiFestival. HAZ RUIDO.</div>
            </footer>
        </div>
    );
};

export default EditarFestival;