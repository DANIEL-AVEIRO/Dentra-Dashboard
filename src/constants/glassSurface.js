import { alpha } from "@mui/material/styles";
import { transition } from "@/constants/motion";

function paletteBrand(theme) {
  return {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
  };
}

export const glassCardSx = (theme) => {
  const isLight = theme.palette.mode === "light";
  const { primary, secondary } = paletteBrand(theme);
  const paper = theme.palette.background.paper;
  const surface = theme.palette.background.default;

  return {
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    background: isLight
      ? `linear-gradient(145deg, ${alpha("#ffffff", 0.94)} 0%, ${alpha(primary, 0.04)} 55%, ${alpha(secondary, 0.03)} 100%)`
      : `linear-gradient(145deg, ${alpha(paper, 0.94)} 0%, ${alpha(primary, 0.14)} 55%, ${alpha(surface, 0.88)} 100%)`,
    border: `1px solid ${alpha(primary, isLight ? 0.1 : 0.22)}`,
    boxShadow: isLight
      ? `0 4px 24px ${alpha(primary, 0.08)}, inset 0 1px 0 ${alpha("#fff", 0.85)}`
      : `0 8px 32px ${alpha("#000", 0.35)}, inset 0 1px 0 ${alpha("#fff", 0.06)}`,
    transition: transition("box-shadow, border-color, transform"),
    "&:hover": {
      borderColor: alpha(primary, isLight ? 0.18 : 0.32),
      boxShadow: isLight
        ? `0 8px 28px ${alpha(primary, 0.12)}, inset 0 1px 0 ${alpha("#fff", 0.9)}`
        : `0 12px 36px ${alpha("#000", 0.45)}, inset 0 1px 0 ${alpha("#fff", 0.08)}`,
    },
  };
};

export const glassPanelSx = (theme) => ({
  ...glassCardSx(theme),
  borderRadius: 2,
});

export const glassAccentBarSx = (theme) => {
  const { primary, secondary } = paletteBrand(theme);
  return {
    width: 48,
    height: 4,
    borderRadius: 999,
    background: `linear-gradient(90deg, ${primary}, ${secondary})`,
  };
};
