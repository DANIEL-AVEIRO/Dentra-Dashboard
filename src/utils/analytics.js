/** Lightweight analytics — enable with VITE_ANALYTICS_ID in production. */

const ANALYTICS_ID = import.meta.env.VITE_ANALYTICS_ID || "";
let gtagLoading = false;

function ensureGtag() {
  if (!ANALYTICS_ID || typeof window === "undefined" || window.gtag || gtagLoading) return;
  gtagLoading = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", ANALYTICS_ID, { send_page_view: false });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ANALYTICS_ID)}`;
  document.head.appendChild(script);
}

export function initAnalytics() {
  if (!ANALYTICS_ID || typeof window === "undefined") return;
  window.__arrowAnalyticsId = ANALYTICS_ID;
  ensureGtag();
}

export function trackPageView(path) {
  if (!ANALYTICS_ID || typeof window === "undefined") return;
  if (window.gtag) {
    window.gtag("event", "page_view", { page_path: path });
  }
}

export function trackEvent(name, params = {}) {
  if (!ANALYTICS_ID || typeof window === "undefined") return;
  if (window.gtag) {
    window.gtag("event", name, params);
  }
}

export function trackError(error, context = {}) {
  if (import.meta.env.DEV) {
    console.error("[trackError]", error, context);
  }
  if (typeof window !== "undefined" && window.__arrowCaptureException) {
    window.__arrowCaptureException(error, context);
  }
  trackEvent("exception", {
    description: error?.message || String(error),
    ...context,
  });
}

if (typeof window !== "undefined") {
  window.__arrowTrackError = trackError;
}
