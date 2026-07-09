import { createContext, useContext } from "react";

export const TableHighlightContext = createContext("");

export function useTableHighlight() {
  return useContext(TableHighlightContext);
}
