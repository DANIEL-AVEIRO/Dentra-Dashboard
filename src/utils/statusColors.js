import { alpha } from "@mui/material/styles";
import { getStatusMeta } from "@/config/statuses";

/** Semantic tones for workflow states — light/dark aware. */
const TONE_PALETTE = {
  pending: {
    light: { main: "#D97706", bg: "#FFFBEB", border: "#FCD34D", text: "#92400E" },
    dark: { main: "#FBBF24", bg: "#3D2E0A", border: "#92400E", text: "#FDE68A" },
  },
  info: {
    light: { main: "#0284C7", bg: "#F0F9FF", border: "#7DD3FC", text: "#075985" },
    dark: { main: "#38BDF8", bg: "#0C2D44", border: "#0369A1", text: "#BAE6FD" },
  },
  progress: {
    light: { main: "#4F46E5", bg: "#EEF2FF", border: "#A5B4FC", text: "#3730A3" },
    dark: { main: "#818CF8", bg: "#1E1B4B", border: "#4338CA", text: "#C7D2FE" },
  },
  brand: {
    light: { main: "#EC0D13", bg: "#FEF5F5", border: "#F5A8A8", text: "#8C0609" },
    dark: { main: "#FF6B6B", bg: "#2A1414", border: "#EC0D13", text: "#FFE8E8" },
  },
  success: {
    light: { main: "#059669", bg: "#ECFDF5", border: "#6EE7B7", text: "#065F46" },
    dark: { main: "#34D399", bg: "#064E3B", border: "#047857", text: "#A7F3D0" },
  },
  danger: {
    light: { main: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B" },
    dark: { main: "#F87171", bg: "#450A0A", border: "#B91C1C", text: "#FECACA" },
  },
  warning: {
    light: { main: "#EA580C", bg: "#FFF7ED", border: "#FDBA74", text: "#9A3412" },
    dark: { main: "#FB923C", bg: "#431407", border: "#C2410C", text: "#FED7AA" },
  },
  neutral: {
    light: { main: "#64748B", bg: "#F8FAFC", border: "#CBD5E1", text: "#334155" },
    dark: { main: "#94A3B8", bg: "#1E293B", border: "#475569", text: "#E2E8F0" },
  },
};

/** Fallback tone when value is not listed on a status config array. */
export const STATUS_VALUE_TONES = {
  pending: "pending",
  paid: "success",
  draft: "pending",
  generated: "success",
  active: "success",
  inactive: "neutral",
  received: "success",
  short: "danger",
  awaiting: "pending",
  partial: "warning",
};

export function getStatusTone(value, statusList) {
  if (value == null || value === "") return "neutral";
  const meta = statusList?.length ? getStatusMeta(statusList, value) : null;
  if (meta?.tone) return meta.tone;
  return STATUS_VALUE_TONES[String(value)] || "neutral";
}

export function getStatusToneColors(theme, tone = "neutral") {
  const mode = theme.palette.mode === "dark" ? "dark" : "light";
  const palette = TONE_PALETTE[tone] || TONE_PALETTE.neutral;
  return palette[mode];
}

/** Accent line / border color for status cards and filters. */
export function resolveStatusAccent(theme, value, statusList) {
  return getStatusToneColors(theme, getStatusTone(value, statusList)).main;
}

/** Professional soft chip styling shared across the dashboard. */
export function getStatusChipSx(theme, value, statusList, { size = "sm" } = {}) {
  const colors = getStatusToneColors(theme, getStatusTone(value, statusList));
  const height = size === "xs" ? 20 : 24;
  const fontSize = size === "xs" ? "0.6875rem" : "0.8125rem";

  return {
    height,
    fontWeight: 600,
    fontSize,
    letterSpacing: "0.01em",
    bgcolor: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    boxShadow: `inset 0 1px 0 ${alpha("#ffffff", theme.palette.mode === "light" ? 0.65 : 0.08)}`,
    "& .MuiChip-label": {
      px: size === "xs" ? 0.75 : 1,
      py: 0,
    },
  };
}
