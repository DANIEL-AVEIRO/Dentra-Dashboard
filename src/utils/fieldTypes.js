import {
  MULTILINE_MAX_ROWS,
  MULTILINE_DEFAULT_ROWS,
  MULTILINE_LONG_TEXT_ROWS,
  MULTILINE_MIN_ROWS,
} from "@/components/common/form/fieldStyles";

/** Field names that are always boolean toggles (active/inactive, flags, calculators). */
export const BOOLEAN_FIELD_NAMES = new Set([
  "is_active",
  "active",
  "is_staff",
  "is_superuser",
  "is_developer",
  "is_online",
  "visible",
  "enabled",
  "published",
  "profit_loss_calculator",
  "budget_plan_calculator",
  "raw_material_cost_calculator",
  "supplier_pre_washed",
]);

const BOOLEAN_COLUMN_KEYS = new Set([
  ...BOOLEAN_FIELD_NAMES,
  "staff",
]);

/** Multiline fields that typically need more lines. */
const LONG_TEXT_FIELD_NAMES = new Set([
  "address",
  "description",
  "message",
  "remark",
  "note",
  "delivery_note",
  "pickup_note",
  "delivery_address",
  "pickup_address",
  "special_instruction",
  "package_content",
  "delivery_fail_reason",
  "fail_reason_text",
  "reject_reason",
  "comment",
]);

const COMPACT_FIELD_NAMES = new Set([
  "phone",
  "email",
  "username",
  "password",
  "otp",
  "code",
  "pieces",
  "items",
  "weight_kg",
  "item_price",
  "cod_amount",
  "delivery_fee",
  "gate_transport_fee",
  "transportation_charges",
  "max_weight_kg",
  "max_dimension_ft",
  "base_price",
  "rider_id",
  "pickup_id",
  "delivery_id",
  "merchant_id",
  "bank_account_number",
  "time_range",
]);

const COMPACT_FIELD_SUFFIXES = [
  "_phone",
  "_email",
  "_code",
  "_amount",
  "_fee",
  "_kg",
  "_ft",
  "_id",
  "_number",
  "_count",
  "_price",
  "_date",
];

const COMPACT_FIELD_MAX_WIDTH = {
  email: 360,
  tel: 280,
  number: 220,
  date: 240,
  default: 320,
};

export function isBooleanFieldName(name) {
  if (!name || typeof name !== "string") return false;
  if (BOOLEAN_FIELD_NAMES.has(name)) return true;
  if (name.startsWith("is_") && name.endsWith("_active")) return true;
  if (name.endsWith("_enabled")) return true;
  return false;
}

const ACTIVE_INACTIVE_VALUES = new Set(["active", "inactive"]);

/** True when options are exactly active + inactive (Plans status, etc.). */
export function isActiveInactiveOptions(options = []) {
  if (!Array.isArray(options) || options.length !== 2) return false;
  const values = options.map((o) =>
    String(o?.id ?? o?.value ?? o?.name ?? o).toLowerCase(),
  );
  return values.every((v) => ACTIVE_INACTIVE_VALUES.has(v));
}

/** Form fields that use the Active / Inactive toggle (string status or activeStatus type). */
export function isActiveStatusFormField(field) {
  if (!field) return false;
  if (field.type === "activeStatus") return true;
  if (
    field.type === "select" &&
    (field.name === "status" || isActiveInactiveOptions(field.options))
  ) {
    return isActiveInactiveOptions(field.options);
  }
  return false;
}

export function activeStatusFieldMode(field) {
  if (
    field?.type === "boolean" ||
    field?.name === "is_active" ||
    field?.name === "active"
  ) {
    return "boolean";
  }
  return "string";
}

export function isLongTextFieldName(name) {
  if (!name || typeof name !== "string") return false;
  if (LONG_TEXT_FIELD_NAMES.has(name)) return true;
  return (
    name.includes("address") ||
    name.includes("description") ||
    name.endsWith("_note") ||
    name.includes("message") ||
    name.includes("remark") ||
    name.includes("instruction")
  );
}

export function isCompactField(field) {
  if (!field) return false;
  if (field.compact === true) return true;
  if (field.compact === false) return false;
  if (field.multiline || field.fullWidth === true) return false;

  const name = field.name || "";
  const type = field.type || "text";

  if (type === "number" || type === "email" || type === "tel" || type === "date") {
    return true;
  }
  if (COMPACT_FIELD_NAMES.has(name)) return true;
  return COMPACT_FIELD_SUFFIXES.some((suffix) => name.endsWith(suffix));
}

export function compactFieldSx(field) {
  if (!isCompactField(field)) return {};
  const type = field?.type || "text";
  const maxWidth =
    COMPACT_FIELD_MAX_WIDTH[type] ?? COMPACT_FIELD_MAX_WIDTH.default;
  return { maxWidth, width: "100%" };
}

export function resolveMultilineRows(field) {
  const requested = field?.minRows ?? field?.rows;
  if (requested != null) {
    return Math.min(Math.max(Number(requested) || MULTILINE_MIN_ROWS, MULTILINE_MIN_ROWS), MULTILINE_MAX_ROWS);
  }
  if (isLongTextFieldName(field?.name)) {
    return MULTILINE_LONG_TEXT_ROWS;
  }
  return MULTILINE_DEFAULT_ROWS;
}

/** Infer `type: "boolean"` when config omitted but name matches Lab Management conventions. */
export function normalizeFieldConfig(field) {
  if (!field) return field;
  let next = field;
  if (!next.type && isBooleanFieldName(next.name)) {
    next = { ...next, type: "boolean" };
  }
  if (next.multiline) {
    next = {
      ...next,
      minRows: resolveMultilineRows(next),
      maxRows: next.maxRows ?? MULTILINE_MAX_ROWS,
    };
  }
  if (isCompactField(next) && next.fullWidth == null) {
    next = { ...next, fullWidth: false };
  }
  return next;
}

/** Props for MUI multiline TextField from a form field config. */
export function multilineTextFieldProps(field) {
  const config =
    field == null
      ? null
      : typeof field === "object"
        ? field
        : { multiline: true, minRows: field };

  if (!config?.multiline && typeof field !== "number") return {};

  const minRows = resolveMultilineRows(
    typeof field === "number" ? { multiline: true, minRows: field } : config
  );

  return {
    multiline: true,
    minRows,
    maxRows: config?.maxRows ?? MULTILINE_MAX_ROWS,
  };
}

export function isBooleanColumnKey(key) {
  return isBooleanFieldName(key) || BOOLEAN_COLUMN_KEYS.has(key);
}

/** List columns toggled inline via PATCH (legacy form-switch + AJAX). */
export const INLINE_PATCHABLE_BOOLEAN_KEYS = new Set(["is_active", "active"]);

export function resolveInlinePatchBooleanKeys(columns, explicitKeys) {
  if (explicitKeys !== undefined) return explicitKeys;
  if (!Array.isArray(columns)) return [];
  return columns
    .map((col) => col?.key)
    .filter((key) => key && INLINE_PATCHABLE_BOOLEAN_KEYS.has(key));
}

export function isBooleanValue(value) {
  if (typeof value === "boolean") return true;
  if (value === 1 || value === 0) return true;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    return s === "true" || s === "false" || s === "1" || s === "0";
  }
  return false;
}
