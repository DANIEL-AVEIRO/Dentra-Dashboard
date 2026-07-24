import { useCallback } from "react";
import ResourceListPage from "@/pages/resources/ResourceListPage";
import { TableActionButton } from "@/components/common/TableActions";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { FABRICATION_COLUMNS } from "@/pages/operations/caseFormConfig";

const ADVANCE_TOAST = {
  qc: "Case finished — moved to QC",
  ready: "Case finished — moved to Deliveries",
  delivered: "Case finished — ready for Billing",
  shipped: "Case finished — moved to Deliveries",
};

export default function FabricationPage() {
  const { t } = useTranslation();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const handleAdvance = useCallback(
    async (row, refresh) => {
      const ok = await confirm({
        title: t("pages.fabrication.confirmTitle", {
          defaultValue: "Finish fabrication?",
        }),
        message: t("pages.fabrication.confirmMessage", {
          defaultValue: "Mark case {{caseId}} as finished and move it to the next step?",
          caseId: row.case_id || row.id,
        }),
        confirmLabel: t("pages.fabrication.finished", {
          defaultValue: "Finished",
        }),
      });
      if (!ok) return;

      try {
        const { data } = await client.post(`/cases/${row.id}/advance/`, {});
        const next = data?.status;
        toast.success(
          t("pages.fabrication.advanced", {
            defaultValue: ADVANCE_TOAST[next] || "Case finished",
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
        endpoint="cases"
        pageKey="fabrication"
        columns={FABRICATION_COLUMNS}
        fields={[]}
        canCreate={false}
        canEdit={false}
        canDelete={false}
        showRowNumbers={false}
        listParams={{ pipeline: "fabrication" }}
        trashResourceId="cases"
        extraRowActions={(row, { refresh } = {}) => {
          if (!["received", "in_fabrication"].includes(row.status)) return null;
          return (
            <TableActionButton
              variant="status"
              title={t("pages.fabrication.finished", {
                defaultValue: "Finished",
              })}
              onClick={() => handleAdvance(row, refresh)}
            />
          );
        }}
      />
      <ConfirmDialog />
    </>
  );
}
