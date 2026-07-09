import { alpha } from "@mui/material/styles";
import { brandFromTheme } from "@/utils/brandPalette";
import { DURATION, EASE_SOFT } from "@/constants/motion";
import { TABLE_FILTER_DATE_WIDTH } from "@/constants/layout";
import {
  outlinedInputRootSx,
  filterOutlinedInputRootSx,
  inputLabelSx,
  filterInputLabelSx,
  inputBaseSx,
  filterInputBaseSx,
} from "@/components/common/form/fieldStyles";

export function pickerCalendarSx(theme) {
  const { primary } = brandFromTheme(theme);
  return {
    borderRadius: 2,
    border: 1,
    borderColor: "divider",
    overflow: "hidden",
    boxShadow:
      theme.palette.mode === "light"
        ? `0 12px 40px ${alpha(primary, 0.14)}`
        : "0 12px 40px rgba(0,0,0,0.45)",
    "& .MuiPickersCalendarHeader-label": { fontWeight: 700 },
    "& .MuiDayCalendar-weekDayLabel": { fontWeight: 600, fontSize: "0.7rem" },
    "& .MuiMultiSectionDigitalClockSection-root": {
      "& .MuiMenuItem-root.Mui-selected": {
        bgcolor: `${primary} !important`,
      },
    },
    "& .MuiTimeClock-root": {
      "& .MuiClockPointer-root": {
        bgcolor: primary,
      },
      "& .MuiClockPointer-thumb": {
        borderColor: primary,
        bgcolor: primary,
      },
      "& .MuiClock-pin": {
        bgcolor: primary,
      },
      "& .MuiClockNumber-root.Mui-selected": {
        bgcolor: `${primary} !important`,
      },
    },
  };
}

export function pickerRootSx(theme) {
  const { primary } = brandFromTheme(theme);
  return {
    "& .MuiPickersDay-root": {
      transition: `background-color ${DURATION.fast}ms ${EASE_SOFT}, color ${DURATION.fast}ms ${EASE_SOFT}`,
    },
    "& .MuiPickersDay-root.Mui-selected": {
      bgcolor: `${primary} !important`,
      "&:hover": { bgcolor: `${primary} !important` },
    },
    "& .MuiPickersDay-today": { borderColor: primary },
    "& .MuiPickersArrowSwitcher-button": {
      transition: `background-color ${DURATION.fast}ms ${EASE_SOFT}`,
      "&:hover": { bgcolor: "action.hover" },
    },
    "& .MuiMultiSectionDigitalClockSection-item.Mui-selected": {
      bgcolor: `${primary} !important`,
    },
    "& .MuiTimeClock-root": {
      "& .MuiClockPointer-root": {
        bgcolor: primary,
      },
      "& .MuiClockPointer-thumb": {
        borderColor: primary,
        bgcolor: primary,
      },
      "& .MuiClock-pin": {
        bgcolor: primary,
      },
      "& .MuiClockNumber-root.Mui-selected": {
        bgcolor: `${primary} !important`,
      },
    },
  };
}

export function buildPickerSlotProps({
  theme,
  filterBar = false,
  fullWidth = false,
  hideLabel = false,
  label,
  placeholder,
  error = false,
  sx,
}) {
  const { primary } = brandFromTheme(theme);
  const rootSx = filterBar ? filterOutlinedInputRootSx : outlinedInputRootSx;
  const showLabel = !hideLabel && label;

  return {
    textField: {
      size: "small",
      fullWidth: fullWidth || filterBar,
      placeholder: placeholder ?? (hideLabel && label ? label : undefined),
      error,
      sx: {
        width: "100%",
        maxWidth: fullWidth
          ? "100%"
          : filterBar
            ? { xs: "100%", sm: TABLE_FILTER_DATE_WIDTH.sm }
            : { xs: "100%", sm: 220 },
        flexShrink: fullWidth || filterBar ? undefined : 0,
        ...sx,
      },
      InputLabelProps: showLabel
        ? {
            shrink: true,
            sx: filterBar ? filterInputLabelSx(theme) : inputLabelSx(theme),
          }
        : { sx: { display: "none" } },
      InputProps: { sx: rootSx(theme) },
      inputProps: {
        style: filterBar ? filterInputBaseSx() : inputBaseSx(),
      },
    },
    field: { clearable: true },
    desktopPaper: { elevation: 0, sx: pickerCalendarSx(theme) },
    mobilePaper: { elevation: 0, sx: { borderRadius: 2 } },
    popper: {
      sx: {
        "& .MuiPaper-root": {
          transition: `transform ${DURATION.normal}ms ${EASE_SOFT}, opacity ${DURATION.normal}ms ${EASE_SOFT}`,
        },
      },
    },
    openPickerButton: {
      sx: {
        color: primary,
        "&:hover": { bgcolor: alpha(primary, 0.08) },
      },
    },
    clearButton: {
      sx: {
        color: "text.secondary",
        "&:hover": { color: primary },
      },
    },
  };
}
