const STORAGE_PREFIX = "arrow:list-view:";

export function readStoredListSearch(pathname) {
  if (!pathname) return "";
  try {
    return sessionStorage.getItem(`${STORAGE_PREFIX}${pathname}`) || "";
  } catch {
    return "";
  }
}

export function writeStoredListSearch(pathname, search) {
  if (!pathname) return;
  try {
    const key = `${STORAGE_PREFIX}${pathname}`;
    const normalized = (search || "").replace(/^\?/, "").trim();
    if (!normalized) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, normalized);
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function listPathWithStoredSearch(pathname) {
  const stored = readStoredListSearch(pathname);
  return stored ? `${pathname}?${stored}` : pathname;
}

/** Navigate to a detail row — remember list URL (filters, sort, page). */
export function navigateToListDetail(navigate, location, detailPath) {
  const pathname = location.pathname;
  const search = location.search.replace(/^\?/, "");
  writeStoredListSearch(pathname, search);
  const from = search ? `${pathname}?${search}` : pathname;
  navigate(detailPath, { state: { listReturnTo: from } });
}

/** Resolve back link for detail pages. */
export function resolveListBackPath(location, fallbackPath) {
  const fromState = location.state?.listReturnTo;
  if (typeof fromState === "string" && fromState.startsWith("/")) {
    return fromState;
  }
  return listPathWithStoredSearch(fallbackPath);
}

export function parseStatusParam(value) {
  if (!value || typeof value !== "string") return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export function formatStatusParam(values) {
  if (!values?.length) return "";
  return values.join(",");
}

export function parsePageParam(value, fallback = 1) {
  const n = parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}
