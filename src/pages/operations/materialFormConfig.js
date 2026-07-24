export const MATERIAL_COLUMNS = [
  { key: "name", labelKey: "fields.name" },
  { key: "code", labelKey: "fields.code" },
  { key: "category_name", labelKey: "fields.category" },
  { key: "stock_qty", labelKey: "fields.stock_qty" },
  { key: "reorder_level", labelKey: "fields.reorder_level" },
  {
    key: "is_active",
    labelKey: "fields.status",
    type: "boolean",
    trueLabelKey: "common.active",
    falseLabelKey: "common.inactive",
  },
];

export const MATERIAL_FIELDS = [
  { name: "name", labelKey: "fields.name", required: true },
  { name: "code", labelKey: "fields.code" },
  {
    name: "category",
    labelKey: "fields.category",
    type: "select",
    optionsFrom: "material-categories",
    required: true,
  },
  {
    name: "stock_qty",
    labelKey: "fields.stock_qty",
    type: "number",
    integer: true,
    step: 1,
    min: 0,
    compact: true,
  },
  {
    name: "reorder_level",
    labelKey: "fields.reorder_level",
    type: "number",
    integer: true,
    step: 1,
    min: 0,
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
