import { alpha } from "@mui/material/styles";
import { BRAND_PRIMARY } from "@/theme";
import { DURATION, EASE_SOFT, transition } from "@/constants/motion";

export function statusDialogPaperSx(theme) {
  const isLight = theme.palette.mode === "light";
  return {
    borderRadius: 2,
    overflow: "hidden",
    border: `1px solid ${alpha(BRAND_PRIMARY, isLight ? 0.12 : 0.22)}`,
    boxShadow: isLight
      ? `0 12px 28px ${alpha("#000", 0.1)}`
      : `0 16px 32px ${alpha("#000", 0.42)}`,
  };
}

export const statusDialogTitleSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  py: 1.25,
  px: { xs: 1.5, sm: 2 },
  borderBottom: 1,
  borderColor: "divider",
};

export const statusDialogIconSx = {
  width: 32,
  height: 32,
  borderRadius: 1.25,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  bgcolor: (theme) => alpha(BRAND_PRIMARY, theme.palette.mode === "light" ? 0.08 : 0.18),
  color: "primary.main",
};

export const statusDialogContentSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
  px: { xs: 1.5, sm: 2 },
  py: { xs: 1.25, sm: 1.5 },
};

export const statusDialogActionsSx = {
  px: { xs: 1.5, sm: 2 },
  py: 1.25,
  gap: 1,
  borderTop: 1,
  borderColor: "divider",
  bgcolor: (theme) =>
    alpha(theme.palette.background.default, theme.palette.mode === "light" ? 0.4 : 0.22),
  flexWrap: "wrap",
  justifyContent: "flex-end",
  alignItems: "center",
};

/** Shared footer bar for create/edit dialogs */
export const formDialogActionsSx = statusDialogActionsSx;

export const statusExtraFieldsSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.25,
  pt: 1.25,
  mt: 1,
  borderTop: 1,
  borderColor: "divider",
};

export const statusUpdatePanelSx = {
  borderRadius: 2,
  overflow: "hidden",
  border: 1,
  borderColor: (theme) => alpha(BRAND_PRIMARY, theme.palette.mode === "light" ? 0.12 : 0.2),
  bgcolor: "background.paper",
  boxShadow: (theme) =>
    theme.palette.mode === "light"
      ? `0 4px 16px ${alpha("#000", 0.06)}`
      : `0 6px 18px ${alpha("#000", 0.22)}`,
};

export const statusUpdatePanelHeaderSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  px: { xs: 1.5, sm: 2 },
  py: 1.125,
  borderBottom: 1,
  borderColor: "divider",
};

export const statusUpdatePanelBodySx = {
  px: { xs: 1.5, sm: 2 },
  py: { xs: 1.25, sm: 1.5 },
};

export const statusUpdatePanelActionsSx = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1,
  px: { xs: 1.5, sm: 2 },
  py: 1.25,
  borderTop: 1,
  borderColor: "divider",
  bgcolor: (theme) =>
    alpha(theme.palette.background.default, theme.palette.mode === "light" ? 0.4 : 0.22),
};

export const statusCardMotion = {
  transition: transition("border-color, background-color, box-shadow", DURATION.normal),
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
};

export const statusCardEnter = (index = 0) => ({
  animation: `statusCardIn ${DURATION.normal}ms ${EASE_SOFT} both`,
  animationDelay: `${Math.min(index, 6) * 24}ms`,
  "@keyframes statusCardIn": {
    from: { opacity: 0, transform: "translateY(4px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});
