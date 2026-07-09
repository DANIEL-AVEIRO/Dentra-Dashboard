import { CircularProgress, IconButton, Tooltip, useTheme } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTranslation } from "@/context/LanguageContext";
import { TABLE_FILTER_HEIGHT } from "@/constants/layout";

export default function TableRefreshButton({
  onRefresh,
  refreshing = false,
  disabled = false,
  sx,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  if (!onRefresh) return null;

  const iconBtnSx = {
    width: TABLE_FILTER_HEIGHT,
    height: TABLE_FILTER_HEIGHT,
    border: 1,
    borderColor: "divider",
    color: primary,
    ...sx,
  };

  return (
    <Tooltip title={t("table.refreshHint")}>
      <span>
        <IconButton
          size="small"
          disabled={disabled || refreshing}
          onClick={onRefresh}
          aria-label={t("table.refresh")}
          sx={iconBtnSx}
        >
          {refreshing ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <RefreshIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}
