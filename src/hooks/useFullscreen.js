import { useCallback, useEffect, useState } from "react";

export function useFullscreen() {
  const [active, setActive] = useState(
    () =>
      typeof document !== "undefined" && Boolean(document.fullscreenElement),
  );

  useEffect(() => {
    const onChange = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const supported =
    typeof document !== "undefined" &&
    typeof document.documentElement?.requestFullscreen === "function";

  const toggle = useCallback(async () => {
    if (!supported) return;
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* user denied or browser blocked */
    }
  }, [supported]);

  return { active, toggle, supported };
}
