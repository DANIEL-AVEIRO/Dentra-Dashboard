import { useEffect, useRef } from "react";

export function useTableKeyboardNav({
  rows,
  enabled = true,
  onOpenRow,
  onClearSelection,
}) {
  const indexRef = useRef(-1);

  useEffect(() => {
    if (!enabled) return undefined;

    const onKeyDown = (event) => {
      if (!rows.length) return;
      const tag = event.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        indexRef.current = Math.min(indexRef.current + 1, rows.length - 1);
        onOpenRow?.(rows[indexRef.current], { previewOnly: true });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        indexRef.current = Math.max(indexRef.current - 1, 0);
        onOpenRow?.(rows[indexRef.current], { previewOnly: true });
      } else if (event.key === "Enter" && indexRef.current >= 0) {
        event.preventDefault();
        onOpenRow?.(rows[indexRef.current], { previewOnly: false });
      } else if (event.key === "Escape") {
        indexRef.current = -1;
        onClearSelection?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, onClearSelection, onOpenRow, rows]);
}
