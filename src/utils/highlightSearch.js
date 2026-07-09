/** Escape special regex characters in a search string. */
export function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** OR-match each whitespace-separated search term (case-insensitive). */
export function buildSearchHighlightRegex(query) {
  const trimmed = query?.trim();
  if (!trimmed) return null;
  const terms = trimmed.split(/\s+/).filter(Boolean);
  if (!terms.length) return null;
  return new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
}

/**
 * Split display text into segments for highlight rendering.
 * @returns {{ text: string, match: boolean }[]}
 */
export function splitBySearchQuery(text, query) {
  const str = text == null ? "" : String(text);
  const trimmed = query?.trim();
  if (!trimmed) return [{ text: str, match: false }];

  const terms = trimmed.split(/\s+/).filter(Boolean);
  const lowered = terms.map((t) => t.toLowerCase());
  const re = buildSearchHighlightRegex(trimmed);
  if (!re) return [{ text: str, match: false }];

  return str
    .split(re)
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      match: lowered.includes(part.toLowerCase()),
    }));
}
