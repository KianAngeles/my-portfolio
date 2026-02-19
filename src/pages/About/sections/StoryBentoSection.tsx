import { useEffect, useRef, useState } from "react";
import MagicBento from "./MagicBento";
import SectionRadialGlowAlt from "@/components/ui/SectionRadialGlowAlt";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import useFirstVisit from "@/hooks/useFirstVisit";
import "./StoryBentoSection.css";

export default function StoryBentoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isFirstVisit, markVisited } = useFirstVisit("aboutStoryBentoAnimated");
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.body.classList.contains("dark");
  });

  const shouldRunIntro = isFirstVisit && !prefersReducedMotion;
  const introActive = shouldRunIntro ? hasEnteredView : true;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasEnteredView(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.26,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
    if (hasEnteredView && isFirstVisit) {
      markVisited();
    }
  }, [hasEnteredView, isFirstVisit, markVisited]);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28" aria-labelledby="story-bento-title">
      {isDarkMode && <SectionRadialGlowAlt />}

      <div className="mx-auto max-w-6xl px-4">
        <header
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            introActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:text-white/60">Who I Am</p>
          <h2 id="story-bento-title" className="mt-4 text-3xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            Beyond the Code
          </h2>
          <p
            className={`mt-4 text-sm leading-relaxed text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] dark:text-white/65 sm:text-base ${
              introActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: introActive && shouldRunIntro ? "140ms" : "0ms" }}
          >
            A snapshot of how I think, collaborate, and execute when building products from idea to delivery.
          </p>
          <span
            className={`story-bento-init-line mx-auto mt-5 block h-px w-14 bg-gradient-to-r from-transparent via-accent/70 to-transparent transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              introActive ? "story-bento-init-line--active opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            style={{ transitionDelay: introActive && shouldRunIntro ? "220ms" : "0ms" }}
          />
        </header>

        <div className="mt-10">
          <MagicBento
            textAutoHide={false}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={true}
            particleCount={12}
            spotlightRadius={420}
            glowColor="59, 130, 246"
            disableAnimations={false}
            introEnabled={shouldRunIntro}
            introActive={introActive}
          />
        </div>
      </div>
    </section>
  );
}
