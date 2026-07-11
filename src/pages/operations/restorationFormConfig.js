export const RESTORATION_COLUMNS = [
  { key: "name", labelKey: "fields.name" },
  { key: "code", labelKey: "fields.code" },
  { key: "category_name", labelKey: "fields.category" },
  { key: "turnaround_days", labelKey: "fields.turnaround_days" },
  {
    key: "is_active",
    labelKey: "fields.status",
    type: "boolean",
    trueLabelKey: "common.active",
    falseLabelKey: "common.inactive",
  },
];

export const RESTORATION_FIELDS = [
  { name: "name", labelKey: "fields.name", required: true },
  { name: "code", labelKey: "fields.code" },
  {
    name: "category",
    labelKey: "fields.category",
    type: "select",
    optionsFrom: "restoration-categories",
    required: true,
  },
  {
    name: "turnaround_days",
    labelKey: "fields.turnaround_days",
    type: "number",
    compact: true,
  },
  {
    name: "description",
    labelKey: "fields.description",
    multiline: true,
    fullWidth: true,
    rows: 3,
  },
  {
    name: "is_active",
    labelKey: "fields.status",
    type: "boolean",
    default: true,
    activeLabelKey: "common.active",
    inactiveLabelKey: "common.inactive",
  },
];
