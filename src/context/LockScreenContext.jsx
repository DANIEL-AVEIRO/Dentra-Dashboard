import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import client from "@/api/client";
import { useAuth } from "@/context/AuthContext";

const LOCK_STORAGE_KEY = "arrow_screen_locked";

const LockScreenContext = createContext(null);

function readStoredLock() {
  try {
    return sessionStorage.getItem(LOCK_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeStoredLock(locked) {
  try {
    if (locked) {
      sessionStorage.setItem(LOCK_STORAGE_KEY, "1");
    } else {
      sessionStorage.removeItem(LOCK_STORAGE_KEY);
    }
  } catch {
    /* ignore quota / private mode */
  }
}

function hasAccessToken() {
  try {
    return Boolean(localStorage.getItem("access_token"));
  } catch {
    return false;
  }
}

export function LockScreenProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [isLocked, setIsLocked] = useState(
    () => hasAccessToken() && readStoredLock()
  );

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsLocked(false);
      writeStoredLock(false);
      return;
    }

    if (readStoredLock()) {
      setIsLocked(true);
    }
  }, [user, authLoading]);

  const lock = useCallback(() => {
    if (!user) return;
    setIsLocked(true);
    writeStoredLock(true);
  }, [user]);

  const unlock = useCallback(async (password) => {
    await client.post("/auth/verify-password/", { password });
    setIsLocked(false);
    writeStoredLock(false);
  }, []);

  const value = useMemo(
    () => ({ isLocked, lock, unlock }),
    [isLocked, lock, unlock]
  );

  return (
    <LockScreenContext.Provider value={value}>
      {children}
    </LockScreenContext.Provider>
  );
}

export function useLockScreen() {
  const ctx = useContext(LockScreenContext);
  if (!ctx) {
    throw new Error("useLockScreen must be used within LockScreenProvider");
  }
  return ctx;
}
