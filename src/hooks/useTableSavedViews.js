import { useCallback, useMemo, useState } from "react";

const STORAGE_PREFIX = "arrow-table-saved-views";

function storageKey(endpoint) {
  return `${STORAGE_PREFIX}:${endpoint}`;
}

function readViews(endpoint) {
  try {
    const raw = localStorage.getItem(storageKey(endpoint));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeViews(endpoint, views) {
  try {
    localStorage.setItem(storageKey(endpoint), JSON.stringify(views));
  } catch {
    /* ignore */
  }
}

export function useTableSavedViews(endpoint) {
  const [version, setVersion] = useState(0);
  const views = useMemo(() => readViews(endpoint), [endpoint, version]);

  const saveView = useCallback(
    (name, snapshot) => {
      const next = [
        ...readViews(endpoint).filter((v) => v.name !== name),
        { name, snapshot, savedAt: Date.now() },
      ].slice(-12);
      writeViews(endpoint, next);
      setVersion((v) => v + 1);
      return next;
    },
    [endpoint]
  );

  const deleteView = useCallback(
    (name) => {
      const next = readViews(endpoint).filter((v) => v.name !== name);
      writeViews(endpoint, next);
      setVersion((v) => v + 1);
      return next;
    },
    [endpoint]
  );

  return { views, saveView, deleteView };
}
