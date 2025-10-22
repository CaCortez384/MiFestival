import { useContext } from "react";
import { Navigate, Link } from "react-router-dom"; // Import Link
import { auth } from "../firebase";
import mflogo from "../assets/mflogo20.png";
// import mfbanner from "../assets/bailando.webp"; // Eliminamos el banner para un look más limpio
import { AuthContext } from "../context/AuthContext";
// NUEVO: Importamos iconos (Asegúrate que @heroicons/react está instalado o usa emojis)
import { PlusCircleIcon, ListBulletIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

// MODIFICADO: Acciones rápidas con iconos importados y sin colores de fondo complejos
const quickActions = [
  {
    title: "Crear Nuevo Festival",
    desc: "Empieza a diseñar tu próximo evento.",
    icon: <PlusCircleIcon className="w-8 h-8 text-cyan-600 mb-2" />, // Icono
    href: "/crear-festival",
    disabled: false, // Asegurarse que esté habilitado
  },
  {
    title: "Mis Festivales",
    desc: "Ver y editar tus creaciones guardadas.",
    icon: <ListBulletIcon className="w-8 h-8 text-cyan-600 mb-2" />, // Icono
    href: "/mis-festivales",
    disabled: false,
  },
  {
    title: "Mi Perfil",
    desc: "Gestiona tu información de cuenta.",
    icon: <UserCircleIcon className="w-8 h-8 text-gray-400 mb-2" />, // Icono gris (deshabilitado)
    href: "#", // Enlace '#' ya que está deshabilitado funcionalmente por ahora
    disabled: true // Mantenemos deshabilitado funcionalmente, pero lo mostraremos
  }
];

// Eliminamos la lista de tips por simplicidad

const Inicio = () => {
  const { user, setUser } = useContext(AuthContext);

  // Pantalla de carga mientras se verifica el usuario
  if (user === undefined) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Cargando...</p> {/* Mensaje simple */}
        </div>
    );
  }
  // Redirige si no hay usuario
  if (!user) return <Navigate to="/home" replace />; // Usa replace para no guardar en historial

  // Cierre de sesión (sin cambios lógicos)
  const handleLogout = async () => {
    try {
        if (user.isGuest) {
            setUser(null); // Limpia el usuario invitado del contexto
            // No necesitamos navegar aquí, el componente se re-renderizará y el !user redirigirá
        } else {
            await auth.signOut();
            // El onAuthStateChanged se encargará de actualizar el user a null,
            // y el componente se re-renderizará, redirigiendo
        }
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        // Podrías mostrar un mensaje al usuario aquí si falla el signOut
    }
  };

  return (
    // MODIFICADO: Fondo limpio consistente
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      {/* MODIFICADO: Estilo consistente, botón de cerrar sesión */}
      <header className="w-full px-4 sm:px-6 py-3 border-b border-gray-100 sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={mflogo} alt="MiFestival Logo" className="w-8 h-8 rounded-md" />
            <span className="text-lg font-bold text-gray-900">MiFestival</span>
          </Link>
          <button
            onClick={handleLogout}
            // MODIFICADO: Botón simple para cerrar sesión
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Salir
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="max-w-3xl mx-auto"> {/* Centra el contenido */}
          {/* Mensaje de Bienvenida */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              ¡Hola, {user.displayName || "Usuario"}!
            </h1>
            <p className="text-lg text-gray-600">
              Bienvenido a tu panel de MiFestival. ¿Qué quieres hacer hoy?
            </p>
          </div>

          {/* Aviso Invitado */}
          {/* MODIFICADO: Estilo más sutil y alineado */}
          {user.isGuest && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md p-4 mb-8 flex items-start gap-3">
              <span className="mt-0.5">⚠️</span> {/* Emoji o icono */}
              <div>
                <span className="font-semibold">Modo Invitado:</span> Tus festivales se perderán al cerrar o recargar la página. <Link to="/register" className="font-medium underline hover:text-yellow-900">Regístrate gratis</Link> para guardarlos.
              </div>
            </div>
          )}

          {/* Acciones Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.disabled ? '#' : action.href} // Enlace '#' si está deshabilitado
                // MODIFICADO: Tarjetas limpias, estilo hover sutil
                className={`
                  block bg-white rounded-lg shadow border border-gray-100 p-6 transition duration-200 ease-in-out
                  ${action.disabled
                    ? 'opacity-60 cursor-not-allowed grayscale' // Estilo deshabilitado
                    : 'hover:shadow-md hover:border-gray-200 hover:-translate-y-1' // Estilo habilitado hover
                  }
                `}
                onClick={(e) => action.disabled && e.preventDefault()} // Previene navegación si está deshabilitado
                aria-disabled={action.disabled}
              >
                {action.icon}
                <h3 className="text-base font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.desc}</p>
              </Link>
            ))}
          </div>

          {/* Eliminamos la sección de Tips */}

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

export default Inicio;