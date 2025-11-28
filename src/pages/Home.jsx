import { useNavigate } from "react-router-dom";
import mflogo from "../assets/mflogo20.png";
import banner from "../assets/banner.png"; // Usaremos la imagen existente
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// NUEVO: Texto más orientado al beneficio y conciso
const features = [
  {
    title: "Diseña a Tu Gusto",
    desc: "Elige nombre, días y escenarios. Control total.",
    // Iconos Emoji como fallback simple y universal
    icon: "🎨",
  },
  {
    title: "Organiza Fácilmente",
    desc: "Arrastra y suelta artistas en tu lineup visual.",
    icon: "🎧",
  },
  {
    title: "Comparte al Instante",
    desc: "Descarga o comparte tu póster profesional.",
    icon: "✨",
  },
];

const Home = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGuest = () => {
    setUser({ isGuest: true, displayName: "Invitado" });
    navigate("/inicio");
  };

  return (
    // MODIFICADO: Fondo blanco limpio, tipografía sans-serif por defecto
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
      {/* Header */}
      {/* MODIFICADO: Sencillo, limpio, con énfasis en el CTA principal */}
      <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md" />
            <span className="text-lg font-bold text-gray-900">MiFestival</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 transition"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              // CTA Principal en Header
              className="px-4 py-1.5 rounded-md text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 shadow-sm transition"
            >
              Crear Cuenta
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      {/* MODIFICADO: Texto MUY claro y directo, CTAs grandes y contrastados, imagen como soporte visual */}
      <section className="flex-grow flex py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-stretch">
          {/* Columna de Texto - Enfocada en la acción */}
          <div className="text-center md:text-left flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
              Crea <span className="text-cyan-600">Pósters</span> de Festivales Únicos.
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Tu herramienta online para diseñar lineups y compartirlos fácilmente.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3">
              <Link
                to="/register"
                // CTA Principal GRANDE
                className="w-full sm:w-auto text-center bg-cyan-500 text-white text-base font-semibold py-3 px-8 rounded-lg shadow hover:bg-cyan-600 transform hover:scale-105 transition duration-150"
              >
                Empezar Gratis
              </Link>
              <button
                type="button"
                onClick={handleGuest}
                // CTA Secundario más sutil pero claro
                className="w-full sm:w-auto text-center bg-gray-100 text-gray-700 text-base font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 transition duration-150"
              >
                Ver Demo Invitado
              </button>
            </div>
            {/* NUEVO: Prueba Social / Beneficio Clave (Opcional) */}
            <p className="mt-6 text-sm text-gray-500">
              ✅ No necesitas cuenta de Spotify &nbsp; ✨ Totalmente gratis
            </p>
          </div>

          {/* Columna de Imagen - Soporte visual claro */}
          <div className="px-4 h-full">
            <img
              src={banner} // Reutilizamos la imagen banner existente
              alt="Ejemplo visual de posters de MiFestival"
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Cómo Funciona (Simplificado) */}
      {/* MODIFICADO: Sección integrada, título como pregunta, tarjetas minimalistas */}
      <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">¿Cómo Crear Tu Lineup?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <div
                key={i}
                // Tarjeta minimalista con icono y texto
                className="flex items-start gap-4 p-4"
              >
                <div className="flex-shrink-0 text-3xl">{f.icon}</div> {/* Icono Emoji */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final (Opcional - puede ser redundante si el Hero es fuerte) */}
      {/* Se puede eliminar si buscamos máxima simplificación */}
      {/* <section className="py-16 bg-white"> ... </section> */}

      {/* Footer */}
      {/* MODIFICADO: Ultra minimalista */}
      <footer className="w-full py-5 text-center text-xs text-gray-400 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          © {new Date().getFullYear()} MiFestival por Carlos Cortez.
        </div>
      </footer>
    </div>
  );
};

export default Home;