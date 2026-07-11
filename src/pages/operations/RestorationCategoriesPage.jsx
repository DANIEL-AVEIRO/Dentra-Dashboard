import ResourceListPage from "@/pages/resources/ResourceListPage";
import {
  RESTORATION_CATEGORY_COLUMNS,
  RESTORATION_CATEGORY_FIELDS,
} from "@/pages/operations/restorationCategoryFormConfig";

export default function RestorationCategoriesPage() {
  return (
    <ResourceListPage
      endpoint="restoration-categories"
      columns={RESTORATION_CATEGORY_COLUMNS}
      fields={RESTORATION_CATEGORY_FIELDS}
    />
  );
}
