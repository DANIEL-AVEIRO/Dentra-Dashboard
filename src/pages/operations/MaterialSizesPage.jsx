import ResourceListPage from "@/pages/resources/ResourceListPage";
import {
  MATERIAL_SIZE_COLUMNS,
  MATERIAL_SIZE_FIELDS,
} from "@/pages/operations/materialSizeFormConfig";

export default function MaterialSizesPage() {
  return (
    <ResourceListPage
      endpoint="material-sizes"
      columns={MATERIAL_SIZE_COLUMNS}
      fields={MATERIAL_SIZE_FIELDS}
      rowReorderField="sort_order"
    />
  );
}
