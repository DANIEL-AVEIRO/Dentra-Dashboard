import ResourceListPage from "@/pages/resources/ResourceListPage";

export default function CommissionRulesPage() {
  return (
    <ResourceListPage
      endpoint="commission-rules"
      pageKey="commissionRules"
      columns={[
        { key: "user_name", labelKey: "fields.username" },
        { key: "percent", labelKey: "fields.percent" },
      ]}
      fields={[
        {
          name: "user",
          labelKey: "fields.username",
          type: "select",
          optionsFrom: "users",
          required: true,
        },
        {
          name: "percent",
          labelKey: "fields.percent",
          type: "number",
          required: true,
          compact: true,
        },
      ]}
    />
  );
}
