import { useEffect, useRef } from "react";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useTranslation } from "@/context/LanguageContext";
import { TABLE_FILTER_HEIGHT } from "@/constants/layout";

const INTERVALS = [0, 30, 60, 120];

export default function TableAutoRefresh({
  onRefresh,
  disabled = false,
  intervalSec = 0,
  onIntervalChange,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!intervalSec || !onRefresh) return undefined;
    timerRef.current = setInterval(() => onRefresh(), intervalSec * 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalSec, onRefresh]);

  if (!onIntervalChange) return null;

  const cycle = () => {
    const index = INTERVALS.indexOf(intervalSec);
    const next = INTERVALS[(index + 1) % INTERVALS.length];
    onIntervalChange(next);
  };

  const label =
    intervalSec === 0
      ? t("table.autoRefreshOff")
      : t("table.autoRefreshOn", { seconds: intervalSec });

  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          size="small"
          disabled={disabled}
          onClick={cycle}
          aria-label={label}
          sx={{
            width: TABLE_FILTER_HEIGHT,
            height: TABLE_FILTER_HEIGHT,
            border: 1,
            borderColor: intervalSec ? "primary.light" : "divider",
            color: intervalSec ? primary : "text.secondary",
          }}
        >
          <AutorenewIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </span>
    </Tooltip>
  );
}
