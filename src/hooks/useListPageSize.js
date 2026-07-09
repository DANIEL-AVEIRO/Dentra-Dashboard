import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const STORAGE_KEY = "arrow-table-page-size";
const DEFAULT_PAGE_SIZE = 20;

function parsePageSize(value) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return PAGE_SIZE_OPTIONS.includes(n) ? n : DEFAULT_PAGE_SIZE;
}

export function useListPageSize() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = parsePageSize(
    searchParams.get("page_size") ?? localStorage.getItem(STORAGE_KEY) ?? DEFAULT_PAGE_SIZE
  );

  const setPageSize = useCallback(
    (next) => {
      const resolved = parsePageSize(next);
      try {
        localStorage.setItem(STORAGE_KEY, String(resolved));
      } catch {
        /* ignore */
      }
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (resolved === DEFAULT_PAGE_SIZE) params.delete("page_size");
          else params.set("page_size", String(resolved));
          params.delete("page");
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return { pageSize, setPageSize, pageSizeOptions: PAGE_SIZE_OPTIONS };
}
