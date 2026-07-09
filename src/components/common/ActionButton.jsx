import { forwardRef } from "react";
import { Button, CircularProgress, useTheme } from "@mui/material";
import {
  getButtonIntentSx,
  renderButtonIntentIcon,
  resolveButtonIntent,
} from "@/constants/buttonIntents";

/**
 * Semantic primary button — gradient + icon chip by action intent.
 *
 * Intents: create | save | confirm | auth | success | danger | assign | export | send
 */
const ActionButton = forwardRef(function ActionButton(
  {
    intent,
    color,
    size = "medium",
    startIcon,
    endIcon,
    loading = false,
    disabled,
    sx,
    children,
    ...props
  },
  ref
) {
  const theme = useTheme();
  const resolvedIntent = resolveButtonIntent({ intent, color });
  const intentSx = getButtonIntentSx(resolvedIntent, theme, { size });

  const resolvedStartIcon =
    startIcon === undefined ? renderButtonIntentIcon(resolvedIntent, size) : startIcon;

  const icon = loading ? (
    <CircularProgress size={size === "small" ? 16 : size === "large" ? 22 : 18} color="inherit" />
  ) : (
    resolvedStartIcon
  );

  return (
    <Button
      ref={ref}
      variant="contained"
      size={size}
      disabled={disabled || loading}
      startIcon={icon || undefined}
      endIcon={!loading ? endIcon : undefined}
      sx={[intentSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...props}
    >
      {children}
    </Button>
  );
});

export default ActionButton;
