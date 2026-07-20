import { createContext, useContext, useMemo } from "react";
import {
  createTranslator,
  DEFAULT_LOCALE,
  LOCALES,
} from "@/i18n";

const LanguageContext = createContext(null);

const noopSetLocale = () => {};

export function LanguageProvider({ children }) {
  const t = useMemo(() => createTranslator(DEFAULT_LOCALE), []);

  const value = useMemo(
    () => ({
      locale: DEFAULT_LOCALE,
      setLocale: noopSetLocale,
      t,
      locales: LOCALES,
    }),
    [t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    const t = createTranslator(DEFAULT_LOCALE);
    return {
      t,
      locale: DEFAULT_LOCALE,
      setLocale: noopSetLocale,
      locales: LOCALES,
    };
  }
  return ctx;
}
