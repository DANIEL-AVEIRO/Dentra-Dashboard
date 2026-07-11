import ResourceListPage from "@/pages/resources/ResourceListPage";
import { CASE_COLUMNS, CASE_FIELDS } from "@/pages/operations/caseFormConfig";

export default function CasesPage() {
  return (
    <ResourceListPage
      endpoint="cases"
      columns={CASE_COLUMNS}
      fields={CASE_FIELDS}
      formPath="/cases"
    />
  );
}
