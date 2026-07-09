import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { isColumnSortable, resolveColumnOrderField } from "@/utils/columnOrdering";

const DESC_BY_DEFAULT = new Set(["created_at", "updated_at", "deleted_at"]);

function parseOrdering(ordering, defaultField, defaultDesc) {
  if (!ordering) {
    return { field: defaultField, desc: defaultDesc };
  }
  const desc = ordering.startsWith("-");
  const field = desc ? ordering.slice(1) : ordering;
  if (!field) {
    return { field: defaultField, desc: defaultDesc };
  }
  return { field, desc };
}

/**
 * Server-side sort state → `ordering` query param (-field / field), synced to URL.
 */
export function useTableSort({
  defaultField = "created_at",
  defaultDesc = true,
} = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = useMemo(() => {
    const ordering = searchParams.get("ordering") || "";
    return parseOrdering(ordering, defaultField, defaultDesc);
  }, [searchParams, defaultField, defaultDesc]);

  const ordering = useMemo(
    () => `${sort.desc ? "-" : ""}${sort.field}`,
    [sort.desc, sort.field]
  );

  const setSortField = useCallback(
    (field, desc) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("ordering", `${desc ? "-" : ""}${field}`);
          next.delete("page");
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const toggleColumnSort = useCallback(
    (column) => {
      const field = resolveColumnOrderField(column);
      if (!field) return false;
      if (sort.field === field) {
        setSortField(field, !sort.desc);
      } else {
        setSortField(field, DESC_BY_DEFAULT.has(field));
      }
      return true;
    },
    [setSortField, sort.desc, sort.field]
  );

  const isActive = useCallback(
    (column) => {
      const field = resolveColumnOrderField(column);
      return field != null && field === sort.field;
    },
    [sort.field]
  );

  const getDirection = useCallback(
    (column) => {
      if (!isActive(column)) return false;
      return sort.desc ? "desc" : "asc";
    },
    [isActive, sort.desc]
  );

  return {
    sort,
    ordering,
    toggleColumnSort,
    isActive,
    getDirection,
    isColumnSortable,
  };
}
