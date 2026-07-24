export const PRICE_LIST_COLUMNS = [
  { key: "material_name", labelKey: "fields.material" },
  { key: "material_size_name", labelKey: "fields.material_size" },
  { key: "unit_price", labelKey: "fields.unit_price" },
  {
    key: "is_active",
    labelKey: "fields.status",
    type: "boolean",
    trueLabelKey: "common.active",
    falseLabelKey: "common.inactive",
  },
];

export const PRICE_LIST_FIELDS = [
  {
    name: "material",
    labelKey: "fields.material",
    type: "select",
    optionsFrom: "materials",
    required: true,
  },
  {
    name: "material_size",
    labelKey: "fields.material_size",
    type: "select",
    optionsFrom: "material-sizes",
    required: true,
  },
  {
    name: "unit_price",
    labelKey: "fields.unit_price",
    type: "number",
    required: true,
    compact: true,
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
