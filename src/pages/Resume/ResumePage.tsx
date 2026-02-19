import { useEffect, useState } from "react";
import LightRays from "@/components/LightRays";
import Footer from "@/components/layout/Footer";
import ResumeHero from "./sections/ResumeHero";
import ResumeDetailsSection from "./sections/ResumeDetailsSection";
import useIsMobile from "@/hooks/useIsMobile";

const RESUME_ANIMATION_SEEN_KEY = "resume_page_animation_seen";

export default function ResumePage() {
  const isMobile = useIsMobile();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.body.classList.contains("dark");
  });
  const [shouldAnimate] = useState(() => {
    if (typeof window === "undefined") return true;

    try {
      return window.sessionStorage.getItem(RESUME_ANIMATION_SEEN_KEY) !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const body = document.body;
    if (!body) return undefined;

    const syncTheme = () => {
      setIsDarkMode(body.classList.contains("dark"));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldAnimate || typeof window === "undefined") return;

    try {
      window.sessionStorage.setItem(RESUME_ANIMATION_SEEN_KEY, "1");
    } catch {
      // Ignore storage errors and keep default behavior.
    }
  }, [shouldAnimate]);

  return (
    <main className="resume-page relative isolate min-h-screen overflow-x-clip bg-gradient-to-b from-slate-50 via-sky-50/70 to-white dark:from-navy dark:to-navy-light">
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.62) 74%, rgba(0,0,0,0.36) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.62) 74%, rgba(0,0,0,0.36) 100%)",
        }}
        aria-hidden="true"
      >
        {isDarkMode && !isMobile && (
          <LightRays
            raysOrigin="top-center"
            raysColor="#7dd3fc"
            raysSpeed={0.72}
            lightSpread={0.95}
            rayLength={3.1}
            followMouse={false}
            mouseInfluence={0}
            noiseAmount={0.08}
            distortion={0.015}
            pulsating={false}
            fadeDistance={1.1}
            saturation={1.35}
            className="opacity-95 [filter:saturate(130%)_brightness(1.12)_contrast(1.05)]"
          />
        )}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-b from-[#1e3a8a14] via-[#0b11274a] to-[#0206172a]"
              : "bg-gradient-to-b from-white/55 via-sky-100/35 to-transparent"
          }`}
        />
        <div
          className={`pointer-events-none absolute -left-56 top-[54%] h-[30rem] w-[30rem] -translate-y-1/2 rounded-full blur-3xl sm:h-[36rem] sm:w-[36rem] ${
            isDarkMode ? "opacity-75 mix-blend-screen" : "opacity-55"
          }`}
          style={{
            background: isDarkMode
              ? "radial-gradient(circle, rgba(56,189,248,0.32) 0%, rgba(56,189,248,0.14) 35%, rgba(56,189,248,0) 74%)"
              : "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(56,189,248,0.1) 35%, rgba(56,189,248,0) 74%)",
          }}
        />
        <div
          className={`pointer-events-none absolute -right-56 top-[74%] h-[30rem] w-[30rem] -translate-y-1/2 rounded-full blur-3xl sm:h-[36rem] sm:w-[36rem] ${
            isDarkMode ? "opacity-72 mix-blend-screen" : "opacity-52"
          }`}
          style={{
            background: isDarkMode
              ? "radial-gradient(circle, rgba(96,165,250,0.28) 0%, rgba(125,211,252,0.12) 35%, rgba(125,211,252,0) 74%)"
              : "radial-gradient(circle, rgba(14,165,233,0.18) 0%, rgba(125,211,252,0.1) 35%, rgba(125,211,252,0) 74%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <ResumeHero shouldAnimate={shouldAnimate && !isMobile} />
        <ResumeDetailsSection shouldAnimate={shouldAnimate && !isMobile} />
        <Footer />
      </div>
    </main>
  );
}
