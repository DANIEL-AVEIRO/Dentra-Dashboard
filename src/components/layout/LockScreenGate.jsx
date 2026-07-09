import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLockScreen } from "@/context/LockScreenContext";
import LockScreenOverlay from "@/components/layout/LockScreenOverlay";

function sameLocation(a, b) {
  if (!a || !b) return false;
  return (
    a.pathname === b.pathname &&
    a.search === b.search &&
    a.hash === b.hash
  );
}

export default function LockScreenGate({ children }) {
  const { isLocked } = useLockScreen();
  const location = useLocation();
  const navigate = useNavigate();
  const anchorRef = useRef(null);

  useEffect(() => {
    if (!isLocked) {
      anchorRef.current = null;
      return;
    }
    if (!anchorRef.current) {
      anchorRef.current = location;
      return;
    }
    if (!sameLocation(location, anchorRef.current)) {
      const { pathname, search, hash } = anchorRef.current;
      navigate({ pathname, search, hash }, { replace: true });
    }
  }, [isLocked, location, navigate]);

  useEffect(() => {
    if (!isLocked) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isLocked]);

  return (
    <>
      {children}
      {isLocked ? <LockScreenOverlay /> : null}
    </>
  );
}
