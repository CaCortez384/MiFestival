import cityImg from "../assets/City.svg";

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

const PosterFestival = ({ festival }) => {
    if (!festival) return null;

    const dias = getDiasFestival(festival.days || 1);
    const artistas = festival.artistas || [];
    const diasConArtistas = agruparArtistasPorDia(artistas, dias);

    return (
        <div
            style={{
                aspectRatio: "0.93",
                backgroundColor: "#0c0032",
                position: "relative",
                minHeight: diasConArtistas.length > 1 ? 600 + diasConArtistas.length * 60 : 600, // altura dinámica
                height: "auto"
            }}
            className="text-white w-full max-w-2xl mx-auto rounded-2xl overflow-hidden"
        >
            <img
                src={cityImg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                style={{ zIndex: 0 }}
            />
            <div className="relative z-10 px-6 pt-6">
                <div className="text-4xl md:text-5xl text-center font-bold" style={{ fontFamily: "Ganache" }}>
                    {festival.name}
                </div>
                {diasConArtistas.map((dia, idx) => (
                    <div className="my-6 text-center" key={dia.nombre + idx}>
                        <div className="flex items-center justify-center">
                            <div className="shrink text-base font-semibold w-12" style={{ color: "#FC6AFD", fontFamily: "Secuela" }}>
                                {dia.nombre}
                            </div>
                            <div className="flex-1">
                                <h1
                                    className="text-2xl md:text-3xl font-extrabold"
                                    style={{ fontFamily: "Passion One" }}
                                >
                                    {dia.artistas[0] || "Headliner"}
                                </h1>
                            </div>
                            <div className="shrink text-base font-semibold w-12" style={{ color: "#FC6AFD", fontFamily: "Secuela" }}>
                                {dia.fecha}
                            </div>
                        </div>
                        <div className="text-xl md:text-2xl mt-2" style={{ fontFamily: "Secuela" }}>
                            {dia.artistas.slice(1, 4).map((art, i) => (
                                <span key={art + i}>
                                    {art}
                                    {i < 2 && dia.artistas.length > i + 2 && <span style={{ color: "#FC6AFD" }}> • </span>}
                                </span>
                            ))}
                        </div>
                        <div className="text-base md:text-lg mt-1 opacity-90" style={{ fontFamily: "Secuela" }}>
                            {dia.artistas.slice(4).map((art, i, arr) => (
                                <span key={art + i}>
                                    {art}
                                    {i < arr.length - 1 && <span style={{ color: "#FC6AFD" }}> • </span>}
                                    {(i + 1) % 4 === 0 && <br />}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div
                className="absolute bottom-0 left-0 w-[22%] h-[8.2%] flex items-center justify-center"
                style={{ backgroundColor: "#2c0161bf" }}
            >
            </div>
        </div>
    );
};

export default PosterFestival;