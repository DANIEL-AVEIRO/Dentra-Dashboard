import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/utils/analytics";

function resetScrollPosition() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const main = document.querySelector("main");
  if (main) main.scrollTop = 0;
}

/** Reset window (and main) scroll when navigating between dashboard routes. */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) return;
    resetScrollPosition();
  }, [pathname, hash]);

  useLayoutEffect(() => {
    trackPageView(`${pathname}${search}`);
  }, [pathname, search]);

  return null;
}
