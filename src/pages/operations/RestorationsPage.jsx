import ResourceListPage from "@/pages/resources/ResourceListPage";
import {
  RESTORATION_COLUMNS,
  RESTORATION_FIELDS,
} from "@/pages/operations/restorationFormConfig";

export default function RestorationsPage() {
  return (
    <ResourceListPage
      endpoint="restorations"
      columns={RESTORATION_COLUMNS}
      fields={RESTORATION_FIELDS}
    />
  );
}
