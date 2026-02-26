import React, { useState, useContext } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import mflogo from "../assets/mflogo20.png";
import { AuthContext } from "../context/AuthContext";
// Iconos Heroicons
import { ArrowLeftIcon, TicketIcon, CalendarDaysIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

function generarSlug(nombre) {
    return nombre
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
}

const CreateFestival = () => {
    const [name, setName] = useState("");
    const [days, setDays] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Por favor, dale un nombre a tu festival.");
            return;
        }
        if (days < 1 || days > 30) {
            setError("El número de días debe estar entre 1 y 30.");
            return;
        }

        setLoading(true);
        try {
            if (!user) {
                setError("Debes iniciar sesión o usar modo invitado para crear un festival.");
                setLoading(false);
                return;
            }
            const slug = generarSlug(name);
            const initialStages = ["Escenario Principal"];
            const docRef = await addDoc(collection(db, "festivals"), {
                name: name.trim(),
                slug,
                days: Number(days),
                stages: initialStages,
                fondoPoster: "city",
                createdAt: serverTimestamp(),
                userId: user.isGuest ? "invitado" : user.uid,
            });
            navigate(`/editarFestival/${docRef.id}`);
        } catch (error) {
            setError("Error al guardar el festival. Intenta de nuevo.");
            console.error("Error creating festival:", error);
            setLoading(false);
        }
    };

    const ejemplos = [
        { nombre: "Lollapalooza Home", dias: 3 },
        { nombre: "Summer Vibes", dias: 2 },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-brutal-base text-[#050510] font-inter selection:bg-yellow-400 selection:text-black relative overflow-hidden border-x-4 border-black max-w-[1600px] mx-auto">
            {/* Fondo Textura */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

            {/* --- HEADER --- */}
            <header className="w-full px-4 sm:px-6 py-4 border-b-4 border-black sticky top-0 z-50 bg-brutal-base">
                <div className="container mx-auto flex justify-between items-center max-w-7xl">
                    <Link to="/inicio" className="flex items-center gap-3 shrink-0">
                        <div className="relative border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
                            <img src={mflogo} alt="MiFestival Logo" className="relative w-8 h-8 sm:w-9 sm:h-9 object-cover" />
                        </div>
                        <span className="text-lg sm:text-xl brutal-title hidden sm:inline bg-yellow-400 px-2 mt-1">MiFestival</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black border-2 border-black hover:bg-white shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-[#00E5FF]"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Atrás
                    </button>
                </div>
            </header>

            {/* --- MAIN CARD --- */}
            <main className="flex-grow flex items-center justify-center px-4 py-12 sm:py-16 relative z-10 w-full">
                <div className="bg-[#FF90E8] brutal-card p-8 sm:p-10 max-w-lg w-full relative transform -rotate-1">

                    {/* Elemento Decorativo */}
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-yellow-400 border-4 border-black brutal-card flex items-center justify-center transform rotate-12">
                        <TicketIcon className="w-8 h-8 text-black" />
                    </div>

                    <div className="text-center mb-8 bg-white border-4 border-black p-4 shadow-[8px_8px_0_#000] transform rotate-2">
                        <h1 className="text-4xl brutal-title mb-2">Nuevo Festival</h1>
                        <p className="text-lg text-black font-semibold">
                            El primer paso para crear tu lineup.
                        </p>
                    </div>

                    {/* Aviso Invitado */}
                    {user?.isGuest && (
                        <div className="bg-white border-4 border-black text-black font-bold p-4 mb-8 flex items-start gap-4 shadow-[4px_4px_0_#000]">
                            <div className="bg-yellow-400 border-2 border-black p-1 text-2xl rotate-12">⚠️</div>
                            <div>
                                <span className="font-outfit uppercase text-lg block mb-1">Modo Demo:</span> Tus festivales no se guardarán.<br /> <Link to="/register" className="underline hover:bg-yellow-400 inline-block px-1 transition mt-2">Crear cuenta gratis</Link>.
                            </div>
                        </div>
                    )}

                    {/* Mensaje de Error */}
                    {error && (
                        <div className="bg-red-500 border-4 border-black text-white font-bold text-center uppercase p-3 mb-6 shadow-[4px_4px_0_#000] animate-pulse">
                            {error}
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} id="create-festival" className="space-y-6">

                        {/* Input Nombre */}
                        <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_#000]">
                            <label htmlFor="festival-name" className="block text-xl brutal-title mb-2">
                                Nombre del Festival <span className="text-[#FF90E8]">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                                    <MusicalNoteIcon className="h-6 w-6" />
                                </div>
                                <input
                                    id="festival-name"
                                    type="text"
                                    placeholder="Ej: Lollapalooza 2026"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-[#f5f5f0] border-2 border-black focus:bg-yellow-100 focus:outline-none focus:ring-4 focus:ring-black text-xl font-bold text-black placeholder-gray-400 transition-colors rounded-none"
                                />
                            </div>
                        </div>

                        {/* Input Días */}
                        <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_#000]">
                            <label htmlFor="festival-days" className="block text-xl brutal-title mb-2">
                                Duración (Días) <span className="text-[#FF90E8]">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="relative w-32">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                                        <CalendarDaysIcon className="h-6 w-6" />
                                    </div>
                                    <input
                                        type="number"
                                        min={1}
                                        max={30}
                                        value={days === 0 ? "" : days}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setDays(val === "" ? 0 : Number(val));
                                        }}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-[#f5f5f0] border-2 border-black focus:bg-yellow-100 focus:outline-none focus:ring-4 focus:ring-black text-xl font-bold text-black placeholder-gray-400 transition-colors rounded-none"
                                    />
                                </div>
                                <span className="text-sm font-bold text-gray-500 border-l-4 border-black pl-3 bg-gray-100 p-2">Recomendado 3 días</span>
                            </div>
                        </div>

                        {/* Botón Crear */}
                        <button
                            id="create-festival"
                            type="submit"
                            disabled={loading}
                            className={`w-full text-2xl py-5 relative z-10 ${loading
                                ? 'bg-gray-300 border-4 border-black text-black cursor-not-allowed uppercase font-black tracking-widest'
                                : 'bg-[#00FF66] brutal-btn'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
                                    PREPARANDO...
                                </span>
                            ) : (
                                "EMPEZAR A DISEÑAR →"
                            )}
                        </button>
                    </form>

                    {/* Sección Inspiración */}
                    <div className="mt-8 pt-6 border-t-4 border-black border-dashed">
                        <h3 className="text-sm font-black text-black mb-4 text-center uppercase tracking-wider bg-white border-2 border-black py-1 px-3 inline-block mx-auto transform -rotate-2">Ideas Populares</h3>
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                            {ejemplos.map((ej, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => { setName(ej.nombre); setDays(ej.dias); }}
                                    className="bg-white border-2 border-black hover:bg-yellow-400 px-3 py-2 text-sm text-black font-bold transition-colors flex items-center gap-2 shadow-[2px_2px_0_#000] active:shadow-[0_0_0_#000] active:translate-x-[2px] active:translate-y-[2px]"
                                >
                                    <TicketIcon className="w-4 h-4 text-black" />
                                    <span className="uppercase">{ej.nombre}</span>
                                    <span className="text-black bg-[#00E5FF] px-1 border-l-2 border-black">{ej.dias}D</span>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="w-full py-8 text-center text-sm font-black uppercase tracking-widest text-black border-t-4 border-black bg-white mt-10">
                <div className="container mx-auto px-4">
                    © {new Date().getFullYear()} MiFestival. HAZ RUIDO.
                </div>
            </footer>
        </div>
    );
};

export default CreateFestival;