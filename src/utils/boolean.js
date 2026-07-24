/** Coerce API / form values to strict boolean. */
export function toBoolean(value, fallback = false) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  if (value == null || value === "") return fallback;
  return Boolean(value);
}

/** Field types where empty string means "cleared" and should be sent as null. */
const NULL_IF_EMPTY_TYPES = new Set([
  "select",
  "buttonSelect",
  "number",
  "file",
  "date",
  "datetime",
]);

/**
 * Prepare form state for PATCH/POST.
 * - Booleans stay boolean
 * - Empty select/number/date/file → null (cleared relation / value)
 * - Empty text/email/password/multiline stay "" (blank=True DB fields reject null)
 * - Empty password / requiredOnCreate fields are omitted (optional on update)
 */
export function serializeFormPayload(form, fields = []) {
  const fieldByName = Object.fromEntries(
    (fields || []).map((f) => [f.name, f]),
  );
  const booleanKeys = new Set(
    fields.filter((f) => f.type === "boolean").map((f) => f.name),
  );
  const payload = { ...form };

  Object.keys(payload).forEach((key) => {
    if (booleanKeys.has(key)) {
      payload[key] = toBoolean(payload[key]);
      return;
    }
    if (payload[key] !== "") return;
    const field = fieldByName[key];
    if (field && NULL_IF_EMPTY_TYPES.has(field.type)) {
      payload[key] = null;
    }
  });

  // Don't send empty create-only / password fields — avoids "required" API
  // errors on update when the label has no *.
  Object.keys(payload).forEach((key) => {
    const field = fieldByName[key];
    if (!field) return;
    if (field.type !== "password" && !field.requiredOnCreate) return;
    if (payload[key] == null || payload[key] === "") delete payload[key];
  });

  return payload;
}
