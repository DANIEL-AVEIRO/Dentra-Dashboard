import { useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { readStoredListSearch, writeStoredListSearch } from "@/utils/listViewState";

/**
 * Restore list query string from sessionStorage when landing on a bare list URL,
 * and persist the full query string whenever it changes.
 */
export function usePersistedListSearch() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    if (searchParams.toString()) return;
    const stored = readStoredListSearch(location.pathname);
    if (!stored) return;
    setSearchParams(new URLSearchParams(stored), { replace: true });
  }, [location.pathname, searchParams, setSearchParams]);

  useEffect(() => {
    writeStoredListSearch(location.pathname, searchParams.toString());
  }, [location.pathname, searchParams]);
}
