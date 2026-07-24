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

export const CASE_STATUS_OPTIONS = [
  { id: "draft", name: "Draft" },
  { id: "received", name: "Received" },
  { id: "in_fabrication", name: "In fabrication" },
  { id: "qc", name: "QC" },
  { id: "ready", name: "Ready" },
  { id: "shipped", name: "Shipped" },
  { id: "delivered", name: "Delivered" },
  { id: "cancelled", name: "Cancelled" },
];

export const CASE_STATUS_COLUMN = {
  statusList: [
    { value: "draft", color: "default" },
    { value: "received", color: "info" },
    { value: "in_fabrication", color: "primary" },
    { value: "qc", color: "warning" },
    { value: "ready", color: "success" },
    { value: "shipped", color: "secondary" },
    { value: "delivered", color: "success" },
    { value: "cancelled", color: "error" },
  ],
  translationNs: "caseStatuses",
};

/** Fabrication Finished → QC */
export const FABRICATION_ADVANCE_NEXT = {
  received: "qc",
  in_fabrication: "qc",
};

export const CASE_COLUMNS = [
  { key: "case_id", labelKey: "fields.case_id" },
  { key: "clinic_name", labelKey: "fields.clinic_name" },
  { key: "patient_name", labelKey: "fields.patient_name" },
  { key: "case_type", labelKey: "fields.case_type", ...CASE_TYPE_COLUMN },
  { key: "dentist_name", labelKey: "fields.dentist_name" },
  { key: "technicians_names", labelKey: "fields.technicians" },
  { key: "materials_summary", labelKey: "fields.materials_summary" },
  { key: "restorations_summary", labelKey: "fields.restorations_summary" },
  { key: "teeth_summary", labelKey: "fields.teeth_summary" },
  { key: "due_date", labelKey: "fields.due_date" },
  { key: "priority", labelKey: "fields.priority", ...CASE_PRIORITY_COLUMN },
  { key: "amount", labelKey: "fields.amount" },
];

export const FABRICATION_COLUMNS = [
  { key: "case_id", labelKey: "fields.case_id" },
  { key: "patient_name", labelKey: "fields.patient_name" },
  { key: "clinic_name", labelKey: "fields.clinic_name" },
  { key: "technicians_names", labelKey: "fields.technicians" },
  { key: "materials_summary", labelKey: "fields.materials_summary" },
  { key: "restorations_summary", labelKey: "fields.restorations_summary" },
  { key: "teeth_summary", labelKey: "fields.teeth_summary" },
  { key: "due_date", labelKey: "fields.due_date" },
  { key: "priority", labelKey: "fields.priority", ...CASE_PRIORITY_COLUMN },
  { key: "amount", labelKey: "fields.amount" },
];

export const DELIVERY_STATUS_COLUMN = {
  statusList: [
    { value: "pending", color: "warning" },
    { value: "in_transit", color: "info" },
    { value: "delivered", color: "success" },
    { value: "failed", color: "error" },
  ],
  translationNs: "deliveryStatuses",
};

export const DELIVERY_COLUMNS = [
  { key: "case_id_display", labelKey: "fields.case_id" },
  { key: "clinic_name", labelKey: "fields.clinic_name" },
  { key: "status", labelKey: "fields.status", ...DELIVERY_STATUS_COLUMN },
  { key: "scheduled_date", labelKey: "fields.scheduled_date" },
  { key: "delivered_at", labelKey: "fields.delivered_at" },
  { key: "notes", labelKey: "fields.notes" },
];

export const DELIVERY_FIELDS = [
  {
    name: "case",
    labelKey: "fields.case_id",
    type: "select",
    optionsFrom: "cases",
    optionsQuery: { status: "ready" },
    optionLabelKey: "case_id",
    required: true,
  },
  {
    name: "scheduled_date",
    labelKey: "fields.scheduled_date",
    type: "date",
  },
  {
    name: "notes",
    labelKey: "fields.notes",
    multiline: true,
    rows: 3,
  },
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
    name: "patient_name",
    labelKey: "fields.patient_name",
    required: false,
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
    name: "technicians",
    labelKey: "fields.technicians",
    type: "multiSelect",
    optionsFrom: "users",
  },
  {
    name: "due_date",
    labelKey: "fields.due_date",
    type: "date",
    required: false,
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
    name: "line_items",
    labelKey: "pages.cases.sections.workItems",
    type: "caseLineItems",
    fullWidth: true,
    groupTitleKey: "pages.cases.sections.workItems",
  },
  {
    name: "financial_summary",
    type: "caseFinancialSummary",
    fullWidth: true,
    groupTitleKey: "pages.cases.sections.financial",
  },
];
