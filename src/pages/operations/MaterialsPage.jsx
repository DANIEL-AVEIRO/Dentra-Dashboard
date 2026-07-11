import ResourceListPage from "@/pages/resources/ResourceListPage";
import {
  MATERIAL_COLUMNS,
  MATERIAL_FIELDS,
} from "@/pages/operations/materialFormConfig";

export default function MaterialsPage() {
  return (
    <ResourceListPage
      endpoint="materials"
      columns={MATERIAL_COLUMNS}
      fields={MATERIAL_FIELDS}
    />
  );
}
