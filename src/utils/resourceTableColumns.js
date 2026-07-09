import { formatCellValue } from "@/utils/displayValue";
import { formatDateTime } from "@/utils/format";

export const META_COLUMN_KEYS = ["created_at", "updated_at", "created_by", "updated_by"];

function formatMetaDate(value) {
  return formatDateTime(value);
}

function buildMetaColumn(key) {
  if (key === "created_at" || key === "updated_at") {
    return {
      key,
      label: key === "created_at" ? "Created At" : "Updated At",
      exportValue: (row) => row?.[key] ?? "",
      render: (row) => formatMetaDate(row?.[key]),
    };
  }
  return {
    key,
    label: key === "created_by" ? "Created By" : "Updated By",
    exportValue: (row) => {
      const text = formatCellValue(row, key);
      return text === "—" ? "" : text;
    },
    render: (row) => formatCellValue(row, key),
  };
}

export function resolveResourceTableColumns(columns, { includeMetaColumns = true } = {}) {
  const base = Array.isArray(columns) ? columns : [];
  const existing = new Set(base.map((col) => col.key));
  if (!includeMetaColumns) return base;
  const additions = META_COLUMN_KEYS.filter((key) => !existing.has(key)).map((key) =>
    buildMetaColumn(key)
  );
  return [...base, ...additions];
}
