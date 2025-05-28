// pages/CreateFestival.jsx
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const CreateFestival = () => {
    const [name, setName] = useState("");
    const [days, setDays] = useState(1);
    const [stages, setStages] = useState(["Escenario Principal"]);

    const handleAddStage = () => {
        setStages([...stages, `Escenario ${stages.length + 1}`]);
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

            console.log("Festival creado con ID:", docRef.id);
            navigate(`/festival/${docRef.id}/artistas`);
        } catch (error) {
            console.error("Error al guardar el festival:", error);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="mb-4 text-purple-600 hover:text-purple-800 font-medium transition"
                >
                    ← Volver
                </button>
                <h2 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
                    Crear nuevo festival
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del festival
                        </label>
                        <input
                            type="text"
                            placeholder="Nombre del festival"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Días del festival
                        </label>
                        <select
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value))}
                            className="w-32 px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                        >
                            {[1, 2, 3].map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700 mb-2">Escenarios</p>
                        <div className="space-y-2">
                            {stages.map((stage, index) => (
                                <input
                                    key={index}
                                    value={stage}
                                    onChange={(e) =>
                                        setStages(stages.map((s, i) => (i === index ? e.target.value : s)))
                                    }
                                    className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddStage}
                            className="mt-3 inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition"
                        >
                            <span className="text-lg mr-1">+</span> Agregar escenario
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-purple-700 hover:to-blue-600 transition"
                    >
                        Crear festival
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateFestival;
