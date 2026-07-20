/** Finance module list/form configs (Billing, Collections, Expenses). */

export const INVOICE_STATUS_COLUMN = {
  statusList: [
    { value: "draft", color: "default" },
    { value: "issued", color: "info" },
    { value: "partially_paid", color: "warning" },
    { value: "paid", color: "success" },
    { value: "overdue", color: "error" },
    { value: "cancelled", color: "default" },
  ],
  translationNs: "invoiceStatuses",
};

export const INVOICE_COLUMNS = [
  { key: "invoice_number", labelKey: "fields.invoice_number" },
  { key: "laboratory_name", labelKey: "fields.laboratory_name" },
  { key: "clinic_name", labelKey: "fields.clinic_name" },
  { key: "invoice_date", labelKey: "fields.invoice_date" },
  { key: "due_date", labelKey: "fields.due_date" },
  { key: "status", labelKey: "fields.status", ...INVOICE_STATUS_COLUMN },
  { key: "grand_total", labelKey: "fields.grand_total" },
  { key: "balance_due", labelKey: "fields.balance_due" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { id: "cash", name: "Cash" },
  { id: "bank_transfer", name: "Bank transfer" },
  { id: "cheque", name: "Cheque" },
  { id: "mobile_banking", name: "Mobile banking" },
];

export const PAYMENT_COLUMNS = [
  { key: "invoice_number", labelKey: "fields.invoice_number" },
  { key: "clinic_name", labelKey: "fields.clinic_name" },
  { key: "amount", labelKey: "fields.amount" },
  { key: "method", labelKey: "fields.payment_method" },
  { key: "paid_at", labelKey: "fields.paid_at" },
  { key: "reference", labelKey: "fields.reference" },
];

export const PAYMENT_FIELDS = [
  {
    name: "invoice",
    labelKey: "fields.invoice_number",
    type: "select",
    optionsFrom: "invoices",
    optionsQuery: { status: "issued,partially_paid,overdue" },
    optionLabelKey: "invoice_number",
    required: true,
  },
  {
    name: "amount",
    labelKey: "fields.amount",
    type: "number",
    required: true,
  },
  {
    name: "method",
    labelKey: "fields.payment_method",
    type: "select",
    options: PAYMENT_METHOD_OPTIONS,
    required: true,
    default: "cash",
  },
  {
    name: "paid_at",
    labelKey: "fields.paid_at",
    type: "date",
    required: true,
  },
  { name: "reference", labelKey: "fields.reference" },
  {
    name: "notes",
    labelKey: "fields.notes",
    multiline: true,
    rows: 2,
  },
];

export const EXPENSE_CATEGORY_OPTIONS = [
  { id: "material_purchase", name: "Material purchase" },
  { id: "salary", name: "Salary" },
  { id: "technician_commission", name: "Technician commission" },
  { id: "delivery_cost", name: "Delivery cost" },
  { id: "tax", name: "Tax" },
  { id: "rent", name: "Rent" },
  { id: "utilities", name: "Utilities" },
  { id: "admin", name: "Admin" },
  { id: "other", name: "Other" },
];

export const EXPENSE_STATUS_COLUMN = {
  statusList: [
    { value: "draft", color: "default" },
    { value: "approved", color: "success" },
  ],
  translationNs: "expenseStatuses",
};

export const EXPENSE_COLUMNS = [
  { key: "expense_date", labelKey: "fields.expense_date" },
  { key: "category", labelKey: "fields.expense_category" },
  { key: "amount", labelKey: "fields.amount" },
  { key: "status", labelKey: "fields.status", ...EXPENSE_STATUS_COLUMN },
  { key: "notes", labelKey: "fields.notes" },
];

export const EXPENSE_FIELDS = [
  {
    name: "category",
    labelKey: "fields.expense_category",
    type: "select",
    options: EXPENSE_CATEGORY_OPTIONS,
    required: true,
    default: "other",
  },
  {
    name: "amount",
    labelKey: "fields.amount",
    type: "number",
    required: true,
  },
  {
    name: "expense_date",
    labelKey: "fields.expense_date",
    type: "date",
    required: true,
  },
  {
    name: "notes",
    labelKey: "fields.notes",
    multiline: true,
    rows: 2,
  },
];
