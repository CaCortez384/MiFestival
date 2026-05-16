// src/utils/analytics.js
// Direct GA4 event tracking via gtag.js (Measurement ID: G-T5T2X1JLFN)

/**
 * Send a custom event directly to GA4.
 * @param {string} eventName - GA4 event name (e.g. 'sign_up', 'login', 'festival_created')
 * @param {Object} params - Additional event parameters
 */
export function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    }
}

/**
 * Track a virtual pageview (useful for SPA route changes).
 * @param {string} pagePath - The current route path
 * @param {string} pageTitle - The current page title
 */
export function trackPageView(pagePath, pageTitle) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
            page_path: pagePath,
            page_title: pageTitle,
        });
    }
}
