/** API endpoint slug → Django model class name (audit_logs.model_name). */
const ENDPOINT_AUDIT_MODEL = {
  users: "UserModel",
  roles: "RoleModel",
  plans: "PlanModel",
  laboratories: "LaboratoryModel",
  cases: "CaseModel",
  deliveries: "DeliveryModel",
  invoices: "InvoiceModel",
  payments: "PaymentModel",
  "lab-expenses": "LabExpenseModel",
  regions: "RegionModel",
  clinics: "ClinicModel",
  dentists: "DentistModel",
  materials: "MaterialModel",
  "material-categories": "MaterialCategoryModel",
  restorations: "RestorationModel",
  "restoration-categories": "RestorationCategoryModel",
  shades: "ShadeModel",
  "material-sizes": "MaterialSizeModel",
  "price-list": "PriceListItemModel",
};

export function endpointToAuditModelName(endpoint) {
  if (!endpoint) return null;
  return ENDPOINT_AUDIT_MODEL[endpoint] ?? null;
}

/** Resolve audit model + object id for row preview activity log. */
export function resolveActivityLogTarget(row, activityLog, rowIdKey = "id") {
  if (!row || !activityLog) return null;

  const auditModel =
    typeof activityLog.auditModel === "function"
      ? activityLog.auditModel(row)
      : activityLog.auditModel ?? activityLog.modelName;
  if (!auditModel) return null;

  const objectIdKey = activityLog.objectIdKey ?? rowIdKey;
  const objectId = row[objectIdKey] ?? row.id;
  if (objectId == null || objectId === "") return null;

  return { modelName: auditModel, objectId: String(objectId) };
}
