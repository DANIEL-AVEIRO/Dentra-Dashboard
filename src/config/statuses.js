/** Status metadata for dashboard chips and filters. */

export const ACTIVE_STATUSES = [
  { value: "active", label: "Active", tone: "success" },
  { value: "inactive", label: "Inactive", tone: "neutral" },
];

export const getStatusMeta = (list, value) =>
  (list ?? []).find((s) => s.value === value) || {
    label: value,
    tone: "neutral",
  };
