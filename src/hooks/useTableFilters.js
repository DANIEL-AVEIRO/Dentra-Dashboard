import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const EMPTY = {
  search: "",
  date: "",
  date_from: "",
  date_to: "",
  date_field: "",
  department: "",
  position: "",
};

const FILTER_KEYS = Object.keys(EMPTY);

/** Query keys owned by other list hooks — never drop when syncing table filters. */
const PRESERVED_URL_KEYS = ["status", "page", "ordering", "resource", "page_size"];

function preserveListParams(source, target) {
  for (const key of PRESERVED_URL_KEYS) {
    const value = source.get(key);
    if (value != null && value !== "") {
      target.set(key, value);
    }
  }
}

function filtersFromSearchParams(searchParams, initial = {}) {
  const next = { ...EMPTY, ...initial };
  for (const key of FILTER_KEYS) {
    const value = searchParams.get(key);
    if (value != null && value !== "") {
      next[key] = value;
    }
  }
  return next;
}

function buildSearchParams(filters, debouncedSearch) {
  const params = new URLSearchParams();
  const search = debouncedSearch.trim();
  if (search) params.set("search", search);
  if (filters.date) params.set("date", filters.date);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);
  if (
    filters.date_field &&
    (filters.date || filters.date_from || filters.date_to)
  ) {
    params.set("date_field", filters.date_field);
  }
  if (filters.department) {
    params.set("department", filters.department);
    if (filters.position) params.set("position", filters.position);
  }
  return params;
}

export function useTableFilters(initial = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const skipUrlSyncRef = useRef(false);
  const lastUrlRef = useRef(
    buildSearchParams(
      filtersFromSearchParams(searchParams, initial),
      (searchParams.get("search") ?? "").trim()
    ).toString()
  );

  const [filters, setFilters] = useState(() =>
    filtersFromSearchParams(searchParams, initial)
  );
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 220);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    const built = buildSearchParams(filters, debouncedSearch);
    const next = built.toString();
    if (next === lastUrlRef.current) return;
    lastUrlRef.current = next;
    skipUrlSyncRef.current = true;
    setSearchParams(
      (prev) => {
        const merged = new URLSearchParams(prev);
        for (const key of FILTER_KEYS) {
          merged.delete(key);
        }
        for (const [key, value] of built.entries()) {
          merged.set(key, value);
        }
        preserveListParams(prev, merged);
        return merged;
      },
      { replace: true }
    );
  }, [
    debouncedSearch,
    filters.date,
    filters.date_from,
    filters.date_to,
    filters.date_field,
    filters.department,
    filters.position,
    setSearchParams,
  ]);

  useEffect(() => {
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      return;
    }
    const fromUrl = filtersFromSearchParams(searchParams, initial);
    const serialized = buildSearchParams(fromUrl, fromUrl.search).toString();
    if (serialized === lastUrlRef.current) {
      return;
    }
    lastUrlRef.current = serialized;
    setFilters(fromUrl);
    setDebouncedSearch(fromUrl.search);
  }, [searchParams]);

  const queryParams = useMemo(() => {
    const p = {};
    const search = debouncedSearch.trim();
    if (search) p.search = search;
    if (filters.date) p.date = filters.date;
    if (filters.date_from) p.date_from = filters.date_from;
    if (filters.date_to) p.date_to = filters.date_to;
    if (
      filters.date_field &&
      (filters.date || filters.date_from || filters.date_to)
    ) {
      p.date_field = filters.date_field;
    }
    if (filters.department) {
      p.department = filters.department;
      if (filters.position) p.position = filters.position;
    }
    return p;
  }, [
    debouncedSearch,
    filters.date,
    filters.date_from,
    filters.date_to,
    filters.date_field,
    filters.department,
    filters.position,
  ]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "department") {
        next.position = "";
      }
      if (key === "date" && value) {
        next.date_from = "";
        next.date_to = "";
      }
      if ((key === "date_from" || key === "date_to") && value) {
        next.date = "";
      }
      return next;
    });
  }, []);

  const removeFilterChip = useCallback((key) => {
    setFilters((prev) => {
      if (key === "date_field") {
        return {
          ...prev,
          date_field: "",
          date: "",
          date_from: "",
          date_to: "",
        };
      }
      return { ...prev, [key]: "" };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...EMPTY, ...initial });
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const key of FILTER_KEYS) {
          next.delete(key);
        }
        preserveListParams(prev, next);
        next.delete("page");
        return next;
      },
      { replace: true }
    );
  }, [initial, setSearchParams]);

  const hasActiveFilters =
    Boolean(filters.search?.trim()) ||
    Boolean(filters.date) ||
    Boolean(filters.date_from) ||
    Boolean(filters.date_to) ||
    Boolean(filters.department) ||
    Boolean(filters.position);

  return {
    filters,
    setFilters,
    setFilter,
    resetFilters,
    removeFilterChip,
    queryParams,
    debouncedSearch,
    hasActiveFilters,
  };
}
