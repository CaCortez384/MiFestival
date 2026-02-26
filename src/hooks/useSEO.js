// src/hooks/useSEO.js
import { useEffect } from 'react';

/**
 * Custom hook to dynamically set SEO meta tags per page.
 * @param {Object} options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description
 * @param {string} [options.canonical] - Canonical URL
 * @param {boolean} [options.noindex] - If true, adds noindex meta tag
 */
export default function useSEO({ title, description, canonical, noindex = false }) {
    useEffect(() => {
        // Title
        document.title = title;

        // Meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description);
        } else {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            metaDesc.content = description;
            document.head.appendChild(metaDesc);
        }

        // Canonical
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            if (linkCanonical) {
                linkCanonical.setAttribute('href', canonical);
            } else {
                linkCanonical = document.createElement('link');
                linkCanonical.rel = 'canonical';
                linkCanonical.href = canonical;
                document.head.appendChild(linkCanonical);
            }
        }

        // Robots noindex
        let metaRobots = document.querySelector('meta[name="robots"]');
        if (noindex) {
            if (!metaRobots) {
                metaRobots = document.createElement('meta');
                metaRobots.name = 'robots';
                document.head.appendChild(metaRobots);
            }
            metaRobots.setAttribute('content', 'noindex, nofollow');
        } else if (metaRobots) {
            metaRobots.setAttribute('content', 'index, follow');
        }

        // Cleanup: restore defaults when component unmounts
        return () => {
            document.title = 'MiFestival - Crea, Comparte y Vota Lineups de Festivales';
            if (metaDesc) {
                metaDesc.setAttribute('content', 'El generador de carteles de música #1. Crea tu lineup sin Spotify, publícalo en la comunidad, recibe likes y compite por estar en el Top Tendencias. Descarga gratis en HD.');
            }
            if (linkCanonical) {
                linkCanonical.setAttribute('href', 'https://mifestival.web.app/');
            }
            if (metaRobots) {
                metaRobots.setAttribute('content', 'index, follow');
            }
        };
    }, [title, description, canonical, noindex]);
}
