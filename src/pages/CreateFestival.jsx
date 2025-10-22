import React, { useState, useContext } from "react";
// MODIFICADO: Importa updateDoc también
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom"; // Importa Link
import mflogo from "../assets/mflogo20.png";
// import mfbanner from "../assets/bailando.webp"; // Eliminamos banner para un look más limpio
import { AuthContext } from "../context/AuthContext";
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Icono para volver

function generarSlug(nombre) {
    return nombre
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
}

const CreateFestival = () => {
    const [name, setName] = useState("");
    const [days, setDays] = useState(1);
    // const [stages, setStages] = useState(["Escenario Principal"]); // Mantenemos la lógica original donde escenarios no se definen aquí
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    // Eliminamos handleAddStage y handleRemoveStage ya que no hay UI para ellos aquí

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validación simple
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
            const initialStages = ["Escenario Principal"]; // Definimos el escenario inicial aquí
            const docRef = await addDoc(collection(db, "festivals"), {
                name: name.trim(), // Usamos trim()
                slug,
                days: Number(days), // Aseguramos que sea número
                stages: initialStages, // Guardamos el escenario inicial
                fondoPoster: "city", // Valor por defecto
                createdAt: serverTimestamp(),
                userId: user.isGuest ? "invitado" : user.uid,
                // No guardamos el ID aquí, Firebase lo asigna automáticamente.
                // Si necesitas el ID *dentro* del documento por alguna razón,
                // se haría en un paso posterior, pero generalmente no es necesario.
            });
            // No necesitamos updateDoc aquí solo para añadir el ID.
            navigate(`/editarFestival/${docRef.id}`); // Navega a editar con el ID real
        } catch (error) {
            setError("Error al guardar el festival. Intenta de nuevo.");
            console.error("Error creating festival:", error);
            setLoading(false); // Asegúrate que loading se quite en caso de error
        }
        // No necesitas setLoading(false) aquí si navegas, pero es buena práctica tenerlo en el catch
    };

    // Mantenemos ejemplos, pero podrían eliminarse si buscas ultra-minimalismo
    const ejemplos = [
        { nombre: "Eco Sound Fest", dias: 3 },
        { nombre: "Noche Urbana", dias: 2 },
    ];

    return (
        // MODIFICADO: Fondo limpio consistente
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
            {/* Header */}
            {/* MODIFICADO: Estilo consistente, botón "Volver" con icono */}
            <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/inicio" className="flex items-center gap-2"> {/* Enlace a Inicio (dashboard) */}
                        <img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md" />
                        <span className="text-lg font-bold text-gray-900 hidden sm:inline">MiFestival</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => navigate(-1)} // Vuelve a la página anterior
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Volver
                    </button>
                </div>
            </header>

            {/* Main Content */}
            {/* MODIFICADO: Centrado, card limpia para el formulario */}
            <main className="flex-grow flex items-center justify-center px-4 py-12 sm:py-16">
                <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 max-w-lg w-full"> {/* max-w-lg para un poco más de espacio */}
                    <div className="text-center mb-8">
                        {/* <img src={mflogo} alt="" className="w-16 h-16 mx-auto mb-4 rounded-lg"/> */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Crea Tu Nuevo Festival</h1>
                        <p className="text-sm text-gray-500">
                            Define los detalles básicos para empezar a diseñar.
                        </p>
                    </div>

                    {/* Aviso Invitado */}
                    {user?.isGuest && ( // Añadido '?' por seguridad
                         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md p-4 mb-6 flex items-start gap-3">
                           <span className="mt-0.5">⚠️</span>
                           <div>
                             <span className="font-semibold">Modo Invitado:</span> Tus festivales se perderán al cerrar o recargar. <Link to="/register" className="font-medium underline hover:text-yellow-900">Regístrate gratis</Link> para guardarlos.
                           </div>
                         </div>
                    )}

                    {/* Mensaje de Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3 mb-4 text-center">
                            {error}
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="festival-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre del Festival <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="festival-name"
                                type="text"
                                placeholder="Ej: Festival del Sol"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                // MODIFICADO: Estilo de input consistente
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-150 ease-in-out"
                            />
                        </div>
                        <div>
                            <label htmlFor="festival-days" className="block text-sm font-medium text-gray-700 mb-1">
                                Número de Días <span className="text-red-500">*</span>
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
                                required
                            
                                // MODIFICADO: Input más pequeño y consistente
                                className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-150 ease-in-out"
                            />
                             <p className="text-xs text-gray-500 mt-1">Entre 1 y 30 días.</p>
                        </div>

                        {/* Botón Crear */}
                        <button
                            type="submit"
                            disabled={loading}
                            // MODIFICADO: Botón principal consistente
                             className={`w-full text-center bg-cyan-500 text-white font-semibold py-2.5 px-4 rounded-md shadow-sm transition duration-150 ease-in-out ${
                                loading
                                  ? 'opacity-70 cursor-not-allowed'
                                  : 'hover:bg-cyan-600'
                              }`}
                        >
                            {loading ? "Creando..." : "Crear y Añadir Artistas"}
                        </button>
                    </form>

                     {/* Sección Inspiración (Opcional, diseño simple) */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                         <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">¿Necesitas Ideas?</h3>
                         <div className="flex justify-center gap-4">
                             {ejemplos.map((ej, idx) => (
                                 <div key={idx} className="bg-gray-50 rounded-md p-3 text-center text-xs">
                                     <span className="font-semibold text-gray-800 block">{ej.nombre}</span>
                                     <span className="text-gray-500">{ej.dias} días</span>
                                 </div>
                             ))}
                         </div>
                    </div>

                    {/* Eliminamos sección "Consejos" para simplificar */}
                </div>
            </main>

            {/* Footer */}
            {/* MODIFICADO: Minimalista consistente */}
            <footer className="w-full py-5 text-center text-xs text-gray-400 border-t border-gray-100 mt-auto">
                 <div className="container mx-auto px-4 sm:px-6">
                   © {new Date().getFullYear()} MiFestival por Carlos Cortez.
                 </div>
             </footer>
        </div>
    );
};

export default CreateFestival;