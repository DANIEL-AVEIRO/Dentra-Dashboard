import { useEffect } from "react";
import { toast } from "@/utils/toast";

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return Boolean(el.isContentEditable);
}

function focusFirstSearch() {
  const root = document.getElementById("main-content") || document;
  const input = root.querySelector('input[type="search"]');
  if (input) {
    input.focus();
    input.select?.();
    return true;
  }
  return false;
}

/**
 * Global dashboard shortcuts: / or Cmd+K → focus search; ? → shortcut help.
 */
export default function useKeyboardShortcuts({ onShowHelp } = {}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTypingTarget(document.activeElement)) return;

      const mod = e.metaKey || e.ctrlKey;

      if ((e.key === "/" && !mod) || (mod && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        focusFirstSearch();
        return;
      }

      if (e.key === "?" && !mod) {
        e.preventDefault();
        if (onShowHelp) {
          onShowHelp();
          return;
        }
        if (import.meta.env.DEV) {
          console.info(
            "[Arrow shortcuts] / or Cmd+K: focus search · ?: show this help"
          );
        }
        toast.info("/ or ⌘K — focus search\n? — keyboard shortcuts");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onShowHelp]);
}
