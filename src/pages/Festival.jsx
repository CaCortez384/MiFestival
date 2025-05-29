import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

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
                    <h1 className="text-4xl font-extrabold text-purple-700">{festival.name}</h1>
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
                <p className="mb-4 text-gray-700">Días: {festival.days} | Escenarios: {escenarios.join(", ")}</p>
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
        </div>
    );
};

export default Festival;
