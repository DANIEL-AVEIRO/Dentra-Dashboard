import { useCallback, useState } from "react";

const TABLE_DENSITY_KEY = "arrow-table-density";

function readStoredDensity() {
  try {
    const stored = localStorage.getItem(TABLE_DENSITY_KEY);
    if (stored === "compact" || stored === "comfortable") return stored;
  } catch {
    /* ignore */
  }
  return "comfortable";
}

function persistDensity(value) {
  try {
    localStorage.setItem(TABLE_DENSITY_KEY, value);
  } catch {
    /* ignore */
  }
}

export function useTableDensity(initial = readStoredDensity()) {
  const [density, setDensityState] = useState(initial);
  const isCompact = density === "compact";

  const setDensity = useCallback((next) => {
    setDensityState(next);
    persistDensity(next);
  }, []);

  const toggleDensity = useCallback(() => {
    setDensity(isCompact ? "comfortable" : "compact");
  }, [isCompact, setDensity]);

  return { density, isCompact, setDensity, toggleDensity };
}
