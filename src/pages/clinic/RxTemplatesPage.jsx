import ResourceListPage from "@/pages/resources/ResourceListPage";

export default function RxTemplatesPage() {
  return (
    <ResourceListPage
      endpoint="rx-templates"
      pageKey="rxTemplates"
      columns={[
        { key: "name", labelKey: "fields.name" },
        { key: "clinic_name", labelKey: "fields.clinic_name" },
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
        {
          name: "line_preset",
          labelKey: "fields.line_preset",
          multiline: true,
          rows: 4,
          fullWidth: true,
          helperText: "JSON array of line item presets",
        },
      ]}
    />
  );
}
