export function formatCaseMoney(value) {
  if (value == null || value === "") return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function caseLineTotal(row) {
  const qty = Number(row?.quantity) || 0;
  const price = Number(row?.unit_price);
  if (!qty || !Number.isFinite(price)) return null;
  return qty * price;
}

export function computeWorkItemsTotal(lineItems = []) {
  if (!Array.isArray(lineItems)) return 0;
  return lineItems.reduce((sum, row) => {
    const total = caseLineTotal(row);
    return total != null ? sum + total : sum;
  }, 0);
}

export function countPricedLineItems(lineItems = []) {
  if (!Array.isArray(lineItems)) return 0;
  return lineItems.filter((row) => caseLineTotal(row) != null).length;
}
