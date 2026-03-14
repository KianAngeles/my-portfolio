import { useEffect, useRef, useState } from "react";
import { resume } from "@/data/resume";
import useFirstVisit from "@/hooks/useFirstVisit";
import useIsMobile from "@/hooks/useIsMobile";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

export default function EducationSection() {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion() || isMobile;
  const { isFirstVisit, markVisited } = useFirstVisit("aboutEducationAnimated");
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const primaryEducation = resume.education?.[0] ?? null;

  const shouldRunIntro = isFirstVisit && !prefersReducedMotion;
  const introActive = shouldRunIntro ? hasEnteredView : true;
  const cards = [
    {
      label: "Degree",
      value: primaryEducation?.degree,
      glow: "from-cyan-400/20 via-blue-400/10 to-transparent",
    },
    {
      label: "School",
      value: primaryEducation?.school,
      glow: "from-sky-400/20 via-indigo-400/10 to-transparent",
    },
    {
      label: "Honors",
      value:
        primaryEducation?.honors?.join(" | ") || "Available upon request",
      glow: "from-blue-400/20 via-cyan-400/10 to-transparent",
    },
  ];

  if (!primaryEducation) return null;

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
        threshold: 0.24,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasEnteredView && isFirstVisit) {
      markVisited();
    }
  }, [hasEnteredView, isFirstVisit, markVisited]);

  return (
    <section
      ref={sectionRef}
      className="mb-8 px-4 pb-10 md:mb-12 md:pb-14"
      aria-labelledby="about-education-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl p-6 sm:p-8">
          <div
            className={`flex flex-col gap-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex-row lg:items-end lg:justify-between ${
              introActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:text-white/60">
                Education
              </p>
              <h2
                id="about-education-title"
                className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl"
              >
                Academic Background
              </h2>
              <p
                className={`mt-3 text-sm leading-relaxed text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] dark:text-white/70 sm:text-base ${
                  introActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{
                  transitionDelay: introActive && shouldRunIntro ? "120ms" : "0ms",
                }}
              >
                My formal foundation in information technology supports the
                full-stack work shown throughout this portfolio.
              </p>
            </div>

            <p
              className={`text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] dark:text-white/55 ${
                introActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{
                transitionDelay: introActive && shouldRunIntro ? "200ms" : "0ms",
              }}
            >
              {primaryEducation.yearRange}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cards.map((card, index) => (
              <article
                key={card.label}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/75 p-5 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] transition duration-300 ease-out hover:-translate-y-1 hover:border-blue-300/70 hover:bg-white/90 hover:shadow-[0_18px_40px_-20px_rgba(56,189,248,0.45)] focus-within:-translate-y-1 focus-within:border-blue-300/70 focus-within:bg-white/90 focus-within:shadow-[0_18px_40px_-20px_rgba(56,189,248,0.45)] dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-sky-300/35 dark:hover:bg-white/[0.06] dark:focus-within:border-sky-300/35 dark:focus-within:bg-white/[0.06] motion-reduce:transform-none ${
                  introActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
                style={{
                  transitionDelay: introActive && shouldRunIntro
                    ? `${260 + index * 110}ms`
                    : "0ms",
                }}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 ${card.glow}`}
                />
                <p className="relative text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 transition-colors duration-300 group-hover:text-slate-700 group-focus-within:text-slate-700 dark:text-white/55 dark:group-hover:text-white/75 dark:group-focus-within:text-white/75">
                  {card.label}
                </p>
                <p className="relative mt-2 text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-blue-700 group-focus-within:text-blue-700 dark:text-white dark:group-hover:text-sky-200 dark:group-focus-within:text-sky-200">
                  {card.value}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
