/** Whether this field must be filled for the current create/edit mode */
export function isFieldRequired(field, editing) {
  if (field?.hideInForm) return false;
  if (field?.requiredOnCreate && !editing) return true;
  return Boolean(field?.required);
}

function isEmptyValue(field, value) {
  if (field.type === "boolean") return false;
  if (field.type === "multiSelect" || field.type === "permissionCheckboxes") {
    return !Array.isArray(value) || value.length === 0;
  }
  if (field.type === "file") {
    return value == null || value === "";
  }
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

/**
 * Client-side required checks for modal/resource forms.
 * Returns { valid, errors } where errors is { fieldName: message }.
 */
export function validateResourceForm(fields, form, editing, t) {
  const errors = {};

  for (const field of fields) {
    if (!isFieldRequired(field, editing)) continue;
    if (isEmptyValue(field, form[field.name])) {
      errors[field.name] = t("validation.required", {
        field: field.label || field.name,
      });
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
