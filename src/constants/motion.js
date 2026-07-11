/** Shared motion tokens — soft, fluid UI across the dashboard */

export const EASE_SOFT = "cubic-bezier(0.33, 1, 0.68, 1)";
export const EASE_SMOOTH = "cubic-bezier(0.4, 0, 0.2, 1)";
export const EASE_SPRING = "cubic-bezier(0.34, 1.2, 0.64, 1)";

export const DURATION = {
  fast: 160,
  normal: 280,
  slow: 420,
  page: 200,
  theme: 680,
  /** Table row preview offcanvas — enter slightly slower than exit */
  previewDrawerEnter: 400,
  previewDrawerExit: 320,
};

/** Offcanvas slide + backdrop fade (ms) */
export const PREVIEW_DRAWER_MS = {
  enter: DURATION.previewDrawerEnter,
  exit: DURATION.previewDrawerExit,
};

/** Dark / light mode cross-fade */
export const THEME_SWITCH_MS = DURATION.theme;
export const THEME_SWITCH_EASE = EASE_SOFT;

/** CSS transition string for sx props */
export const transition = (
  props = "all",
  duration = DURATION.normal,
  easing = EASE_SOFT
) => {
  const list = props.split(",").map((p) => p.trim());
  return list.map((p) => `${p} ${duration}ms ${easing}`).join(", ");
};

/** Unified smooth hover/active for buttons and icon buttons */
export const BUTTON_TRANSITION = transition(
  "background-color, color, border-color, box-shadow, opacity, transform, filter"
);

/** Subtle hover — color/shadow only (no transform to avoid click jitter) */
export const hoverLift = {
  transition: transition("box-shadow, border-color"),
  "&:hover": {
    boxShadow: "0 4px 16px rgba(86, 37, 108, 0.12)",
  },
};

export const focusRing = (color) => ({
  "&:focus-visible": {
    outline: `2px solid ${color}`,
    outlineOffset: 2,
  },
});
