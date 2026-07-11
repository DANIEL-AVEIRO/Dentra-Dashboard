export const PRICE_LIST_COLUMNS = [
  { key: "restoration_name", labelKey: "fields.restoration" },
  { key: "material_name", labelKey: "fields.material" },
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
    name: "restoration",
    labelKey: "fields.restoration",
    type: "select",
    optionsFrom: "restorations",
    required: true,
  },
  {
    name: "material",
    labelKey: "fields.material",
    type: "select",
    optionsFrom: "materials",
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
