/** Optional Sentry — set VITE_SENTRY_DSN in production. */

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || "";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function initErrorMonitoring() {
  if (!SENTRY_DSN || typeof window === "undefined" || window.Sentry) return;
  try {
    await loadScript("https://browser.sentry-cdn.com/9.15.0/bundle.min.js");
    window.Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
    });
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[errorMonitoring] Sentry load failed:", err);
    }
  }
}

export function captureException(error, context = {}) {
  if (window.Sentry?.captureException) {
    window.Sentry.captureException(error, { extra: context });
  }
}
