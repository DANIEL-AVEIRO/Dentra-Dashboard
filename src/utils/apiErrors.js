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

function capitalizeMessage(message) {
  const text = String(message ?? "").trim();
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Turn DRF field messages into plain, user-facing copy */
export function humanizeFieldMessage(message, fieldLabel = "This field") {
  const msg = String(message ?? "").trim();
  const label = fieldLabel || "This field";

  if (/^this field is required\.?$/i.test(msg)) {
    return `${label} is required`;
  }
  if (/^this field may not be blank\.?$/i.test(msg)) {
    return `${label} cannot be blank`;
  }
  if (/^this field may not be null\.?$/i.test(msg)) {
    return `${label} is required`;
  }
  if (/with this .+ already exists\.?$/i.test(msg)) {
    return `This ${label.toLowerCase()} is already in use`;
  }
  if (/^enter a valid email address\.?$/i.test(msg)) {
    return `Please enter a valid ${label.toLowerCase()}`;
  }
  if (/^enter a valid /i.test(msg)) {
    return capitalizeMessage(msg);
  }

  return capitalizeMessage(msg);
}

export function fieldLabelFromFields(fields) {
  const map = Object.fromEntries(
    (fields ?? []).map((f) => [f.name, f.label || f.name]),
  );
  return (key) => map[key] || key.replace(/_/g, " ");
}

/** Map API validation errors to { fieldName: friendlyMessage } for inline forms */
export function apiFieldErrorsForForm(data, fields) {
  const raw = extractApiFieldErrors(data);
  const labelFor = fieldLabelFromFields(fields);
  const errors = {};
  for (const [key, message] of Object.entries(raw)) {
    errors[key] = humanizeFieldMessage(message, labelFor(key));
  }
  return errors;
}

/** Human-readable toast text */
export function formatApiErrorMessage(data, labelForField = (k) => k) {
  if (!data) return null;
  if (data.detail) return capitalizeMessage(String(data.detail));
  if (data.non_field_errors?.[0]) {
    return capitalizeMessage(String(data.non_field_errors[0]));
  }

  const fieldErrors = extractApiFieldErrors(data);
  const keys = Object.keys(fieldErrors);
  if (keys.length === 0) return null;

  return keys
    .map((key) =>
      humanizeFieldMessage(fieldErrors[key], labelForField(key)),
    )
    .join(" · ");
}
