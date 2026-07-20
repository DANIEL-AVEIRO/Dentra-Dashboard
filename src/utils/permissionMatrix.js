const CRUD_ACTIONS = ["view", "add", "change", "delete"];

const CRUD_PATTERNS = {
  view: /^view_(.+)$/,
  add: /^add_(.+)$/,
  change: /^change_(.+)$/,
  delete: /^delete_(.+)$/,
};

const HIDDEN_APPS = new Set(["admin", "auth", "contenttypes", "sessions", "sites"]);

export function labelFromPermissionName(name) {
  const match = /^Can (?:add|change|delete|view) (.+)$/i.exec(String(name || "").trim());
  return match ? match[1] : "";
}

function inferModel(codename) {
  for (const pattern of Object.values(CRUD_PATTERNS)) {
    const match = pattern.exec(String(codename || ""));
    if (match) return match[1];
  }
  return String(codename || "other");
}

function humanizeModel(model) {
  const base = String(model || "")
    .replace(/model$/i, "")
    .replace(/_/g, " ")
    .trim();
  if (!base) return "Other";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function rowIds(row) {
  const ids = [];
  for (const action of CRUD_ACTIONS) {
    if (row[action]?.id != null) ids.push(String(row[action].id));
  }
  for (const custom of row.custom || []) {
    if (custom.id != null) ids.push(String(custom.id));
  }
  return ids;
}

export function buildPermissionMatrix(options = []) {
  const byModule = new Map();

  for (const opt of options) {
    const app = opt.app_label || "other";
    if (HIDDEN_APPS.has(app)) continue;

    const model = opt.model || inferModel(opt.codename);
    const key = `${app}:${model}`;
    if (!byModule.has(key)) {
      byModule.set(key, {
        key,
        moduleLabel: "",
        model,
        app_label: app,
        view: null,
        add: null,
        change: null,
        delete: null,
        custom: [],
      });
    }

    const row = byModule.get(key);
    const codename = String(opt.codename || "");
    let matched = false;
    for (const action of CRUD_ACTIONS) {
      if (CRUD_PATTERNS[action].test(codename)) {
        row[action] = { ...opt, id: opt.value ?? opt.id };
        matched = true;
        break;
      }
    }
    if (!matched) {
      row.custom.push({
        ...opt,
        id: opt.value ?? opt.id,
        label: opt.permission_name || opt.label || codename,
      });
    }
  }

  for (const row of byModule.values()) {
    const source =
      row.add || row.change || row.view || row.delete || row.custom[0] || null;
    const fromName = labelFromPermissionName(source?.permission_name);
    row.moduleLabel = fromName || humanizeModel(row.model);
  }

  return [...byModule.values()].sort((a, b) =>
    a.moduleLabel.localeCompare(b.moduleLabel)
  );
}

export function filterPermissionMatrix(rows, query) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => {
    const hay = [
      row.moduleLabel,
      row.model,
      row.app_label,
      ...(row.custom || []).map((c) => c.label),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function matrixRowAllChecked(row, selected) {
  const ids = rowIds(row);
  return ids.length > 0 && ids.every((id) => selected.has(id));
}

export function matrixRowSomeChecked(row, selected) {
  const ids = rowIds(row);
  return ids.some((id) => selected.has(id));
}

export function matrixAllPermissionIds(rows = []) {
  const ids = [];
  for (const row of rows) {
    ids.push(...rowIds(row));
  }
  return ids;
}

export function matrixAllPermissionsChecked(rows, selected) {
  const ids = matrixAllPermissionIds(rows);
  return ids.length > 0 && ids.every((id) => selected.has(id));
}

export function matrixSomePermissionsChecked(rows, selected) {
  const ids = matrixAllPermissionIds(rows);
  return ids.some((id) => selected.has(id));
}

export function toggleMatrixAllPermissions(rows, selected, checked) {
  const next = new Set(selected);
  for (const id of matrixAllPermissionIds(rows)) {
    if (checked) next.add(id);
    else next.delete(id);
  }
  return next;
}

export function toggleMatrixRow(row, selected, checked) {
  const next = new Set(selected);
  for (const id of rowIds(row)) {
    if (checked) next.add(id);
    else next.delete(id);
  }
  return next;
}

export function toggleMatrixCell(id, selected, checked) {
  const next = new Set(selected);
  const key = String(id);
  if (checked) next.add(key);
  else next.delete(key);
  return next;
}

export function normalizeSelectedIds(value) {
  if (!Array.isArray(value)) return new Set();
  return new Set(
    value.map((item) =>
      String(typeof item === "object" && item != null ? item.id ?? item : item)
    )
  );
}

export function toPayloadIds(selectedSet) {
  return [...selectedSet].map((id) => {
    const num = Number(id);
    return Number.isNaN(num) ? id : num;
  });
}
