import { useCallback } from "react";
import ResourceListPage from "@/pages/resources/ResourceListPage";
import { TableActionButton } from "@/components/common/TableActions";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import {
  DELIVERY_COLUMNS,
  DELIVERY_FIELDS,
} from "@/pages/operations/caseFormConfig";
import { printDeliveryNote } from "@/utils/printDocuments";

export default function DeliveriesPage() {
  const { t } = useTranslation();

  const handleConfirm = useCallback(
    async (row, refresh) => {
      if (row.status === "delivered") return;
      try {
        await client.post(`/deliveries/${row.id}/confirm/`);
        toast.success(
          t("pages.deliveries.confirmed", {
            defaultValue: "Delivered — moved to Unbilled Cases",
          }),
        );
        refresh?.();
      } catch (err) {
        toast.error(getErrorMessage(err, t("toast.saveFailed")));
      }
    },
    [t],
  );

  return (
    <ResourceListPage
      endpoint="deliveries"
      pageKey="deliveries"
      columns={DELIVERY_COLUMNS}
      fields={DELIVERY_FIELDS}
      canEdit={false}
      showRowNumbers={false}
      listParams={{ status: "pending,in_transit" }}
      extraRowActions={(row, { refresh } = {}) => (
        <>
          <TableActionButton
            variant="view"
            title={t("pages.deliveries.printNote", {
              defaultValue: "Print delivery note",
            })}
            onClick={() => printDeliveryNote(row)}
          />
          {row.status !== "delivered" && row.status !== "failed" ? (
            <TableActionButton
              variant="status"
              title={t("pages.deliveries.delivered", {
                defaultValue: "Delivered",
              })}
              onClick={() => handleConfirm(row, refresh)}
            />
          ) : null}
        </>
      )}
    />
  );
}
