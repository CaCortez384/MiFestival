import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toPng } from "html-to-image";
import PosterFestival from "./PosterFestival";

const Festival = () => {
    const { id } = useParams();
    const [festival, setFestival] = useState(null);
    const [loading, setLoading] = useState(true);
    const [artistas, setArtistas] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const posterRef = useRef(null);

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

    const dias = Array.from({ length: festival.days }, (_, i) => `Día ${i + 1}`);
    const escenarios = festival.stages || [];

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 px-4 py-8">
            <main className="flex-1 bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-4xl w-full mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-6">
                        {festival.imagen && (
                            <img
                                src={festival.imagen}
                                alt={festival.name}
                                className="w-24 h-24 object-cover rounded-2xl shadow-lg border-4 border-purple-200"
                            />
                        )}
                        <h1 className="text-4xl font-extrabold text-purple-700">{festival.name}</h1>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={`/editarFestival/${id}`}
                            className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:scale-105 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <span className="inline-flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z"/>
                                </svg>
                                Editar
                            </span>
                        </a>
                        <a
                            href="/inicio"
                            className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-xl shadow-lg hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 font-semibold border-2 border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <span className="inline-flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"/>
                                </svg>
                                Volver a inicio
                            </span>
                        </a>
                    </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-4 items-center">
                    <div className="bg-purple-100 px-4 py-2 rounded-lg text-purple-700 font-semibold shadow">
                        <span className="mr-2">Días:</span>
                        {dias.length}
                    </div>
                    <div className="bg-yellow-100 px-4 py-2 rounded-lg text-yellow-800 font-semibold shadow">
                        <span className="mr-2">Escenarios:</span>
                        {escenarios.map((esc, idx) => (
                            <span
                                key={idx}
                                className="inline-block bg-yellow-200 text-yellow-900 px-2 py-1 rounded mr-1 text-sm"
                            >
                                {esc}
                            </span>
                        ))}
                    </div>
                </div>
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
                                        >
                                            {artistas
                                                .filter(a => a.dia === dia && a.escenario === escenario)
                                                .map((a, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-purple-200 rounded px-2 py-1 mb-1 text-purple-900 text-sm flex items-center justify-between"
                                                    >
                                                        <span>{a.nombre}</span>
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
            {/* Lateral derecho: Preview del póster */}
            <aside
                className="w-[520px] bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-6 ml-5 flex-shrink-0 h-fit self-start flex flex-col items-center"
                style={{ minWidth: 520 }}
            >
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Line UP</h2>
                <div className="flex gap-3 mb-4 w-full justify-center">
                    <button
                        onClick={handleDescargarPoster}
                        className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:scale-105 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
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
                            className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-xl shadow-lg hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 font-semibold border-2 border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <span className="inline-flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M12 15v-6m0 0l-3 3m3-3l3 3"/>
                                </svg>
                                Compartir póster
                            </span>
                        </button>
                    )}
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
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            maxWidth: 480,
                            maxHeight: 640,
                        }}
                    />
                </div>
                <span className="text-sm text-gray-500 mt-2 text-center">
                    Vista previa generada automáticamente.
                </span>
            </aside>
        </div>
    );
};

export default Festival;
