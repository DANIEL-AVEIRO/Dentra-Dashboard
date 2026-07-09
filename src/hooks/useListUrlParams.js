import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatStatusParam, parsePageParam, parseStatusParam } from "@/utils/listViewState";

export function useListPageParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePageParam(searchParams.get("page"));

  const setPage = useCallback(
    (nextPage) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const n = parsePageParam(nextPage);
          if (n <= 1) next.delete("page");
          else next.set("page", String(n));
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return [page, setPage];
}

export function useListStatusParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get("status") ?? "";

  const [statusFilter, setStatusFilterState] = useState(() =>
    parseStatusParam(searchParams.get("status") ?? "")
  );

  useEffect(() => {
    setStatusFilterState(parseStatusParam(statusParam));
  }, [statusParam]);

  const setStatusFilter = useCallback(
    (next) => {
      setStatusFilterState(next);
      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          const formatted = formatStatusParam(next);
          if (formatted) nextParams.set("status", formatted);
          else nextParams.delete("status");
          nextParams.delete("page");
          return nextParams;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return [statusFilter, setStatusFilter];
}

export function useListStringParam(key, defaultValue = "") {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramValue = searchParams.get(key) ?? defaultValue;

  const [value, setLocalValue] = useState(
    () => searchParams.get(key) ?? defaultValue
  );

  useEffect(() => {
    setLocalValue(paramValue);
  }, [paramValue]);

  const setValue = useCallback(
    (next) => {
      const normalized = next == null ? "" : String(next).trim();
      const resolved = !normalized || normalized === defaultValue ? defaultValue : normalized;
      setLocalValue(resolved);
      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          if (!normalized || normalized === defaultValue) nextParams.delete(key);
          else nextParams.set(key, normalized);
          nextParams.delete("page");
          return nextParams;
        },
        { replace: true }
      );
    },
    [defaultValue, key, setSearchParams]
  );

  return [value, setValue];
}
