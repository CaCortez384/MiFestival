import React from 'react';
import cityImg from "../assets/City.svg";
import beachImg from "../assets/Beach.svg";
import desertImg from "../assets/Desert.svg";

// Utilidad para obtener los nombres de los días y fechas próximas
const diasSemana = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
function getDiasFestival(numDias) {
    const hoy = new Date();
    return Array.from({ length: numDias }, (_, i) => {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + i);
        const nombre = diasSemana[fecha.getDay()];
        const fechaStr = fecha.toLocaleString("en-US", { month: "short", day: "2-digit" }).toUpperCase();
        return { nombre, fecha: fechaStr, idx: i };
    });
}

// Agrupa artistas por día
function agruparArtistasPorDia(artistas, dias) {
    return dias.map((dia, idx) => {
        const artistasDia = artistas.filter(a => a.dia === `Día ${idx + 1}`);
        return {
            ...dia,
            artistas: artistasDia.map(a => a.nombre)
        };
    });
}

const PosterFestival = ({ festival, backgroundType = "city" }) => {
    if (!festival) return null;

    // Fondo según tipo
    const hasImageBackground = ["city", "beach", "desert"].includes(backgroundType);

    // Definición de días y artistas
    const dias = getDiasFestival(festival.days || 1);
    const artistas = Array.isArray(festival.artistas) ? festival.artistas : [];
    const hasAnyArtists = artistas.length > 0;
    const diasAgrupados = agruparArtistasPorDia(artistas, dias);

    let MAX_ARTISTS_PER_DAY = 20; // Para 1 día
    if (dias.length === 2) MAX_ARTISTS_PER_DAY = 15;
    if (dias.length >= 3) MAX_ARTISTS_PER_DAY = 15; // Aumentado para soportar 15 como Instafest

    // --- COLORES POR TEMA ---
    // --- COLORES POR TEMA BRUTALISTA ---
    let backgroundColor = "#FFFDF9"; // Base hueca/crema
    let borderColor = "#050510"; // Border muy negro
    let colorTitulos = "#050510"; // Titulos negros por defecto
    let colorFechas = "#050510";
    let colorSecundario = "#FF55B5"; // Rosa por defecto
    let colorHeadliners = "#050510";
    let backgroundStyle = { backgroundColor: backgroundColor };

    if (backgroundType === "city") {
        backgroundColor = "#00E5FF"; // Cyan
        colorSecundario = "#FF90E8"; // Rosa pastel
        backgroundStyle = { backgroundColor };
    } else if (backgroundType === "beach") {
        backgroundColor = "#FFD500"; // Amarillo
        colorSecundario = "#00E5FF"; // Cyan
        backgroundStyle = { backgroundColor };
    } else if (backgroundType === "desert") {
        backgroundColor = "#FF90E8"; // Rosa pastel
        colorFechas = "#FFF";
        colorSecundario = "#FFD500"; // Amarillo
        backgroundStyle = { backgroundColor };
    } else if (backgroundType === "cyber") {
        backgroundColor = "#050510"; // Todo negro o casi
        borderColor = "#00FF66"; // Bordes verde fluor
        colorTitulos = "#00FF66";
        colorFechas = "#FFF";
        colorHeadliners = "#00FF66";
        colorSecundario = "#00E5FF";
        backgroundStyle = { backgroundColor, border: `12px solid ${borderColor}` };
    } else if (backgroundType === "retro") {
        backgroundColor = "#FF5722"; // Naranja
        colorSecundario = "#FFD500";
        backgroundStyle = { backgroundColor };
    } else if (backgroundType === "minimal") {
        backgroundColor = "#FFFDF9";
        colorSecundario = "#050510";
        colorFechas = "#FFF";
        backgroundStyle = { backgroundColor };
    } else if (backgroundType === "neon") {
        backgroundColor = "#00FF66"; // Verde fluor
        colorSecundario = "#FF90E8";
        backgroundStyle = { backgroundColor };
    }

    const POSTER_WIDTH = 1080;
    const POSTER_HEIGHT = 1920; // 9:16 perfect ratio para IG Stories / TikTok
    const FOOTER_HEIGHT = 140;

    // --- LÓGICA DE FUENTES ---
    const nombreFestival = festival.name || "Mi Festival";

    // Mantenemos la lógica de tamaño solo para que se vea bonito, 
    // pero ya no afecta la posición (eso lo hace Flexbox).
    let fontSizeTitulo = 110;
    if (nombreFestival.length > 32) fontSizeTitulo = 70;
    else if (nombreFestival.length > 24) fontSizeTitulo = 85;
    else if (nombreFestival.length > 18) fontSizeTitulo = 100;
    else if (nombreFestival.length > 12) fontSizeTitulo = 115;

    // Seguridad extra para palabras muy largas
    const longestToken = nombreFestival.split(/\s+/).reduce((a, b) => (a.length > b.length ? a : b), "");
    if (longestToken.length >= 14) fontSizeTitulo = Math.min(fontSizeTitulo, 80);

    const CONTENT_PADDING = "0 40px";
    const HEADLINER_PADDING = "0 100px";

    // --- RENDER LIST HELPER ---
    const renderArtistList = (list, fontSize, marginTop) => (
        <div style={{
            marginTop: marginTop,
            fontFamily: "'Inter', sans-serif",
            fontSize: fontSize,
            color: colorTitulos,
            fontWeight: 900,
            textTransform: "uppercase",
            padding: CONTENT_PADDING,
            boxSizing: "border-box",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            lineHeight: 1.2,
            filter: backgroundType === 'minimal' ? 'none' : "drop-shadow(3px 3px 0px #FFF) drop-shadow(-1px -1px 0px #000) drop-shadow(1px -1px 0px #000) drop-shadow(-1px 1px 0px #000) drop-shadow(1px 1px 0px #000)",
            WebkitTextStroke: backgroundType !== 'cyber' && backgroundType !== 'minimal' ? "2px #000" : "none",
        }}>
            {list.map((art, i) => (
                <span key={i}>
                    {art}
                    {i < list.length - 1 && (
                        <span style={{
                            color: colorSecundario,
                            margin: "0 15px",
                            fontWeight: 900,
                            display: "inline-block",
                            WebkitTextStroke: backgroundType !== 'cyber' && backgroundType !== 'minimal' ? "2px #000" : "none"
                        }}>•</span>
                    )}
                </span>
            ))}
        </div>
    );

    return (
        <div
            style={{
                width: POSTER_WIDTH,
                height: POSTER_HEIGHT,
                ...backgroundStyle,
                position: "relative",
                overflow: "hidden",
                padding: 0,
            }}
        >
            {/* 1. IMAGEN DE FONDO (PATRÓN BRUTALISTA DE PUNTOS O CUADROS) */}
            {hasImageBackground ? (
                <div style={{
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0,
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                    backgroundSize: "60px 60px",
                    opacity: 0.15
                }}></div>
            ) : (
                <div style={{ ...backgroundStyle, position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}></div>
            )}

            {/* 2. OVERLAY BRUTALISTA (MARCO NEGRO GRUESO) */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, border: "24px solid #050510", boxSizing: "border-box", pointerEvents: "none" }}></div>

            {/* --- CONTENEDOR PRINCIPAL FLEXIBLE (LA SOLUCIÓN AL SOLAPAMIENTO) --- */}
            {/* Este contenedor ocupa todo el alto y apila los elementos automáticamente */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                zIndex: 10,
                paddingTop: 70, // Espacio superior inicial
                boxSizing: "border-box"
            }}>

                {/* A. TÍTULO */}
                <div
                    style={{
                        width: "100%",
                        textAlign: "center",
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: fontSizeTitulo,
                        fontWeight: 900,
                        lineHeight: 0.9,
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        textTransform: "uppercase",
                        padding: "0 50px",
                        boxSizing: "border-box",
                        marginBottom: 20,
                        filter: backgroundType === 'minimal' ? 'none' : "drop-shadow(6px 6px 0px #050510) drop-shadow(-2px -2px 0px #050510) drop-shadow(2px -2px 0px #050510) drop-shadow(-2px 2px 0px #050510) drop-shadow(2px 2px 0px #050510)",
                        WebkitTextStroke: backgroundType !== 'cyber' && backgroundType !== 'minimal' ? "2px #050510" : "none",
                        color: backgroundType !== 'cyber' && backgroundType !== 'minimal' ? "#FFF" : colorTitulos
                    }}
                >
                    {nombreFestival}
                </div>

                {/* B. FECHAS */}
                <div
                    style={{
                        width: "fit-content",
                        margin: "0 auto",
                        textAlign: "center",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 32,
                        color: colorFechas,
                        fontWeight: 900,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        marginBottom: 50,
                        backgroundColor: colorSecundario,
                        padding: "10px 30px",
                        border: "6px solid #050510",
                        boxShadow: "6px 6px 0px #050510",
                        transform: "rotate(-2deg)"
                    }}
                >
                    {dias.map(d => d.fecha).join("  //  ")}
                </div>

                {!hasAnyArtists && (
                    <div style={{ width: "100%", textAlign: "center", marginTop: 100 }}>
                        <h1 style={{ color: colorTitulos, fontSize: 60, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: 2, fontWeight: 900, backgroundColor: "#FFF", border: "4px solid #000", padding: "20px", display: "inline-block", boxShadow: "8px 8px 0px #000", transform: "rotate(3deg)" }}>LINEUP PENDIENTE</h1>
                    </div>
                )}

                {/* C. LISTA DE ARTISTAS (Ocupa el espacio restante) */}
                {hasAnyArtists && (
                    <div style={{
                        width: "100%",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: dias.length > 2 ? "25px" : "40px",
                        justifyContent: "flex-start", // Cambiado de space-evenly a flex-start para controlar el flujo
                        paddingBottom: FOOTER_HEIGHT + 140, // Espacio vital para el footer
                    }}>
                        {diasAgrupados.map((dia, idx) => {
                            const artistasDiaOriginal = dia.artistas;
                            const artistasDia = artistasDiaOriginal.slice(0, MAX_ARTISTS_PER_DAY);
                            const overflow = artistasDiaOriginal.length - artistasDia.length;

                            return (
                                <div key={dia.nombre + idx} style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

                                    {/* Etiquetas Laterales Brutalistas (Movidas a flujo normal o relativas al header del día) */}
                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "0 30px", marginBottom: "15px", zIndex: 5 }}>
                                        <div style={{
                                            textAlign: "center",
                                            fontFamily: "'Outfit', sans-serif", fontSize: 28, color: "#000", fontWeight: 900,
                                            backgroundColor: "#FFF", border: "4px solid #000", padding: "5px 15px",
                                            transform: "rotate(-3deg)", boxShadow: "6px 6px 0px #000"
                                        }}>
                                            {dia.nombre}
                                        </div>
                                        <div style={{
                                            textAlign: "center",
                                            fontFamily: "'Outfit', sans-serif", fontSize: 28, color: backgroundType === 'minimal' ? '#FFF' : '#000', fontWeight: 900,
                                            backgroundColor: colorSecundario, border: "4px solid #000", padding: "5px 15px",
                                            transform: "rotate(3deg)", boxShadow: "6px 6px 0px #000"
                                        }}>
                                            {dia.fecha}
                                        </div>
                                    </div>

                                    <div style={{ width: "100%", textAlign: "center", padding: "0 40px" }}>

                                        {/* Headliner */}
                                        {artistasDia.length > 0 && (
                                            <div style={{
                                                fontFamily: "'Outfit', sans-serif",
                                                fontSize: dias.length > 2 ? 65 : 75, // Ligeramente más pequeños para asegurar encaje
                                                color: colorHeadliners,
                                                textTransform: "uppercase",
                                                fontWeight: 900,
                                                lineHeight: 0.95,
                                                whiteSpace: "normal",
                                                overflowWrap: "break-word",
                                                marginBottom: "15px",
                                                filter: backgroundType === 'minimal' ? 'none' : "drop-shadow(4px 4px 0px #FFF) drop-shadow(-2px -2px 0px #000) drop-shadow(2px -2px 0px #000) drop-shadow(-2px 2px 0px #000) drop-shadow(2px 2px 0px #000)",
                                                WebkitTextStroke: backgroundType !== 'minimal' ? "2px #000" : "none"
                                            }}>
                                                {artistasDia[0]}
                                            </div>
                                        )}

                                        {/* Secundarios */}
                                        {artistasDia.length > 1 && renderArtistList(artistasDia.slice(1, 4), dias.length > 2 ? 45 : 52, "10px")}
                                        {artistasDia.length > 4 && renderArtistList(artistasDia.slice(4, 9), dias.length > 2 ? 38 : 42, "10px")}
                                        {artistasDia.length > 9 && renderArtistList(artistasDia.slice(9, 15), dias.length > 2 ? 30 : 34, "10px")}
                                        {artistasDia.length > 15 && renderArtistList(artistasDia.slice(15, 20), dias.length > 2 ? 24 : 28, "10px")}

                                        {overflow > 0 && (
                                            <div style={{ marginTop: "15px", fontFamily: "'Inter', sans-serif", fontSize: 22, color: colorTitulos, fontWeight: 900, backgroundColor: "#FFF", border: "4px solid #000", padding: "4px 12px", display: "inline-block", boxShadow: "4px 4px 0px #000" }}>
                                                ...y {overflow} MÁS
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* --- FOOTER BRUTALISTA --- */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: FOOTER_HEIGHT + 40,
                    background: "#050510",
                    borderTop: `12px solid ${colorSecundario}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 20,
                    boxSizing: "border-box",
                    paddingBottom: 20
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 24,
                        fontWeight: 900,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        backgroundColor: colorSecundario,
                        color: backgroundType === 'cyber' ? '#000' : (backgroundType === 'minimal' ? '#FFF' : '#000'),
                        border: backgroundType === 'minimal' || backgroundType === 'cyber' ? "2px solid #FFF" : "2px solid #000",
                        padding: "4px 12px",
                        transform: "rotate(-2deg)",
                        boxShadow: "4px 4px 0px #FFF"
                    }}>
                        CREA TU LINEUP EN
                    </span>
                </div>

                <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    color: "#fff",
                    fontSize: 55,
                    fontWeight: 900,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginTop: 15,
                    WebkitTextStroke: "2px #000",
                    filter: "drop-shadow(4px 4px 0px #000)"
                }}>
                    MIFESTIVAL<span style={{ color: backgroundType === 'minimal' ? '#FFF' : colorSecundario }}>.WEB.APP</span>
                </span>
            </div>
        </div>
    );
};

export default PosterFestival;