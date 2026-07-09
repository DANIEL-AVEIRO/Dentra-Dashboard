import { STORAGE_KEY as LOCALE_KEY } from "@/i18n";

const AUTH_KEYS = ["access_token", "refresh_token"];
const THEME_KEY = "admin-theme";

/**
 * Clear browser storage and HTTP caches. Preserves login and theme by default.
 */
export async function clearBrowserCache({
  preserveAuth = true,
  preserveTheme = true,
  preserveLocale = true,
} = {}) {
  const preserve = new Set();
  if (preserveAuth) AUTH_KEYS.forEach((k) => preserve.add(k));
  if (preserveTheme) preserve.add(THEME_KEY);
  if (preserveLocale) preserve.add(LOCALE_KEY);

  const saved = {};
  preserve.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value != null) saved[key] = value;
  });

  localStorage.clear();
  Object.entries(saved).forEach(([key, value]) => localStorage.setItem(key, value));

  sessionStorage.clear();

  if (typeof caches !== "undefined") {
    const names = await caches.keys();
    await Promise.all(names.map((name) => caches.delete(name)));
  }

  if (typeof navigator !== "undefined" && navigator.serviceWorker) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((reg) => reg.unregister()));
  }
}
