import { useNavigate } from "react-router-dom";
import mflogo from "../assets/mflogo20.png";
import banner from "../assets/banner.png";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// Iconos Heroicons para darle el toque pro
import { SparklesIcon, TicketIcon, MusicalNoteIcon, ArrowRightIcon, BoltIcon, FireIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGuest = () => {
    setUser({ isGuest: true, displayName: "Invitado" });
    navigate("/inicio");
  };

  return (
    // CAMBIO RADICAL: Fondo oscuro profundo para resaltar los colores neon
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-white font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      
      {/* Efectos de fondo ambiental (Blobs de luz) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-cyan-600/20 rounded-full blur-[100px]"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="w-full px-6 py-4 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-[#0B0F19]/80">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200"></div>
                <img src={mflogo} alt="MiFestival Logo" className="relative w-9 h-9 rounded-lg" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">MiFestival</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden sm:block px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-full text-sm font-bold text-[#0B0F19] bg-white hover:bg-cyan-400 transition transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              Crear Cuenta
            </Link>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Texto Hero */}
            <div className="lg:w-1/2 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
                <SparklesIcon className="w-4 h-4" /> Nueva Generación de Lineups
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                El Festival <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                  De Tus Sueños.
                </span>
              </h1>
              
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Olvídate de las restricciones. Crea el cartel definitivo con <strong>cualquier artista</strong>, sin depender de algoritmos ni Spotify. Diseño profesional en segundos.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-cyan-600 font-lg rounded-xl hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition duration-200"></div>
                  <span className="relative flex items-center gap-2">
                    Crear mi Póster Gratis <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                  </span>
                </Link>
                <button
                  onClick={handleGuest}
                  className="px-8 py-4 rounded-xl text-white font-semibold border border-white/20 hover:bg-white/10 transition backdrop-blur-sm"
                >
                  Probar Demo
                </button>
              </div>
              
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div> 100% Gratis</span>
                <span className="flex items-center gap-2"><BoltIcon className="w-4 h-4 text-yellow-500"/> Instantáneo</span>
                <span className="flex items-center gap-2">HD Download</span>
              </div>
            </div>

            {/* Imagen Hero (Efecto 3D) */}
            <div className="lg:w-1/2 relative perspective-1000">
              <div className="relative transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition duration-500 ease-out">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
                <img
                  src={banner}
                  alt="Interfaz de MiFestival"
                  className="relative w-full rounded-2xl shadow-2xl border border-white/10 bg-[#151923]"
                />
                {/* Elemento flotante decorativo */}
                <div className="absolute -bottom-6 -left-6 bg-[#1a1f2e] border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md hidden md:block animate-bounce-slow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white font-bold">JD</div>
                        <div>
                            <p className="text-white text-sm font-bold">Lineup creado</p>
                            <p className="text-cyan-400 text-xs">hace 2 min</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES (Bento Grid Style) --- */}
      <section className="py-24 bg-[#0B0F19] relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Poderoso. Flexible. <span className="text-cyan-400">Tuyo.</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Todo lo que necesitas para viralizar tu gusto musical en una sola herramienta.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/20 transition"></div>
                <MusicalNoteIcon className="w-12 h-12 text-cyan-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">Libertad Musical Total</h3>
                <p className="text-gray-400">Escribe lo que quieras. Bandas locales, artistas fallecidos o tus guilty pleasures. No dependes de tu historial de Spotify.</p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition"></div>
                <TicketIcon className="w-12 h-12 text-purple-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">Diseño Profesional</h3>
                <p className="text-gray-400">Fondos dinámicos, tipografías de impacto y layouts organizados automáticamente. Parece hecho por un diseñador gráfico.</p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pink-500/30 transition duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-pink-500/20 transition"></div>
                <FireIcon className="w-12 h-12 text-pink-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">Viral Ready</h3>
                <p className="text-gray-400">Exporta en PNG de alta resolución (1080x1920) perfecto para Instagram Stories, TikTok y Twitter. Calidad nítida.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEO CONTENT (Diseñado para no aburrir) --- */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="bg-gradient-to-b from-white/5 to-transparent p-8 md:p-12 rounded-3xl border border-white/5">
                <h2 className="text-3xl font-bold mb-8 text-center text-white">Preguntas Frecuentes</h2>
                <div className="space-y-6">
                    <div className="border-b border-white/10 pb-6">
                        <h3 className="text-lg font-semibold text-cyan-300 mb-2">¿Es realmente gratis?</h3>
                        <p className="text-gray-400 leading-relaxed">Sí, 100%. No hay marcas de agua gigantes ni muros de pago. MiFestival es un proyecto hecho por fans para fans.</p>
                    </div>
                    <div className="border-b border-white/10 pb-6">
                        <h3 className="text-lg font-semibold text-cyan-300 mb-2">¿Necesito Spotify?</h3>
                        <p className="text-gray-400 leading-relaxed">No. Esa es nuestra gran ventaja sobre Instafest. Aquí tú tienes el control manual para agregar exactamente a quien tú quieras, en el orden que quieras.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-300 mb-2">¿Puedo personalizar los días?</h3>
                        <p className="text-gray-400 leading-relaxed">Claro. Puedes configurar festivales de 1, 2 o 3 días, y asignar artistas a diferentes escenarios para crear choques de horarios realistas.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-[#0B0F19] z-0"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">¿Listo para ser el Headliner?</h2>
            <Link
                to="/register"
                className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-black bg-white rounded-full hover:bg-cyan-400 transition transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
                Empezar Ahora
            </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} MiFestival. Desarrollado con pasión.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;