import ResourceListPage from "@/pages/resources/ResourceListPage";
import { formatDisplayDate } from "@/utils/dateTimeValue";

export default function RolesPage() {
  return (
    <ResourceListPage
      endpoint="roles"
      title="Roles"
      subtitle="Manage user roles and which actions each role can perform"
      searchPlaceholder="Search role name…"
      formDialogMaxWidth="lg"
      formDialogLayout="role"
      columns={[
        { key: "name", labelKey: "pages.roles.roleName", label: "Role name" },
        { key: "permissions_count", label: "Permissions" },
        {
          key: "created_at",
          label: "Created",
          render: (row) =>
            row.created_at ? formatDisplayDate(row.created_at) : "—",
        },
      ]}
      fields={[
        {
          name: "name",
          label: "Name",
          required: true,
          placeholder: "e.g. Inventory Staff",
          description: "Unique name, e.g. merchant, rider, staff",
        },
        {
          name: "permission_ids",
          labelKey: "pages.roles.permissionsLabel",
          type: "permissionMatrix",
          optionsFrom: "roles/permission-options",
          optionLabelKey: "label",
          placeholderKey: "pages.roles.permissionsSearch",
          fullWidth: true,
        },
      ]}
    />
  );
}
