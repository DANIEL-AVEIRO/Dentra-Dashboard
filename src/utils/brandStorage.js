const BRAND_STORAGE_KEY = "dentra-admin-brand";

export function getStoredBrand() {
  try {
    const raw =
      localStorage.getItem(BRAND_STORAGE_KEY) ||
      localStorage.getItem("arrow-admin-brand");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredBrand(brand) {
  if (!brand) return;
  try {
    const payload = {
      logo: brand.logo ?? null,
      primary: brand.primary,
      secondary: brand.secondary,
      dark: brand.dark,
      darker: brand.darker,
    };
    localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function clearStoredBrand() {
  try {
    localStorage.removeItem(BRAND_STORAGE_KEY);
    localStorage.removeItem("arrow-admin-brand");
  } catch {
    /* ignore */
  }
}
