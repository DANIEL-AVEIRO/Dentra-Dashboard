/** Coerce API / form values to strict boolean. */
export function toBoolean(value, fallback = false) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  if (value == null || value === "") return fallback;
  return Boolean(value);
}

/** Prepare form state for PATCH/POST — boolean fields stay boolean. */
export function serializeFormPayload(form, fields = []) {
  const booleanKeys = new Set(
    fields.filter((f) => f.type === "boolean").map((f) => f.name)
  );
  const payload = { ...form };

  Object.keys(payload).forEach((key) => {
    if (booleanKeys.has(key)) {
      payload[key] = toBoolean(payload[key]);
      return;
    }
    if (payload[key] === "") delete payload[key];
  });

  return payload;
}
