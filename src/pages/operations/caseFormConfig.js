export const CASE_TYPE_OPTIONS = [
  { id: "new_case", name: "New case" },
  { id: "redo", name: "Redo" },
  { id: "repair", name: "Repair" },
  { id: "lab_to_lab", name: "Lab to lab" },
  { id: "rejected", name: "Rejected" },
  { id: "cancelled", name: "Cancelled" },
];

export const CASE_SOURCE_OPTIONS = [
  { id: "clinic", name: "Clinic" },
  { id: "lab_to_lab", name: "Lab to lab" },
  { id: "internal", name: "Internal" },
];

export const CASE_PRIORITY_OPTIONS = [
  { id: "normal", name: "Normal", color: "primary" },
  { id: "urgent", name: "Urgent", color: "warning" },
  { id: "vip", name: "VIP", color: "error" },
];

export const CASE_TYPE_COLUMN = {
  statusList: [
    { value: "new_case", color: "primary" },
    { value: "redo", color: "warning" },
    { value: "repair", color: "info" },
    { value: "lab_to_lab", color: "secondary" },
    { value: "rejected", color: "error" },
    { value: "cancelled", color: "default" },
  ],
  translationNs: "caseTypes",
};

export const CASE_SOURCE_COLUMN = {
  statusList: [
    { value: "clinic", color: "primary" },
    { value: "lab_to_lab", color: "secondary" },
    { value: "internal", color: "default" },
  ],
  translationNs: "caseSources",
};

export const CASE_PRIORITY_COLUMN = {
  statusList: [
    { value: "normal", color: "default" },
    { value: "urgent", color: "warning" },
    { value: "vip", color: "error" },
  ],
  translationNs: "casePriorities",
};

export const CASE_COLUMNS = [
  { key: "case_id", labelKey: "fields.case_id" },
  { key: "case_type", labelKey: "fields.case_type", ...CASE_TYPE_COLUMN },
  { key: "case_source", labelKey: "fields.case_source", ...CASE_SOURCE_COLUMN },
  { key: "clinic_name", labelKey: "fields.clinic_name" },
  { key: "dentist_name", labelKey: "fields.dentist_name" },
  { key: "due_date", labelKey: "fields.due_date" },
  { key: "priority", labelKey: "fields.priority", ...CASE_PRIORITY_COLUMN },
  { key: "line_items_count", labelKey: "fields.line_items_count" },
];

export const CASE_FIELDS = [
  {
    name: "case_type",
    labelKey: "fields.case_type",
    type: "select",
    options: CASE_TYPE_OPTIONS,
    required: true,
    default: "new_case",
  },
  {
    name: "case_source",
    labelKey: "fields.case_source",
    type: "select",
    options: CASE_SOURCE_OPTIONS,
    required: true,
    default: "clinic",
  },
  {
    name: "clinic",
    labelKey: "fields.clinic_name",
    type: "select",
    optionsFrom: "clinics",
    clearsFields: ["dentist"],
    inlineCreate: {
      endpoint: "clinics",
      titleKey: "inlineCreate.newClinic",
      fields: [
        { name: "name", labelKey: "fields.clinic_name", required: true },
        { name: "phone", labelKey: "fields.phone" },
        { name: "email", labelKey: "fields.email", type: "email" },
      ],
    },
  },
  {
    name: "dentist",
    labelKey: "fields.dentist_name",
    type: "select",
    optionsFrom: "dentists",
    dependsOn: "clinic",
    optionsQueryParam: "clinic",
    dependsOnPlaceholderKey: "inlineCreate.selectClinicFirst",
    inlineCreate: {
      endpoint: "dentists",
      titleKey: "inlineCreate.newDentist",
      requires: "clinic",
      requiresMessageKey: "inlineCreate.selectClinicFirst",
      fields: [
        { name: "name", labelKey: "fields.dentist_name", required: true },
        {
          name: "clinic_ids",
          labelKey: "fields.associated_clinics",
          type: "multiSelect",
          optionsFrom: "clinics",
          required: true,
          defaultFromParent: "clinic",
        },
        { name: "phone", labelKey: "fields.phone" },
        { name: "email", labelKey: "fields.email", type: "email" },
      ],
    },
  },
  {
    name: "due_date",
    labelKey: "fields.due_date",
    type: "date",
    required: true,
    datePresets: true,
  },
  {
    name: "priority",
    labelKey: "fields.priority",
    type: "buttonSelect",
    options: CASE_PRIORITY_OPTIONS,
    required: true,
    default: "normal",
  },
  {
    name: "reference_po",
    labelKey: "fields.reference_po",
  },
  {
    name: "line_items",
    labelKey: "pages.cases.sections.workItems",
    type: "caseLineItems",
    fullWidth: true,
    groupTitleKey: "pages.cases.sections.workItems",
  },
  {
    name: "clinic_note",
    labelKey: "fields.clinic_note",
    multiline: true,
    fullWidth: true,
    rows: 3,
    groupTitleKey: "pages.cases.sections.notes",
  },
  {
    name: "internal_note",
    labelKey: "fields.internal_note",
    multiline: true,
    fullWidth: true,
    rows: 3,
  },
  {
    name: "financial_summary",
    type: "caseFinancialSummary",
    fullWidth: true,
    groupTitleKey: "pages.cases.sections.financial",
  },
];
