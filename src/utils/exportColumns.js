import { filterExportColumns } from "@/utils/exportColumnFilter";
import { getExportableColumns } from "@/utils/exportTable";

/** Table columns (+ optional API fields) for the export column picker. */
export function buildExportColumnOptions(tableColumns, apiFields = []) {
  const map = new Map();
  const exportable = getExportableColumns(tableColumns);
  const allTableKeys = new Set(exportable.map((c) => c.key));
  const tableCols = filterExportColumns(exportable, { allKeys: allTableKeys });

  tableCols.forEach((col) => {
    map.set(col.key, {
      key: col.key,
      label: col.label ?? col.key,
      exportValue: col.exportValue,
      source: "table",
    });
  });

  const apiCtx = { allKeys: new Set((apiFields || []).map((f) => f.name ?? f.key)) };
  filterExportColumns(
    (apiFields || []).map((field) => ({
      key: field.name ?? field.key,
      label: field.verbose_name ?? field.label,
    })),
    apiCtx
  ).forEach((field) => {
    const key = field.key;
    if (!key || map.has(key)) return;
    map.set(key, {
      key,
      label: field.label ?? key,
      source: "model",
    });
  });

  const table = [...map.values()].filter((c) => c.source === "table");
  const modelOnly = [...map.values()].filter((c) => c.source === "model");
  return [...table, ...modelOnly];
}
