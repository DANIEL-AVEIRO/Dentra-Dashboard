import { Box, Button, Typography, alpha, useTheme } from "@mui/material";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { normalizeOptions } from "@/components/common/SearchableSelect";
import {
  FIELD_MIN_HEIGHT,
  FIELD_RADIUS,
} from "@/components/common/form/fieldStyles";
import { brandFromTheme } from "@/utils/brandPalette";
import { transition } from "@/constants/motion";

const VALUE_ICONS = {
  normal: CheckCircleOutlineIcon,
  urgent: BoltOutlinedIcon,
  vip: WorkspacePremiumOutlinedIcon,
};

function resolvePaletteColor(theme, colorKey = "primary") {
  const palette = theme.palette[colorKey];
  return palette?.main ?? theme.palette.primary.main;
}

export default function OptionButtonGroup({
  value,
  onChange,
  options = [],
  disabled = false,
  valueKey = "id",
  labelKey = "name",
}) {
  const theme = useTheme();
  const { primary } = brandFromTheme(theme);
  const normalized = normalizeOptions(options, { valueKey, labelKey });
  const isLight = theme.palette.mode === "light";

  return (
    <Box
      role="radiogroup"
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs:
            normalized.length > 2
              ? "minmax(0, 1fr)"
              : `repeat(${Math.max(normalized.length, 1)}, minmax(0, 1fr))`,
          sm: `repeat(${Math.max(normalized.length, 1)}, minmax(0, 1fr))`,
        },
        gap: 0.5,
        width: "100%",
        minWidth: 0,
        p: 0.5,
        minHeight: FIELD_MIN_HEIGHT,
        borderRadius: `${FIELD_RADIUS}px`,
        border: 1,
        borderColor: alpha(primary, isLight ? 0.14 : 0.24),
        bgcolor: isLight ? alpha(primary, 0.03) : alpha(primary, 0.08),
      }}
    >
      {normalized.map((opt) => {
        const selected = value === opt.value;
        const colorKey = opt.color || "primary";
        const accent = resolvePaletteColor(theme, colorKey);
        const Icon = VALUE_ICONS[String(opt.value)] ?? CheckCircleOutlineIcon;

        return (
          <Button
            key={String(opt.value)}
            role="radio"
            aria-checked={selected}
            disableElevation
            disabled={disabled}
            onClick={() => onChange?.(opt.value)}
            sx={{
              minWidth: 0,
              minHeight: FIELD_MIN_HEIGHT - 8,
              px: 1.25,
              py: 0.75,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.625,
              textTransform: "none",
              fontWeight: selected ? 700 : 500,
              fontSize: "0.8125rem",
              lineHeight: 1.2,
              borderRadius: `${FIELD_RADIUS - 2}px`,
              border: 1,
              borderColor: selected ? accent : "transparent",
              bgcolor: selected
                ? accent
                : "transparent",
              color: selected
                ? theme.palette.getContrastText(accent)
                : "text.secondary",
              boxShadow: selected
                ? `0 2px 10px ${alpha(accent, isLight ? 0.28 : 0.38)}`
                : "none",
              transition: transition("background-color, border-color, color, box-shadow"),
              "&:hover": {
                bgcolor: selected
                  ? accent
                  : alpha(primary, isLight ? 0.06 : 0.14),
                borderColor: selected
                  ? accent
                  : alpha(primary, isLight ? 0.18 : 0.28),
                color: selected
                  ? theme.palette.getContrastText(accent)
                  : "text.primary",
              },
              "&.Mui-disabled": {
                opacity: 0.45,
              },
            }}
          >
            <Icon sx={{ fontSize: 17, opacity: selected ? 1 : 0.72 }} />
            <Typography
              component="span"
              variant="body2"
              sx={{
                fontWeight: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
                color: "inherit",
                whiteSpace: { xs: "normal", sm: "nowrap" },
                textAlign: "center",
                overflowWrap: "anywhere",
              }}
            >
              {opt.label}
            </Typography>
          </Button>
        );
      })}
    </Box>
  );
}
