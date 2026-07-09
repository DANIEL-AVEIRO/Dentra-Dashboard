/** Map dashboard column keys to Django ORM ordering fields. */
const COLUMN_ORDER_FIELD = {
  user_name: "user__username",
  role_name: "role__name",
  region_name: "region__name",
  township_name: "township__name",
  branch_name: "branch__name",
};

/** Serializer-only fields — not sortable unless orderField is set. */
const NON_SORTABLE_KEYS = new Set(["is_super_admin", "activity", "changes", "qr_code"]);

export function resolveColumnOrderField(column) {
  if (!column || column.sortable === false) return null;
  if (column.orderField) return column.orderField;
  if (NON_SORTABLE_KEYS.has(column.key)) return null;
  if (COLUMN_ORDER_FIELD[column.key]) return COLUMN_ORDER_FIELD[column.key];
  if (column.key === "actions") return null;
  return column.key;
}

export function isColumnSortable(column) {
  return Boolean(resolveColumnOrderField(column));
}
