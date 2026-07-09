/** Auto StatusChip for table columns without a custom render. */
export const STATUS_COLUMN_REGISTRY = {};

export const STATUS_CONTEXT_REGISTRY = {};

export function resolveStatusColumnConfig(col) {
  if (col?.statusList) {
    return {
      list: col.statusList,
      translationNs: col.translationNs ?? col.statusNs ?? "statuses",
      size: col.statusSize,
    };
  }
  if (col?.key && STATUS_COLUMN_REGISTRY[col.key]) {
    return STATUS_COLUMN_REGISTRY[col.key];
  }
  if (col?.key === "status" && col?.statusContext && STATUS_CONTEXT_REGISTRY[col.statusContext]) {
    return STATUS_CONTEXT_REGISTRY[col.statusContext];
  }
  return null;
}
