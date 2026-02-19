import { useEffect, useRef, useState } from "react";

const COMPLETE_HOLD_MS = 300;
const COMPLETE_GLOW_BOOST_MS = 240;
const FADE_DURATION_MS = 860;

export default function IntroOverlay({ phase, onLineComplete, onSkip }) {
  const timersRef = useRef([]);
  const hasCompletedLineRef = useRef(false);
  const hasNotifiedCompleteRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [loaderState, setLoaderState] = useState(() => (phase === "intro" ? "loading" : "done"));
  const [dotCount, setDotCount] = useState(1);
  const [glowBoost, setGlowBoost] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const clearTimers = () => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];
  };

  const queueTimeout = (callback, delay) => {
    const timerId = window.setTimeout(callback, delay);
    timersRef.current.push(timerId);
    return timerId;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setPrefersReducedMotion(media.matches);

    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    if (phase === "intro") {
      clearTimers();
      hasCompletedLineRef.current = false;
      hasNotifiedCompleteRef.current = false;
      setGlowBoost(false);
      setDotCount(1);
      setLoaderState("loading");
      return;
    }

    if (phase === "ready") {
      setLoaderState("done");
    }
  }, [phase]);

  useEffect(() => {
    if (loaderState !== "loading" || prefersReducedMotion) {
      setDotCount(1);
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setDotCount((current) => (current >= 3 ? 1 : current + 1));
    }, 800);

    return () => window.clearInterval(intervalId);
  }, [loaderState, prefersReducedMotion]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (loaderState === "done") return;

      clearTimers();
      setLoaderState("done");
      onSkip?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [loaderState, onSkip]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const handleSkip = () => {
    if (loaderState === "done") return;
    clearTimers();
    setLoaderState("done");
    onSkip?.();
  };

  const handleLineAnimationEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.animationName !== "introLineExpand") return;
    if (loaderState !== "loading") return;
    if (hasCompletedLineRef.current) return;

    hasCompletedLineRef.current = true;

    if (prefersReducedMotion) {
      if (!hasNotifiedCompleteRef.current) {
        hasNotifiedCompleteRef.current = true;
        onLineComplete?.();
      }
      setLoaderState("fade");
      queueTimeout(() => setLoaderState("done"), 260);
      return;
    }

    setLoaderState("complete");
    setGlowBoost(true);

    queueTimeout(() => setGlowBoost(false), COMPLETE_GLOW_BOOST_MS);
    queueTimeout(() => {
      if (!hasNotifiedCompleteRef.current) {
        hasNotifiedCompleteRef.current = true;
        onLineComplete?.();
      }
      setLoaderState("fade");
    }, COMPLETE_HOLD_MS);

    queueTimeout(() => {
      setLoaderState("done");
    }, COMPLETE_HOLD_MS + FADE_DURATION_MS);
  };

  if (loaderState === "done") return null;

  const isLoadingOrComplete = loaderState === "loading" || loaderState === "complete";
  const isFading = loaderState === "fade";
  const loadingLabel = `LOADING${".".repeat(dotCount)}`;

  const lineGlowFilter = glowBoost
    ? "drop-shadow(0 0 12px rgba(255,255,255,0.42)) brightness(1.08)"
    : "drop-shadow(0 0 7px rgba(255,255,255,0.24))";

  const fillStyle = {
    transform: "scaleX(0)",
    transformOrigin: "center",
    willChange: "transform, filter",
    animation: mounted && isLoadingOrComplete
      ? "introLineExpand 1600ms cubic-bezier(0.22, 1, 0.36, 1) forwards"
      : "none",
    filter: lineGlowFilter,
  };

  return (
    <div
      role="presentation"
      onClick={handleSkip}
      className={`fixed inset-0 z-50 isolate cursor-pointer transition-all duration-[860ms] ease-out ${
        isFading ? "opacity-0 blur-[6px] scale-[1.01] pointer-events-none" : "opacity-100 blur-0 scale-100 pointer-events-auto"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-140px] top-[25%] h-[620px] w-[620px] rounded-full bg-accent/12 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-navy" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/95 via-navy to-navy-light/95" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,0.34)_100%)]" />

      <div className="relative z-10 flex min-h-full items-center justify-center text-center">
        <div className="w-full">
          <p
            className={`text-sm font-semibold uppercase tracking-[0.32em] text-white/85 ${
              !prefersReducedMotion && loaderState === "loading"
                ? "animate-[introLoadingBreathe_2200ms_ease-in-out_infinite]"
                : ""
            }`}
          >
            {loadingLabel}
          </p>

          <div className="mt-5 w-screen px-6 sm:px-10 lg:px-16">
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                aria-hidden="true"
                onAnimationEnd={handleLineAnimationEnd}
                className="relative h-full w-full overflow-hidden rounded-full"
                style={fillStyle}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-white/80 via-white to-white/80"
                />
                <div
                  className={`pointer-events-none absolute inset-0 blur-[5px] transition-opacity duration-300 ${
                    glowBoost ? "opacity-60" : "opacity-30"
                  }`}
                  style={{
                    background: "linear-gradient(90deg, rgba(255,255,255,0.45), rgba(255,255,255,0.78), rgba(255,255,255,0.45))",
                  }}
                />
                <div
                  className={`pointer-events-none absolute top-1/2 h-[160%] w-[32%] -translate-y-1/2 blur-sm ${
                    prefersReducedMotion ? "opacity-0" : "opacity-70"
                  }`}
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.86), transparent)",
                    animation: prefersReducedMotion ? "none" : "introLineSweep 2450ms linear infinite",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
