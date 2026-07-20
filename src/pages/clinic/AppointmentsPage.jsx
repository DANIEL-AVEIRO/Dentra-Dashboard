import ResourceListPage from "@/pages/resources/ResourceListPage";

const APPOINTMENT_STATUS_OPTIONS = [
  { id: "scheduled", name: "Scheduled" },
  { id: "completed", name: "Completed" },
  { id: "cancelled", name: "Cancelled" },
  { id: "no_show", name: "No show" },
];

const APPOINTMENT_STATUS_COLUMN = {
  statusList: [
    { value: "scheduled", color: "info" },
    { value: "completed", color: "success" },
    { value: "cancelled", color: "default" },
    { value: "no_show", color: "warning" },
  ],
};

export default function AppointmentsPage() {
  return (
    <ResourceListPage
      endpoint="appointments"
      pageKey="appointments"
      columns={[
        { key: "clinic_name", labelKey: "fields.clinic_name" },
        { key: "patient_name", labelKey: "fields.patient_name" },
        { key: "dentist_name", labelKey: "fields.dentist_name" },
        { key: "starts_at", labelKey: "fields.starts_at" },
        { key: "ends_at", labelKey: "fields.ends_at" },
        { key: "chair_label", labelKey: "fields.chair_label" },
        {
          key: "status",
          labelKey: "fields.status",
          ...APPOINTMENT_STATUS_COLUMN,
        },
      ]}
      fields={[
        {
          name: "clinic",
          labelKey: "fields.clinic_name",
          type: "select",
          optionsFrom: "clinics",
          required: true,
          clearsFields: ["patient"],
        },
        {
          name: "patient",
          labelKey: "fields.patient_name",
          type: "select",
          optionsFrom: "patients",
          dependsOn: "clinic",
          optionsQueryParam: "clinic",
          required: true,
        },
        {
          name: "dentist",
          labelKey: "fields.dentist_name",
          type: "select",
          optionsFrom: "dentists",
        },
        {
          name: "starts_at",
          labelKey: "fields.starts_at",
          type: "datetime",
          required: true,
        },
        {
          name: "ends_at",
          labelKey: "fields.ends_at",
          type: "datetime",
        },
        { name: "chair_label", labelKey: "fields.chair_label" },
        {
          name: "status",
          labelKey: "fields.status",
          type: "select",
          options: APPOINTMENT_STATUS_OPTIONS,
          default: "scheduled",
          required: true,
        },
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
