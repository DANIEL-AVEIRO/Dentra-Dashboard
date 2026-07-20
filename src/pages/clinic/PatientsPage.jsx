import ResourceListPage from "@/pages/resources/ResourceListPage";

export default function PatientsPage() {
  return (
    <ResourceListPage
      endpoint="patients"
      pageKey="patients"
      columns={[
        { key: "name", labelKey: "fields.name" },
        { key: "phone", labelKey: "fields.phone" },
        { key: "clinic_name", labelKey: "fields.clinic_name" },
        { key: "dob", labelKey: "fields.dob" },
        { key: "notes", labelKey: "fields.notes" },
      ]}
      fields={[
        {
          name: "clinic",
          labelKey: "fields.clinic_name",
          type: "select",
          optionsFrom: "clinics",
          required: true,
        },
        { name: "name", labelKey: "fields.name", required: true },
        { name: "phone", labelKey: "fields.phone" },
        { name: "dob", labelKey: "fields.dob", type: "date" },
        {
          name: "notes",
          labelKey: "fields.notes",
          multiline: true,
          rows: 3,
        },
      ]}
    />
  );
}
