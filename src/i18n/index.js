import en from "@/i18n/locales/en.json";

export const LOCALES = {
  en: { label: "English", flag: "EN", dict: en },
};

export const DEFAULT_LOCALE = "en";
/** Kept for cacheClear preserve list; locale is English-only. */
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

export function createTranslator(_locale) {
  const dict = LOCALES.en.dict;

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

/** English only — ignores any stored locale. */
export function getStoredLocale() {
  return DEFAULT_LOCALE;
}
