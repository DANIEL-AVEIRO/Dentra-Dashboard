import { createContext, useContext, useEffect, useState } from "react";
import TopLoadingBar from "@/components/common/TopLoadingBar";
import {
  startTopLoading,
  stopTopLoading,
  subscribeLoading,
} from "@/api/loadingTracker";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [active, setActive] = useState(false);

  useEffect(() => subscribeLoading(setActive), []);

  const value = {
    active,
    start: startTopLoading,
    stop: stopTopLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      <TopLoadingBar active={active} />
      {children}
    </LoadingContext.Provider>
  );
}

export function useTopLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useTopLoading must be used within LoadingProvider");
  }
  return ctx;
}
