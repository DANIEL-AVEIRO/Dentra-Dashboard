import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "@/theme";
import DatePickerProvider from "@/providers/DatePickerProvider";
import { useBrand } from "@/context/BrandContext";
import { runThemeSwitch } from "@/utils/themeTransition";
import { applyBrandCssVars } from "@/utils/brandPalette";
import "@/styles/global.css";
import "@/styles/print.css";

const ThemeModeContext = createContext(null);

export function AppThemeProvider({ children }) {
  const { colors } = useBrand();
  const [mode, setMode] = useState(
    () =>
      localStorage.getItem("admin-theme") ||
      localStorage.getItem("dashboard-theme") ||
      "light"
  );

  const toggleMode = () => {
    runThemeSwitch(() => {
      flushSync(() => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("admin-theme", next);
          return next;
        });
      });
    });
  };

  const theme = useMemo(() => getTheme(mode, colors), [mode, colors]);

  useEffect(() => {
    applyBrandCssVars(colors);
  }, [colors]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DatePickerProvider>{children}</DatePickerProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeModeContext);
