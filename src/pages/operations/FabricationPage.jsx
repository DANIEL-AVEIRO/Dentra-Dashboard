import { useCallback } from "react";
import ResourceListPage from "@/pages/resources/ResourceListPage";
import { TableActionButton } from "@/components/common/TableActions";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import {
  FABRICATION_ADVANCE_NEXT,
  FABRICATION_COLUMNS,
} from "@/pages/operations/caseFormConfig";

export default function FabricationPage() {
  const { t } = useTranslation();

  const handleAdvance = useCallback(
    async (row, refresh) => {
      const next = FABRICATION_ADVANCE_NEXT[row.status];
      if (!next) {
        toast.error(
          t("pages.fabrication.cannotAdvance", {
            defaultValue: "This case cannot be advanced further.",
          }),
        );
        return;
      }
      try {
        await client.post(`/cases/${row.id}/advance/`, { to: next });
        toast.success(
          t("pages.fabrication.advanced", {
            defaultValue: "Case finished — moved to QC",
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
        if (!FABRICATION_ADVANCE_NEXT[row.status]) return null;
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
  );
}
