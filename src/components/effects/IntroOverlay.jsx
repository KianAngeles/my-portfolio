import { useEffect, useRef, useState } from "react";

export default function IntroOverlay({ phase, onLineComplete, onSkip }) {
  const hasCompletedLineRef = useRef(false);
  const fillRef = useRef(null);
  const flashTimerRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (phase !== "intro" && phase !== "exit") return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onSkip?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onSkip, phase]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (phase === "intro") {
      hasCompletedLineRef.current = false;
      setFlash(false);
    }
  }, [phase]);

  useEffect(() => {
    return () => {
      window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  const handleLineAnimationEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.animationName !== "introLineExpand") return;
    if (phase !== "intro") return;
    if (hasCompletedLineRef.current) return;

    hasCompletedLineRef.current = true;
    setFlash(true);
    window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => {
      setFlash(false);
      onLineComplete?.();
    }, 180);
  };

  if (phase === "ready") return null;

  const isIntro = phase === "intro";
  const shouldAnimateLine = mounted && isIntro;
  const dropShadowFilter = "drop-shadow(0 0 6px rgba(255,255,255,0.22))";
  const lineFilter = flash ? `${dropShadowFilter} brightness(1.12)` : dropShadowFilter;
  const fillStyle = {
    transform: isIntro ? "scaleX(0)" : "scaleX(1)",
    transformOrigin: "center",
    willChange: "transform, filter",
    animation: shouldAnimateLine
      ? "introLineExpand 1600ms cubic-bezier(0.22, 1, 0.36, 1) forwards"
      : "none",
    filter: lineFilter,
  };

  const pulseStyle = {
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
    animation: shouldAnimateLine
      ? "introLinePulse 1600ms cubic-bezier(0.16,1,0.3,1) forwards"
      : "none",
    opacity: 0.25,
  };

  return (
    <div
      role="presentation"
      onClick={onSkip}
      className={`fixed inset-0 z-50 isolate cursor-pointer transition-opacity duration-[600ms] ease-in-out ${
        isIntro ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-140px] top-[25%] h-[620px] w-[620px] rounded-full bg-accent/12 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-navy" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/95 via-navy to-navy-light/95" />

      <div
        className={`relative z-10 flex min-h-full items-center justify-center text-center transition-all duration-[600ms] ease-in-out ${
          isIntro ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
        }`}
      >
        <div className="w-full">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/85">
            Loading...
          </p>

          <div className="mt-5 w-screen px-6 sm:px-10 lg:px-16">
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                ref={fillRef}
                aria-hidden="true"
                onAnimationEnd={handleLineAnimationEnd}
                className="relative h-full w-full bg-white"
                style={fillStyle}
              >
                <div className="absolute inset-0" style={pulseStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
