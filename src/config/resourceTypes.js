/**
 * User-friendly resource labels — shared by Audit Logs, Trash, etc.
 * Keys are Django model class names stored in audit_logs.model_name.
 */

export const RESOURCE_LABELS = {
  UserModel: "Users",
  RoleModel: "Roles",
};

/** Sorted options for filter dropdowns (value = model_name for API) */
export const resourceTypeFilterOptions = Object.entries(RESOURCE_LABELS)
  .map(([modelName, title]) => ({ modelName, title }))
  .sort((a, b) => a.title.localeCompare(b.title));

export function getResourceTypeTitle(modelName, t) {
  if (!modelName) return "—";
  if (t) {
    return t(`resources.${modelName}`, {
      defaultValue:
        RESOURCE_LABELS[modelName] ??
        (modelName.replace(/Model$/, "") || modelName),
    });
  }
  if (RESOURCE_LABELS[modelName]) return RESOURCE_LABELS[modelName];
  return modelName.replace(/Model$/, "") || modelName;
}
