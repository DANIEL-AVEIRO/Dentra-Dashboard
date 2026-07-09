/** Secret admin sign-in URL (obscurity + 404 everywhere else). */
function normalizeLoginPath(raw) {
  const value = (raw || "/sfkicv").trim();
  if (!value || value === "/") return "/sfkicv";
  return value.startsWith("/") ? value : `/${value}`;
}

export const LOGIN_PATH = normalizeLoginPath(import.meta.env.VITE_LOGIN_PATH);

/** React Router `path` segment (no leading slash). */
export const LOGIN_ROUTE = LOGIN_PATH.replace(/^\//, "");

export function isLoginPath(pathname) {
  if (!pathname) return false;
  const normalized = pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
  return normalized === LOGIN_PATH;
}
