import { createElement } from "react";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { BUTTON_PILL_RADIUS } from "@/constants/shape";
import { transition } from "@/constants/motion";

function brandFromTheme(theme) {
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const dark = theme.palette.primary.dark;
  const darker =
    (typeof document !== "undefined" &&
      getComputedStyle(document.documentElement).getPropertyValue("--brand-darker").trim()) ||
    dark;

  return { primary, secondary, dark, darker };
}

function buildBrandIntents(palette) {
  const { primary, secondary, dark, darker } = palette;
  return {
    create: {
      tint: primary,
      gradient: `linear-gradient(135deg, ${primary} 0%, ${secondary} 52%, ${dark} 100%)`,
      hoverGradient: `linear-gradient(135deg, ${secondary} 0%, ${primary} 55%, ${dark} 100%)`,
      shadow: 0.28,
    },
    save: {
      tint: primary,
      gradient: `linear-gradient(135deg, ${dark} 0%, ${primary} 48%, ${secondary} 100%)`,
      hoverGradient: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
      shadow: 0.26,
    },
    confirm: {
      tint: primary,
      gradient: `linear-gradient(135deg, ${primary} 0%, ${dark} 100%)`,
      hoverGradient: `linear-gradient(135deg, ${dark} 0%, ${secondary} 100%)`,
      shadow: 0.24,
    },
    auth: {
      tint: primary,
      gradient: `linear-gradient(135deg, ${primary} 0%, ${dark} 45%, ${darker} 100%)`,
      hoverGradient: `linear-gradient(135deg, ${secondary} 0%, ${primary} 100%)`,
      shadow: 0.38,
    },
    success: {
      tint: "#0d7a5f",
      gradient: "linear-gradient(135deg, #0a6b52 0%, #0d7a5f 50%, #12a67d 100%)",
      hoverGradient: "linear-gradient(135deg, #0d7a5f 0%, #14b889 100%)",
      shadow: 0.26,
    },
    danger: {
      tint: "#b4235a",
      gradient: "linear-gradient(135deg, #9a1b3a 0%, #b4235a 52%, #d6405f 100%)",
      hoverGradient: "linear-gradient(135deg, #b4235a 0%, #e05272 100%)",
      shadow: 0.28,
    },
    assign: {
      tint: "#9a6700",
      gradient: "linear-gradient(135deg, #7a5200 0%, #9a6700 50%, #c48400 100%)",
      hoverGradient: "linear-gradient(135deg, #9a6700 0%, #d4a017 100%)",
      shadow: 0.26,
    },
    export: {
      tint: "#3d5a80",
      gradient: "linear-gradient(135deg, #2f4660 0%, #3d5a80 50%, #4a6fa3 100%)",
      hoverGradient: "linear-gradient(135deg, #3d5a80 0%, #5a82b5 100%)",
      shadow: 0.24,
    },
    send: {
      tint: primary,
      gradient: `linear-gradient(135deg, ${darker} 0%, ${primary} 50%, ${secondary} 100%)`,
      hoverGradient: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
      shadow: 0.24,
    },
  };
}

/** Semantic primary-button intents — tint aligns with TableActionButton / bulk pills. */
export const BUTTON_INTENT_ICONS = {
  create: AddIcon,
  save: SaveOutlinedIcon,
  confirm: CheckCircleOutlineIcon,
  auth: LoginOutlinedIcon,
  success: CheckCircleOutlineIcon,
  danger: DeleteOutlineIcon,
  assign: PersonAddOutlinedIcon,
  export: FileDownloadOutlinedIcon,
  send: SendOutlinedIcon,
};

const COLOR_TO_INTENT = {
  primary: "confirm",
  success: "success",
  error: "danger",
  warning: "assign",
  info: "export",
  secondary: "send",
};

export function resolveButtonIntent({ intent, color } = {}) {
  if (intent && BUTTON_INTENT_ICONS[intent]) return intent;
  if (color && COLOR_TO_INTENT[color]) return COLOR_TO_INTENT[color];
  return "confirm";
}

function intentIconSize(size) {
  if (size === "small") return 18;
  if (size === "large") return 22;
  return 20;
}

/** Default leading icon for ActionButton when startIcon is not provided. */
export function renderButtonIntentIcon(intentKey, size = "medium") {
  const resolved = resolveButtonIntent({ intent: intentKey });
  const Icon = BUTTON_INTENT_ICONS[resolved] ?? BUTTON_INTENT_ICONS.confirm;
  return createElement(Icon, { sx: { fontSize: intentIconSize(size) } });
}

function iconChipSize(size) {
  if (size === "small") return { w: 26, h: 26, fontSize: 16, mr: 0.75 };
  if (size === "large") return { w: 34, h: 34, fontSize: 20, mr: 1.125 };
  return { w: 30, h: 30, fontSize: 18, mr: 1 };
}

export function getButtonIntentSx(intentKey, theme, { size = "medium" } = {}) {
  const intents = buildBrandIntents(brandFromTheme(theme));
  const intent = intents[intentKey] ?? intents.confirm;
  const { primary } = brandFromTheme(theme);
  const chip = iconChipSize(size);
  const isDark = theme.palette.mode === "dark";

  return {
    borderRadius: BUTTON_PILL_RADIUS,
    color: "#fff",
    fontWeight: 700,
    letterSpacing: "0.01em",
    border: `1px solid ${alpha("#fff", isDark ? 0.12 : 0.18)}`,
    background: intent.gradient,
    backgroundColor: "transparent",
    boxShadow: `0 4px 14px ${alpha(intent.tint, intent.shadow)}, 0 1px 3px ${alpha(intent.tint, intent.shadow * 0.5)}`,
    transition: transition("transform, box-shadow, background, border-color, opacity"),
    "& .MuiButton-startIcon": {
      marginRight: chip.mr,
      marginLeft: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: chip.w,
      height: chip.h,
      borderRadius: "50%",
      bgcolor: alpha("#fff", isDark ? 0.14 : 0.2),
      boxShadow: `inset 0 1px 0 ${alpha("#fff", 0.22)}`,
      "& .MuiSvgIcon-root, & svg": {
        fontSize: chip.fontSize,
      },
      "& .MuiCircularProgress-root": {
        color: "inherit",
      },
    },
    "& .MuiButton-endIcon": {
      marginLeft: chip.mr,
      marginRight: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: chip.w,
      height: chip.h,
      borderRadius: "50%",
      bgcolor: alpha("#fff", isDark ? 0.14 : 0.2),
      boxShadow: `inset 0 1px 0 ${alpha("#fff", 0.22)}`,
      "& .MuiSvgIcon-root, & svg": {
        fontSize: chip.fontSize,
      },
    },
    "&:hover": {
      background: intent.hoverGradient,
      backgroundColor: "transparent",
      boxShadow: `0 6px 20px ${alpha(intent.tint, intent.shadow + 0.08)}, 0 2px 6px ${alpha(intent.tint, intent.shadow * 0.55)}`,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0) scale(0.985)",
      boxShadow: `0 2px 8px ${alpha(intent.tint, intent.shadow * 0.75)}`,
    },
    "&.Mui-disabled": {
      opacity: 1,
      cursor: "not-allowed",
      color: isDark ? alpha("#fff", 0.58) : alpha(primary, 0.42),
      background: isDark ? alpha(intent.tint, 0.32) : alpha(intent.tint, 0.1),
      backgroundColor: "transparent",
      borderColor: alpha(intent.tint, isDark ? 0.16 : 0.26),
      boxShadow: "none",
      transform: "none",
      "& .MuiButton-startIcon, & .MuiButton-endIcon": {
        bgcolor: alpha(isDark ? "#fff" : intent.tint, isDark ? 0.1 : 0.12),
        color: isDark ? alpha("#fff", 0.58) : alpha(primary, 0.42),
      },
    },
    "&:focus-visible": {
      outline: `2px solid ${alpha(intent.tint, 0.45)}`,
      outlineOffset: 2,
    },
  };
}

/** Default contained button polish when ActionButton intent is not used. */
export function getDefaultContainedButtonSx(theme) {
  const { primary } = brandFromTheme(theme);
  const intents = buildBrandIntents(brandFromTheme(theme));
  const isDark = theme.palette.mode === "dark";
  return {
    background: intents.confirm.gradient,
    backgroundColor: "transparent",
    color: "#fff",
    border: `1px solid ${alpha("#fff", isDark ? 0.1 : 0.16)}`,
    boxShadow: `0 4px 14px ${alpha(primary, 0.22)}`,
    "&:hover": {
      background: intents.confirm.hoverGradient,
      backgroundColor: "transparent",
      boxShadow: `0 6px 18px ${alpha(primary, 0.3)}`,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0) scale(0.985)",
    },
    "&.Mui-disabled": {
      opacity: 1,
      cursor: "not-allowed",
      color: isDark ? alpha("#fff", 0.58) : alpha(primary, 0.42),
      background: isDark ? alpha(primary, 0.32) : alpha(primary, 0.1),
      backgroundColor: "transparent",
      borderColor: alpha(primary, isDark ? 0.16 : 0.26),
      boxShadow: "none",
      transform: "none",
    },
  };
}
