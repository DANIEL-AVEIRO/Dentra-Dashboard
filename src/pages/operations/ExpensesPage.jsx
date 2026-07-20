import { useCallback } from "react";
import ResourceListPage from "@/pages/resources/ResourceListPage";
import { TableActionButton } from "@/components/common/TableActions";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import {
  EXPENSE_COLUMNS,
  EXPENSE_FIELDS,
} from "@/pages/operations/financeFormConfig";

export default function ExpensesPage() {
  const { t } = useTranslation();

  const handleApprove = useCallback(
    async (row, refresh) => {
      try {
        await client.post(`/lab-expenses/${row.id}/approve/`);
        toast.success(
          t("pages.expenses.approved", { defaultValue: "Expense approved" }),
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
      endpoint="lab-expenses"
      pageKey="expenses"
      columns={EXPENSE_COLUMNS}
      fields={EXPENSE_FIELDS}
      canEdit={true}
      extraRowActions={(row, { refresh } = {}) =>
        row.status === "draft" ? (
          <TableActionButton
            variant="status"
            title={t("pages.expenses.approve", { defaultValue: "Approve" })}
            onClick={() => handleApprove(row, refresh)}
          />
        ) : null
      }
    />
  );
}
