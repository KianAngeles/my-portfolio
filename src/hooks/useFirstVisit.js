import { useCallback, useState } from "react";

export default function useFirstVisit(storageKey) {
  const [isFirstVisit] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(storageKey) !== "1";
  });

  const markVisited = useCallback(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(storageKey, "1");
  }, [storageKey]);

  return { isFirstVisit, markVisited };
}
