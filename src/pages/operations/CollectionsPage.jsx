import { useCallback } from "react";
import ResourceListPage from "@/pages/resources/ResourceListPage";
import {
  PAYMENT_COLUMNS,
  PAYMENT_FIELDS,
} from "@/pages/operations/financeFormConfig";

export default function CollectionsPage() {
  return (
    <ResourceListPage
      endpoint="payments"
      pageKey="collections"
      columns={PAYMENT_COLUMNS}
      fields={PAYMENT_FIELDS}
      canEdit={false}
    />
  );
}
