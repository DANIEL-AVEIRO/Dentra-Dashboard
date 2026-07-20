import ResourceListPage from "@/pages/resources/ResourceListPage";
import { TableActionButton } from "@/components/common/TableActions";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";

export default function ClinicsPage() {
  const { t } = useTranslation();

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
        { key: "credit_limit", labelKey: "fields.credit_limit" },
        { key: "credit_warning_pct", labelKey: "fields.credit_warning_pct" },
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
          name: "credit_limit",
          labelKey: "fields.credit_limit",
          type: "number",
          compact: true,
        },
        {
          name: "credit_warning_pct",
          labelKey: "fields.credit_warning_pct",
          type: "number",
          compact: true,
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
      extraRowActions={(row) => (
        <TableActionButton
          variant="status"
          title={t("pages.clinics.sendReminder", {
            defaultValue: "Send payment reminder",
          })}
          onClick={async () => {
            try {
              await client.post(`/clinics/${row.id}/send-reminder/`);
              toast.success(
                t("pages.clinics.reminderSent", {
                  defaultValue: "Reminder sent",
                }),
              );
            } catch (err) {
              toast.error(getErrorMessage(err, t("toast.saveFailed")));
            }
          }}
        />
      )}
    />
  );
}
