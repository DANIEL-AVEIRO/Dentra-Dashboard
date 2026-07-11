import { useMemo, useState } from "react";
import { Box, Button, Stack, Typography, alpha, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "@/context/LanguageContext";
import SmoothDatePicker from "@/components/common/SmoothDatePicker";
import {
  FIELD_MIN_HEIGHT,
  FIELD_RADIUS,
} from "@/components/common/form/fieldStyles";
import { brandFromTheme } from "@/utils/brandPalette";
import { transition } from "@/constants/motion";
import { API_DATE_FORMAT, parseDateValue } from "@/utils/dateTimeValue";

const DEFAULT_PRESETS = [
  { id: "today", days: 0, labelKey: "datePresets.today", label: "Today" },
  { id: "tomorrow", days: 1, labelKey: "datePresets.tomorrow", label: "Tomorrow" },
  { id: "plus3", days: 3, labelKey: "datePresets.plus3Days", label: "+3 Days" },
  { id: "plus7", days: 7, labelKey: "datePresets.plus7Days", label: "+7 Days" },
];

function resolveActivePreset(value) {
  if (!value) return null;
  const selected = parseDateValue(value);
  if (!selected?.isValid?.()) return "custom";
  const diff = selected.startOf("day").diff(dayjs().startOf("day"), "day");
  const match = DEFAULT_PRESETS.find((preset) => preset.days === diff);
  return match?.id ?? "custom";
}

function PresetButton({ selected, disabled, onClick, children, theme, primary, isLight }) {
  const accent = primary;

  return (
    <Button
      disableElevation
      disabled={disabled}
      onClick={onClick}
      sx={{
        minWidth: 0,
        minHeight: FIELD_MIN_HEIGHT - 8,
        px: 0.75,
        py: 0.625,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textTransform: "none",
        fontWeight: selected ? 700 : 500,
        fontSize: "0.75rem",
        lineHeight: 1.15,
        borderRadius: `${FIELD_RADIUS - 2}px`,
        border: 1,
        borderColor: selected ? accent : "transparent",
        bgcolor: selected ? accent : "transparent",
        color: selected ? theme.palette.getContrastText(accent) : "text.secondary",
        boxShadow: selected
          ? `0 2px 10px ${alpha(accent, isLight ? 0.28 : 0.38)}`
          : "none",
        transition: transition("background-color, border-color, color, box-shadow"),
        "&:hover": {
          bgcolor: selected ? accent : alpha(primary, isLight ? 0.06 : 0.14),
          borderColor: selected ? accent : alpha(primary, isLight ? 0.18 : 0.28),
          color: selected ? theme.palette.getContrastText(accent) : "text.primary",
        },
        "&.Mui-disabled": {
          opacity: 0.45,
        },
      }}
    >
      <Typography
        component="span"
        variant="body2"
        sx={{
          fontWeight: "inherit",
          fontSize: "inherit",
          lineHeight: "inherit",
          color: "inherit",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </Typography>
    </Button>
  );
}

export default function DateFieldWithPresets({
  value = "",
  onChange,
  disabled = false,
  error = false,
  minDate,
  maxDate,
  placeholder,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { primary } = brandFromTheme(theme);
  const isLight = theme.palette.mode === "light";
  const [pickerOpen, setPickerOpen] = useState(false);
  const activePreset = useMemo(() => resolveActivePreset(value), [value]);

  const applyOffset = (days) => {
    onChange?.(dayjs().add(days, "day").format(API_DATE_FORMAT));
  };

  const presetButtons = [
    ...DEFAULT_PRESETS.map((preset) => ({
      id: preset.id,
      label: t(preset.labelKey, { defaultValue: preset.label }),
      onClick: () => applyOffset(preset.days),
    })),
    {
      id: "custom",
      label: t("datePresets.custom", { defaultValue: "Custom" }),
      onClick: () => setPickerOpen(true),
    },
  ];

  return (
    <Stack spacing={1} sx={{ width: "100%" }}>
      <SmoothDatePicker
        hideLabel
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        error={error}
        open={pickerOpen}
        onOpen={() => setPickerOpen(true)}
        onClose={() => setPickerOpen(false)}
      />
      <Box
        role="group"
        aria-label={t("datePresets.groupLabel", { defaultValue: "Due date shortcuts" })}
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${presetButtons.length}, minmax(0, 1fr))`,
          gap: 0.5,
          width: "100%",
          p: 0.5,
          minHeight: FIELD_MIN_HEIGHT,
          borderRadius: `${FIELD_RADIUS}px`,
          border: 1,
          borderColor: alpha(primary, isLight ? 0.14 : 0.24),
          bgcolor: isLight ? alpha(primary, 0.03) : alpha(primary, 0.08),
        }}
      >
        {presetButtons.map((preset) => (
          <PresetButton
            key={preset.id}
            selected={activePreset === preset.id}
            disabled={disabled}
            onClick={preset.onClick}
            theme={theme}
            primary={primary}
            isLight={isLight}
          >
            {preset.label}
          </PresetButton>
        ))}
      </Box>
    </Stack>
  );
}
