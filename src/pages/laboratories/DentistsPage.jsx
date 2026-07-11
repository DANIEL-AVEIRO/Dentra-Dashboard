import ResourceListPage from "@/pages/resources/ResourceListPage";

export default function DentistsPage() {
  return (
    <ResourceListPage
      endpoint="dentists"
      columns={[
        { key: "name", labelKey: "fields.dentist_name" },
        { key: "phone", labelKey: "fields.phone" },
        { key: "email", labelKey: "fields.email" },
        {
          key: "clinic_names",
          labelKey: "fields.associated_clinics",
          render: (row) =>
            Array.isArray(row.clinic_names) && row.clinic_names.length
              ? row.clinic_names.join(", ")
              : "—",
        },
      ]}
      fields={[
        { name: "name", labelKey: "fields.dentist_name", required: true },
        { name: "phone", labelKey: "fields.phone" },
        { name: "email", labelKey: "fields.email", type: "email" },
        {
          name: "clinic_ids",
          labelKey: "fields.associated_clinics",
          type: "multiSelect",
          optionsFrom: "clinics",
          namesKey: "clinic_names",
        },
      ]}
    />
  );
}
