import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import avatarImage from "@/assets/images/pic.webp";
import useIsMobile from "@/hooks/useIsMobile";

const EtherealHeroBackground = lazy(() => import("../hero/EtherealHeroBackground"));
const HERO_AVATAR_OBJECT_POSITION = "45% 20%";
const HERO_AVATAR_NUDGE_X = -3;
const HERO_AVATAR_ZOOM = 1.04;

const getRevealClass = (isVisible) => {
  if (isVisible) {
    return "opacity-100 translate-y-0";
  }

  return "opacity-0 translate-y-6";
};

const getExitAlignedDelay = (prefersReducedMotion, phase, delayMs) => {
  if (prefersReducedMotion || phase !== "exit") return undefined;
  return { transitionDelay: `${delayMs}ms` };
};

export default function Hero({
  phase = "ready",
  prefersReducedMotion = false,
}) {
  const isMobile = useIsMobile();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.body.classList.contains("dark");
  });
  const [hasStartedTextGenerate, setHasStartedTextGenerate] = useState(false);
  const [showLabelGenerate, setShowLabelGenerate] = useState(false);
  const isVisible = prefersReducedMotion || phase === "exit" || phase === "ready";
  const backgroundVisible = phase === "exit" || phase === "ready" || prefersReducedMotion;
  const shouldGenerateText = !prefersReducedMotion && hasStartedTextGenerate;
  const heroStartDelay = 450;

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
    if (prefersReducedMotion) {
      setHasStartedTextGenerate(false);
      return;
    }

    if (phase === "intro") {
      setHasStartedTextGenerate(false);
      return;
    }

    if (phase === "exit") {
      setHasStartedTextGenerate(true);
    }
  }, [phase, prefersReducedMotion]);

  useEffect(() => {
    if (!shouldGenerateText) {
      setShowLabelGenerate(false);
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setShowLabelGenerate(true);
    }, 280);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [shouldGenerateText]);

  return (
    <section
      id="top"
      className={`relative min-h-screen overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-b from-navy to-navy-light"
          : "bg-gradient-to-b from-slate-50 via-sky-50 to-white"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-[1200ms] ease-out ${
          backgroundVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {!isMobile ? (
          <Suspense fallback={null}>
            <EtherealHeroBackground isDarkMode={isDarkMode} />
          </Suspense>
        ) : null}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-b from-black/35 via-black/40 to-black/70"
              : "bg-gradient-to-b from-white/40 via-sky-100/30 to-white/78"
          }`}
        />
        <div
          className={`absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
            isDarkMode
              ? "bg-gradient-to-b from-navy to-navy-light"
              : "bg-gradient-to-b from-sky-100/65 to-blue-100/45"
          }`}
        />
        <div
          className={`absolute left-1/2 -translate-x-1/2 rounded-full ${
            isDarkMode
              ? "top-[30%] h-52 w-52 bg-white/10 blur-3xl"
              : "top-[62%] h-44 w-44 bg-sky-200/24 blur-[72px]"
          }`}
        />
      </div>

      <div className="container-wrapper pointer-events-auto relative z-10 flex min-h-screen items-center justify-center py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center space-y-4 text-center md:space-y-5">
          <div
            className={`relative transition-all duration-700 ease-out ${getRevealClass(isVisible)}`}
            style={getExitAlignedDelay(prefersReducedMotion, phase, heroStartDelay)}
          >
            <img
              src={avatarImage}
              alt="Kian Charles S. Angeles avatar"
              width="144"
              height="144"
              className={`h-28 w-28 rounded-full object-cover ring-1 md:h-36 md:w-36 ${
                isDarkMode
                  ? "ring-white/20 shadow-lg shadow-black/30"
                  : "ring-slate-300/70 shadow-lg shadow-slate-300/40"
              }`}
              style={{
                objectPosition: HERO_AVATAR_OBJECT_POSITION,
                transform: `translateX(${HERO_AVATAR_NUDGE_X}px) scale(${HERO_AVATAR_ZOOM})`,
              }}
              draggable="false"
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div
            className={`transition-all duration-700 ease-out ${getRevealClass(isVisible)}`}
            style={getExitAlignedDelay(prefersReducedMotion, phase, heroStartDelay + 100)}
          >
            <div className="relative inline-flex flex-col items-center">
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[100px] w-[90vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl ${
                  isDarkMode ? "bg-white/8 dark:bg-white/10" : "bg-sky-100/80"
                }`}
              />
              <h1 className={isDarkMode ? "text-white" : "text-slate-900"}>
                {shouldGenerateText ? (
                  <TextGenerateEffect
                    words="Kian Charles S. Angeles"
                    className={isDarkMode ? "text-white" : "text-slate-900"}
                    duration={1}
                  />
                ) : (
                  "Kian Charles S. Angeles"
                )}
              </h1>
            </div>
          </div>

          <div
            className={`flex items-center justify-center gap-4 transition-all duration-700 ease-out ${getRevealClass(
              isVisible,
            )}`}
            style={getExitAlignedDelay(prefersReducedMotion, phase, heroStartDelay + 200)}
          >
            <div className={`h-px w-10 ${isDarkMode ? "bg-white/30 dark:bg-white/20" : "bg-slate-400/50"}`} />
            <span
              className={`whitespace-nowrap uppercase tracking-[0.4em] text-xs font-medium ${
                isDarkMode ? "text-white/80 dark:text-white/80" : "text-slate-700"
              }`}
            >
              {shouldGenerateText ? (
                showLabelGenerate ? (
                  <TextGenerateEffect
                    words="Full Stack Developer"
                    className={isDarkMode ? "text-white/80 dark:text-white/80" : "text-slate-700"}
                    duration={1}
                  />
                ) : (
                  <span className="opacity-0">Full Stack Developer</span>
                )
              ) : (
                "Full Stack Developer"
              )}
            </span>
            <div className={`h-px w-10 ${isDarkMode ? "bg-white/30 dark:bg-white/20" : "bg-slate-400/50"}`} />
          </div>

          <p
            className={`max-w-xl transition-all duration-700 ease-out ${
              isDarkMode ? "text-white/80" : "text-slate-700"
            } ${getRevealClass(
              isVisible,
            )}`}
            style={getExitAlignedDelay(prefersReducedMotion, phase, heroStartDelay + 300)}
          >
            I build modern, performant web apps with clean UI and reliable backend systems.
            Focused on React, Node.js, and end-to-end features that ship.
          </p>

          <div
            className={`mt-2 flex flex-col justify-center gap-3 transition-all duration-700 ease-out sm:flex-row ${getRevealClass(
              isVisible,
            )}`}
            style={getExitAlignedDelay(prefersReducedMotion, phase, heroStartDelay + 400)}
          >
            <Link to="/about" aria-label="Learn more about me" className="btn-primary">
              About Me
            </Link>
            <Link
              to="/contact"
              aria-label="Go to contact page"
              className="btn-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
