import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.jsx";
import { getStoredLocale } from "@/i18n";
import { initAnalytics } from "@/utils/analytics";
import { captureException, initErrorMonitoring } from "@/utils/errorMonitoring";
import { applyBrandCssVars } from "@/utils/brandPalette";
import { getStoredBrand } from "@/utils/brandStorage";
import { normalizeBrandPayload } from "@/constants/brand";

initAnalytics();
initErrorMonitoring();

if (typeof window !== "undefined") {
  window.__arrowCaptureException = captureException;
}

document.documentElement.lang = getStoredLocale();

const cachedBrand = getStoredBrand();
if (cachedBrand) {
  applyBrandCssVars(normalizeBrandPayload(cachedBrand));
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
