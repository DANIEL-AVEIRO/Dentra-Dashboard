import { useCallback, useEffect, useMemo, useState } from "react";

const TABLE_COLUMNS_KEY = "arrow-table-visible-columns";
const TABLE_COLUMN_ORDER_KEY = "arrow-table-column-order";

function columnStorageId(columns) {
  return columns.map((col) => col.key).join("|");
}

function readJsonArray(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function persistJsonArray(storageKey, keys) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(keys));
  } catch {
    /* ignore */
  }
}

function readVisibleColumnKeys(storageId, allKeys) {
  const parsed = readJsonArray(`${TABLE_COLUMNS_KEY}:${storageId}`);
  if (!parsed) return null;
  const allowed = new Set(allKeys);
  const kept = parsed.filter((key) => allowed.has(key));
  return kept.length ? kept : null;
}

function readColumnOrder(storageId, allKeys) {
  const parsed = readJsonArray(`${TABLE_COLUMN_ORDER_KEY}:${storageId}`);
  if (!parsed) return allKeys;
  const allowed = new Set(allKeys);
  const kept = parsed.filter((key) => allowed.has(key));
  const missing = allKeys.filter((key) => !kept.includes(key));
  return kept.length ? [...kept, ...missing] : allKeys;
}

function orderColumns(columns, orderKeys) {
  const byKey = new Map(columns.map((col) => [col.key, col]));
  const ordered = orderKeys.map((key) => byKey.get(key)).filter(Boolean);
  const seen = new Set(ordered.map((col) => col.key));
  for (const col of columns) {
    if (!seen.has(col.key)) ordered.push(col);
  }
  return ordered;
}

export function useTableColumnVisibility(columns, storageKey) {
  const resolvedColumns = useMemo(
    () => (Array.isArray(columns) ? columns : []),
    [columns]
  );
  const storageId = storageKey || columnStorageId(resolvedColumns);
  const allColumnKeys = useMemo(
    () => resolvedColumns.map((col) => col.key),
    [resolvedColumns]
  );

  const [columnOrder, setColumnOrder] = useState(() =>
    readColumnOrder(storageId, allColumnKeys)
  );
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() => {
    const stored = readVisibleColumnKeys(storageId, allColumnKeys);
    return new Set(stored ?? allColumnKeys);
  });

  useEffect(() => {
    setColumnOrder(readColumnOrder(storageId, allColumnKeys));
    const stored = readVisibleColumnKeys(storageId, allColumnKeys);
    setVisibleColumnKeys(new Set(stored ?? allColumnKeys));
  }, [storageId, allColumnKeys.join("|")]);

  const orderedColumns = useMemo(
    () => orderColumns(resolvedColumns, columnOrder),
    [resolvedColumns, columnOrder]
  );

  const displayColumns = useMemo(
    () => orderedColumns.filter((col) => visibleColumnKeys.has(col.key)),
    [orderedColumns, visibleColumnKeys]
  );

  const toggleColumnVisibility = useCallback((key) => {
    setVisibleColumnKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size <= 1) return prev;
        next.delete(key);
      } else {
        next.add(key);
      }
      persistJsonArray(`${TABLE_COLUMNS_KEY}:${storageId}`, [...next]);
      return next;
    });
  }, [storageId]);

  const resetColumns = useCallback(() => {
    setColumnOrder([...allColumnKeys]);
    setVisibleColumnKeys(new Set(allColumnKeys));
    persistJsonArray(`${TABLE_COLUMN_ORDER_KEY}:${storageId}`, allColumnKeys);
    persistJsonArray(`${TABLE_COLUMNS_KEY}:${storageId}`, allColumnKeys);
  }, [allColumnKeys, storageId]);

  const reorderColumn = useCallback((activeKey, overKey) => {
    if (!activeKey || !overKey || activeKey === overKey) return;
    setColumnOrder((prev) => {
      const fromIndex = prev.indexOf(activeKey);
      const toIndex = prev.indexOf(overKey);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, activeKey);
      persistJsonArray(`${TABLE_COLUMN_ORDER_KEY}:${storageId}`, next);
      return next;
    });
  }, [storageId]);

  const applyColumnState = useCallback(
    ({ order, visible } = {}) => {
      if (Array.isArray(order) && order.length) {
        const allowed = new Set(allColumnKeys);
        const nextOrder = order.filter((key) => allowed.has(key));
        const missing = allColumnKeys.filter((key) => !nextOrder.includes(key));
        const merged = [...nextOrder, ...missing];
        setColumnOrder(merged);
        persistJsonArray(`${TABLE_COLUMN_ORDER_KEY}:${storageId}`, merged);
      }
      if (Array.isArray(visible) && visible.length) {
        const allowed = new Set(allColumnKeys);
        const kept = visible.filter((key) => allowed.has(key));
        if (kept.length) {
          const nextVisible = new Set(kept);
          setVisibleColumnKeys(nextVisible);
          persistJsonArray(`${TABLE_COLUMNS_KEY}:${storageId}`, [...nextVisible]);
        }
      }
    },
    [allColumnKeys, storageId]
  );

  return {
    allColumns: orderedColumns,
    displayColumns,
    visibleColumnKeys,
    columnOrder,
    toggleColumnVisibility,
    resetColumns,
    reorderColumn,
    applyColumnState,
    canToggle: resolvedColumns.length > 1,
  };
}
