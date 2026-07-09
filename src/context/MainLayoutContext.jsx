import { createContext, useContext } from "react";

const MainLayoutContext = createContext({ mainOffset: 0 });

export function MainLayoutProvider({ mainOffset = 0, children }) {
  return (
    <MainLayoutContext.Provider value={{ mainOffset }}>
      {children}
    </MainLayoutContext.Provider>
  );
}

/** Sidebar width taken by persistent drawer on desktop (0 on mobile / collapsed). */
export function useMainLayoutOffset() {
  return useContext(MainLayoutContext).mainOffset;
}
