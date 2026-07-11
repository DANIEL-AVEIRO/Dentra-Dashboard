import ResourceListPage from "@/pages/resources/ResourceListPage";

export default function ClinicsPage() {
  return (
    <ResourceListPage
      endpoint="clinics"
      columns={[
        { key: "clinic_code", labelKey: "fields.clinic_code" },
        { key: "name", labelKey: "fields.clinic_name" },
        { key: "phone", labelKey: "fields.phone" },
        { key: "email", labelKey: "fields.email" },
        { key: "address", labelKey: "fields.address" },
        { key: "region_name", labelKey: "fields.region_name" },
        {
          key: "is_active",
          labelKey: "fields.status",
          type: "boolean",
          trueLabelKey: "common.active",
          falseLabelKey: "common.inactive",
        },
      ]}
      fields={[
        { name: "name", labelKey: "fields.clinic_name", required: true },
        { name: "phone", labelKey: "fields.phone" },
        { name: "email", labelKey: "fields.email", type: "email" },
        { name: "address", labelKey: "fields.address", type: "multiline" },
        {
          name: "region",
          labelKey: "fields.region",
          type: "select",
          optionsFrom: "regions",
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
