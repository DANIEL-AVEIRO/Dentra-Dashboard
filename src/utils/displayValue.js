import {
  formatDisplayDate,
  formatDisplayDateTime,
  isDateOnlyFieldKey,
  isDateTimeFieldKey,
} from "@/utils/dateTimeValue";

/** Hide raw UUIDs in UI; prefer related *_name / *_display fields. */

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value) {
  if (value == null) return false;
  return UUID_RE.test(String(value).trim());
}

function looksLikeIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function looksLikeIsoDateTime(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value);
}

/** Normalize FK values from API (UUID string or nested { id }). */
export function coerceFkId(value) {
  if (value == null || value === "") return "";
  if (typeof value === "object") {
    const id = value.id ?? value.value;
    return id != null && id !== "" ? String(id).trim() : "";
  }
  return String(value).trim();
}

const FK_LABEL_KEYS = {
  user: ["user_name", "username"],
  region: ["region_name"],
  township: ["township_name"],
  branch: ["branch_name"],
  role: ["role_name"],
  plan: ["plan_name"],
  to_user: ["to_user_name"],
  category: ["category_name"],
  created_by: ["created_by_name", "created_by_username", "created_by_display"],
  updated_by: ["updated_by_name", "updated_by_username", "updated_by_display"],
  deleted_by: ["deleted_by_name", "deleted_by_username", "deleted_by_display"],
};

export function resolveDisplayValue(row, key, rawValue) {
  if (rawValue == null || rawValue === "") return null;

  if (typeof rawValue === "object") {
    if (rawValue.label != null) return String(rawValue.label);
    if (rawValue.name != null) return String(rawValue.name);
    if (rawValue.username != null) return String(rawValue.username);
    return null;
  }

  const str = String(rawValue);
  if (!isUuid(str)) return str;

  const keys = FK_LABEL_KEYS[key] || [`${key}_name`, `${key}_display`, `${key}_id`];
  for (const alt of keys) {
    const v = row?.[alt];
    if (v != null && v !== "" && !isUuid(String(v))) return String(v);
  }
  return null;
}

/** Table cell / detail value — never show bare UUID. */
export function formatCellValue(row, key) {
  const raw = row?.[key];
  const resolved = resolveDisplayValue(row, key, raw);
  if (resolved != null) return resolved;
  if (raw == null || raw === "") return "—";
  if (isUuid(String(raw))) return "—";
  if (isDateTimeFieldKey(key) || looksLikeIsoDateTime(raw)) {
    return formatDisplayDateTime(raw);
  }
  if (isDateOnlyFieldKey(key) || looksLikeIsoDate(raw)) {
    return formatDisplayDate(raw);
  }
  return String(raw);
}

/**
 * Table row preview offcanvas — never show bare FK UUIDs; prefer *_name / *_display.
 */
export function formatPreviewFieldValue(row, field) {
  if (!row || !field) return null;

  if (field.render) {
    const rendered = field.render(row);
    if (rendered == null || rendered === "") return null;
    if (typeof rendered === "string" || typeof rendered === "number") {
      const str = String(rendered).trim();
      if (!str || str === "—") return null;
      if (isUuid(str)) {
        return resolveDisplayValue(row, field.key, str);
      }
      return str;
    }
    return rendered;
  }

  const formatted = formatCellValue(row, field.key);
  if (formatted == null || formatted === "" || formatted === "—") return null;
  if (isUuid(String(formatted))) return null;
  return formatted;
}

/** Map FK field → label field returned by API when UUID is stripped on read. */
const FK_NAME_FALLBACK = {
  region: "region_name",
  township: "township_name",
  user: "user_name",
  branch: "branch_name",
  role: "role_name",
  plan: "plan_name",
  category: "category_name",
  material: "material_name",
  material_size: "material_size_name",
  to_user: "to_user_name",
  clinic: "clinic_name",
  dentist: "dentist_name",
};

/** Export / display label for FK fields when API omits UUID. */
export function getSelectDisplayLabel(row, fieldName) {
  const nameKey = FK_NAME_FALLBACK[fieldName];
  if (!nameKey || !row) return null;
  const label = row[nameKey];
  return label != null && label !== "" ? String(label) : null;
}

function matchOptionByLabel(options, label) {
  if (!label || !options?.length) return null;
  const s = String(label).trim();
  return options.find(
    (o) =>
      String(o.label).trim() === s ||
      String(o.label).trim().startsWith(`${s} —`) ||
      String(o.label).includes(s)
  );
}

/** Prefill select/multiSelect when API omits FK UUIDs (uses *_name labels). */
export function resolveSelectValue(row, field, options = []) {
  const raw = row?.[field.name];
  if (raw != null && raw !== "" && !isUuid(String(raw))) return raw;

  if (field.type === "multiSelect") {
    if (Array.isArray(raw) && raw.length) {
      return raw.map((item) =>
        typeof item === "object" && item != null ? item.id ?? item : item
      );
    }
    const namesKey = field.namesKey || "role_names";
    const names = row?.[namesKey];
    if (!Array.isArray(names) || !options.length) return [];
    return names
      .map((name) => matchOptionByLabel(options, name)?.value)
      .filter((v) => v != null);
  }

  const nameKey = FK_NAME_FALLBACK[field.name];
  if (!nameKey) return raw ?? "";
  const label = row?.[nameKey];
  if (!label) return "";
  return matchOptionByLabel(options, label)?.value ?? "";
}

/** Confirm dialogs, trash rows, etc. */
export function rowLabelFromRow(row, columns = []) {
  if (!row) return "—";
  if (row.display && !isUuid(row.display)) return row.display;

  for (const col of columns) {
    const v = formatCellValue(row, col.key);
    if (v && v !== "—") return v;
  }

  const fallbacks = [
    "username",
    "name",
    "title",
    "email",
    "phone",
    "employee_code",
    "invoice_number",
    "receipt_number",
  ];
  for (const key of fallbacks) {
    const v = formatCellValue(row, key);
    if (v && v !== "—") return v;
  }

  return "—";
}
