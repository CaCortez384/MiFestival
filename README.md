# MiFestival — Platform Architecture & Engine

## El Problema y el Impacto

MiFestival es una aplicación web B2C de entretenimiento orientada a la generación interactiva y personalización de afiches de festivales de música ficticios, inspirada en la dinámica de consumo viral de InstaFest popularizada hacia el año 2023. El producto aborda la necesidad de consumo recreativo y contenido social auto-expresivo, permitiendo a los usuarios componer line-ups musicales a medida y generar piezas gráficas personalizadas directamente desde el navegador de forma ágil y lúdica. La plataforma actúa como un motor de enganche comunitario (social engagement), combinando renderizado dinámico en el cliente con almacenamiento distribuido Serverless para la preservación y compartición de afiches en redes sociales.

## Arquitectura y Stack Tecnológico

La arquitectura de la aplicación adopta un modelo decoupled/serverless centrado en el cliente, optimizado para alto rendimiento de renderizado en UI y baja latencia de respuesta:

* **React 19 & Vite 6**: Núcleo de renderizado declarativo y entorno de construcción optimizado (HMR y empaquetado de producción minificado) para una interfaz de usuario reactiva y fluida.
* **React Router 7**: Enrutador declarativo client-side que gestiona la navegación de la SPA, el middleware de modo mantenimiento dinámico y la captura automática de eventos de navegación.
* **Firebase 11 (Firestore & Auth)**: Plataforma Backend-as-a-Service (BaaS) encargada de la autenticación de usuarios (Google OAuth / Email-Password) y la base de datos NoSQL distribuida Firestore para la persistencia en tiempo real de festivales y listas de artistas.
* **Tailwind CSS v4 & Heroicons**: Motor de diseño utilitario para la construcción de interfaces responsivas de alta fidelidad con soporte para esquemas visuales personalizados en escritorio y dispositivos móviles.
* **html-to-image**: Motor de rasterización en el cliente que transforma nodos del DOM en archivos de imagen (PNG/JPEG) en alta resolución para su descarga inmediata o distribución en redes sociales.
* **PapaParse**: Parser sintáctico de archivos CSV en el navegador para la importación y procesamiento estructurado masivo de listas de artistas.
* **Firebase Hosting**: Infraestructura CDN global optimizada para el despliegue de activos estáticos y la reescritura de peticiones HTTP al punto de entrada único (`index.html`).

## Guía de Despliegue a Prueba de Fallos (Instalación Local)

Para ejecutar y validar la aplicación en un entorno de desarrollo local, siga de manera estricta la secuencia de comandos descrita a continuación:

### 1. Prerrequisitos de Sistema
* Node.js v18.0.0 o superior
* npm v9.0.0 o superior

### 2. Clonación e Instalación de Dependencias
```bash
git clone <URL_DEL_REPOSITORIO>
cd MiFestival
npm install
```

### 3. Configuración de Variables de Entorno
Es **obligatorio** crear un archivo `.env` en la raíz del proyecto a partir de la plantilla provista `.env.example`.

```bash
cp .env.example .env
```

Asegúrese de definir las variables según el estado operativo requerido:
```env
# Modo mantenimiento (true: bloquea la SPA y muestra la vista de mantenimiento; false: operación normal)
VITE_MAINTENANCE=false
```

### 4. Ejecución del Servidor de Desarrollo
Para iniciar el servidor local con Hot Module Replacement (HMR):

```bash
npm run dev
```

El servidor estará disponible por defecto en `http://localhost:5173`.

### 5. Validación de Código y Construcción para Producción
Ejecute la verificación de calidad de código y el empaquetado de artefactos estáticos:

```bash
# Análisis estático de código
npm run lint

# Generación del bundle de producción en el directorio /dist
npm run build

# Vista previa local del build de producción
npm run preview
```

---

## Estructura del Repositorio

El proyecto está estructurado bajo principios de modularidad por responsabilidades claras dentro del directorio `src/`:

```text
.
├── .env.example              # Plantilla de variables de entorno del cliente.
├── .firebaserc               # Selección del proyecto activo en Firebase CLI.
├── eslint.config.js          # Reglas y estándares de linter para React/JS.
├── firebase.json             # Configuración del servidor de hosting estático y reescritura SPA.
├── index.html                # Estructura HTML base y puntos de montaje DOM.
├── package.json              # Manifiesto de dependencias y scripts de ejecución npm.
├── vite.config.js            # Configuración del pipeline de construcción de Vite.
└── src/
    ├── App.jsx               # Orquestador de rutas principales, middleware y rastreador de tráfico.
    ├── main.jsx              # Punto de entrada de hidratación de React en el DOM.
    ├── firebase.js           # Inicialización de Firebase SDK (Auth, Firestore y Google Provider).
    ├── index.css             # Directivas globales de Tailwind CSS y diseño base.
    ├── context/
    │   └── AuthContext.jsx   # Proveedor de estado global para la sesión de usuario y autenticación.
    ├── hooks/
    │   └── useSEO.js         # Hook personalizado para inyección dinámica de meta-tags y Open Graph.
    ├── pages/                # Vistas y controladores de interfaz de la aplicación:
    │   ├── Home.jsx          # Landing page principal y llamada a la acción.
    │   ├── Inicio.jsx        # Panel de control de bienvenida para usuarios autenticados.
    │   ├── CreateFestival.jsx# Flujo interactivo para la creación de un nuevo festival.
    │   ├── EditarFestival.jsx# Editor dinámico de line-up, arrastre de artistas y escenarios.
    │   ├── Festival.jsx      # Visualizador del festival y gestor de asignaciones.
    │   ├── VerFestival.jsx   # Vista pública/compartible optimizada para consumo externo.
    │   ├── PosterFestival.jsx# Canvas de renderizado y exportación de afiches gráficos.
    │   ├── Explorar.jsx      # Catálogo de festivales públicos creados por la comunidad.
    │   ├── MisFestivales.jsx # Colección personal de festivales guardados por el usuario.
    │   ├── Perfil.jsx        # Gestión del perfil de usuario y configuraciones de cuenta.
    │   ├── Login.jsx         # Controlador de inicio de sesión de usuario.
    │   ├── Register.jsx      # Controlador de registro de usuarios.
    │   ├── Restablecer.jsx   # Recuperación y restablecimiento de credenciales.
    │   └── Mantenimiento.jsx # Pantalla de bloqueo operativa activada vía VITE_MAINTENANCE.
    └── utils/
        └── analytics.js      # Módulo de integración de telemetría y eventos con Google Tag Manager / GA4.
```