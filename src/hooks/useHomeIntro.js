import { useCallback, useEffect, useRef, useState } from "react";

const INTRO_STORAGE_KEY = "homeIntroSeen";
const EXIT_DURATION_MS = 600;

const getInitialPhase = (prefersReducedMotion) => {
  if (typeof window === "undefined") return "ready";

  if (
    prefersReducedMotion ||
    window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "1"
  ) {
    return "ready";
  }

  return "intro";
};

const clearTimers = (timersRef) => {
  timersRef.current.forEach((id) => window.clearTimeout(id));
  timersRef.current = [];
};

const markSeen = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
};

export default function useHomeIntro(prefersReducedMotion) {
  const [phase, setPhase] = useState(() => getInitialPhase(prefersReducedMotion));
  const timersRef = useRef([]);
  const skippingRef = useRef(false);

  const skip = useCallback(() => {
    skippingRef.current = true;
    clearTimers(timersRef);
    markSeen();
    setPhase("ready");
  }, []);

  const start = useCallback(() => {
    if (typeof window === "undefined") {
      setPhase("ready");
      return;
    }

    if (
      prefersReducedMotion ||
      window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "1"
    ) {
      markSeen();
      setPhase("ready");
      return;
    }

    skippingRef.current = false;
    setPhase("intro");
  }, [prefersReducedMotion]);

  const onLineComplete = useCallback(() => {
    if (skippingRef.current) return;

    setPhase((currentPhase) => {
      if (currentPhase !== "intro") return currentPhase;

      clearTimers(timersRef);

      const readyTimer = window.setTimeout(() => {
        if (skippingRef.current) return;
        markSeen();
        setPhase("ready");
      }, EXIT_DURATION_MS);

      timersRef.current = [readyTimer];
      return "exit";
    });
  }, []);

  useEffect(() => {
    start();

    return () => {
      clearTimers(timersRef);
    };
  }, [start]);

  return {
    phase,
    start,
    skip,
    onLineComplete,
  };
}
