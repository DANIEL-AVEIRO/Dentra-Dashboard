import { Box, Tooltip, alpha, useTheme } from "@mui/material";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { TABLE_ACTION_VARIANTS } from "@/components/common/TableActionButton";
import { transition } from "@/constants/motion";

const ACTION_ID_TO_VARIANT = {
  assign: "assign",
  status: "status",
  delete: "delete",
  restore: "restore",
  "delete-permanent": "deletePermanent",
};

const EXTRA_ACTION_CONFIG = {
  slips: {
    tint: "#3d5a80",
    Icon: LocalPrintshopOutlinedIcon,
    muiIcon: true,
  },
  activate: {
    tint: "#0d7a5f",
    Icon: ToggleOnOutlinedIcon,
    muiIcon: true,
  },
  deactivate: {
    tint: "#637381",
    Icon: ToggleOffOutlinedIcon,
    muiIcon: true,
  },
};

const COLOR_TINTS = {
  error: "#b4235a",
  success: "#0d7a5f",
  warning: "#9a6700",
  secondary: "#6b4c8a",
  info: "#3d5a80",
};

function resolveActionConfig(action, theme) {
  const primary = theme.palette.primary.main;
  const variantKey = ACTION_ID_TO_VARIANT[action.id];
  if (variantKey && TABLE_ACTION_VARIANTS[variantKey]) {
    const variant = TABLE_ACTION_VARIANTS[variantKey];
    return {
      ...variant,
      tint: variant.tint ?? primary,
    };
  }
  if (EXTRA_ACTION_CONFIG[action.id]) {
    return EXTRA_ACTION_CONFIG[action.id];
  }
  return {
    tint: COLOR_TINTS[action.color] ?? primary,
    Icon: null,
    muiIcon: false,
  };
}

function renderActionIcon(action, config) {
  if (action.icon) return action.icon;

  const { Icon, muiIcon } = config;
  if (!Icon) return null;
  if (muiIcon) return <Icon sx={{ fontSize: 15 }} />;
  return <Icon size={15} />;
}

/**
 * Pill-style bulk action — matches TableActionButton tints with visible label.
 */
export default function TableBulkActionButton({ action }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const config = resolveActionConfig(action, theme);
  const { tint } = config;
  const disabled = Boolean(action.disabled);

  return (
    <Tooltip title={action.label} arrow placement="top">
      <Box
        component="span"
        sx={{ display: "inline-flex", maxWidth: "100%" }}
      >
        <Box
          component="button"
          type="button"
          disabled={disabled}
          onClick={action.onClick}
          aria-label={action.label}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.875,
            px: 1.375,
            py: 0.625,
            minHeight: 36,
            borderRadius: 999,
            border: `1px solid ${alpha(tint, isDark ? 0.38 : 0.22)}`,
            bgcolor: alpha(tint, isDark ? 0.2 : 0.08),
            color: tint,
            fontWeight: 600,
            fontSize: "0.8125rem",
            lineHeight: 1.2,
            fontFamily: "inherit",
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.48 : 1,
            transition: transition(
              "background-color, border-color, box-shadow, transform"
            ),
            "&:hover:not(:disabled)": {
              bgcolor: alpha(tint, isDark ? 0.3 : 0.14),
              borderColor: alpha(tint, isDark ? 0.5 : 0.32),
              boxShadow: `0 2px 8px ${alpha(tint, 0.16)}`,
            },
            "&:active:not(:disabled)": {
              transform: "scale(0.98)",
            },
            "&:focus-visible": {
              outline: `2px solid ${alpha(tint, 0.45)}`,
              outlineOffset: 2,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              flexShrink: 0,
              borderRadius: "50%",
              bgcolor: alpha(tint, isDark ? 0.28 : 0.14),
              "& .MuiCircularProgress-root": {
                color: "inherit",
              },
            }}
          >
            {renderActionIcon(action, config)}
          </Box>
          <Box component="span" sx={{ pr: 0.25 }}>
            {action.label}
          </Box>
        </Box>
      </Box>
    </Tooltip>
  );
}
