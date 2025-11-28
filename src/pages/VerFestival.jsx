import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toPng } from "html-to-image";
import PosterFestival from "./PosterFestival";
import mflogo from "../assets/mflogo20.png";

// Iconos para mejorar la UI pública
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const Festival = () => {
    const { slugId } = useParams();
    // Manejo robusto del ID por si el slug no tiene guión
    const id = slugId.includes('-') ? slugId.split('-').pop() : slugId;
    
    const [festival, setFestival] = useState(null);
    const [loading, setLoading] = useState(true);
    const [artistas, setArtistas] = useState([]);
    const [fondoPoster, setFondoPoster] = useState("city");
    
    // REFS
    const posterRef = useRef(null); // Para descarga (invisible, HD)
    const previewContainerRef = useRef(null); // Para medir ancho en pantalla
    const [previewScale, setPreviewScale] = useState(0.3); // Escala dinámica

    // --- LÓGICA DE ESCALADO (Igual que en el editor) ---
    useEffect(() => {
        const calculateScale = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.offsetWidth;
                // El ancho real del póster es 1080px
                const scale = containerWidth / 1080;
                setPreviewScale(scale);
            }
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);
        
        // Timeout para asegurar carga del DOM
        const timer = setTimeout(calculateScale, 100);

        return () => {
            window.removeEventListener('resize', calculateScale);
            clearTimeout(timer);
        };
    }, [loading]);

    const handleDescargarPoster = async () => {
        if (!posterRef.current) return;
        try {
            // Descargamos desde el REF oculto que tiene el tamaño real (1080x1920)
            const dataUrl = await toPng(posterRef.current.firstChild, { pixelRatio: 1, cacheBust: true });
            const link = document.createElement("a");
            link.download = `${festival.name || "poster"}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error(err);
            alert("No se pudo generar la imagen.");
        }
    };

    useEffect(() => {
        const fetchFestival = async () => {
            try {
                const docRef = doc(db, "festivals", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFestival(docSnap.data());
                    setArtistas(docSnap.data().artistas || []);
                    setFondoPoster(docSnap.data().fondoPoster || "city");
                }
            } catch (error) {
                console.error("Error fetching festival:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchFestival();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
                <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl shadow-lg p-8 text-center">
                    <p className="text-lg text-purple-700 font-semibold animate-pulse">Cargando festival...</p>
                </div>
            </div>
        );
    }

    if (!festival) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-red-600 font-semibold text-lg mb-4">Festival no encontrado.</p>
                <Link to="/inicio" className="px-5 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition">
                    Ir al inicio
                </Link>
            </div>
        );
    }

    const dias = Array.from({ length: festival.days || 1 }, (_, i) => `Día ${i + 1}`);
    const escenarios = festival.stages || [];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
            {/* Header */}
            <header className="w-full px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <Link to="/inicio" className="flex items-center gap-2">
                        <img src={mflogo} alt="MiFestival Logo" className="w-10 h-10 rounded-lg shadow-sm" />
                        <span className="hidden md:inline text-xl font-bold text-gray-800 tracking-tight">MiFestival</span>
                    </Link>
                </div>
                <Link
                    to="/inicio"
                    className="text-sm font-medium text-purple-700 hover:text-purple-900 transition"
                >
                    Crear mi propio póster →
                </Link>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row gap-8 px-4 py-8 md:py-12 w-full max-w-7xl mx-auto">
                
                {/* Columna Izquierda: Información */}
                <section className="flex-1 w-full bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 md:p-8 h-fit">
                    <div className="mb-6">
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 uppercase leading-tight tracking-tight">
                            {festival.name}
                        </h1>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {dias.length} Días
                            </span>
                            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {escenarios.length} Escenarios
                            </span>
                        </div>
                    </div>

                    {/* Tabla de horarios estilizada */}
                    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm mt-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-500 border-b">Escenario</th>
                                        {dias.map((dia, idx) => (
                                            <th key={idx} className="px-4 py-3 text-left font-semibold text-gray-500 border-b whitespace-nowrap">{dia}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {escenarios.map((escenario, idxEsc) => (
                                        <tr key={idxEsc} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900 bg-gray-50/30">{escenario}</td>
                                            {dias.map((dia, idxDia) => {
                                                const acts = artistas.filter(a => a.dia === dia && a.escenario === escenario);
                                                return (
                                                    <td key={idxDia} className="px-4 py-3 align-top">
                                                        {acts.length > 0 ? (
                                                            <div className="flex flex-col gap-1">
                                                                {acts.map((a, i) => (
                                                                    <span key={i} className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium border border-purple-100">
                                                                        {a.nombre}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-300 text-xs italic">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Columna Derecha: Póster */}
                <aside className="w-full lg:w-[480px] xl:w-[540px] flex flex-col items-center flex-shrink-0">
                    <div className="bg-white p-4 rounded-3xl shadow-2xl w-full">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Póster Oficial</h2>
                        
                        {/* CONTENEDOR DE PREVISUALIZACIÓN ESCALABLE */}
                        <div 
                            ref={previewContainerRef}
                            className="w-full relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200"
                            style={{ aspectRatio: '9/16' }}
                        >
                            <div
                                style={{
                                    width: 1080,
                                    height: 1920,
                                    transform: `scale(${previewScale})`,
                                    transformOrigin: "top left",
                                    position: "absolute",
                                    top: 0,
                                    left: 0
                                }}
                            >
                                <PosterFestival
                                    festival={{ ...festival, artistas }}
                                    backgroundType={fondoPoster}
                                />
                            </div>
                        </div>

                        {/* Botón Descarga */}
                        <button
                            onClick={handleDescargarPoster}
                            className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Descargar en Alta Calidad
                        </button>
                    </div>

                    {/* PÓSTER OCULTO PARA DESCARGA (HD 1080x1920) */}
                    <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                        <div ref={posterRef}>
                            <PosterFestival
                                festival={{ ...festival, artistas }}
                                backgroundType={fondoPoster}
                            />
                        </div>
                    </div>
                </aside>

            </main>
            
            {/* Footer */}
            <footer className="w-full py-6 text-center text-sm text-gray-500 border-t border-purple-100 bg-white/50">
                © {new Date().getFullYear()} <span className="font-bold text-purple-700">MiFestival</span>
            </footer>
        </div>
    );
};

export default Festival;