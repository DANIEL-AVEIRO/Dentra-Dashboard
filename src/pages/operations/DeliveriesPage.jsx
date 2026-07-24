import { useCallback } from "react";
import ResourceListPage from "@/pages/resources/ResourceListPage";
import { TableActionButton } from "@/components/common/TableActions";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import {
  DELIVERY_COLUMNS,
  DELIVERY_FIELDS,
} from "@/pages/operations/caseFormConfig";
import { printDeliveryNote } from "@/utils/printDocuments";

const REDO_TOAST = {
  qc: "Case sent back to QC",
  received: "Case sent back to Fabrication",
  in_fabrication: "Case sent back to Fabrication",
};

export default function DeliveriesPage() {
  const { t } = useTranslation();
  const { confirm, ConfirmDialog } = useConfirmDialog();

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

  const handleRedo = useCallback(
    async (row, refresh) => {
      const caseId = row.case;
      if (!caseId) return;
      const ok = await confirm({
        title: t("pages.deliveries.redoTitle", {
          defaultValue: "Redo case?",
        }),
        message: t("pages.deliveries.redoMessage", {
          defaultValue:
            "Send case {{caseId}} back to the previous workflow step?",
          caseId: row.case_id_display || caseId,
        }),
        confirmLabel: t("pages.deliveries.redo", { defaultValue: "Redo" }),
        confirmColor: "warning",
      });
      if (!ok) return;
      try {
        const { data } = await client.post(`/cases/${caseId}/redo/`);
        toast.success(
          t("pages.deliveries.redone", {
            defaultValue: REDO_TOAST[data?.status] || "Case sent back",
          }),
        );
        refresh?.();
      } catch (err) {
        toast.error(getErrorMessage(err, t("toast.saveFailed")));
      }
    },
    [confirm, t],
  );

  return (
    <>
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
            <TableActionButton
              variant="restore"
              title={t("pages.deliveries.redo", { defaultValue: "Redo" })}
              onClick={() => handleRedo(row, refresh)}
            />
          </>
        )}
      />
      <ConfirmDialog />
    </>
  );
}
