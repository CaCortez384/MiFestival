import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, updateDoc, arrayUnion, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { toPng } from "html-to-image";
import PosterFestival from "./PosterFestival";
import mflogo from "../assets/mflogo20.png";

const Festival = () => {
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
    const [diaSeleccionado, setDiaSeleccionado] = useState('');
    const [escenarioSeleccionado, setEscenarioSeleccionado] = useState('');
    const [fondoPoster, setFondoPoster] = useState("city");

    const posterRef = useRef(null);

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
        if (!festival) return;
        const docRef = doc(db, "festivals", id);
        updateDoc(docRef, { fondoPoster });
    }, [fondoPoster]);

    useEffect(() => {
        const fetchFestival = async () => {
            const docRef = doc(db, "festivals", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFestival(docSnap.data());
                setArtistas(docSnap.data().artistas || []);
                setFondoPoster(docSnap.data().fondoPoster || "city"); // <-- agrega esta línea
            }
            setLoading(false);
        };
        fetchFestival();
    }, [id]);

    const handleAgregarArtista = async () => {
        if (!nuevoArtista.trim()) return;
        const docRef = doc(db, "festivals", id);
        await updateDoc(docRef, {
            artistas: arrayUnion({ nombre: nuevoArtista, dia: null, escenario: null })
        });
        setArtistas([...artistas, { nombre: nuevoArtista, dia: null, escenario: null }]);
        setNuevoArtista("");
    };

    // Drag & Drop handlers
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
                <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center">
                    <p className="text-lg text-purple-700 font-semibold">Cargando festival...</p>
                </div>
            </div>
        );
    }

    if (!festival) {
        return <p className="text-center text-red-600 mt-10">Festival no encontrado.</p>;
    }

    const dias = Array.from({ length: festival.days }, (_, i) => `Día ${i + 1}`);
    const escenarios = festival.stages || [];

    const artistasSinAsignar = [
        ...artistas.filter(a => !a.dia && !a.escenario),
        ...artistasApi.filter(apiArtista => !artistas.some(a => a.nombre === apiArtista.nombre))
    ];

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
            const dataUrl = await toPng(posterRef.current, { cacheBust: true });
            const link = document.createElement("a");
            link.download = `${festival.name || "poster"}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
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
        setDiaSeleccionado('');
        setEscenarioSeleccionado('');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
            {/* Header */}
            <header className="w-full px-6 py-4 flex justify-between items-center bg-white bg-opacity-80 shadow-lg sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <img src={mflogo} alt="MiFestival Logo" className="w-12 h-12 rounded-2xl shadow-lg" />
                    <span className="text-3xl font-black text-purple-700 tracking-tight">Editar Festival</span>
                </div>
                <a
                    href="/inicio"
                    className="bg-white text-purple-700 border-2 border-purple-500 font-bold py-2 px-6 rounded-full shadow hover:bg-purple-50 transition"
                >
                    Volver a inicio
                </a>
            </header>
            <main className="flex-1 flex flex-col md:flex-row gap-4 px-2 py-4 w-full max-w-[1700px] mx-auto overflow-x-auto">
                {/* Lateral izquierdo: lista de artistas */}
                <aside className="w-full md:w-64 max-w-xs bg-white bg-opacity-90 rounded-2xl shadow-xl p-4 mb-4 md:mb-0 flex-shrink-0 h-fit self-start">
                    <h2 className="text-2xl font-bold text-purple-700 mb-4">Artistas disponibles</h2>
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        placeholder="Buscar artista..."
                        className="mb-4 w-full px-3 py-2 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <ul className="space-y-2 max-h-60 md:max-h-80 overflow-y-auto">
                        {artistasSinAsignar
                            .filter(artista => artista.nombre.toLowerCase().includes(busqueda.toLowerCase()))
                            .slice(0, 10)
                            .map((artista, idx) => (
                                <li
                                    key={artista.nombre}
                                    className="bg-purple-100 rounded-lg px-4 py-2 text-purple-800 font-medium cursor-pointer md:cursor-move"
                                    draggable={window.innerWidth >= 768}
                                    onDragStart={window.innerWidth >= 768 ? () => onDragStart(artista) : undefined}
                                    onClick={window.innerWidth < 768 ? () => { setArtistaSeleccionado(artista); setShowAsignarModal(true); } : undefined}
                                >
                                    {artista.nombre}
                                </li>
                            ))}
                    </ul>
                    <div className="mb-6 flex flex-col items-center">
                        <div className="flex flex-col gap-2 w-full">
                            <input
                                type="text"
                                value={nuevoArtista}
                                onChange={e => setNuevoArtista(e.target.value)}
                                placeholder="Nombre del artista"
                                className="px-4 py-2 bg-transparent focus:bg-white transition w-full outline-none text-lg rounded-t-xl rounded-b-none border-2 border-purple-200 focus:border-purple-500"
                            />
                            <button
                                onClick={handleAgregarArtista}
                                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold hover:from-pink-500 hover:to-yellow-400 transition-all text-lg rounded-b-xl rounded-t-none"
                            >
                                + Agregar artista
                            </button>
                        </div>
                        <span className="text-sm text-gray-500 mt-2">
                            ¿No encuentras el artista en la lista? Agrégalo aquí.
                        </span>
                    </div>
                </aside>
                {/* Contenido principal */}
                <section className="flex-1 w-full max-w-3xl bg-white bg-opacity-90 rounded-2xl shadow-xl p-4 md:p-6 relative overflow-x-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="w-full">
                            <span className="inline-flex items-center px-2 py-1 bg-purple-200 text-purple-700 rounded-lg text-xs font-semibold shadow-sm mb-2">
                                Editar nombre
                            </span>
                            <div className="flex items-center gap-3 mb-2">
                                <input
                                    type="text"
                                    value={festival.name}
                                    onChange={async (e) => {
                                        const newName = e.target.value;
                                        setFestival({ ...festival, name: newName });
                                        const docRef = doc(db, "festivals", id);
                                        await updateDoc(docRef, { name: newName });
                                    }}
                                    className="text-2xl md:text-4xl font-extrabold text-purple-700 drop-shadow-lg outline-none border-b-2 border-purple-300 focus:border-purple-600 transition w-full px-2 py-1 focus:bg-purple-50 rounded-lg"
                                    style={{ minWidth: 120, maxWidth: 420, letterSpacing: 1 }}
                                    spellCheck={false}
                                    autoComplete="off"
                                />
                            </div>
                            <p className="mt-1 text-gray-600 font-medium text-base md:text-lg">
                                <span className="inline-block mr-6">
                                    <span className="font-bold text-purple-600">Días:</span> {festival.days}
                                </span>
                                <span>
                                    <span className="font-bold text-purple-600">Escenarios:</span> {escenarios.join(", ")}
                                </span>
                            </p>
                        </div>
                    </div>
                    {/* Grilla de días (columnas) y escenarios (filas) */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-purple-200 rounded-lg text-xs md:text-sm">
                            <thead>
                                <tr>
                                    <th className="border-b border-purple-200 px-2 md:px-4 py-2 bg-purple-100 text-purple-700">Escenario / Día</th>
                                    {dias.map((dia, idx) => (
                                        <th key={idx} className="border-b border-purple-200 px-2 md:px-4 py-2 bg-purple-100 text-purple-700">{dia}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {escenarios.map((escenario, idxEsc) => (
                                    <tr key={idxEsc}>
                                        <td className="border-b border-purple-200 px-2 md:px-4 py-2 font-semibold text-purple-700 bg-purple-50">{escenario}</td>
                                        {dias.map((dia, idxDia) => (
                                            <td
                                                key={idxDia}
                                                className="border-b border-purple-200 px-2 md:px-4 py-2 bg-white min-w-[90px] md:min-w-[120px]"
                                                onDragOver={onDragOver}
                                                onDrop={() => onDrop(dia, escenario)}
                                            >
                                                {/* Mostrar artistas asignados a este día/escenario */}
                                                {artistas
                                                    .filter(a => a.dia === dia && a.escenario === escenario)
                                                    .map((a, i) => (
                                                        <div
                                                            key={i}
                                                            className="bg-purple-200 rounded px-2 py-1 mb-1 text-purple-900 text-xs md:text-sm flex items-center justify-between cursor-move"
                                                            draggable
                                                            onDragStart={() => onDragStart(a)}
                                                        >
                                                            <span>{a.nombre}</span>
                                                            <button
                                                                className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                                                title="Eliminar"
                                                                onClick={() => handleEliminarArtista(a)}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                {artistas.filter(a => a.dia === dia && a.escenario === escenario).length === 0 && (
                                                    <span className="text-gray-400 italic">Vacío</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Consejos y ayuda */}
                    <div className="mt-8 w-full bg-purple-50 rounded-xl p-4 shadow flex flex-col items-center">
                        <h3 className="text-pink-500 font-bold mb-2 text-lg">Tips para organizar tu Line Up:</h3>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 text-left w-full max-w-md mx-auto">
                            <li>Arrastra y suelta artistas en la grilla para asignarlos a un día y escenario.</li>
                            <li>Puedes editar el nombre del festival en cualquier momento.</li>
                            <li>Descarga o comparte tu póster cuando termines.</li>
                            <li>¡Haz tu festival único y compártelo con tus amigos!</li>
                        </ul>
                    </div>
                </section>
                {/* Lateral derecho: Preview del póster */}
                <aside
                    className="w-full md:w-[540px] bg-white bg-opacity-80 rounded-3xl shadow-2xl p-4 md:p-6 flex-shrink-0 h-fit self-start flex flex-col items-center mt-8 md:mt-0"
                    style={{ minWidth: 0, maxWidth: 560 }}
                >
                    <h2 className="text-2xl font-bold text-purple-700 mb-4">Vista previa del póster</h2>
                    {/* Dropdown para seleccionar fondo */}
                    <div className="mb-4 w-full flex flex-col items-center">
                        <label htmlFor="fondo-poster" className="text-sm font-semibold text-purple-700 mb-1">
                            Fondo del póster:
                        </label>
                        <select
                            id="fondo-poster"
                            value={fondoPoster}
                            onChange={e => setFondoPoster(e.target.value)}
                            className="w-48 px-3 py-2 rounded-lg border-2 border-purple-200 focus:border-purple-500 bg-white text-purple-700 font-bold shadow"
                        >
                            <option value="city">Ciudad</option>
                            <option value="beach">Playa</option>
                            <option value="desert">Desierto</option>
                        </select>
                    </div>
                    <div
                        ref={posterRef}
                        className="w-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-yellow-100 rounded-xl overflow-hidden border-2 border-purple-200"
                        style={{
                            height: "auto",
                            padding: 0,
                        }}
                    >
                        <PosterFestival
                            festival={{
                                ...festival,
                                artistas: artistas
                            }}
                            backgroundType={fondoPoster}
                        />
                    </div>
                    {/* Botones de acción debajo del póster */}
                    <div className="flex gap-2 mt-4 mb-2 w-full justify-center flex-wrap">
                        <button
                            onClick={handleDescargarPoster}
                            className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <span className="inline-flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Descargar póster
                            </span>
                        </button>
                        {navigator.share && (
                            <button
                                onClick={async () => {
                                    if (!posterRef.current) return;
                                    try {
                                        const dataUrl = await toPng(posterRef.current, { cacheBust: true });
                                        const res = await fetch(dataUrl);
                                        const blob = await res.blob();
                                        const file = new File([blob], `${festival.name || "poster"}.png`, { type: "image/png" });
                                        await navigator.share({
                                            files: [file],
                                            title: festival.name || "Póster Festival",
                                            text: "¡Mira el póster de mi festival!",
                                        });
                                    } catch (err) {
                                        alert("No se pudo compartir el póster.");
                                    }
                                }}
                                className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-xl shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 font-semibold border-2 border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M12 15v-6m0 0l-3 3m3-3l3 3" />
                                    </svg>
                                    Compartir póster
                                </span>
                            </button>
                        )}
                    </div>
                    <span className="text-sm text-gray-500 mt-2 text-center">
                        Vista previa generada automáticamente.
                    </span>
                </aside>
                {showAsignarModal && (
                    <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-[90vw] max-w-xs flex flex-col gap-4">
                            <h3 className="text-lg font-bold text-purple-700 mb-2">Asignar artista</h3>
                            <div className="mb-2">
                                <div className="font-semibold text-purple-600">{artistaSeleccionado?.nombre}</div>
                            </div>
                            <select
                                className="w-full border rounded p-2 mb-2"
                                value={diaSeleccionado}
                                onChange={e => setDiaSeleccionado(e.target.value)}
                            >
                                <option value="">Selecciona un día</option>
                                {dias.map(dia => (
                                    <option key={dia} value={dia}>{dia}</option>
                                ))}
                            </select>
                            <select
                                className="w-full border rounded p-2 mb-2"
                                value={escenarioSeleccionado}
                                onChange={e => setEscenarioSeleccionado(e.target.value)}
                            >
                                <option value="">Selecciona un escenario</option>
                                {escenarios.map(esc => (
                                    <option key={esc} value={esc}>{esc}</option>
                                ))}
                            </select>
                            <div className="flex gap-2">
                                <button
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg py-2 font-bold"
                                    onClick={handleAsignarArtistaMobile}
                                >
                                    Asignar
                                </button>
                                <button
                                    className="flex-1 bg-gray-200 rounded-lg py-2 font-bold text-gray-700"
                                    onClick={() => setShowAsignarModal(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            {/* Footer */}
            <footer className="w-screen py-6 text-center text-sm text-gray-500 bg-white bg-opacity-70 backdrop-blur border-t">
                © {new Date().getFullYear()} <span className="font-bold text-purple-700">MiFestival</span> · Crea tu experiencia musical
            </footer>
        </div>
    );
};

export default Festival;