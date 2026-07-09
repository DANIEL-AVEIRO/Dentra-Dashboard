import { Box, LinearProgress, alpha, useTheme } from "@mui/material";

export default function TopLoadingBar({ active }) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  return (
    <Box
      aria-hidden={!active}
      aria-live="polite"
      className="no-theme-transition"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.tooltip + 10,
        height: 3,
        pointerEvents: "none",
        opacity: active ? 1 : 0,
        transition: "opacity 0.4s cubic-bezier(0.33, 1, 0.68, 1)",
      }}
    >
      <LinearProgress
        variant={active ? "indeterminate" : "determinate"}
        value={active ? undefined : 0}
        sx={{
          height: 3,
          bgcolor: alpha(primary, theme.palette.mode === "light" ? 0.12 : 0.25),
          "& .MuiLinearProgress-bar": {
            background: `linear-gradient(90deg, ${primary} 0%, ${secondary} 50%, ${primary} 100%)`,
            backgroundSize: "200% 100%",
            animation: active ? "arrowBarShimmer 1.2s ease-in-out infinite" : "none",
          },
          "@keyframes arrowBarShimmer": {
            "0%": { backgroundPosition: "100% 0" },
            "100%": { backgroundPosition: "-100% 0" },
          },
        }}
      />
    </Box>
  );
}
