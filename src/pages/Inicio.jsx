import { useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import mflogo from "../assets/mflogo20.png";
import { AuthContext } from "../context/AuthContext";
import useSEO from "../hooks/useSEO";
import { trackEvent } from "../utils/analytics";
// Iconos
import {
  PlusCircleIcon,
  ListBulletIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon, // Nuevo icono para el banner
  HeartIcon // Nuevo icono para el banner
} from '@heroicons/react/24/outline';

const getQuickActions = (isGuest) => [
  {
    title: "Crear Nuevo Festival",
    desc: "Empieza a diseñar tu próximo evento.",
    icon: <PlusCircleIcon className="w-12 h-12 text-black mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />,
    href: "/crear-festival",
    disabled: false,
    colorClass: "bg-[#00FF66] hover:bg-white"
  },
  {
    title: "Mis Festivales",
    desc: isGuest ? "Necesitas cuenta para guardar." : "Ver y editar tus creaciones guardadas.",
    icon: <ListBulletIcon className="w-12 h-12 text-black mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />,
    href: "/mis-festivales",
    disabled: isGuest,
    colorClass: "bg-[#FF90E8] hover:bg-white"
  },
  {
    title: "Explorar",
    desc: "Descubre festivales de la comunidad.",
    icon: <GlobeAltIcon className="w-12 h-12 text-black mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />,
    href: "/explorar",
    disabled: false,
    colorClass: "bg-yellow-400 hover:bg-white"
  },
  {
    title: "Mi Perfil",
    desc: isGuest ? "Necesitas cuenta para acceder." : "Estadísticas y ajustes de cuenta.",
    icon: <UserCircleIcon className="w-12 h-12 text-black mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />,
    href: "/perfil",
    disabled: isGuest,
    colorClass: "bg-[#00E5FF] hover:bg-white"
  }
];

const Inicio = () => {
  const { user, setUser } = useContext(AuthContext);

  useSEO({
    title: 'Mi Panel | MiFestival',
    description: 'Panel de control de MiFestival. Crea festivales, explora la comunidad y gestiona tus lineups.',
    noindex: true,
  });

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brutal-base font-inter">
        <p className="text-black font-bold animate-pulse text-2xl uppercase border-4 border-black bg-yellow-400 p-4 shadow-[8px_8px_0_#000]">Cargando...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/home" replace />;

  const handleLogout = async () => {
    try {
      trackEvent('logout', { method: user.isGuest ? 'guest' : 'authenticated' });
      if (user.isGuest) {
        setUser(null);
      } else {
        await auth.signOut();
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brutal-base text-[#050510] font-inter selection:bg-yellow-400 selection:text-black relative overflow-x-hidden border-x-4 border-black max-w-[1600px] mx-auto">

      {/* Fondo Textura */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

      {/* --- HEADER --- */}
      <header className="w-full px-4 sm:px-6 py-4 border-b-4 border-black sticky top-0 z-50 bg-brutal-base">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <Link to="/" className="flex items-center gap-3 shrink-0 hover:translate-x-1 hover:-translate-y-1 transition-transform">
            <div className="relative border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
              <img src={mflogo} alt="MiFestival Logo" className="relative w-8 h-8 sm:w-9 sm:h-9 object-cover" />
            </div>
            <span className="text-lg sm:text-xl font-outfit font-black tracking-tight text-black uppercase hidden sm:block">MiFestival</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black border-2 border-black hover:bg-yellow-400 shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Salir
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 md:py-16 max-w-6xl">

        {/* Bienvenida + CTA Texto */}
        <div className="mb-12 text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#00E5FF] border-4 border-black brutal-card p-6 md:p-12 relative overflow-hidden w-full">
          {/* Geometría Decorativa */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 border-4 border-black rounded-full mix-blend-multiply opacity-50 hidden md:block"></div>

          <div className="relative z-10 w-full overflow-hidden">
            <h1 className="text-4xl sm:text-5xl md:text-6xl brutal-title mb-4 flex flex-col md:block items-start gap-2">
              <span>Hola,</span>
              <span className="bg-white border-2 border-black px-2 py-1 inline-block transform -rotate-2 max-w-[95%] sm:max-w-full truncate align-bottom mt-2 md:mt-0">
                {user.displayName || "Usuario"}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-black font-semibold max-w-xl leading-relaxed mt-4 sm:mt-6 border-l-4 border-black pl-4">
              El escenario es tuyo. Diseña carteles, envíalos a tendencias y descubre nueva música.
            </p>
          </div>
          <Link to="/crear-festival" className="w-full md:w-auto flex justify-center items-center gap-2 text-lg bg-yellow-400 brutal-btn px-6 sm:px-8 py-4 shrink-0">
            <SparklesIcon className="w-6 h-6" />
            ACTUAR AHORA
          </Link>
        </div>

        {/* Aviso Invitado */}
        {user.isGuest && (
          <div className="bg-white border-4 border-black shadow-[4px_4px_0_#000] p-4 mb-10 flex items-start gap-4">
            <div className="bg-yellow-400 p-2 border-2 border-black">
              <ExclamationTriangleIcon className="w-6 h-6 text-black" />
            </div>
            <div>
              <h4 className="font-outfit font-black uppercase text-xl text-black mb-1">Modo Demo</h4>
              <p className="text-black font-semibold text-sm">
                No se guardará nada al salir. <Link to="/register" className="font-bold underline hover:bg-yellow-400 inline-block px-1 border-black transition">Crea cuenta gratis</Link>.
              </p>
            </div>
          </div>
        )}

        {/* --- NUEVO BANNER: LANZAMIENTO COMUNIDAD --- */}
        <div className="bg-white border-4 border-black p-6 md:p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[8px_8px_0_#000] relative">
          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00FF66] border-2 border-black text-black text-xs font-black uppercase tracking-wider mb-4 shadow-[2px_2px_0_#000] transform -rotate-2">
              <SparklesIcon className="w-4 h-4" /> NOVEDAD GLOBAL
            </div>
            <h2 className="text-3xl brutal-title mb-3">La Comunidad está Viva</h2>
            <p className="text-black font-semibold text-base leading-relaxed max-w-xl border-l-4 border-black pl-4">
              Ahora los festivales pueden ser <strong>PÚBLICOS</strong>. Pon el tuyo en la galería, recolecta "Likes" y sube posiciones en Tendencias.
            </p>
            <div className="flex flex-wrap gap-4 mt-6 text-sm font-black uppercase tracking-wide text-black bg-yellow-400 w-fit p-2 border-2 border-black">
              <span className="flex items-center gap-1"><GlobeAltIcon className="w-5 h-5" /> Publica</span>
              <span className="flex items-center gap-1"><HeartIcon className="w-5 h-5" /> Likes</span>
              <span className="flex items-center gap-1"><FireIcon className="w-5 h-5" /> Ranking</span>
            </div>
          </div>

          <Link to="/explorar" className="w-full md:w-auto bg-[#FF90E8] brutal-btn px-8 py-5 text-xl relative z-10">
            EXPLORAR GALERÍA →
          </Link>
        </div>

        {/* --- SECTION 1: ACCIONES PRINCIPALES --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {getQuickActions(user.isGuest).map((action, i) => (
            <Link
              key={i}
              to={action.disabled ? '#' : action.href}
              className={`
                group relative block brutal-card p-6 md:p-8 transition-transform duration-200 overflow-hidden
                ${action.disabled
                  ? 'opacity-50 cursor-not-allowed bg-gray-200'
                  : `hover:-translate-y-2 hover:translate-x-2 ${action.colorClass}`
                }
              `}
              onClick={(e) => action.disabled && e.preventDefault()}
            >
              <div className="relative z-10 flex flex-col h-full bg-white border-2 border-black p-4 shadow-[4px_4px_0_#000] group-hover:shadow-[0_0_0_#000] group-hover:translate-y-1 group-hover:translate-x-1 transition-all">
                {action.icon}
                <h3 className="text-xl brutal-title mb-2 mt-4">{action.title}</h3>
                <p className="text-sm font-semibold text-black/70 leading-relaxed border-t-2 border-dashed border-black pt-2">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* --- SECTION 2: INSPIRACIÓN VISUAL (Ocultamos esto por redundancia con el estilo o simplificamos) --- */}

        {/* --- SECTION 3: PRO TIPS --- */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0_#000] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row gap-8 items-start">
          <div className="bg-[#FFD500] border-4 border-black p-4 shadow-[4px_4px_0_#000] shrink-0 transform -rotate-3">
            <SparklesIcon className="w-12 h-12 text-black" />
          </div>
          <div>
            <h3 className="text-3xl brutal-title mb-6">¿Cómo hacer que tu cartel sea viral?</h3>
            <ul className="space-y-4 text-black font-semibold text-lg leading-relaxed">
              <li className="flex items-start gap-3 bg-[#f5f5f0] p-3 border-l-4 border-indigo-500">
                <span className="text-2xl">🔥</span>
                <span>Mezcla géneros imposibles para generar debate en comentarios.</span>
              </li>
              <li className="flex items-start gap-3 bg-[#f5f5f0] p-3 border-l-4 border-pink-500">
                <span className="text-2xl">🎪</span>
                <span>Prioriza un solo nombre potente por día para impactar (Headliners).</span>
              </li>
              <li className="flex items-start gap-3 bg-[#f5f5f0] p-3 border-l-4 border-green-500">
                <span className="text-2xl">🌍</span>
                <span>Al guardar, marca el switch "Público" para entrar de cabeza al Ranking Global.</span>
              </li>
            </ul>
          </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full py-8 text-center text-sm font-black uppercase tracking-widest text-black border-t-4 border-black bg-white mt-20">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} MiFestival. HAZ RUIDO.
        </div>
      </footer>
    </div>
  );
};

export default Inicio;