import { useCallback, useEffect, useRef, useState } from "react";
import client from "@/api/client";
import { toast } from "@/utils/toast";

export function usePaginatedList(
  endpoint,
  { params = {}, enabled = true, page: pageProp, setPage: setPageProp } = {}
) {
  const [internalPage, setInternalPage] = useState(1);
  const page = pageProp ?? internalPage;
  const setPage = setPageProp ?? setInternalPage;
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const fetchList = useCallback(async () => {
    if (!enabled) return;
    setError("");
    const hasRows = rowsRef.current.length > 0;
    if (hasRows) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const { data } = await client.get(`/${endpoint}/`, {
        params: { page, ...params },
        skipTopLoader: hasRows,
      });
      setRows(data.results ?? data);
      setCount(data.count ?? (data.results ?? data).length);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to load data";
      setError(msg);
      toast.error(msg);
      if (!hasRows) setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [endpoint, page, JSON.stringify(params), enabled]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    rows,
    setRows,
    count,
    page,
    setPage,
    loading,
    refreshing,
    error,
    refresh: fetchList,
  };
}
