import { alpha } from "@mui/material/styles";
import { brandFromTheme } from "@/utils/brandPalette";
import { BUTTON_PILL_RADIUS } from "@/constants/shape";
import { transition } from "@/constants/motion";

/** Form dialogs & pages — soft pill inputs (~42px) */
export const FIELD_RADIUS = 10;
export const FIELD_MIN_HEIGHT = 42;
export const FIELD_INPUT_PADDING = "9px 14px";

/** Default textarea size (forms, dialogs, resource pages). */
export const MULTILINE_MIN_ROWS = 2;
export const MULTILINE_DEFAULT_ROWS = 3;
export const MULTILINE_LONG_TEXT_ROWS = 4;
export const MULTILINE_MAX_ROWS = 10;

export const FILTER_MIN_HEIGHT = 44;
export const FILTER_RADIUS = 8;

function fieldSurfaceBg(theme) {
  const { primary, secondary } = brandFromTheme(theme);
  const isLight = theme.palette.mode === "light";
  const paper = theme.palette.background.paper;
  const surface = theme.palette.background.default;
  return isLight
    ? `linear-gradient(165deg, ${alpha("#ffffff", 0.98)} 0%, ${alpha(primary, 0.045)} 48%, ${alpha(secondary, 0.035)} 100%)`
    : `linear-gradient(165deg, ${alpha(paper, 0.96)} 0%, ${alpha(primary, 0.1)} 52%, ${alpha(surface, 0.88)} 100%)`;
}

function fieldSurfaceShadow(theme, focused = false) {
  const { primary } = brandFromTheme(theme);
  const isLight = theme.palette.mode === "light";
  if (focused) {
    return isLight
      ? `inset 0 1px 0 ${alpha("#fff", 0.95)}, 0 0 0 3px ${alpha(primary, 0.14)}, 0 6px 20px ${alpha(primary, 0.1)}`
      : `inset 0 1px 0 ${alpha("#fff", 0.08)}, 0 0 0 3px ${alpha(primary, 0.22)}, 0 8px 24px ${alpha("#000", 0.35)}`;
  }
  return isLight
    ? `inset 0 1px 0 ${alpha("#fff", 0.92)}, 0 1px 3px ${alpha(primary, 0.06)}`
    : `inset 0 1px 0 ${alpha("#fff", 0.07)}, 0 2px 8px ${alpha("#000", 0.22)}`;
}

/** Shared OutlinedInput root — forms & page settings (not filter bar) */
export function outlinedInputRootSx(theme) {
  const { primary } = brandFromTheme(theme);
  const isLight = theme.palette.mode === "light";

  return {
    borderRadius: `${FIELD_RADIUS}px`,
    minHeight: FIELD_MIN_HEIGHT,
    background: fieldSurfaceBg(theme),
    transition: transition("background, box-shadow, border-color, transform"),
    "&:hover": {
      background: isLight
        ? `linear-gradient(165deg, ${alpha("#ffffff", 1)} 0%, ${alpha(primary, 0.06)} 100%)`
        : `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 1)} 0%, ${alpha(primary, 0.14)} 100%)`,
      boxShadow: isLight
        ? `inset 0 1px 0 ${alpha("#fff", 0.95)}, 0 2px 8px ${alpha(primary, 0.08)}`
        : `inset 0 1px 0 ${alpha("#fff", 0.08)}, 0 4px 12px ${alpha("#000", 0.28)}`,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(primary, isLight ? 0.42 : 0.5),
      },
    },
    "&.Mui-focused": {
      background: fieldSurfaceBg(theme),
      boxShadow: fieldSurfaceShadow(theme, true),
      transform: "translateY(-1px)",
    },
    "&.Mui-error.Mui-focused": {
      boxShadow: `inset 0 1px 0 ${alpha("#fff", isLight ? 0.9 : 0.06)}, 0 0 0 3px ${alpha(theme.palette.error.main, 0.14)}`,
      transform: "translateY(-1px)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(primary, isLight ? 0.2 : 0.3),
      borderWidth: 1,
      transition: transition("border-color"),
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: 1.5,
      borderColor: primary,
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.error.main,
    },
    "&.Mui-disabled": {
      background: isLight ? alpha("#000", 0.02) : alpha("#fff", 0.04),
      boxShadow: "none",
      transform: "none",
    },
    "& .MuiOutlinedInput-input": {
      padding: FIELD_INPUT_PADDING,
    },
    "& .MuiSelect-select": {
      padding: FIELD_INPUT_PADDING,
      minHeight: "1.4375em",
      boxSizing: "border-box",
    },
    "&.MuiInputBase-adornedStart": {
      pl: 0.75,
    },
    "&.MuiInputBase-adornedEnd": {
      pr: 0.75,
    },
    "&.MuiInputBase-multiline": {
      minHeight: "auto",
      padding: 0,
      alignItems: "flex-start",
      "& .MuiOutlinedInput-input": {
        padding: "10px 14px",
        minHeight: "unset",
        lineHeight: 1.5,
        boxSizing: "border-box",
      },
    },
  };
}

export function inputLabelSx(theme) {
  const { primary } = brandFromTheme(theme);
  return {
    fontSize: "0.875rem",
    fontWeight: 500,
    letterSpacing: "0.01em",
    color: "text.secondary",
    "& .MuiInputLabel-asterisk": {
      color: "error.main",
    },
    "&.Mui-focused": {
      color: primary,
      fontWeight: 600,
    },
    "&.MuiInputLabel-shrink": {
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  };
}

export function inputBaseSx() {
  return {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.45,
    "&::placeholder": {
      opacity: 0.72,
      fontWeight: 400,
    },
  };
}

/** Compact inputs for table filter toolbar */
export function filterOutlinedInputRootSx(theme) {
  const { primary } = brandFromTheme(theme);
  const isLight = theme.palette.mode === "light";

  return {
    borderRadius: `${FILTER_RADIUS}px`,
    minHeight: FILTER_MIN_HEIGHT,
    height: FILTER_MIN_HEIGHT,
    background: isLight
      ? `linear-gradient(180deg, ${alpha(primary, 0.04)} 0%, ${alpha(primary, 0.07)} 100%)`
      : `linear-gradient(180deg, ${alpha(primary, 0.1)} 0%, ${alpha(primary, 0.16)} 100%)`,
    boxShadow: isLight
      ? `inset 0 1px 0 ${alpha("#fff", 0.75)}`
      : `inset 0 1px 0 ${alpha("#fff", 0.06)}`,
    transition: transition("background, box-shadow, border-color, transform"),
    "&:hover": {
      background: isLight
        ? `linear-gradient(180deg, ${alpha(primary, 0.06)} 0%, ${alpha(primary, 0.1)} 100%)`
        : `linear-gradient(180deg, ${alpha(primary, 0.14)} 0%, ${alpha(primary, 0.2)} 100%)`,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(primary, 0.46),
      },
    },
    "&.Mui-focused": {
      background: theme.palette.background.paper,
      boxShadow: fieldSurfaceShadow(theme, true),
      transform: "translateY(-1px)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(primary, isLight ? 0.22 : 0.32),
      borderWidth: 1,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(primary, 0.44),
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: 1.5,
      borderColor: primary,
    },
    "& .MuiOutlinedInput-input": {
      py: 0,
      height: "100%",
      boxSizing: "border-box",
    },
    "&.MuiInputBase-adornedStart": {
      pl: 0.5,
    },
    "&.MuiInputBase-multiline": {
      minHeight: FILTER_MIN_HEIGHT,
      height: "auto",
    },
  };
}

export function filterInputLabelSx(theme) {
  const { primary } = brandFromTheme(theme);
  return {
    fontSize: "0.8125rem",
    fontWeight: 600,
    letterSpacing: "0.01em",
    color: "text.secondary",
    "&.Mui-focused": {
      color: primary,
      fontWeight: 700,
    },
    "&.MuiInputLabel-shrink": {
      fontWeight: 700,
      fontSize: "0.75rem",
    },
  };
}

export function filterInputBaseSx() {
  return {
    fontSize: "0.875rem",
    fontWeight: 500,
    padding: "0 12px",
    "&::placeholder": {
      opacity: 0.75,
      fontWeight: 400,
    },
  };
}

/** Outlined buttons in filter row (export, clear) */
export function filterButtonSx() {
  return {
    minHeight: FILTER_MIN_HEIGHT,
    height: FILTER_MIN_HEIGHT,
    px: 1.5,
    fontSize: "0.8125rem",
    fontWeight: 600,
    borderRadius: `${BUTTON_PILL_RADIUS}px`,
    whiteSpace: "nowrap",
  };
}

export function autocompletePaperSx(theme) {
  const { primary } = brandFromTheme(theme);
  return {
    mt: 0.75,
    borderRadius: 2.5,
    border: 1,
    borderColor: alpha(primary, theme.palette.mode === "light" ? 0.12 : 0.22),
    boxShadow:
      theme.palette.mode === "light"
        ? `0 16px 48px ${alpha(primary, 0.16)}, inset 0 1px 0 ${alpha("#fff", 0.8)}`
        : "0 16px 48px rgba(0,0,0,0.48)",
    overflow: "hidden",
    "& .MuiAutocomplete-listbox": {
      py: 0.5,
      maxHeight: 300,
      "& .MuiAutocomplete-option": {
        borderRadius: 1.25,
        mx: 0.5,
        my: 0.125,
        minHeight: 38,
        fontSize: "0.875rem",
      },
    },
  };
}

/** Prevent layout shift when native Select menus open (scrollbar-gutter is already stable). */
export const SELECT_MENU_PROPS = {
  disableScrollLock: true,
};

export function selectMenuPaperSx(theme) {
  const { primary } = brandFromTheme(theme);
  return {
    borderRadius: 2.5,
    mt: 0.5,
    border: 1,
    borderColor: alpha(primary, theme.palette.mode === "light" ? 0.12 : 0.22),
    boxShadow:
      theme.palette.mode === "light"
        ? `0 16px 48px ${alpha(primary, 0.14)}`
        : "0 16px 48px rgba(0,0,0,0.45)",
    "& .MuiMenuItem-root": {
      fontSize: "0.875rem",
      minHeight: 38,
      borderRadius: 1.25,
      mx: 0.5,
      my: 0.125,
      "&.Mui-selected": {
        bgcolor: alpha(primary, 0.12),
        color: primary,
        fontWeight: 600,
        "&:hover": {
          bgcolor: alpha(primary, 0.16),
        },
      },
      "&:hover": {
        bgcolor: alpha(primary, 0.06),
      },
    },
  };
}

/** Icon inside start/end adornment — circular brand chip */
export function inputAdornmentSx(theme, position = "start") {
  const { primary } = brandFromTheme(theme);
  const isLight = theme.palette.mode === "light";
  return {
    maxHeight: "none",
    ...(position === "start" ? { ml: 0.5, mr: 0.25 } : { mr: 0.5, ml: 0.25 }),
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    flexShrink: 0,
    borderRadius: "50%",
    bgcolor: alpha(primary, isLight ? 0.1 : 0.22),
    boxShadow: `inset 0 1px 0 ${alpha("#fff", isLight ? 0.45 : 0.1)}`,
    "& .MuiSvgIcon-root": {
      fontSize: 17,
      color: primary,
    },
  };
}

export function adornmentIconSx(theme, color) {
  const { primary } = brandFromTheme(theme);
  const resolved = color ?? primary;
  return {
    fontSize: 17,
    color: alpha(resolved, 0.92),
  };
}

export function optionStateSx(theme, selected) {
  const { primary } = brandFromTheme(theme);
  return {
    py: 0.875,
    px: 1.25,
    fontSize: "0.875rem",
    fontWeight: selected ? 600 : 500,
    borderRadius: 1.25,
    "&.Mui-focused": {
      bgcolor: alpha(primary, 0.08),
    },
    ...(selected && {
      bgcolor: alpha(primary, 0.1),
      color: primary,
    }),
  };
}
