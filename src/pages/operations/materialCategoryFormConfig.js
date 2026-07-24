export const MATERIAL_CATEGORY_COLUMNS = [
  { key: "name", labelKey: "fields.name" },
  { key: "code", labelKey: "fields.code" },
  {
    key: "is_active",
    labelKey: "fields.status",
    type: "boolean",
    trueLabelKey: "common.active",
    falseLabelKey: "common.inactive",
  },
];

export const MATERIAL_CATEGORY_FIELDS = [
  { name: "name", labelKey: "fields.name", required: true },
  { name: "code", labelKey: "fields.code" },
  {
    name: "description",
    labelKey: "fields.description",
    multiline: true,
    fullWidth: true,
    rows: 2,
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
