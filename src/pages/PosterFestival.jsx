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

    let backgroundImg = cityImg;
    if (backgroundType === "beach") backgroundImg = beachImg;
    if (backgroundType === "desert") backgroundImg = desertImg;

    const dias = getDiasFestival(festival.days || 1);
    const artistas = festival.artistas || [];
    const diasConArtistas = agruparArtistasPorDia(artistas, dias);

    // Paleta y fuentes mejoradas
    const colorHeadliner = "#FFD700";
    const colorSecundario = "#FC6AFD";
    const colorFondo = "#0c0032";
    const colorSombras = "#00000099";
    const fontHeadliner = "'Passion One', Impact, sans-serif";
    const fontSecundario = "'Secuela', 'Montserrat', sans-serif";
    const fontFestival = "'Ganache', 'Bebas Neue', sans-serif";

    // Ajustes de tamaño y scroll
    const POSTER_WIDTH = 520;
    // const POSTER_HEIGHT = 740; // Elimina esta línea

    return (

        <div
            style={{
                width: POSTER_WIDTH,
                height: "auto",
                minHeight: 600, // <-- Mínimo de altura para mostrar el diseño inferior
                background: `radial-gradient(ellipse at 50% 20%, #2c0161 60%, #0c0032 100%)`,
                position: "relative",
                boxShadow: "0 8px 32px 0 #00000044",
                overflow: "hidden",
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                paddingTop: 32,
                paddingBottom: 48,
            }}
            className="text-white mx-auto"
        >
            <img
                src={backgroundImg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                style={{ zIndex: 0 }}
            />
            <div
                className="relative z-10 flex-1 flex flex-col px-6 pt-8 pb-6"
                style={{
                    overflowY: "visible", // Cambia a visible
                    // maxHeight: POSTER_HEIGHT - 48, // Elimina esta línea
                }}
            >
                {/* Nombre del festival */}
                <div
                    className="text-5xl md:text-6xl text-center font-black tracking-wide drop-shadow-lg mb-2"
                    style={{
                        fontFamily: fontFestival,
                        letterSpacing: 2,
                        color: "#fff",
                        textShadow: `0 4px 24px ${colorSombras}, 0 2px 0 #FC6AFD`,
                        wordBreak: "break-word"
                    }}
                >
                    {festival.name}
                </div>
                {/* Fechas y escenarios */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <span
                        className="bg-[#FC6AFD] bg-opacity-80 text-white px-4 py-1 rounded-full text-xs font-bold shadow"
                        style={{ fontFamily: fontSecundario, letterSpacing: 1 }}
                    >
                        {dias.map(d => d.fecha).join(" / ")}
                    </span>
                    {festival.stages && festival.stages.length > 1 && (
                        <span
                            className="bg-[#FFD700] bg-opacity-80 text-[#2c0161] px-4 py-1 rounded-full text-xs font-bold shadow"
                            style={{ fontFamily: fontSecundario, letterSpacing: 1 }}
                        >
                            {festival.stages.join(" • ")}
                        </span>
                    )}
                </div>
                {/* Lineup por día */}
                <div className="flex flex-col gap-6">
                    {diasConArtistas.map((dia, idx) => (
                        <div className="text-center" key={dia.nombre + idx}>
                            <div className="flex items-center justify-center mb-2 gap-2">
                                <div
                                    className="shrink text-base font-bold w-14"
                                    style={{
                                        color: colorSecundario,
                                        fontFamily: fontSecundario,
                                        letterSpacing: 2,
                                        textShadow: `0 2px 8px ${colorSombras}`
                                    }}
                                >
                                    {dia.nombre}
                                </div>
                                <div className="flex-1">
                                    <h1
                                        className="text-3xl md:text-4xl font-black uppercase tracking-wider"
                                        style={{
                                            fontFamily: fontHeadliner,
                                            color: colorHeadliner,
                                            textShadow: `0 6px 24px ${colorSombras}, 0 2px 0 #fff`,
                                            wordBreak: "break-word"
                                        }}
                                    >
                                        {dia.artistas[0] || "Headliner"}
                                    </h1>
                                </div>
                                <div
                                    className="shrink text-base font-bold w-14"
                                    style={{
                                        color: colorSecundario,
                                        fontFamily: fontSecundario,
                                        letterSpacing: 2,
                                        textShadow: `0 2px 8px ${colorSombras}`
                                    }}
                                >
                                    {dia.fecha}
                                </div>
                            </div>
                            {/* Artistas secundarios */}
                            <div
                                className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-lg md:text-xl mt-2 font-bold"
                                style={{
                                    fontFamily: fontSecundario,
                                    color: "#fff",
                                    textShadow: `0 2px 8px ${colorSombras}`,
                                    maxWidth: "90%",
                                    margin: "0 auto"
                                }}
                            >
                                {dia.artistas.slice(1, 7).map((art, i) => (
                                    <span key={art + i} style={{ whiteSpace: "nowrap" }}>
                                        {art}
                                        {i < 6 && dia.artistas.length > i + 2 && (
                                            <span style={{ color: colorSecundario }}> • </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {/* Artistas extra */}
                            {dia.artistas.length > 8 && (
                                <div
                                    className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-base md:text-lg mt-1 opacity-90 font-medium"
                                    style={{
                                        fontFamily: fontSecundario,
                                        color: "#e0e0e0",
                                        textShadow: `0 1px 4px ${colorSombras}`,
                                        maxWidth: "92%",
                                        margin: "0 auto"
                                    }}
                                >
                                    {dia.artistas.slice(7).map((art, i, arr) => (
                                        <span key={art + i} style={{ whiteSpace: "nowrap" }}>
                                            {art}
                                            {i < arr.length - 1 && <span style={{ color: colorSecundario }}> • </span>}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {/* Marca inferior */}
            <div
                className="absolute bottom-0 left-0 w-full flex items-center justify-center py-2"
                style={{
                    background: "linear-gradient(90deg, #2c0161cc 0%, #FC6AFDcc 100%)",
                    zIndex: 20
                }}
            >
                <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{
                        fontFamily: fontSecundario,
                        color: "#FFD700",
                        letterSpacing: 2,
                        textShadow: `0 1px 4px ${colorSombras}`
                    }}
                >
                    MiFestival.app
                </span>
            </div>
        </div>
    );
};

export default PosterFestival;