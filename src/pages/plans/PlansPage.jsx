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
          label: "Storage limit (MB)",
          render: (row) =>
            row.storage_limit != null && row.storage_limit !== ""
              ? `${row.storage_limit} MB`
              : "—",
        },
        {
          key: "max_cases_per_month",
          label: "Max cases / month",
          render: (row) =>
            row.max_cases_per_month != null && row.max_cases_per_month !== ""
              ? String(row.max_cases_per_month)
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
          label: "Storage limit (MB)",
          type: "number",
          required: true,
          placeholder: "e.g. 1024",
        },
        {
          name: "max_cases_per_month",
          label: "Max cases / month",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "status",
          label: "Status",
          type: "activeStatus",
          required: true,
          default: "active",
          options: PLAN_STATUS_OPTIONS,
        },
      ]}
    />
  );
}
