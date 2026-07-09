export function printResourceTable({ title, columns, rows, rowNumberOffset = 0 }) {
  const head = ["#", ...columns.map((col) => col.label)];
  const body = rows.map((row, index) => [
    String(rowNumberOffset + index + 1),
    ...columns.map((col) => {
      if (col.exportValue) {
        const value = col.exportValue(row);
        return value == null ? "" : String(value);
      }
      const value = row[col.key];
      return value == null ? "" : String(value);
    }),
  ]);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title || "Table")}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; color: #111; }
    h1 { font-size: 18px; margin: 0 0 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #f5f5f5; }
    tr:nth-child(even) td { background: #fafafa; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title || "Table")}</h1>
  <table>
    <thead><tr>${head.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead>
    <tbody>
      ${body
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
        )
        .join("")}
    </tbody>
  </table>
</body>
</html>`;

  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
