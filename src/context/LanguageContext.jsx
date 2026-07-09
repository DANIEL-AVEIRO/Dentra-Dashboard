import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  createTranslator,
  DEFAULT_LOCALE,
  getStoredLocale,
  LOCALES,
  STORAGE_KEY,
} from "@/i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(getStoredLocale);

  const setLocale = useCallback((next) => {
    if (!LOCALES[next]) return;
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = next;
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      locales: LOCALES,
    }),
    [locale, setLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    const t = createTranslator(DEFAULT_LOCALE);
    return { t, locale: DEFAULT_LOCALE, setLocale: () => {}, locales: LOCALES };
  }
  return ctx;
}
