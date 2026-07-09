/** Global in-flight request counter for the top loading bar (debounced to avoid flicker). */

let pending = 0;
let visible = false;
const listeners = new Set();

let showTimer = null;
let hideTimer = null;

const SHOW_DELAY_MS = 450;
const HIDE_DELAY_MS = 200;

function emit() {
  listeners.forEach((fn) => fn(visible));
}

function scheduleShow() {
  clearTimeout(showTimer);
  if (visible) return;
  showTimer = setTimeout(() => {
    if (pending > 0) {
      visible = true;
      emit();
    }
  }, SHOW_DELAY_MS);
}

function scheduleHide() {
  clearTimeout(showTimer);
  clearTimeout(hideTimer);
  if (pending > 0) return;
  hideTimer = setTimeout(() => {
    if (pending === 0) {
      visible = false;
      emit();
    }
  }, HIDE_DELAY_MS);
}

export function subscribeLoading(listener) {
  listeners.add(listener);
  listener(visible);
  return () => listeners.delete(listener);
}

export function startTopLoading() {
  pending += 1;
  clearTimeout(hideTimer);
  scheduleShow();
}

export function stopTopLoading() {
  pending = Math.max(0, pending - 1);
  if (pending === 0) {
    scheduleHide();
  }
}

export function trackRequest(config) {
  if (config?.skipTopLoader) return;
  config._trackTopLoader = true;
  startTopLoading();
}

export function untrackRequest(config) {
  if (config?._trackTopLoader) {
    config._trackTopLoader = false;
    stopTopLoading();
  }
}

export function getPendingCount() {
  return pending;
}
