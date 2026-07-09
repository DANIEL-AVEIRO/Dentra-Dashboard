import { THEME_SWITCH_MS } from "@/constants/motion";

let clearTimer = null;

/** Brief global class so colors ease instead of snapping. */
export function beginThemeTransition() {
  const root = document.documentElement;
  root.classList.add("theme-transitioning");
  if (clearTimer) window.clearTimeout(clearTimer);
  clearTimer = window.setTimeout(() => {
    root.classList.remove("theme-transitioning");
    clearTimer = null;
  }, THEME_SWITCH_MS + 120);
}

/**
 * Run a state update with the smoothest available theme animation.
 * Uses View Transitions when supported; falls back to CSS color transitions.
 */
export function runThemeSwitch(update) {
  if (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function"
  ) {
    document.startViewTransition(() => {
      update();
    });
    return;
  }

  beginThemeTransition();
  update();
}
