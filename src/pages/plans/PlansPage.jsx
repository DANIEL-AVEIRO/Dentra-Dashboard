import ResourceListPage from "@/pages/resources/ResourceListPage";

const PLAN_STATUS_OPTIONS = [
  { id: "active", name: "Active" },
  { id: "inactive", name: "Inactive" },
];

const PLAN_STATUS_COLUMN = {
  statusList: [
    { value: "active", color: "success" },
    { value: "inactive", color: "default" },
  ],
};

export default function PlansPage() {
  return (
    <ResourceListPage
      endpoint="plans"
      title="Plans"
      subtitle="Manage subscription plans for laboratories"
      searchPlaceholder="Search plans…"
      columns={[
        { key: "name", label: "Plan name" },
        {
          key: "price",
          label: "Price",
          render: (row) =>
            row.price != null && row.price !== ""
              ? Number(row.price).toLocaleString()
              : "—",
        },
        { key: "user_limit", label: "User limit" },
        {
          key: "storage_limit",
          label: "Storage limit (GB)",
          render: (row) =>
            row.storage_limit != null && row.storage_limit !== ""
              ? `${row.storage_limit} GB`
              : "—",
        },
        {
          key: "status",
          label: "Status",
          ...PLAN_STATUS_COLUMN,
        },
      ]}
      fields={[
        {
          name: "name",
          label: "Plan name",
          required: true,
          placeholder: "e.g. Starter",
        },
        {
          name: "price",
          label: "Price",
          type: "number",
          required: true,
          placeholder: "0",
        },
        {
          name: "user_limit",
          label: "User limit",
          type: "number",
          required: true,
          placeholder: "e.g. 10",
        },
        {
          name: "storage_limit",
          label: "Storage limit (GB)",
          type: "number",
          required: true,
          placeholder: "e.g. 50",
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          default: "active",
          options: PLAN_STATUS_OPTIONS,
        },
      ]}
    />
  );
}
