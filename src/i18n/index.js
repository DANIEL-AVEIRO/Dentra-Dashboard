import en from "@/i18n/locales/en.json";

export const LOCALES = {
  en: { label: "English", flag: "EN", dict: en },
};

export const DEFAULT_LOCALE = "en";
export const STORAGE_KEY = "arrow-admin-locale";

function getNested(obj, path) {
  if (!path) return undefined;
  return path.split(".").reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

/** {{name}} interpolation */
export function interpolate(str, vars = {}) {
  if (typeof str !== "string") return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] != null ? String(vars[key]) : ""
  );
}

export function createTranslator(locale) {
  const dict = LOCALES[locale]?.dict ?? LOCALES.en.dict;

  return function t(key, options = {}) {
    const { defaultValue, ...vars } = options;
    let value = getNested(dict, key);
    if (value == null) {
      value = defaultValue ?? key;
    }
    if (typeof value === "object") {
      value = defaultValue ?? key;
    }
    return interpolate(String(value), vars);
  };
}

export function getStoredLocale() {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem("arrow-dashboard-locale");
    if (stored && LOCALES[stored]) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}
