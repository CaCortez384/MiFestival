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

    // Colores
    const colorHeadliner = "#FFD700";
    const colorSecundario = "#FC6AFD";
    const colorSombras = "#00000099";

    // DIMENSIONES FIJAS como en Python
    const POSTER_WIDTH = 1400;
    const POSTER_HEIGHT = 1512; // Ratio similar a Instafest

    // Posiciones Y calculadas (similar al código Python)
    let yOffset = 80; // Inicio del contenido
    const headlinerSpacing = 320; // Espacio entre cada día

    return (
        <div 
            style={{
                width: POSTER_WIDTH,
                height: POSTER_HEIGHT,
                backgroundColor: "#0c0032",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Imagen de fondo */}
            <img
                src={backgroundImg}
                alt=""
                style={{ 
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.6,
                    zIndex: 0,
                }}
            />

            {/* Nombre del festival */}
            <div 
                style={{ 
                    position: "absolute",
                    top: 20,
                    left: 0,
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "Ganache, 'Bebas Neue', sans-serif",
                    fontSize: 110,
                    color: "#fff",
                    textShadow: `0 4px 12px ${colorSombras}, 0 2px 0 ${colorSecundario}`,
                    zIndex: 10,
                    fontWeight: 900,
                }}
            >
                {festival.name}
            </div>

            {/* Presented by / fechas */}
            <div 
                style={{
                    position: "absolute",
                    top: 180,
                    left: 0,
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "Secuela, Montserrat, sans-serif",
                    fontSize: 40,
                    color: colorSecundario,
                    zIndex: 10,
                    fontWeight: 700,
                }}
            >
                {dias.map(d => d.fecha).join(" / ")}
            </div>

            {/* Lineup por día - posicionamiento absoluto */}
            {diasConArtistas.map((dia, idx) => {
                const currentY = 300 + (idx * headlinerSpacing);
                const dayX = 50;
                const dateX = POSTER_WIDTH - 280;
                
                return (
                    <div key={dia.nombre + idx}>
                        {/* Día de la semana (izquierda) */}
                        <div
                            style={{
                                position: "absolute",
                                top: currentY + 60,
                                left: dayX,
                                fontFamily: "Secuela, Montserrat, sans-serif",
                                fontSize: 60,
                                color: colorSecundario,
                                fontWeight: 700,
                                zIndex: 10,
                            }}
                        >
                            {dia.nombre}
                        </div>

                        {/* Headliner (centro) */}
                        <div
                            style={{
                                position: "absolute",
                                top: currentY,
                                left: 0,
                                width: "100%",
                                textAlign: "center",
                                fontFamily: "'Passion One', Impact, sans-serif",
                                fontSize: 90,
                                color: colorHeadliner,
                                textShadow: `0 4px 12px ${colorSombras}, 0 2px 0 #fff`,
                                textTransform: "uppercase",
                                fontWeight: 900,
                                zIndex: 10,
                            }}
                        >
                            {dia.artistas[0] || "HEADLINER"}
                        </div>

                        {/* Fecha (derecha) */}
                        <div
                            style={{
                                position: "absolute",
                                top: currentY + 60,
                                left: dateX,
                                fontFamily: "Secuela, Montserrat, sans-serif",
                                fontSize: 60,
                                color: colorSecundario,
                                fontWeight: 700,
                                zIndex: 10,
                            }}
                        >
                            {dia.fecha}
                        </div>

                        {/* Artistas secundarios - Primera línea */}
                        {dia.artistas.length > 1 && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: currentY + 145,
                                    left: 0,
                                    width: "100%",
                                    textAlign: "center",
                                    fontFamily: "Secuela, Montserrat, sans-serif",
                                    fontSize: 50,
                                    color: "#fff",
                                    textShadow: `0 2px 6px ${colorSombras}`,
                                    fontWeight: 700,
                                    zIndex: 10,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    padding: "0 100px",
                                }}
                            >
                                {dia.artistas.slice(1, 4).map((art, i, arr) => (
                                    <span key={art + i}>
                                        {art}
                                        {i < arr.length - 1 && (
                                            <span style={{ color: colorSecundario }}> • </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Artistas secundarios - Segunda línea */}
                        {dia.artistas.length > 4 && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: currentY + 216,
                                    left: 0,
                                    width: "100%",
                                    textAlign: "center",
                                    fontFamily: "Secuela, Montserrat, sans-serif",
                                    fontSize: 40,
                                    color: "#fff",
                                    textShadow: `0 1px 4px ${colorSombras}`,
                                    fontWeight: 600,
                                    zIndex: 10,
                                    opacity: 0.9,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    padding: "0 80px",
                                }}
                            >
                                {dia.artistas.slice(4, 9).map((art, i, arr) => (
                                    <span key={art + i}>
                                        {art}
                                        {i < arr.length - 1 && (
                                            <span style={{ color: colorSecundario }}> • </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Artistas secundarios - Tercera línea */}
                        {dia.artistas.length > 9 && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: currentY + 260,
                                    left: 0,
                                    width: "100%",
                                    textAlign: "center",
                                    fontFamily: "Secuela, Montserrat, sans-serif",
                                    fontSize: 30,
                                    color: "#fff",
                                    textShadow: `0 1px 4px ${colorSombras}`,
                                    fontWeight: 600,
                                    zIndex: 10,
                                    opacity: 0.9,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    padding: "0 80px",
                                }}
                            >
                                {dia.artistas.slice(9, 14).map((art, i, arr) => (
                                    <span key={art + i}>
                                        {art}
                                        {i < arr.length - 1 && (
                                            <span style={{ color: colorSecundario }}> • </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Footer */}
            <div 
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 410,
                    height: 124,
                    background: "rgba(44, 1, 97, 0.75)",
                    borderTopRightRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 20,
                }}
            >
                <span 
                    style={{
                        fontFamily: "Secuela, Montserrat, sans-serif",
                        color: colorHeadliner,
                        fontSize: 32,
                        fontWeight: 700,
                        letterSpacing: 2,
                    }}
                >
                    MIFESTIVAL.WEB.APP
                </span>
            </div>
        </div>
    );
};

export default PosterFestival;