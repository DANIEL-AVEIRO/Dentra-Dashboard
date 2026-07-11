import { formatDateTime } from "@/utils/format";

/** Trash / restore configs — endpoint must support ?deleted_only=1 and POST .../restore/ */

export const TRASH_ALL_ID = "";

/** Columns when viewing all resource types (aggregated /trash/ API). */
export const trashAllColumns = [
  { key: "resource_id", labelKey: "filters.resourceType" },
  { key: "display", labelKey: "audit.columns.record" },
];

export const trashAllConfig = {
  id: TRASH_ALL_ID,
  endpoint: "trash",
  title: "All",
  labelKey: "display",
  columns: trashAllColumns,
};

export const trashResources = [
  {
    id: "roles",
    endpoint: "roles",
    title: "Roles",
    labelKey: "name",
    columns: [
      { key: "name", label: "Role name" },
      { key: "permissions_count", label: "Permissions" },
    ],
  },
  {
    id: "users",
    endpoint: "users",
    title: "Users",
    labelKey: "username",
    columns: [
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "role_name", label: "Role" },
    ],
  },
  {
    id: "plans",
    endpoint: "plans",
    title: "Plans",
    labelKey: "name",
    columns: [
      { key: "name", label: "Plan name" },
      { key: "price", label: "Price" },
      { key: "user_limit", label: "User limit" },
      { key: "storage_limit", label: "Storage limit (MB)" },
      { key: "status", label: "Status" },
    ],
  },
  {
    id: "laboratories",
    endpoint: "laboratories",
    title: "Laboratories",
    labelKey: "name",
    columns: [
      { key: "name", label: "Laboratory name" },
      { key: "plan_name", label: "Plan" },
      { key: "owner_name", label: "Owner name" },
      { key: "owner_email", label: "Owner email" },
      { key: "users_usage", label: "Users" },
    ],
  },
  {
    id: "clinics",
    endpoint: "clinics",
    title: "Clinics",
    labelKey: "clinic_code",
    columns: [
      { key: "clinic_code", label: "Clinic code" },
      { key: "name", label: "Clinic name" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "region_name", label: "Region" },
    ],
  },
  {
    id: "dentists",
    endpoint: "dentists",
    title: "Dentists",
    labelKey: "name",
    columns: [
      { key: "name", label: "Dentist name" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
    ],
  },
];

export const deletedAtColumn = {
  key: "deleted_at",
  labelKey: "audit.fields.deleted_at",
  exportValue: (row) => row.deleted_at ?? "",
  render: (row) =>
    row.deleted_at ? formatDateTime(row.deleted_at) : "—",
};

export function getTrashConfig(resourceId) {
  if (!resourceId) return trashAllConfig;
  return trashResources.find((r) => r.id === resourceId) ?? null;
}

export function getTrashRowConfig(row) {
  if (row?.resource_id) {
    return trashResources.find((r) => r.id === row.resource_id) ?? trashAllConfig;
  }
  return trashAllConfig;
}
