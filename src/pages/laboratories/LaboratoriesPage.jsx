import ResourceListPage from "@/pages/resources/ResourceListPage";

export default function LaboratoriesPage() {
  return (
    <ResourceListPage
      endpoint="laboratories"
      title="Laboratories"
      subtitle="Manage dental laboratories and their plans"
      searchPlaceholder="Search laboratories…"
      columns={[
        { key: "name", label: "Laboratory name" },
        { key: "plan_name", label: "Plan" },
      ]}
      fields={[
        {
          name: "name",
          label: "Laboratory name",
          required: true,
          placeholder: "e.g. City Dental Lab",
        },
        {
          name: "plan",
          label: "Plan",
          type: "select",
          optionsFrom: "plans",
          required: true,
        },
      ]}
    />
  );
}
