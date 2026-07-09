import { IconButton, Tooltip, alpha, useTheme } from "@mui/material";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import { useTranslation } from "@/context/LanguageContext";
import { TABLE_FILTER_HEIGHT } from "@/constants/layout";
import { transition } from "@/constants/motion";

export default function TableDensityToggle({ isCompact, onToggle, disabled = false }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const label = isCompact
    ? t("table.densityComfortable")
    : t("table.densityCompact");

  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          size="small"
          disabled={disabled}
          onClick={onToggle}
          aria-label={t("table.densityToggle")}
          sx={{
            width: TABLE_FILTER_HEIGHT,
            height: TABLE_FILTER_HEIGHT,
            flexShrink: 0,
            border: 1,
            borderColor: "divider",
            color: primary,
            transition: transition("background-color, border-color"),
            "&:hover": {
              bgcolor: alpha(primary, 0.12),
              borderColor: alpha(primary, 0.35),
            },
          }}
        >
          {isCompact ? (
            <ViewComfyIcon sx={{ fontSize: 20 }} />
          ) : (
            <ViewCompactIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}
