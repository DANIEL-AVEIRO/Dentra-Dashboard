import { createTheme, alpha } from "@mui/material/styles";
import { createElement } from "react";
import CheckboxVisual from "@/components/common/CheckboxVisual";
import { tableCheckboxSx } from "@/constants/tableStyles";
import {
  BUTTON_TRANSITION,
  DURATION,
  EASE_SOFT,
  THEME_SWITCH_MS,
  transition,
} from "@/constants/motion";
import {
  BRAND_DARK as DEFAULT_BRAND_DARK,
  BRAND_DARKER as DEFAULT_BRAND_DARKER,
  BRAND_PRIMARY as DEFAULT_BRAND_PRIMARY,
  BRAND_SECONDARY as DEFAULT_BRAND_SECONDARY,
  BRAND_WHITE as DEFAULT_BRAND_WHITE,
  DEFAULT_BRAND,
} from "@/constants/brand";
import { resolveUiBrandColors } from "@/utils/brandPalette";
import { getDefaultContainedButtonSx } from "@/constants/buttonIntents";
import { BUTTON_PILL_RADIUS } from "@/constants/shape";

export {
  BRAND_DARK,
  BRAND_DARKER,
  BRAND_PRIMARY,
  BRAND_SECONDARY,
  BRAND_WHITE,
} from "@/constants/brand";
export { BUTTON_PILL_RADIUS } from "@/constants/shape";

function resolveBrand(brand = {}) {
  return {
    primary: brand.primary || DEFAULT_BRAND.primary,
    secondary: brand.secondary || DEFAULT_BRAND.secondary,
    dark: brand.dark || DEFAULT_BRAND.dark,
    darker: brand.darker || DEFAULT_BRAND.darker,
    white: brand.white || DEFAULT_BRAND.white,
  };
}

const tableCell = {
  paddingTop: 14,
  paddingBottom: 14,
  paddingLeft: 16,
  paddingRight: 16,
};

const softShadow = (color, opacity = 0.08) =>
  `0 4px 20px ${alpha(color, opacity)}, 0 1px 3px ${alpha(color, opacity * 0.6)}`;

const interactiveTransition = BUTTON_TRANSITION;

export const getTheme = (mode, brandInput = {}) => {
  const brand = resolveBrand(brandInput);
  const ui = resolveUiBrandColors(brand, mode);
  const {
    primary: BRAND_PRIMARY,
    secondary: BRAND_SECONDARY,
    dark: BRAND_DARK,
    darker: BRAND_DARKER,
    white: BRAND_WHITE,
    raw: RAW_BRAND,
  } = ui;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: BRAND_PRIMARY,
        light: BRAND_SECONDARY,
        dark: BRAND_DARK,
        contrastText: BRAND_WHITE,
      },
      secondary: {
        main: BRAND_SECONDARY,
        contrastText: BRAND_WHITE,
      },
      background: {
        default: mode === "light" ? "#f4f7fb" : "#0a1220",
        paper: mode === "light" ? BRAND_WHITE : "#111d2e",
      },
      text:
        mode === "light"
          ? {
              primary: "#1a2332",
              secondary: alpha("#1a2332", 0.68),
              disabled: alpha("#1a2332", 0.38),
            }
          : {
              primary: "#e8eef8",
              secondary: alpha("#e8eef8", 0.72),
              disabled: alpha("#e8eef8", 0.4),
            },
      divider:
        mode === "light"
          ? alpha(BRAND_PRIMARY, 0.1)
          : alpha(BRAND_WHITE, 0.1),
      action: {
        hover:
          mode === "light"
            ? alpha(BRAND_PRIMARY, 0.06)
            : alpha(BRAND_WHITE, 0.06),
        selected:
          mode === "light"
            ? alpha(BRAND_PRIMARY, 0.1)
            : alpha(BRAND_PRIMARY, 0.22),
        ...(mode === "dark"
          ? {
              disabled: alpha(BRAND_WHITE, 0.3),
              disabledBackground: alpha(BRAND_WHITE, 0.08),
            }
          : {}),
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 16,
      h4: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        fontSize: "1.5rem",
        fontWeight: 700,
        lineHeight: 1.35,
        letterSpacing: "-0.02em",
      },
      h5: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        fontSize: "1.25rem",
        fontWeight: 700,
        lineHeight: 1.4,
        letterSpacing: "-0.01em",
      },
      h6: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        fontSize: "1.125rem",
        fontWeight: 600,
        lineHeight: 1.45,
      },
      subtitle1: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        fontSize: "1rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      subtitle2: { fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.4 },
      body1: { fontSize: "1rem", lineHeight: 1.5 },
      body2: { fontSize: "0.875rem", lineHeight: 1.5 },
      caption: { fontSize: "0.8125rem", lineHeight: 1.45 },
      button: { fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "0.01em" },
    },
    shape: { borderRadius: 10 },
    transitions: {
      duration: {
        shortest: DURATION.fast,
        shorter: DURATION.fast,
        short: DURATION.normal,
        standard: DURATION.normal,
        complex: DURATION.slow,
        enteringScreen: DURATION.page,
        leavingScreen: DURATION.normal,
      },
      easing: {
        easeInOut: EASE_SOFT,
        easeOut: EASE_SOFT,
        easeIn: "cubic-bezier(0.4, 0, 1, 1)",
        sharp: EASE_SOFT,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontSize: "1rem",
            transition: transition(
              "background-color, color, background-image",
              THEME_SWITCH_MS
            ),
            backgroundImage:
              mode === "light"
                ? `radial-gradient(ellipse 80% 50% at 100% -20%, ${alpha(BRAND_PRIMARY, 0.06)} 0%, transparent 55%),
                   radial-gradient(ellipse 60% 40% at 0% 100%, ${alpha(BRAND_SECONDARY, 0.05)} 0%, transparent 50%)`
                : `radial-gradient(ellipse 85% 55% at 15% -15%, ${alpha(BRAND_SECONDARY, 0.14)} 0%, transparent 52%),
                   radial-gradient(ellipse 65% 45% at 100% 0%, ${alpha(BRAND_PRIMARY, 0.12)} 0%, transparent 48%),
                   radial-gradient(ellipse 55% 40% at 50% 100%, ${alpha(BRAND_DARKER, 0.35)} 0%, transparent 55%)`,
            backgroundAttachment: "fixed",
          },
          "*:focus-visible": {
            outlineOffset: 2,
          },
          ...(mode === "dark"
            ? {
                "input::placeholder, textarea::placeholder": {
                  color: alpha(BRAND_WHITE, 0.45),
                  opacity: 1,
                },
              }
            : {}),
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: BUTTON_PILL_RADIUS,
            padding: "8px 18px",
            transition: interactiveTransition,
          },
          contained: {
            transition: interactiveTransition,
            "&.Mui-disabled": {
              opacity: 1,
            },
          },
          containedPrimary: ({ theme: muiTheme }) => getDefaultContainedButtonSx(muiTheme),
          outlined: {
            borderWidth: 1,
            "&:hover": {
              borderWidth: 1,
              bgcolor: alpha(BRAND_PRIMARY, 0.04),
            },
          },
        },
      },
      MuiIconButton: {
        defaultProps: {},
        styleOverrides: {
          root: {
            borderRadius: BUTTON_PILL_RADIUS,
            transition: interactiveTransition,
            "&:hover": {
              bgcolor: alpha(BRAND_PRIMARY, 0.08),
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0) scale(0.96)",
            },
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: BUTTON_PILL_RADIUS,
            transition: interactiveTransition,
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            borderRadius: BUTTON_PILL_RADIUS,
            overflow: "hidden",
          },
          grouped: {
            "&:not(:first-of-type)": {
              marginLeft: 0,
              borderRadius: 0,
            },
            "&:first-of-type": {
              borderRadius: `${BUTTON_PILL_RADIUS}px 0 0 ${BUTTON_PILL_RADIUS}px`,
            },
            "&:last-of-type": {
              borderRadius: `0 ${BUTTON_PILL_RADIUS}px ${BUTTON_PILL_RADIUS}px 0`,
            },
            "&:only-child": {
              borderRadius: BUTTON_PILL_RADIUS,
            },
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: `${64}px !important`,
            paddingLeft: 16,
            paddingRight: 16,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: `linear-gradient(135deg, ${RAW_BRAND.primary} 0%, ${RAW_BRAND.dark} 55%, ${RAW_BRAND.darker} 100%)`,
            backdropFilter: "blur(8px)",
            transition: transition("box-shadow", DURATION.slow),
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            transition: transition("transform, box-shadow", DURATION.page, EASE_SOFT),
            borderRight: `1px solid ${alpha(BRAND_PRIMARY, mode === "light" ? 0.08 : 0.15)}`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            paddingTop: 8,
            paddingBottom: 8,
            transition: interactiveTransition,
            "&.Mui-selected": {
              transition: interactiveTransition,
            },
          },
        },
      },
      MuiCollapse: {
        defaultProps: {
          timeout: { enter: DURATION.normal, exit: DURATION.fast },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 40,
            transition: transition("color", DURATION.normal),
          },
        },
      },
      MuiTable: {
        defaultProps: { size: "medium" },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 0,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            ...tableCell,
            borderColor: alpha(BRAND_PRIMARY, mode === "light" ? 0.08 : 0.16),
            fontSize: "0.9375rem",
            lineHeight: 1.5,
            whiteSpace: "nowrap",
            transition: transition("background-color, color", DURATION.fast),
          },
          head: {
            ...tableCell,
            fontWeight: 400,
            fontSize: "0.9375rem",
            letterSpacing: "normal",
            textTransform: "none",
            color: "text.primary",
            whiteSpace: "nowrap",
            lineHeight: 1.5,
          },
          sizeSmall: {
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 14,
            paddingRight: 14,
            fontSize: "0.875rem",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: transition("background-color", DURATION.fast),
            "&:last-child td": { borderBottom: 0 },
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: { fontSize: "0.875rem" },
          toolbar: { minHeight: 48, paddingLeft: 14, paddingRight: 14 },
        },
      },
      MuiTextField: {
        defaultProps: { margin: "dense", size: "small" },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            minHeight: 42,
            transition: interactiveTransition,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(BRAND_PRIMARY, 0.42),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: 1.5,
              borderColor: BRAND_PRIMARY,
            },
            "&.MuiInputBase-multiline": { minHeight: "auto", padding: 0 },
          },
          input: {
            padding: "8.5px 14px",
            fontSize: "0.875rem",
            fontWeight: 400,
          },
          inputSizeSmall: {
            padding: "8.5px 14px",
            fontSize: "0.875rem",
          },
          notchedOutline: {
            borderColor: alpha(BRAND_PRIMARY, mode === "light" ? 0.18 : 0.26),
          },
        },
      },
      MuiFormControl: {
        defaultProps: { margin: "dense", size: "small" },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: "0.875rem",
            fontWeight: 500,
            transition: transition("color, transform", DURATION.normal),
            "&.Mui-focused": {
              color: BRAND_PRIMARY,
              fontWeight: 600,
            },
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            "& .MuiSvgIcon-root": { fontSize: 20 },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: BRAND_PRIMARY,
            transition: transition("transform", DURATION.fast),
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: { fontSize: "0.75rem", marginTop: 3 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            height: 28,
            fontSize: "0.8125rem",
            transition: interactiveTransition,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: interactiveTransition,
            border: `1px solid ${alpha(BRAND_PRIMARY, mode === "light" ? 0.08 : 0.12)}`,
            backdropFilter: "blur(8px)",
            "&:hover": {
              borderColor: alpha(BRAND_PRIMARY, 0.2),
              boxShadow: softShadow(BRAND_PRIMARY, mode === "light" ? 0.1 : 0.2),
            },
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: 20,
            "&:last-child": { paddingBottom: 20 },
          },
        },
      },
      MuiModal: {
        defaultProps: {
          // scrollbar-gutter: stable (global.css) already reserves gutter space
          disableScrollLock: true,
        },
      },
      MuiDialog: {
        defaultProps: {
          TransitionProps: { timeout: { enter: DURATION.normal, exit: DURATION.fast } },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontSize: "1.125rem",
            fontWeight: 700,
            padding: "16px 16px",
            flexShrink: 0,
            [theme.breakpoints.down("sm")]: {
              fontSize: "1rem",
              padding: "14px 16px",
            },
          }),
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: "16px 16px 20px",
            [theme.breakpoints.down("sm")]: {
              padding: "12px 16px 16px",
            },
          }),
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: "12px 16px 20px",
            flexShrink: 0,
            [theme.breakpoints.down("sm")]: {
              padding: "12px 16px calc(12px + env(safe-area-inset-bottom, 0px))",
              flexDirection: "column-reverse",
              alignItems: "stretch",
              "& > .MuiButton-root": {
                width: "100%",
                margin: 0,
              },
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            transition: interactiveTransition,
          },
          elevation1: {
            boxShadow: softShadow(BRAND_PRIMARY, 0.06),
          },
        },
      },
      MuiPopover: {
        defaultProps: {
          // global.css uses scrollbar-gutter: stable — avoid body padding toggle on menus
          disableScrollLock: true,
        },
      },
      MuiMenu: {
        defaultProps: {
          disableScrollLock: true,
          TransitionProps: { timeout: { enter: DURATION.fast, exit: DURATION.fast } },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "2px 6px",
            transition: transition("background-color", DURATION.fast),
          },
        },
      },
      MuiTooltip: {
        defaultProps: { enterDelay: 400, leaveDelay: 80 },
      },
      MuiAutocomplete: {
        defaultProps: { size: "small" },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": { borderRadius: 10, minHeight: 42 },
            "& .Mui-focused .MuiAutocomplete-popupIndicator": {
              transform: "rotate(180deg)",
            },
          },
          paper: {
            borderRadius: 8,
            border: `1px solid ${alpha(BRAND_PRIMARY, mode === "light" ? 0.1 : 0.15)}`,
            boxShadow: softShadow(BRAND_PRIMARY, 0.14),
            marginTop: 6,
          },
          option: {
            borderRadius: 8,
            margin: "2px 6px",
            fontSize: "0.875rem",
            minHeight: 36,
            fontWeight: 500,
            transition: transition("background-color", DURATION.fast),
            '&[aria-selected="true"]': {
              bgcolor: alpha(BRAND_PRIMARY, 0.1),
              color: BRAND_PRIMARY,
              fontWeight: 600,
            },
          },
          popupIndicator: {
            color: BRAND_PRIMARY,
          },
          clearIndicator: {
            transition: transition("color", DURATION.fast),
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            transform: "scale(1)",
            "&::after": {
              animationDuration: "1.6s",
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            overflow: "hidden",
          },
        },
      },
      MuiCheckbox: {
        defaultProps: {
          disableRipple: true,
          size: "small",
          icon: createElement(CheckboxVisual),
          checkedIcon: createElement(CheckboxVisual, { checked: true }),
          indeterminateIcon: createElement(CheckboxVisual, { indeterminate: true }),
        },
        styleOverrides: {
          root: ({ theme: muiTheme }) => ({
            ...tableCheckboxSx(muiTheme),
          }),
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            transition: transition("transform, color", DURATION.normal),
            color:
              mode === "dark" ? alpha(BRAND_WHITE, 0.72) : undefined,
            "&.Mui-checked": {
              color: BRAND_PRIMARY,
              "& + .MuiSwitch-track": {
                backgroundColor: BRAND_PRIMARY,
                opacity: mode === "dark" ? 0.55 : 0.5,
              },
            },
          },
          track: {
            transition: transition("background-color, opacity", DURATION.normal),
            backgroundColor:
              mode === "dark" ? alpha(BRAND_WHITE, 0.28) : undefined,
            opacity: mode === "dark" ? 1 : undefined,
          },
          thumb: {
            boxShadow:
              mode === "dark"
                ? `0 1px 3px ${alpha("#000", 0.45)}`
                : undefined,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: alpha(BRAND_PRIMARY, mode === "light" ? 0.08 : 0.12),
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            transition: transition("background-color, color", DURATION.fast),
            "&.Mui-selected": {
              backgroundColor: BRAND_PRIMARY,
              color: BRAND_WHITE,
              "&:hover": {
                backgroundColor: BRAND_SECONDARY,
              },
              "&:focus": {
                backgroundColor: BRAND_PRIMARY,
              },
            },
          },
          today: {
            borderColor: BRAND_PRIMARY,
          },
        },
      },
      MuiPickersCalendarHeader: {
        styleOverrides: {
          label: {
            fontWeight: 700,
            fontSize: "0.875rem",
          },
          switchViewButton: {
            transition: transition("background-color, color", DURATION.fast),
          },
        },
      },
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            transition: transition("opacity", DURATION.normal),
          },
        },
      },
      MuiPickersArrowSwitcher: {
        styleOverrides: {
          button: {
            transition: transition("background-color, color", DURATION.fast),
          },
        },
      },
      MuiPickersYear: {
        styleOverrides: {
          yearButton: {
            transition: transition("background-color, color", DURATION.fast),
            "&.Mui-selected": {
              backgroundColor: BRAND_PRIMARY,
              "&:hover": { backgroundColor: BRAND_SECONDARY },
            },
          },
        },
      },
      MuiPickersMonth: {
        styleOverrides: {
          monthButton: {
            transition: transition("background-color, color", DURATION.fast),
            "&.Mui-selected": {
              backgroundColor: BRAND_PRIMARY,
              "&:hover": { backgroundColor: BRAND_SECONDARY },
            },
          },
        },
      },
    },
  });
};
