import ResourceListPage from "@/pages/resources/ResourceListPage";
import {
  MATERIAL_CATEGORY_COLUMNS,
  MATERIAL_CATEGORY_FIELDS,
} from "@/pages/operations/materialCategoryFormConfig";

export default function MaterialCategoriesPage() {
  return (
    <ResourceListPage
      endpoint="material-categories"
      columns={MATERIAL_CATEGORY_COLUMNS}
      fields={MATERIAL_CATEGORY_FIELDS}
    />
  );
}
