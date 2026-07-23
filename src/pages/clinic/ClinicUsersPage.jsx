import ResourceListPage from "@/pages/resources/ResourceListPage";

export default function ClinicUsersPage() {
  return (
    <ResourceListPage
      endpoint="users"
      pageKey="clinicUsers"
      listParams={{ clinic_users: "1" }}
      columns={[
        { key: "username", labelKey: "fields.username" },
        { key: "email", labelKey: "fields.email" },
        { key: "phone", labelKey: "fields.phone" },
        { key: "clinic_name", labelKey: "fields.clinic_name" },
        {
          key: "is_active",
          labelKey: "fields.status",
          type: "boolean",
          trueLabelKey: "common.active",
          falseLabelKey: "common.inactive",
        },
      ]}
      fields={[
        { name: "username", labelKey: "fields.username", required: true },
        { name: "email", labelKey: "fields.email", type: "email", required: true },
        { name: "phone", labelKey: "fields.phone" },
        {
          name: "password",
          labelKey: "fields.password",
          type: "password",
          requiredOnCreate: true,
          helperTextKey: "fields.passwordHelp",
        },
        {
          name: "clinic",
          labelKey: "fields.clinic_name",
          type: "select",
          optionsFrom: "clinics",
          required: true,
        },
        {
          name: "is_active",
          labelKey: "fields.status",
          type: "boolean",
          default: true,
          activeLabelKey: "common.active",
          inactiveLabelKey: "common.inactive",
        },
      ]}
    />
  );
}
