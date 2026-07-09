import { useTheme } from "@mui/material";

export function useBrandColors() {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const dark = theme.palette.primary.dark;
  const darker =
    (typeof document !== "undefined" &&
      getComputedStyle(document.documentElement).getPropertyValue("--brand-darker").trim()) ||
    dark;

  return { primary, secondary, dark, darker };
}
