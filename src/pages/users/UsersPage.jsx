import ResourceListPage from "@/pages/resources/ResourceListPage";
import BooleanCell from "@/components/common/BooleanCell";
import { useAuth } from "@/context/AuthContext";

const SUPER_ADMIN_LABEL =
  import.meta.env.VITE_SUPER_ADMIN_USERNAME?.trim() || "Super Admin";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const viewerIsSuperAdmin = Boolean(currentUser?.is_super_admin);
  const viewerIsSuperuser = Boolean(currentUser?.is_superuser);
  const inlinePatchKeys = [
    "is_staff",
    "is_active",
    ...(viewerIsSuperuser ? ["is_superuser"] : []),
  ];

  return (
    <ResourceListPage
      endpoint="users"
      title="Users"
      subtitle="Manage system users and staff accounts"
      inlinePatchKeys={inlinePatchKeys}
      columns={(rows = []) => {
        const showSuperAdminColumn =
          viewerIsSuperAdmin && rows.some((row) => row.is_super_admin);
        return [
          { key: "username", label: "Username" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "role_name", label: "Role" },
          ...(showSuperAdminColumn
            ? [
                {
                  key: "is_super_admin",
                  label: SUPER_ADMIN_LABEL,
                  render: (row) => (
                    <BooleanCell
                      value={row.is_super_admin}
                      trueLabel={SUPER_ADMIN_LABEL}
                      falseLabel="—"
                    />
                  ),
                },
              ]
            : []),
          {
            key: "is_staff",
            label: "Staff",
            type: "boolean",
            trueLabel: "Staff",
            falseLabel: "User",
          },
          {
            key: "is_active",
            label: "Status",
            type: "boolean",
            trueLabel: "Active",
            falseLabel: "Inactive",
          },
          ...(viewerIsSuperuser
            ? [
                {
                  key: "is_superuser",
                  label: "Administrator",
                  type: "boolean",
                  trueLabel: "Superuser enabled",
                  falseLabel: "Regular permissions",
                },
              ]
            : []),
        ];
      }}
      fields={[
        { name: "username", label: "Username", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone" },
        {
          name: "password",
          label: "Password",
          type: "password",
          requiredOnCreate: true,
          helperText: "Minimum 6 characters",
        },
        { name: "role", label: "Role", type: "select", optionsFrom: "roles" },
        { name: "address", label: "Address", multiline: true, rows: 2 },
        {
          name: "is_staff",
          label: "Staff access",
          type: "boolean",
          default: false,
          description: "Allow access to admin dashboard",
          activeLabel: "Staff enabled",
          inactiveLabel: "Regular user",
        },
        {
          name: "is_active",
          label: "Account active",
          type: "boolean",
          default: true,
          description: "Inactive users cannot log in",
          activeLabel: "Active",
          inactiveLabel: "Inactive",
        },
        ...(viewerIsSuperuser
          ? [
              {
                name: "is_superuser",
                label: "Administrator",
                type: "boolean",
                default: false,
                description: "Grant full system permissions",
                activeLabel: "Superuser enabled",
                inactiveLabel: "Regular permissions",
              },
            ]
          : []),
      ]}
    />
  );
}
