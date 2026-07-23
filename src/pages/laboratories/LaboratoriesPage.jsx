import ResourceListPage from "@/pages/resources/ResourceListPage";

export default function LaboratoriesPage() {
  return (
    <ResourceListPage
      endpoint="laboratories"
      title="Laboratories"
      subtitle="Manage dental laboratories, owners, and plans"
      searchPlaceholder="Search laboratories…"
      columns={[
        { key: "name", label: "Laboratory name" },
        { key: "city_code", label: "City code" },
        { key: "lab_code", label: "Lab code" },
        { key: "plan_name", label: "Plan" },
        { key: "owner_name", label: "Owner name" },
        { key: "owner_email", label: "Owner email" },
        { key: "users_usage", label: "Users" },
      ]}
      fields={[
        {
          name: "name",
          label: "Laboratory name",
          required: true,
          placeholder: "e.g. City Dental Lab",
        },
        {
          name: "city_code",
          label: "City code",
          placeholder: "e.g. YGN",
          helperText: "Used in Case ID (YGN/PWA/2026/000001.0)",
        },
        {
          name: "lab_code",
          label: "Lab code",
          placeholder: "e.g. PWA",
        },
        {
          name: "plan",
          label: "Plan",
          type: "select",
          optionsFrom: "plans",
          required: true,
        },
        {
          name: "owner_name",
          label: "Owner name",
          requiredOnCreate: true,
          placeholder: "e.g. Dr. Aung",
        },
        {
          name: "owner_email",
          label: "Owner email",
          type: "email",
          requiredOnCreate: true,
          placeholder: "owner@lab.com",
        },
        {
          name: "owner_password",
          label: "Owner password",
          type: "password",
          requiredOnCreate: true,
          helperText: "Minimum 6 characters",
        },
      ]}
    />
  );
}
