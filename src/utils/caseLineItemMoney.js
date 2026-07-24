export function formatCaseMoney(value) {
  if (value == null || value === "") return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/** line_total = max(0, unit_price * quantity - discount) */
export function caseLineTotal(row) {
  const qty = Number(row?.quantity) || 0;
  const price = Number(row?.unit_price);
  if (!qty || !Number.isFinite(price)) return null;
  const discount = Number(row?.discount) || 0;
  return Math.max(0, qty * price - discount);
}

export function caseLineGross(row) {
  const qty = Number(row?.quantity) || 0;
  const price = Number(row?.unit_price);
  if (!qty || !Number.isFinite(price)) return null;
  return qty * price;
}

export function caseLineDiscount(row) {
  const gross = caseLineGross(row);
  if (gross == null) return 0;
  const discount = Number(row?.discount) || 0;
  return Math.min(Math.max(0, discount), gross);
}

export function computeWorkItemsTotal(lineItems = []) {
  if (!Array.isArray(lineItems)) return 0;
  return lineItems.reduce((sum, row) => {
    const total = caseLineTotal(row);
    return total != null ? sum + total : sum;
  }, 0);
}

export function computeWorkItemsGross(lineItems = []) {
  if (!Array.isArray(lineItems)) return 0;
  return lineItems.reduce((sum, row) => {
    const gross = caseLineGross(row);
    return gross != null ? sum + gross : sum;
  }, 0);
}

export function computeWorkItemsDiscount(lineItems = []) {
  if (!Array.isArray(lineItems)) return 0;
  return lineItems.reduce((sum, row) => sum + caseLineDiscount(row), 0);
}

export function countPricedLineItems(lineItems = []) {
  if (!Array.isArray(lineItems)) return 0;
  return lineItems.filter((row) => caseLineTotal(row) != null).length;
}

export function sumLineItemQuantity(lineItems = []) {
  if (!Array.isArray(lineItems)) return 0;
  return lineItems.reduce((sum, row) => {
    const qty = Number(row?.quantity);
    return sum + (Number.isFinite(qty) && qty > 0 ? qty : 0);
  }, 0);
}
