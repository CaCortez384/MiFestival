// pages/CreateFestival.jsx
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import mflogo from "../assets/mflogo20.png"; // Asegúrate de que la ruta sea correcta


const CreateFestival = () => {
    const [name, setName] = useState("");
    const [days, setDays] = useState(1);
    const [stages, setStages] = useState(["Escenario Principal"]);

    const handleAddStage = () => {
        setStages([...stages, `Escenario ${stages.length + 1}`]);
    };

    const handleRemoveStage = (index) => {
        if (stages.length === 1) return;
        setStages(stages.filter((_, i) => i !== index));
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = auth.currentUser;
            if (!user) {
                alert("Debes iniciar sesión para crear un festival.");
                return;
            }

            const docRef = await addDoc(collection(db, "festivals"), {
                name,
                days,
                stages,
                createdAt: serverTimestamp(),
                userId: user.uid,
            });

            navigate(`/editarFestival/${docRef.id}`);
        } catch (error) {
            console.error("Error al guardar el festival:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 px-2 md:px-4 py-4 md:py-8 gap-4">
            {/* Header mejorado */}
            <header className="w-full flex flex-col md:flex-row items-center justify-between mb-4 md:mb-8 gap-2
                        bg-gradient-to-r from-purple-600 via-pink-400 to-yellow-400
                        rounded-3xl shadow-2xl px-6 py-4 border-2 border-white/70
                    ">
                <div className="flex items-center gap-4">
                    <img src={mflogo} alt="MiFestival Logo" className="w-14 h-14 rounded-2xl shadow-lg border-2 border-white" />
                    <div>
                        <span className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg block">Crea!</span>
                    </div>
                </div>
            </header>
            <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 flex items-center justify-center px-4">
                <div className="bg-white/90 shadow-2xl rounded-3xl p-10 w-full max-w-2xl border border-purple-100">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="mb-4 text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 transition"
                    >
                        <span className="text-xl">←</span> Volver
                    </button>
                    <h2 className="text-4xl font-black text-purple-700 mb-8 text-center tracking-tight drop-shadow">
                        Crear nuevo festival
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-2">
                                Nombre del festival
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Festival Primavera"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 bg-purple-50/50 transition text-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-2">
                                Días del festival
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={30}
                                value={days === 0 ? "" : days}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setDays(val === "" ? 0 : Number(val));
                                }}
                                className="w-36 px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 bg-purple-50/50 text-lg transition"
                                required
                            />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 mb-3 text-base">Escenarios</p>
                            <div className="space-y-3">
                                {stages.map((stage, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            value={stage}
                                            onChange={(e) =>
                                                setStages(stages.map((s, i) => (i === index ? e.target.value : s)))
                                            }
                                            className="flex-1 px-4 py-2 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 bg-purple-50/50 transition"
                                        />
                                        {stages.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveStage(index)}
                                                className="text-red-500 hover:text-red-700 text-xl px-2 transition"
                                                title="Eliminar escenario"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddStage}
                                className="mt-4 inline-flex items-center text-base text-purple-700 hover:text-purple-900 font-semibold transition"
                            >
                                <span className="text-2xl mr-1">＋</span> Agregar escenario
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:from-purple-700 hover:to-blue-600 transition"
                        >
                            Crear festival
                        </button>
                    </form>
                </div>
            </div>
            {/* Footer agregado */}
            <footer className="w-full mt-8 py-4 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-t-3xl shadow-inner flex flex-col items-center text-center text-purple-700 text-sm font-medium border-t border-purple-200">
                <span>© {new Date().getFullYear()} MiFestival. Todos los derechos reservados.</span>
                <span className="text-xs text-gray-500 mt-1">Hecho con <span className="text-pink-500">♥</span> por tu equipo.</span>
            </footer>
        </div>
    );
};

export default CreateFestival;
