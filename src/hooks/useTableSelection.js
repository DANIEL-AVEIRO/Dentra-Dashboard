import { useCallback, useMemo, useState } from "react";
import { fetchAllFilteredRows } from "@/utils/fetchAllFilteredRows";

/**
 * Row selection for bulk table actions (persists across pages).
 * Supports "select all matching filter" mode.
 */
export function useTableSelection(rowIdKey = "id") {
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [allMatching, setAllMatching] = useState(false);
  const [allMatchingCount, setAllMatchingCount] = useState(0);

  const toggle = useCallback((id) => {
    setAllMatching(false);
    setAllMatchingCount(0);
    const key = String(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const isSelected = useCallback(
    (id) => allMatching || selectedIds.has(String(id)),
    [allMatching, selectedIds]
  );

  const clear = useCallback(() => {
    setSelectedIds(new Set());
    setAllMatching(false);
    setAllMatchingCount(0);
  }, []);

  const toggleAllOnPage = useCallback(
    (rows) => {
      setAllMatching(false);
      setAllMatchingCount(0);
      const pageIds = rows.map((r) => String(r[rowIdKey]));
      setSelectedIds((prev) => {
        const allOnPage = pageIds.length > 0 && pageIds.every((id) => prev.has(id));
        const next = new Set(prev);
        if (allOnPage) {
          pageIds.forEach((id) => next.delete(id));
        } else {
          pageIds.forEach((id) => next.add(id));
        }
        return next;
      });
    },
    [rowIdKey]
  );

  const selectAllMatching = useCallback((totalCount) => {
    setSelectedIds(new Set());
    setAllMatching(true);
    setAllMatchingCount(totalCount);
  }, []);

  const pageSelectionState = useCallback(
    (rows) => {
      if (allMatching) {
        return { checked: rows.length > 0, indeterminate: false };
      }
      if (!rows.length) return { checked: false, indeterminate: false };
      const pageIds = rows.map((r) => String(r[rowIdKey]));
      const selectedOnPage = pageIds.filter((id) => selectedIds.has(id)).length;
      return {
        checked: selectedOnPage === pageIds.length,
        indeterminate: selectedOnPage > 0 && selectedOnPage < pageIds.length,
      };
    },
    [allMatching, rowIdKey, selectedIds]
  );

  const getSelectedRows = useCallback(
    (rows) => {
      if (allMatching) return rows;
      return rows.filter((r) => selectedIds.has(String(r[rowIdKey])));
    },
    [allMatching, rowIdKey, selectedIds]
  );

  const selectedIdList = useMemo(() => [...selectedIds], [selectedIds]);
  const selectedCount = allMatching ? allMatchingCount : selectedIds.size;

  const resolveBulkIds = useCallback(
    async (endpoint, listParams) => {
      if (allMatching) {
        const allRows = await fetchAllFilteredRows(endpoint, listParams);
        return allRows.map((row) => row[rowIdKey]);
      }
      return selectedIdList;
    },
    [allMatching, rowIdKey, selectedIdList]
  );

  return {
    selectedIds,
    selectedIdList,
    selectedCount,
    allMatching,
    allMatchingCount,
    toggle,
    isSelected,
    clear,
    toggleAllOnPage,
    selectAllMatching,
    pageSelectionState,
    getSelectedRows,
    resolveBulkIds,
  };
}
