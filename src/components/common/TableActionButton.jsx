import { IconButton, Tooltip, alpha, useTheme } from "@mui/material";
import {
  ArrowArchiveIcon,
  ArrowAssignIcon,
  ArrowEditIcon,
  ArrowDeleteForeverIcon,
  ArrowDuplicateIcon,
  ArrowRestoreIcon,
  ArrowStatusIcon,
  ArrowViewIcon,
} from "@/components/icons/ArrowTableIcons";
import { useTranslation } from "@/context/LanguageContext";
import { BUTTON_TRANSITION } from "@/constants/motion";

const VARIANT_TITLE_KEYS = {
  edit: "common.edit",
  delete: "bulk.moveToTrash",
  restore: "common.restore",
  deletePermanent: "common.deletePermanently",
  view: "common.view",
  assign: "bulk.assignRider",
  status: "bulk.updateStatus",
  duplicate: "table.duplicateRow",
};

const VARIANTS = {
  edit: {
    Icon: ArrowEditIcon,
    title: "Edit",
    colorKey: "primary",
  },
  delete: {
    Icon: ArrowArchiveIcon,
    title: "Move to trash",
    colorKey: "error",
    tint: "#b4235a",
  },
  restore: {
    Icon: ArrowRestoreIcon,
    title: "Restore",
    colorKey: "success",
    tint: "#0d7a5f",
  },
  deletePermanent: {
    Icon: ArrowDeleteForeverIcon,
    title: "Delete permanently",
    colorKey: "error",
    tint: "#9a1b3a",
  },
  view: {
    Icon: ArrowViewIcon,
    title: "View details",
    colorKey: "info",
    tint: "#3d5a80",
  },
  assign: {
    Icon: ArrowAssignIcon,
    title: "Assign rider",
    colorKey: "warning",
    tint: "#9a6700",
  },
  status: {
    Icon: ArrowStatusIcon,
    title: "Update status",
    colorKey: "secondary",
    tint: "#6b4c8a",
  },
  duplicate: {
    Icon: ArrowDuplicateIcon,
    title: "Duplicate",
    colorKey: "info",
    tint: "#5b6b8a",
  },
};

/**
 * Branded table row action — tinted tile + custom Arrow icons.
 */
export default function TableActionButton({
  variant,
  title,
  onClick,
  disabled = false,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const config = VARIANTS[variant];
  if (!config) return null;

  const { Icon } = config;
  const tint = config.tint ?? theme.palette.primary.main;
  const label =
    title ??
    (VARIANT_TITLE_KEYS[variant]
      ? t(VARIANT_TITLE_KEYS[variant], { defaultValue: config.title })
      : config.title);
  const isDark = theme.palette.mode === "dark";

  return (
    <Tooltip title={label} arrow placement="top">
      <span>
        <IconButton
          size="small"
          disabled={disabled}
          onClick={onClick}
          aria-label={label}
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            color: tint,
            bgcolor: alpha(tint, isDark ? 0.22 : 0.1),
            border: `1px solid ${alpha(tint, isDark ? 0.35 : 0.2)}`,
            transition: BUTTON_TRANSITION,
            "&:hover": {
              bgcolor: alpha(tint, isDark ? 0.32 : 0.16),
              boxShadow: `0 2px 6px ${alpha(tint, 0.18)}`,
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0) scale(0.96)",
            },
            "&.Mui-disabled": {
              opacity: 0.45,
              bgcolor: alpha(tint, 0.06),
            },
          }}
        >
          <Icon size={17} />
        </IconButton>
      </span>
    </Tooltip>
  );
}

export { VARIANTS as TABLE_ACTION_VARIANTS };
