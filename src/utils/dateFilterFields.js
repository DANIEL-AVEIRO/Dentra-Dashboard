/** Map table column keys to ORM date field paths (?date_field= on list APIs). */
const COLUMN_DATE_FIELD_OVERRIDES = {
  date_to_deliver: "delivery_at",
  delivered_date: "delivery_at",
};

const ENDPOINT_COLUMN_DATE_FIELD_OVERRIDES = {
  deliveries: {
    pickup_date: "pickup__pickup_date",
    date_to_deliver: "delivery_at",
    delivered_date: "delivery_at",
  },
};

const DATE_COLUMN_KEY_PATTERN = /_(?:at|date)$/;

export function resolveDateFilterField(columnKey, { endpoint } = {}) {
  if (!columnKey) return null;
  const endpointMap = ENDPOINT_COLUMN_DATE_FIELD_OVERRIDES[endpoint] ?? {};
  if (endpointMap[columnKey]) return endpointMap[columnKey];
  if (COLUMN_DATE_FIELD_OVERRIDES[columnKey]) {
    return COLUMN_DATE_FIELD_OVERRIDES[columnKey];
  }
  if (DATE_COLUMN_KEY_PATTERN.test(columnKey)) return columnKey;
  return null;
}

function toDateFieldToggle(field, col = {}) {
  return {
    field,
    labelKey: col.labelKey ?? `fields.${field}`,
    label: col.label,
  };
}

/** Unique date filter toggles derived from visible table columns. */
export function dateFieldsFromColumns(columns, options = {}) {
  if (!Array.isArray(columns)) return [];

  const seen = new Set();
  const result = [];

  for (const col of columns) {
    const field =
      col.dateFilterField ??
      resolveDateFilterField(col.key, { endpoint: options.endpoint });
    if (!field || seen.has(field)) continue;
    seen.add(field);
    result.push(toDateFieldToggle(field, col));
  }

  return result;
}

const ENDPOINT_DATE_FIELD_DEFAULTS = {
  "audit-logs": ["created_at"],
  trash: ["deleted_at"],
};

const DEFAULT_DATE_FIELDS = ["created_at", "updated_at"];
const TRASH_MODE_DATE_FIELDS = ["deleted_at", "created_at", "updated_at"];

/** Column-derived toggles, with endpoint fallbacks so every table has date filters. */
export function resolveDateFilterFields(columns, options = {}) {
  const fromColumns = dateFieldsFromColumns(columns, options);
  if (fromColumns.length) return fromColumns;

  const endpoint = options.endpoint;
  let fields = DEFAULT_DATE_FIELDS;
  if (options.trashMode) {
    fields = TRASH_MODE_DATE_FIELDS;
  } else if (endpoint && ENDPOINT_DATE_FIELD_DEFAULTS[endpoint]) {
    fields = ENDPOINT_DATE_FIELD_DEFAULTS[endpoint];
  }

  return fields.map((field) => toDateFieldToggle(field));
}
