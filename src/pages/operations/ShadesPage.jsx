import ResourceListPage from "@/pages/resources/ResourceListPage";
import {
  SHADE_COLUMNS,
  SHADE_FIELDS,
} from "@/pages/operations/shadeFormConfig";

export default function ShadesPage() {
  return (
    <ResourceListPage
      endpoint="shades"
      columns={SHADE_COLUMNS}
      fields={SHADE_FIELDS}
      rowReorderField="sort_order"
    />
  );
}
