import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import mflogo from "../assets/mflogo20.png";
import mfbanner from "../assets/bailando.webp";

const CreateFestival = () => {
    const [name, setName] = useState("");
    const [days, setDays] = useState(1);
    const [stages, setStages] = useState(["Escenario Principal"]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
        setError("");
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                setError("Debes iniciar sesión para crear un festival.");
                setLoading(false);
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
            setError("Error al guardar el festival. Intenta de nuevo.");
            setLoading(false);
        }
    };

    // NUEVO: Ejemplo de inspiración y ayuda
    const ejemplos = [
        {
            nombre: "Festival Primavera",
            dias: 3,
            escenarios: ["Main Stage", "Electro Garden", "Indie Tent"]
        },
        {
            nombre: "Rock & Colors",
            dias: 2,
            escenarios: ["Escenario Central", "Rock Arena"]
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
            {/* Header */}
            <header className="w-full px-6 py-4 flex justify-between items-center bg-white bg-opacity-80 shadow-lg sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <img src={mflogo} alt="MiFestival Logo" className="w-12 h-12 rounded-2xl shadow-lg" />
                    <span className="text-3xl font-black text-purple-700 tracking-tight">MiFestival</span>
                </div>
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="bg-white text-purple-700 border-2 border-purple-500 font-bold py-2 px-6 rounded-full shadow hover:bg-purple-50 transition"
                >
                    Volver
                </button>
            </header>

            {/* Main */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-10 max-w-2xl w-full flex flex-col items-center">
                    <img
                        src={mfbanner}
                        alt="Ilustración crear festival"
                        className="w-32 mb-4 drop-shadow"
                    />
                    <h2 className="text-3xl font-extrabold text-purple-700 mb-2 text-center">¡Crea tu festival!</h2>
                    <p className="text-md text-gray-600 mb-6 text-center">
                        Personaliza el nombre, los días y los escenarios de tu evento. ¡Hazlo único!
                    </p>
                    {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-2">
                                Nombre del festival *
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Festival Primavera"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-purple-50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-2">
                                Días del festival *
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
                                className="w-36 px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-purple-50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-2">
                                Escenarios (Opcional)
                            </label>
                            <div className="space-y-3">
                                {stages.map((stage, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            value={stage}
                                            onChange={(e) =>
                                                setStages(stages.map((s, i) => (i === index ? e.target.value : s)))
                                            }
                                            className="flex-1 px-4 py-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-purple-50"
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
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition text-lg"
                        >
                            {loading ? "Creando..." : "Crear festival"}
                        </button>
                    </form>

                    {/* Inspiración */}
                    <div className="mt-8 w-full bg-yellow-50 rounded-xl p-4 shadow flex flex-col items-center">
                        <h3 className="text-purple-700 font-bold mb-2 text-lg">¿Necesitas inspiración?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {ejemplos.map((ej, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow p-4 flex flex-col items-start">
                                    <span className="font-bold text-pink-500">{ej.nombre}</span>
                                    <span className="text-sm text-gray-600">Días: {ej.dias}</span>
                                    <span className="text-sm text-gray-600">Escenarios: {ej.escenarios.join(", ")}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Consejos */}
                    <div className="mt-8 w-full bg-purple-50 rounded-xl p-4 shadow flex flex-col items-center">
                        <h3 className="text-pink-500 font-bold mb-2 text-lg">¿Sabías que…?</h3>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 text-left w-full max-w-md mx-auto">
                            <li>Puedes editar los escenarios y días después.</li>
                            <li>¡Agrega tantos escenarios como quieras!</li>
                            <li>Comparte tu festival con tus amigos al terminar.</li>
                            <li>Pronto podrás añadir artistas y horarios personalizados.</li>
                        </ul>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-6 text-center text-sm text-gray-500 bg-white bg-opacity-70 backdrop-blur border-t">
                © {new Date().getFullYear()} <span className="font-bold text-purple-700">MiFestival</span> · Crea tu experiencia musical
            </footer>
        </div>
    );
};

export default CreateFestival;