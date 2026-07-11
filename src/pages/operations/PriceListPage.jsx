import ResourceListPage from "@/pages/resources/ResourceListPage";
import {
  PRICE_LIST_COLUMNS,
  PRICE_LIST_FIELDS,
} from "@/pages/operations/priceListFormConfig";

export default function PriceListPage() {
  return (
    <ResourceListPage
      endpoint="price-list"
      columns={PRICE_LIST_COLUMNS}
      fields={PRICE_LIST_FIELDS}
    />
  );
}
