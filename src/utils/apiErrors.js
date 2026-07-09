/** DRF field errors → { fieldName: message } */
export function extractApiFieldErrors(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  const errors = {};
  for (const [key, val] of Object.entries(data)) {
    if (key === "detail" || key === "non_field_errors") continue;
    if (Array.isArray(val) && val[0]) errors[key] = String(val[0]);
    else if (typeof val === "string") errors[key] = val;
  }
  return errors;
}

/** Human-readable toast text with field labels */
export function formatApiErrorMessage(data, labelForField = (k) => k) {
  if (!data) return null;
  if (data.detail) return String(data.detail);
  if (data.non_field_errors?.[0]) return String(data.non_field_errors[0]);

  const fieldErrors = extractApiFieldErrors(data);
  const keys = Object.keys(fieldErrors);
  if (keys.length === 0) return null;

  return keys
    .map((key) => `${labelForField(key)}: ${fieldErrors[key]}`)
    .join(" · ");
}
