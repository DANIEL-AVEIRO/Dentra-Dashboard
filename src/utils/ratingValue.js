/** Parse rating stored as number or "1"–"5" for MUI Rating (1–max). */
export function parseRatingValue(value, max = 5) {
  const n = parseInt(String(value ?? "").trim(), 10);
  if (Number.isNaN(n) || n < 1) return null;
  return Math.min(max, Math.max(1, n));
}
