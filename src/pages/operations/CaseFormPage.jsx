import ResourceFormPanel from "@/components/resources/ResourceFormPanel";
import { CASE_FIELDS } from "@/pages/operations/caseFormConfig";

export default function CaseFormPage() {
  return (
    <ResourceFormPanel endpoint="cases" fields={CASE_FIELDS} listPath="/cases" />
  );
}
