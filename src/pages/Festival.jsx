import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import PosterFestival from "./PosterFestival";

const Festival = () => {
    const { id } = useParams();
    const [festival, setFestival] = useState(null);
    const [loading, setLoading] = useState(true);
    const [artistas, setArtistas] = useState([]);
    const [editMode, setEditMode] = useState(false);

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
            <main className="flex-1 bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-5xl w-full mx-auto">
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
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                        >
                            Editar
                        </a>
                        <a
                            href="/inicio"
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                        >
                            Volver a inicio
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
                className="w-[420px] bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-2xl p-6 ml-5 flex-shrink-0 h-fit self-start flex flex-col items-center"
                style={{ minWidth: 420 }}
            >
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Line UP</h2>
                <div className="w-full h-[500px] flex items-center justify-center bg-gradient-to-br from-purple-100 to-yellow-100 rounded-xl overflow-hidden border-2 border-purple-200">
                    {/* Aquí va el póster dinámico */}
                    <PosterFestival festival={{
                        ...festival,
                        artistas: artistas
                    }} />
                </div>
                <span className="text-sm text-gray-500 mt-2 text-center">
                    Vista previa generada automáticamente.
                </span>
            </aside>
        </div>
    );
};

export default Festival;
