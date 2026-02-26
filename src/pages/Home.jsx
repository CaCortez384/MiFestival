import { useNavigate } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import { trackEvent } from "../utils/analytics";
import mflogo from "../assets/mflogo20.png";
import poster1 from "../assets/poster1.webp";
import poster2 from "../assets/poster2.webp";
import poster3 from "../assets/poster3.webp";
import poster4 from "../assets/poster4.webp";
import poster5 from "../assets/poster5.webp";
import poster6 from "../assets/poster6.webp";
import poster7 from "../assets/poster7.webp";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// Iconos
import { SparklesIcon, ArrowRightIcon, BoltIcon, FireIcon, UserGroupIcon, HeartIcon, GlobeAltIcon, MusicalNoteIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useSEO({
    title: 'MiFestival - Crea, Comparte y Vota Lineups de Festivales',
    description: 'El generador de carteles de música #1. Crea tu lineup sin Spotify, publícalo en la comunidad, recibe likes y compite por estar en el Top Tendencias. Descarga gratis en HD.',
    canonical: 'https://mifestival.web.app/',
  });

  const handleGuest = () => {
    trackEvent('guest_mode_start');
    setUser({ isGuest: true, displayName: "Invitado" });
    navigate("/inicio");
  };

  const posters = [poster1, poster2, poster3, poster4, poster5, poster6, poster7];
  const doubledPosters = [...posters, ...posters];

  return (
    <div className="min-h-screen flex flex-col bg-brutal-base text-[#050510] font-inter selection:bg-yellow-400 selection:text-black overflow-x-hidden border-x-4 border-black max-w-[1600px] mx-auto">

      {/* Fondo de patrón de puntos Brutalista (opcional, le da textura) */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

      {/* --- HEADER --- */}
      <header className="w-full px-4 sm:px-6 py-4 border-b-4 border-black sticky top-0 z-50 bg-brutal-base">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 hover:translate-x-1 hover:-translate-y-1 transition-transform">
            <div className="relative border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
              <img src={mflogo} alt="MiFestival Logo" className="relative w-8 h-8 sm:w-9 sm:h-9 object-cover" />
            </div>
            <span className="text-lg sm:text-xl font-outfit font-black tracking-tight text-black uppercase">MiFestival</span>
          </Link>

          {/* Navegación Responsive */}
          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="px-3 py-2 text-xs sm:text-sm font-bold text-black hover:bg-yellow-100 transition whitespace-nowrap border-2 border-transparent hover:border-black rounded-none"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-xs sm:text-sm bg-yellow-400 brutal-btn"
            >
              <span className="hidden sm:inline">Crear Cuenta</span>
              <span className="sm:hidden">Crear</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-24 lg:pt-32 lg:pb-40 border-b-4 border-black bg-[#FF90E8]">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Texto Hero */}
            <div className="lg:w-1/2 text-center lg:text-left z-10">
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-2 bg-yellow-400 border-4 border-black brutal-title text-xs sm:text-sm mb-6 shadow-[4px_4px_0px_#000]">
                <SparklesIcon className="w-5 h-5 text-black" /> Ahora con Comunidad y Likes
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-8xl brutal-title mb-6 leading-tight md:leading-[0.9] tracking-tighter"
                style={{
                  color: window.innerWidth > 768 ? 'white' : 'black',
                  textShadow: window.innerWidth > 768 ? "4px 4px 0px #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000" : "none"
                }}>
                Crea, <br />
                Comparte & <br />
                <span className="text-yellow-400"
                  style={{
                    textShadow: window.innerWidth <= 768 ? "2px 2px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" : "none"
                  }}>
                  Viraliza.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-black font-bold mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed border-l-4 border-black pl-4">
                Diseña el cartel definitivo sin Spotify. Publica tu lineup en nuestra comunidad global, recibe likes y llega al top de tendencias.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-5 text-lg bg-[#00FF66] brutal-btn w-full sm:w-auto"
                >
                  <span className="flex items-center gap-2">
                    Empezar Gratis <ArrowRightIcon className="w-6 h-6 border-2 border-black bg-white rounded-full p-1" />
                  </span>
                </Link>
                <button
                  onClick={handleGuest}
                  className="px-8 py-5 text-lg bg-white brutal-btn w-full sm:w-auto"
                >
                  Probar Demo
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm font-bold text-black">
                <span className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-[2px_2px_0_#000]"><div className="w-2 h-2 rounded-full bg-green-500"></div> Gratis</span>
                <span className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-[2px_2px_0_#000]"><HeartIcon className="w-4 h-4 text-red-500" /> Comunidad</span>
                <span className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-[2px_2px_0_#000]"><BoltIcon className="w-4 h-4 text-yellow-500" /> Sin Spotify</span>
              </div>
            </div>

            {/* Imagen Hero (Carrusel Animado) */}
            <div className="lg:w-1/2 relative w-full mt-10 lg:mt-0 xl:pl-10">
              <div className="relative transform hover:-translate-y-2 hover:translate-x-2 transition-transform duration-300">
                <div className="absolute top-4 left-4 w-full h-full bg-[#00E5FF] border-4 border-black -z-10"></div>

                {/* Contenedor del Carrusel brutalista */}
                <div className="w-full h-64 sm:h-80 lg:h-[720px] xl:h-[800px] border-4 border-black shadow-[8px_8px_0_#000] bg-black overflow-hidden relative">
                  {/* Carrusel Horizontal (Móvil/Tablet) */}
                  <div className="flex w-max h-full animate-marquee lg:hidden">
                    {doubledPosters.map((src, i) => (
                      <img key={`mobile-${i}`} src={src} className="h-full w-auto object-cover border-r-4 border-black shrink-0" alt={`Poster ${i}`} />
                    ))}
                  </div>

                  {/* Carrusel Vertical Alternado (Escritorio) - 2 Columnas */}
                  <div className="hidden lg:flex w-full h-full gap-4 bg-black p-4">
                    {/* Columna 1 - Sube */}
                    <div className="flex-1 overflow-hidden relative">
                      <div className="flex flex-col gap-4 w-full h-max animate-marquee-vertical">
                        {doubledPosters.map((src, i) => (
                          <img key={`desktop-c1-${i}`} src={src} className="w-full h-auto object-cover border-4 border-black shrink-0 bg-white" alt={`Poster Col 1 - ${i}`} />
                        ))}
                      </div>
                    </div>
                    {/* Columna 2 - Baja */}
                    <div className="flex-1 overflow-hidden relative">
                      <div className="flex flex-col gap-4 w-full h-max animate-marquee-vertical-reverse">
                        {doubledPosters.map((src, i) => (
                          <img key={`desktop-c2-${i}`} src={src} className="w-full h-auto object-cover border-4 border-black shrink-0 bg-white" alt={`Poster Col 2 - ${i}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Etiqueta Flotante Brutalista */}
                <div className="absolute -bottom-6 -left-6 bg-yellow-400 border-4 border-black p-4 brutal-card hidden md:block rotate-[-5deg] animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0_#000]">
                      <HeartIcon className="w-6 h-6 text-red-500 fill-red-500" />
                    </div>
                    <div>
                      <p className="text-black text-sm brutal-title">Top #1 📈</p>
                      <p className="text-black font-bold text-xs uppercase">Primavera Fest</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 border-b-4 border-black bg-[#00E5FF] relative overflow-hidden">
        {/* Decoración geométrica */}
        <div className="absolute top-10 right-10 w-24 h-24 border-8 border-black rounded-full opacity-20 hidden md:block"></div>
        <div className="absolute bottom-10 left-10 w-32 h-12 bg-black opacity-10 hidden md:block transform -rotate-12"></div>

        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-6xl brutal-title mb-6 leading-tight">Mucho más que <br className="md:hidden" /><span className="bg-yellow-400 px-4 border-4 border-black inline-block transform rotate-2">una app.</span></h2>
            <p className="text-black font-bold text-lg md:text-xl max-w-2xl mx-auto border-4 border-black bg-white p-4 shadow-[4px_4px_0_#000]">La mejor alternativa a Instafest. Únete a miles de creadores, descubre música nueva y comparte tu visión.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-white p-8 brutal-card transform hover:-translate-y-2 hover:translate-x-2 transition-all duration-200">
              <div className="w-16 h-16 bg-[#FF90E8] border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0_#000]">
                <MusicalNoteIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl brutal-title mb-4">Libertad Musical</h3>
              <p className="text-black font-semibold text-sm leading-relaxed border-t-2 border-black pt-4">Escribe lo que quieras. Bandas locales, artistas indie o headliners mundiales. No dependes de tu historial de escucha.</p>
            </div>

            <div className="bg-yellow-400 p-8 brutal-card transform hover:-translate-y-2 hover:translate-x-2 transition-all duration-200 relative md:-top-6">
              <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0_#000]">
                <UserGroupIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl brutal-title mb-4">Comunidad Viral</h3>
              <p className="text-black font-semibold text-sm leading-relaxed border-t-2 border-black pt-4">Publica tu festival en nuestra galería global. Recibe likes, sube en el ranking de tendencias y compite con otros.</p>
            </div>

            <div className="bg-white p-8 brutal-card transform hover:-translate-y-2 hover:translate-x-2 transition-all duration-200">
              <div className="w-16 h-16 bg-[#00FF66] border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0_#000]">
                <FireIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl brutal-title mb-4">Calidad HD</h3>
              <p className="text-black font-semibold text-sm leading-relaxed border-t-2 border-black pt-4">Exporta en PNG de alta resolución (1080x1920) perfecto para IG Stories o TikTok. Cero marcas de agua.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEO CONTENT & FAQ --- */}
      <section className="py-24 border-b-4 border-black bg-brutal-base">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

          {/* Texto descriptivo para Google */}
          <div className="mb-20 text-center md:text-left bg-white brutal-card p-8 md:p-12">
            <h2 className="text-4xl brutal-title mb-6">El Creador de Carteles de Festivales Online #1</h2>
            <div className="prose prose-lg text-black font-semibold max-w-none">
              <p className="mb-4">
                ¿Alguna vez has soñado con organizar tu propio evento musical? <strong className="font-outfit uppercase">MiFestival</strong> es la herramienta gratuita que te permite convertirte en promotor por un día. A diferencia de otros generadores automáticos, aquí tienes el <strong className="bg-[#FF90E8] px-1">control total</strong>.
              </p>
              <p>
                No necesitas conectar tu cuenta de Spotify ni Apple Music. Simplemente ingresa los nombres de tus artistas favoritos, organiza los escenarios por días y personaliza el estilo visual. Tu imaginación es el límite.
              </p>
            </div>
          </div>

          {/* Grid FAQ */}
          <div>
            <div className="flex items-center gap-4 mb-10 justify-center md:justify-start">
              <div className="bg-[#00E5FF] p-2 border-4 border-black shadow-[4px_4px_0_#000]">
                <QuestionMarkCircleIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-4xl brutal-title">FAQ</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#FFD500] brutal-card p-6">
                <h4 className="text-xl brutal-title mb-3">¿Es realmente gratis?</h4>
                <p className="text-black font-semibold text-sm leading-relaxed border-t-2 border-black pt-3">Sí, 100%. Puedes crear, editar y descargar tantos pósters como quieras. Cero muros de pago.</p>
              </div>
              <div className="bg-white brutal-card p-6">
                <h4 className="text-xl brutal-title mb-3">¿Ranking social?</h4>
                <p className="text-black font-semibold text-sm leading-relaxed border-t-2 border-black pt-3">Al marcar un festival como "Público", aparece en Explorar. Los usuarios pueden darle Like y subirlo a Tendencias.</p>
              </div>
              <div className="bg-white brutal-card p-6">
                <h4 className="text-xl brutal-title mb-3">¿Necesito Spotify?</h4>
                <p className="text-black font-semibold text-sm leading-relaxed border-t-2 border-black pt-3">No. Es ideal si prefieres hacer carteles a mano, usas Youtube o quieres mezclar artistas imposibles.</p>
              </div>
              <div className="bg-[#FF90E8] brutal-card p-6">
                <h4 className="text-xl brutal-title mb-3">¿Fondo personalizable?</h4>
                <p className="text-black font-semibold text-sm leading-relaxed border-t-2 border-black pt-3">Tenemos temas brutales (Cyber, Retro, Desierto) que adaptan colores y tipografías al instante.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 bg-[#00FF66] border-b-4 border-black relative overflow-hidden">
        {/* Banner de texto moviéndose */}
        <div className="absolute top-0 w-full overflow-hidden border-b-4 border-black bg-white p-2 flex whitespace-nowrap">
          <div className="animate-marquee">
            <p className="text-black font-bold uppercase tracking-widest opacity-50 shrink-0 px-4">
              CREA TU CARTEL • DESCUBRE LINEUPS • MÚSICA SIN LÍMITES • TOTALMENTE GRATIS • CREA TU CARTEL • DESCUBRE LINEUPS •
            </p>
            <p className="text-black font-bold uppercase tracking-widest opacity-50 shrink-0 px-4" aria-hidden="true">
              CREA TU CARTEL • DESCUBRE LINEUPS • MÚSICA SIN LÍMITES • TOTALMENTE GRATIS • CREA TU CARTEL • DESCUBRE LINEUPS •
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 text-center mt-10 relative z-10">
          <h2 className="text-4xl md:text-8xl brutal-title mb-10 text-white drop-shadow-[2px_2px_0_#000] md:drop-shadow-none"
            style={{ textShadow: window.innerWidth > 768 ? "4px 4px 0px #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000" : "2px 2px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
            ¿Listo para <br />el Main Stage?
          </h2>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-12 py-6 text-2xl md:text-3xl bg-yellow-400 brutal-btn"
          >
            HACER FESTIVAL AHORA
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full py-10 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm font-bold text-black uppercase tracking-widest border-t-4 border-black pt-10">
          <p>© {new Date().getFullYear()} MiFestival. HAZ RUIDO.</p>
          <div className="flex gap-6 mt-6 md:mt-0">
            <span className="hover:bg-yellow-400 px-2 border-2 border-transparent hover:border-black transition cursor-pointer">Privacidad</span>
            <span className="hover:bg-pink-400 px-2 border-2 border-transparent hover:border-black transition cursor-pointer">Términos</span>
            <a href="https://github.com/CaCortez384" target="_blank" rel="noreferrer" className="hover:bg-cyan-400 px-2 border-2 border-transparent hover:border-black transition">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;