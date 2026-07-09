import { buildResourceDetailRows } from "@/utils/resourceDetail";

/** Column keys omitted from auto-generated preview fields */
export const PREVIEW_SKIP_COLUMN_KEYS = new Set([
  "actions",
  "_actions",
  "is_active",
]);

const ID_KEY_CANDIDATES = [
  "employee_code",
  "invoice_number",
  "receipt_number",
  "quotation_number",
  "batch_number",
  "username",
  "name",
  "title",
];

function inferFieldGroup(key = "") {
  const k = String(key).toLowerCase();
  if (/name|phone|merchant|user_name|rider/.test(k)) return "contact";
  if (/township|region|branch|address|location/.test(k)) return "location";
  if (/date|time|sched|created|updated|delivered|period|return/.test(k)) return "schedule";
  if (/pickup|ref|merchant_id|delivery_id|invoice|batch/.test(k)) return "related";
  return "details";
}

export function inferPreviewIdKey(row, columns = [], rowIdKey = "id") {
  if (!row) return rowIdKey;
  for (const key of ID_KEY_CANDIDATES) {
    if (row[key] != null && row[key] !== "") return key;
  }
  const idCol = columns.find(
    (col) =>
      col?.key &&
      /_id$/.test(col.key) &&
      !col.key.endsWith("_id_display") &&
      row[col.key] != null &&
      row[col.key] !== ""
  );
  if (idCol) return idCol.key;
  return rowIdKey;
}

export function inferPreviewStatusKey(row, columns = []) {
  if (!row) return undefined;
  const statusCol = columns.find((col) => col?.key && /(^status$|_status$)/.test(col.key));
  if (statusCol && row[statusCol.key] != null && row[statusCol.key] !== "") {
    return statusCol.key;
  }
  if (row.status != null && row.status !== "") return "status";
  return undefined;
}

/** Build preview drawer fields from visible table columns */
export function buildPreviewFieldsFromColumns(columns = [], { maxFields = 14 } = {}) {
  return columns
    .filter(
      (col) =>
        col?.key &&
        col.label &&
        !PREVIEW_SKIP_COLUMN_KEYS.has(col.key) &&
        col.skipPreview !== true
    )
    .slice(0, maxFields)
    .map((col) => ({
      key: col.key,
      label: col.label,
      group: col.group || inferFieldGroup(col.key),
      render: col.previewRender || col.render,
    }));
}

/** Resource list pages — columns + form fields + audit meta */
export function buildPreviewFieldsFromResource({ row, columns = [], fields = [], t }) {
  if (!row) return [];
  const detailRows = buildResourceDetailRows({ row, columns, fields, t });
  return detailRows.map((item, index) => ({
    key: `resource_preview_${index}`,
    label: item.label,
    group: inferFieldGroup(String(item.label || "")),
    render: () => item.value,
  }));
}

export function resolvePreviewDetailPath(row, detailPath, rowIdKey = "id") {
  if (!row || detailPath == null) return null;
  if (typeof detailPath === "function") return detailPath(row);
  if (typeof detailPath === "string" && detailPath.includes(":id")) {
    return detailPath.replace(":id", String(row[rowIdKey] ?? ""));
  }
  return detailPath;
}

export function canShowPreviewOpenDetail(rowPreview, row) {
  if (!rowPreview || rowPreview.showOpenDetail === false) return false;
  if (rowPreview.onOpenDetail) return true;
  return Boolean(resolvePreviewDetailPath(row, rowPreview.detailPath, rowPreview.rowIdKey || "id"));
}
