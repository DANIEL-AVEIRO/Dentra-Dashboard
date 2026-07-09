import { formatCellValue } from "@/utils/displayValue";
import { formatDateTime } from "@/utils/format";
import { getCellPlainText } from "@/utils/renderTableCell";
import { toBoolean } from "@/utils/boolean";

const SKIP_DETAIL_FIELD_TYPES = new Set([
  "password",
  "file",
  "permissionCheckboxes",
]);

const META_DETAIL_KEYS = [
  { key: "created_at", labelKey: "fields.created_at", defaultLabel: "Created At" },
  { key: "updated_at", labelKey: "fields.updated_at", defaultLabel: "Updated At" },
  { key: "created_by", labelKey: "fields.created_by", defaultLabel: "Created By" },
  { key: "updated_by", labelKey: "fields.updated_by", defaultLabel: "Updated By" },
];

function formatMetaDate(value) {
  return formatDateTime(value);
}

function formatColumnValue(row, col) {
  if (col.render) return col.render(row);
  if (col.exportValue) {
    const v = col.exportValue(row);
    return v == null || v === "" ? "—" : String(v);
  }
  return getCellPlainText(row[col.key], row, col.key);
}

function formatFieldValue(row, field, t) {
  const key = field.name;
  const raw = row[key];

  if (field.type === "boolean") {
    const on = toBoolean(raw);
    if (on) return field.activeLabel || t("common.yes");
    return field.inactiveLabel || t("common.no");
  }

  if (field.type === "multiSelect") {
    const namesKey = field.namesKey || "role_names";
    const names = row[namesKey];
    if (Array.isArray(names) && names.length) return names.join(", ");
    if (Array.isArray(raw) && raw.length) {
      return raw
        .map((item) =>
          typeof item === "object" && item != null
            ? item.name ?? item.label ?? item.id
            : item
        )
        .join(", ");
    }
    return "—";
  }

  if (field.type === "starRating") {
    if (raw == null || raw === "") return "—";
    return String(raw);
  }

  return formatCellValue(row, key);
}

function hasMetaValue(row, key) {
  if (key.endsWith("_at")) return Boolean(row[key]);
  return Boolean(row[key]) || Boolean(row[`${key}_name`]);
}

/** Read-only quick-view rows for ResourceListPage (columns + extra form fields + audit meta). */
export function buildResourceDetailRows({ row, columns = [], fields = [], t }) {
  if (!row) return [];

  const seen = new Set();
  const rows = [];

  for (const col of columns) {
    if (!col?.key || col.key === "actions" || seen.has(col.key)) continue;
    seen.add(col.key);
    rows.push({
      label: col.label,
      value: formatColumnValue(row, col),
    });
  }

  for (const field of fields) {
    if (!field?.name || seen.has(field.name) || SKIP_DETAIL_FIELD_TYPES.has(field.type)) {
      continue;
    }
    seen.add(field.name);
    rows.push({
      label: field.label,
      value: formatFieldValue(row, field, t),
    });
  }

  for (const meta of META_DETAIL_KEYS) {
    if (!hasMetaValue(row, meta.key)) continue;
    rows.push({
      label: t(meta.labelKey, { defaultValue: meta.defaultLabel }),
      value:
        meta.key.endsWith("_at")
          ? formatMetaDate(row[meta.key])
          : formatCellValue(row, meta.key),
    });
  }

  return rows;
}
