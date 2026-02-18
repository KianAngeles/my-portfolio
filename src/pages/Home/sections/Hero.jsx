import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EtherealHeroBackground from "../hero/EtherealHeroBackground";
import InteractiveParticleBackground from "../hero/InteractiveParticleBackground";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import avatarImage from "@/assets/images/pic.jpg";

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
  const [hasStartedTextGenerate, setHasStartedTextGenerate] = useState(false);
  const [showLabelGenerate, setShowLabelGenerate] = useState(false);
  const isVisible = prefersReducedMotion || phase === "exit" || phase === "ready";
  const backgroundVisible = phase === "exit" || phase === "ready" || prefersReducedMotion;
  const shouldGenerateText = !prefersReducedMotion && hasStartedTextGenerate;
  const heroStartDelay = 450;

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
    <section id="top" className="relative min-h-screen overflow-hidden bg-gradient-to-b from-navy to-navy-light">
      <div
        className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-[1200ms] ease-out ${
          backgroundVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <EtherealHeroBackground />
        <InteractiveParticleBackground
          className="z-[1]"
          particleCount={160}
          swirlRadius={180}
          swirlStrength={0.72}
          attractStrength={1950}
          glow={18}
          maxSpeed={5.35}
          globalDamping={1.05}
          localDampingStrength={0.02}
          springK={0.008}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/40 to-black/70" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-navy to-navy-light blur-3xl" />
        <div className="absolute left-1/2 top-[30%] h-52 w-52 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
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
              className="h-28 w-28 rounded-full object-cover ring-1 ring-white/20 shadow-lg shadow-black/30 md:h-36 md:w-36"
              draggable="false"
            />
          </div>

          <div
            className={`transition-all duration-700 ease-out ${getRevealClass(isVisible)}`}
            style={getExitAlignedDelay(prefersReducedMotion, phase, heroStartDelay + 100)}
          >
            <div className="relative inline-flex flex-col items-center">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[100px] w-[90vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/8 blur-2xl dark:bg-white/10"
              />
              <h1 className="text-white">
                {shouldGenerateText ? (
                  <TextGenerateEffect
                    words="Kian Charles S. Angeles"
                    className="text-white"
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
            <div className="h-px w-10 bg-white/30 dark:bg-white/20" />
            <span className="whitespace-nowrap uppercase tracking-[0.4em] text-xs font-medium text-white/80 dark:text-white/80">
              {shouldGenerateText ? (
                showLabelGenerate ? (
                  <TextGenerateEffect
                    words="Full Stack Developer"
                    className="text-inherit"
                    duration={1}
                  />
                ) : (
                  <span className="opacity-0">Full Stack Developer</span>
                )
              ) : (
                "Full Stack Developer"
              )}
            </span>
            <div className="h-px w-10 bg-white/30 dark:bg-white/20" />
          </div>

          <p
            className={`max-w-xl text-white/80 transition-all duration-700 ease-out ${getRevealClass(
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
