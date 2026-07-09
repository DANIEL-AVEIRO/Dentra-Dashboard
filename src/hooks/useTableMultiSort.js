import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { isColumnSortable, resolveColumnOrderField } from "@/utils/columnOrdering";

const DESC_BY_DEFAULT = new Set(["created_at", "updated_at", "deleted_at"]);
const MAX_SORT_FIELDS = 3;

function parseOrderingList(raw, defaultField, defaultDesc) {
  const value = (raw || "").trim();
  if (!value) {
    return [{ field: defaultField, desc: defaultDesc }];
  }
  const parts = value.split(",").map((p) => p.trim()).filter(Boolean);
  if (!parts.length) {
    return [{ field: defaultField, desc: defaultDesc }];
  }
  return parts.slice(0, MAX_SORT_FIELDS).map((part) => {
    const desc = part.startsWith("-");
    const field = desc ? part.slice(1) : part;
    return { field, desc };
  });
}

function serializeOrdering(sorts) {
  return sorts.map(({ field, desc }) => `${desc ? "-" : ""}${field}`).join(",");
}

/** Multi-field server-side sort synced to URL `ordering` (-a,b,-c). */
export function useTableMultiSort({
  defaultField = "created_at",
  defaultDesc = true,
} = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const sorts = useMemo(() => {
    const ordering = searchParams.get("ordering") || "";
    return parseOrderingList(ordering, defaultField, defaultDesc);
  }, [searchParams, defaultField, defaultDesc]);

  const ordering = useMemo(() => serializeOrdering(sorts), [sorts]);
  const primarySort = sorts[0] ?? { field: defaultField, desc: defaultDesc };

  const setSorts = useCallback(
    (nextSorts) => {
      const serialized = serializeOrdering(nextSorts);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (serialized) next.set("ordering", serialized);
          else next.delete("ordering");
          next.delete("page");
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const toggleColumnSort = useCallback(
    (column, { shiftKey = false } = {}) => {
      const field = resolveColumnOrderField(column);
      if (!field) return false;

      if (!shiftKey) {
        if (primarySort.field === field) {
          setSorts([{ field, desc: !primarySort.desc }]);
        } else {
          setSorts([{ field, desc: DESC_BY_DEFAULT.has(field) }]);
        }
        return true;
      }

      const existingIndex = sorts.findIndex((s) => s.field === field);
      if (existingIndex >= 0) {
        const next = [...sorts];
        const current = next[existingIndex];
        if (current.desc) {
          next[existingIndex] = { field, desc: false };
        } else {
          next.splice(existingIndex, 1);
        }
        setSorts(next.length ? next : [{ field: defaultField, desc: defaultDesc }]);
        return true;
      }

      setSorts(
        [...sorts, { field, desc: DESC_BY_DEFAULT.has(field) }].slice(0, MAX_SORT_FIELDS)
      );
      return true;
    },
    [defaultDesc, defaultField, primarySort.desc, primarySort.field, setSorts, sorts]
  );

  const sortIndex = useCallback(
    (column) => {
      const field = resolveColumnOrderField(column);
      if (!field) return -1;
      return sorts.findIndex((s) => s.field === field);
    },
    [sorts]
  );

  return {
    sorts,
    sort: primarySort,
    ordering,
    setSorts,
    toggleColumnSort,
    sortIndex,
    isColumnSortable,
  };
}
