import { Box, Button, alpha, useTheme } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTranslation } from "@/context/LanguageContext";

export default function SettingsThemeToggle({ mode, onToggle }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const isLight = mode === "light";

  const segmentSx = (active) => ({
    minWidth: 92,
    px: 1.5,
    py: 0.75,
    borderRadius: 999,
    fontWeight: 700,
    fontSize: "0.8125rem",
    textTransform: "none",
    gap: 0.75,
    color: active ? primary : "text.secondary",
    bgcolor: active
      ? theme.palette.mode === "light"
        ? "#fff"
        : alpha(primary, 0.18)
      : "transparent",
    boxShadow: active
      ? `0 1px 3px ${alpha(primary, 0.18)}, inset 0 1px 0 ${alpha("#fff", 0.65)}`
      : "none",
    "&:hover": {
      bgcolor: active
        ? theme.palette.mode === "light"
          ? "#fff"
          : alpha(primary, 0.22)
        : alpha(primary, 0.06),
    },
  });

  const setLight = () => {
    if (!isLight) onToggle();
  };

  const setDark = () => {
    if (isLight) onToggle();
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        p: 0.5,
        borderRadius: 999,
        border: 1,
        borderColor: "divider",
        bgcolor:
          theme.palette.mode === "light"
            ? alpha(primary, 0.04)
            : alpha(primary, 0.1),
      }}
    >
      <Button
        size="small"
        startIcon={<Brightness7Icon sx={{ fontSize: "18px !important" }} />}
        onClick={setLight}
        sx={segmentSx(isLight)}
      >
        {t("pages.settings.admin.darkModeOff")}
      </Button>
      <Button
        size="small"
        startIcon={<Brightness4Icon sx={{ fontSize: "18px !important" }} />}
        onClick={setDark}
        sx={segmentSx(!isLight)}
      >
        {t("pages.settings.admin.darkModeOn")}
      </Button>
    </Box>
  );
}
