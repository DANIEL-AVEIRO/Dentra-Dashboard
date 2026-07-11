import { forwardRef } from "react";
import { Button, CircularProgress, alpha, useTheme } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TABLE_ACTION_VARIANTS } from "@/components/common/TableActionButton";
import { BUTTON_PILL_RADIUS } from "@/constants/shape";
import { BUTTON_TRANSITION } from "@/constants/motion";

const EXTRA_VARIANTS = {
  cancel: {
    tint: "#637381",
    Icon: CloseRoundedIcon,
    muiIcon: true,
  },
};

function resolveVariant(variant) {
  if (TABLE_ACTION_VARIANTS[variant]) {
    return TABLE_ACTION_VARIANTS[variant];
  }
  if (EXTRA_VARIANTS[variant]) {
    return EXTRA_VARIANTS[variant];
  }
  return TABLE_ACTION_VARIANTS.edit;
}

function iconSize(size) {
  return size === "small" ? 15 : 17;
}

function iconChipSize(size) {
  return size === "small" ? 26 : 30;
}

export function getToolbarActionSx(theme, tint, { size = "small", active = false } = {}) {
  const isDark = theme.palette.mode === "dark";
  const isLight = !isDark;
  const chip = iconChipSize(size);

  return {
    textTransform: "none",
    fontWeight: 700,
    letterSpacing: "0.01em",
    borderRadius: BUTTON_PILL_RADIUS,
    px: size === "small" ? 1.25 : 1.5,
    py: size === "small" ? 0.625 : 0.75,
    minHeight: size === "small" ? 36 : 40,
    color: tint,
    bgcolor: alpha(tint, active ? (isDark ? 0.28 : 0.14) : isDark ? 0.18 : 0.07),
    border: `1px solid ${alpha(tint, active ? (isDark ? 0.52 : 0.36) : isDark ? 0.38 : 0.22)}`,
    boxShadow: active
      ? `0 4px 14px ${alpha(tint, 0.16)}, inset 0 1px 0 ${alpha("#fff", isLight ? 0.45 : 0.08)}`
      : isLight
        ? `0 1px 4px ${alpha(tint, 0.08)}`
        : `0 2px 8px ${alpha("#000", 0.18)}`,
    transition: BUTTON_TRANSITION,
    "& .MuiButton-startIcon": {
      marginRight: 0.75,
      marginLeft: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: chip,
      height: chip,
      borderRadius: "50%",
      bgcolor: alpha(tint, active ? (isDark ? 0.4 : 0.22) : isDark ? 0.28 : 0.14),
      boxShadow: `inset 0 1px 0 ${alpha("#fff", isLight ? 0.35 : 0.08)}`,
      "& .MuiSvgIcon-root, & svg": {
        fontSize: iconSize(size),
      },
      "& .MuiCircularProgress-root": {
        color: "inherit",
      },
    },
    "&:hover": {
      bgcolor: alpha(tint, isDark ? 0.28 : 0.12),
      borderColor: alpha(tint, isDark ? 0.52 : 0.34),
      color: tint,
      boxShadow: `0 4px 14px ${alpha(tint, 0.18)}`,
      transform: "translateY(-1px)",
      "& .MuiButton-startIcon": {
        bgcolor: alpha(tint, isDark ? 0.36 : 0.2),
      },
    },
    "&:active": {
      transform: "translateY(0) scale(0.985)",
    },
    "&.Mui-disabled": {
      color: alpha(tint, 0.55),
      borderColor: alpha(tint, isDark ? 0.2 : 0.12),
      bgcolor: alpha(tint, isDark ? 0.08 : 0.04),
      boxShadow: "none",
      transform: "none",
    },
    "&:focus-visible": {
      outline: `2px solid ${alpha(tint, 0.45)}`,
      outlineOffset: 2,
    },
  };
}

/**
 * Page toolbar action — tinted pill with icon chip (detail headers, panels).
 *
 * variant: edit | status | assign | view | cancel | …
 */
const ToolbarActionButton = forwardRef(function ToolbarActionButton(
  {
    variant = "edit",
    size = "small",
    active = false,
    loading = false,
    startIcon,
    disabled,
    sx,
    children,
    ...props
  },
  ref
) {
  const theme = useTheme();
  const config = resolveVariant(variant);
  const tint = config.tint ?? theme.palette.primary.main;
  const actionSx = getToolbarActionSx(theme, tint, { size, active });

  const DefaultIcon = config.Icon;
  const icon = loading ? (
    <CircularProgress size={size === "small" ? 14 : 16} color="inherit" />
  ) : startIcon !== undefined ? (
    startIcon
  ) : config.muiIcon ? (
    <DefaultIcon sx={{ fontSize: iconSize(size) }} />
  ) : (
    <DefaultIcon size={iconSize(size)} />
  );

  return (
    <Button
      ref={ref}
      size={size}
      disabled={disabled || loading}
      startIcon={icon || undefined}
      sx={[actionSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...props}
    >
      {children}
    </Button>
  );
});

export default ToolbarActionButton;
