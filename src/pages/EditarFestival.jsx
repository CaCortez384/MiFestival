import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import Papa from "papaparse";
const artistasCSV = "/src/assets/artistas.csv";

const Festival = () => {
    const { id } = useParams();
    const [festival, setFestival] = useState(null);
    const [loading, setLoading] = useState(true);
    const [artistas, setArtistas] = useState([]);
    const [nuevoArtista, setNuevoArtista] = useState("");
    const [draggedArtista, setDraggedArtista] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    // Cargar artistas desde un CSV (solo nombres de la columna "Artist Name")

    const [artistasApi, setArtistasApi] = useState([]);

    useEffect(() => {
        // Cargar y parsear el CSV al montar el componente
        fetch(artistasCSV)
            .then(response => response.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true,
                    complete: (results) => {
                        // Extraer solo el nombre del artista
                        const artistas = results.data
                            .filter(row => row["Artist Name"])
                            .map(row => ({ nombre: row["Artist Name"] }));
                        setArtistasApi(artistas);
                    }
                });
            });
    }, []);

    useEffect(() => {
        const fetchFestival = async () => {
            const docRef = doc(db, "festivals", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFestival(docSnap.data());
                setArtistas(docSnap.data().artistas || []);
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

        // Si el artista ya está asignado, lo quitamos de su asignación anterior
        let nuevosArtistas = artistas.filter(
            a => !(a.nombre === draggedArtista.nombre && a.dia === draggedArtista.dia && a.escenario === draggedArtista.escenario)
        );

        // Añadimos el artista con la nueva asignación
        const artistaAsignado = { ...draggedArtista, dia, escenario };
        nuevosArtistas.push(artistaAsignado);

        // Actualizamos en Firestore
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300">
                <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center">
                    <p className="text-lg text-purple-700 font-semibold">Cargando festival...</p>
                </div>
            </div>
        );
    }

    if (!festival) {
        return <p className="text-center text-red-600 mt-10">Festival no encontrado.</p>;
    }

    // Crear matriz para la grilla de días y escenarios
    const dias = Array.from({ length: festival.days }, (_, i) => `Día ${i + 1}`);
    const escenarios = festival.stages || [];

    // Artistas agregados que no están asignados a ningún día/escenario
    const artistasSinAsignar = [
        ...artistas.filter(a => !a.dia && !a.escenario),
        ...artistasApi.filter(apiArtista => !artistas.some(a => a.nombre === apiArtista.nombre))
    ];

    // Nueva función para eliminar artista de la grilla
    const handleEliminarArtista = async (artistaEliminar) => {
        // Filtra el artista a eliminar
        const nuevosArtistas = artistas.filter(
            a =>
                !(
                    a.nombre === artistaEliminar.nombre &&
                    a.dia === artistaEliminar.dia &&
                    a.escenario === artistaEliminar.escenario
                )
        );
        // Actualiza en Firestore
        const docRef = doc(db, "festivals", id);
        await updateDoc(docRef, { artistas: nuevosArtistas });
        setArtistas(nuevosArtistas);
    };


    return (
        <div className="min-h-screen flex bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 px-4 py-8">
            {/* Lateral izquierdo: lista de artistas de la "API" y no asignados */}
            <aside className="w-64 bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-6 mr-8 flex-shrink-0 h-fit self-start">
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Artistas disponibles</h2>
                <input
                    type="text"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar artista..."
                    className="mb-4 w-full px-3 py-2 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <ul
                    className="space-y-2 max-h-80 overflow-y-auto"
                    style={{ maxHeight: "320px", overflowY: "auto" }}
                >
                    {artistasSinAsignar
                        .filter(artista =>
                            artista.nombre.toLowerCase().includes(busqueda.toLowerCase())
                        )
                        .slice(0, 10)
                        .map((artista, idx) => (
                            <li
                                key={artista.nombre}
                                className="bg-purple-100 rounded-lg px-4 py-2 text-purple-800 font-medium cursor-move"
                                draggable
                                onDragStart={() => onDragStart(artista)}
                            >
                                {artista.nombre}
                            </li>
                        ))}
                </ul>
            </aside>
            {/* Contenido principal */}
            <main className="flex-1 bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-5xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold text-purple-700">{festival.name}</h1>
                    <a
                        href="/inicio"
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                    >
                        Volver a inicio
                    </a>
                </div>
                <p className="mb-4 text-gray-700">Días: {festival.days} | Escenarios: {escenarios.join(", ")}</p>
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        value={nuevoArtista}
                        onChange={e => setNuevoArtista(e.target.value)}
                        placeholder="Nombre del artista"
                        className="px-4 py-2 rounded-l-lg border border-purple-300 focus:outline-none"
                    />
                    <button
                        onClick={handleAgregarArtista}
                        className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition"
                    >
                        Agregar artista
                    </button>
                </div>
                {/* Grilla de días (columnas) y escenarios (filas) */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-purple-200 rounded-lg">
                        <thead>
                            <tr>
                                <th className="border-b border-purple-200 px-4 py-2 bg-purple-100 text-purple-700">Escenario / Día</th>
                                {dias.map((dia, idx) => (
                                    <th key={idx} className="border-b border-purple-200 px-4 py-2 bg-purple-100 text-purple-700">{dia}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {escenarios.map((escenario, idxEsc) => (
                                <tr key={idxEsc}>
                                    <td className="border-b border-purple-200 px-4 py-2 font-semibold text-purple-700 bg-purple-50">{escenario}</td>
                                    {dias.map((dia, idxDia) => (
                                        <td
                                            key={idxDia}
                                            className="border-b border-purple-200 px-4 py-2 bg-white min-w-[120px]"
                                            onDragOver={onDragOver}
                                            onDrop={() => onDrop(dia, escenario)}
                                        >
                                            {/* Mostrar artistas asignados a este día/escenario */}
                                            {artistas
                                                .filter(a => a.dia === dia && a.escenario === escenario)
                                                .map((a, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-purple-200 rounded px-2 py-1 mb-1 text-purple-900 text-sm flex items-center justify-between"
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
            </main>
        </div>
    );
};

export default Festival;