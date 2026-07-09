import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BRAND_PRIMARY } from "@/theme";
import { formatCellValue, getSelectDisplayLabel } from "@/utils/displayValue";

function escapeCsvCell(value) {
  if (value == null) return "";
  const s = String(value).replace(/"/g, '""');
  return /[",\n\r]/.test(s) ? `"${s}"` : s;
}

export function cellText(row, col) {
  if (col.exportValue) return col.exportValue(row);
  if (col.key) {
    const related = getSelectDisplayLabel(row, col.key);
    if (related) return related;
    if (col.key.endsWith("_name") && row[col.key] != null) {
      return String(row[col.key]);
    }
  }
  const formatted = formatCellValue(row, col.key);
  if (formatted !== "—") return formatted;

  const raw = row[col.key];
  if (raw != null && typeof raw === "object") {
    return raw.label ?? raw.name ?? raw.username ?? raw.id ?? "";
  }
  if (raw != null && raw !== "") return String(raw);
  return "";
}

export function getExportableColumns(columns) {
  return (columns || []).filter((c) => c.key && c.key !== "actions");
}

function rowsToMatrix(columns, rows) {
  const cols = getExportableColumns(columns);
  const header = cols.map((c) => c.label ?? c.key);
  const body = rows.map((row) =>
    cols.map((col) => {
      const v = cellText(row, col);
      return v == null ? "" : String(v);
    })
  );
  return { header, body };
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportTableCsv(columns, rows, filename = "export.csv") {
  const { header, body } = rowsToMatrix(columns, rows);
  const lines = [
    header.map(escapeCsvCell).join(","),
    ...body.map((line) => line.map(escapeCsvCell).join(",")),
  ];
  const csv = `\uFEFF${lines.join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

export function exportTableExcel(columns, rows, filename = "export") {
  const { header, body } = rowsToMatrix(columns, rows);
  const sheet = XLSX.utils.aoa_to_sheet([header, ...body]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Data");
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(blob, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function exportTablePdf(columns, rows, filename = "export", { title } = {}) {
  const { header, body } = rowsToMatrix(columns, rows);
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const brand = hexToRgb(BRAND_PRIMARY);

  if (title) {
    doc.setFontSize(14);
    doc.setTextColor(brand.r, brand.g, brand.b);
    doc.text(title, 40, 36);
  }

  autoTable(doc, {
    startY: title ? 48 : 32,
    head: [header],
    body,
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [brand.r, brand.g, brand.b],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 242, 248] },
    margin: { left: 24, right: 24 },
  });

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

export function buildExportFilename(base, extension) {
  const date = new Date().toISOString().slice(0, 10);
  const safe = String(base).replace(/[^\w-]+/g, "-").replace(/-+/g, "-");
  return `${safe}-${date}.${extension}`;
}
