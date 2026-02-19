import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { featuredProjects } from "@/data/projects";
import SectionRadialGlow from "@/components/ui/SectionRadialGlow";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import useIsMobile from "@/hooks/useIsMobile";
import { getMotionProps } from "@/utils/motion";
import "./projects-grid-glow.css";

type ProjectsGridSectionProps = {
  shouldAnimateIntro: boolean;
  phaseDelay: number;
};

const headingContainerVariants = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({
    opacity: 1,
    transition: {
      delayChildren: delay,
      staggerChildren: 0.1,
    },
  }),
};

const headingItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardsContainerVariants = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({
    opacity: 1,
    transition: {
      delayChildren: delay,
      staggerChildren: 0.08,
    },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, clipPath: "inset(0 0 14% 0 round 1.5rem)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0 round 1.5rem)",
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function StackPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-white/15 dark:bg-white/[0.05] dark:text-white/80">
      {label}
    </span>
  );
}

export default function ProjectsGridSection({
  shouldAnimateIntro,
  phaseDelay,
}: ProjectsGridSectionProps) {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement | null>(null);
  const glowZoneRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion() || isMobile;
  const [glowEnabled, setGlowEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setGlowEnabled(canHover && !prefersReducedMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!glowEnabled) return undefined;

    const sectionNode = sectionRef.current;
    const glowZoneNode = glowZoneRef.current;
    const spotlightNode = spotlightRef.current;
    if (!sectionNode || !glowZoneNode || !spotlightNode) return undefined;

    const cards = Array.from(
      glowZoneNode.querySelectorAll<HTMLElement>(".projects-glow-card"),
    );

    const nearDistance = 240;
    const fadeDistance = 520;

    const resetGlow = () => {
      spotlightNode.style.opacity = "0";
      cards.forEach((card) => {
        card.style.setProperty("--glow-intensity", "0");
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      const sectionRect = glowZoneNode.getBoundingClientRect();
      const isInside =
        event.clientX >= sectionRect.left &&
        event.clientX <= sectionRect.right &&
        event.clientY >= sectionRect.top &&
        event.clientY <= sectionRect.bottom;

      if (!isInside) {
        resetGlow();
        return;
      }

      spotlightNode.style.left = `${event.clientX}px`;
      spotlightNode.style.top = `${event.clientY}px`;
      spotlightNode.style.opacity = "1";

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance =
          Math.hypot(event.clientX - centerX, event.clientY - centerY) -
          Math.max(rect.width, rect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        let intensity = 0;
        if (effectiveDistance <= nearDistance) {
          intensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          intensity = (fadeDistance - effectiveDistance) / (fadeDistance - nearDistance);
        }

        const xPercent = Math.min(
          100,
          Math.max(0, ((event.clientX - rect.left) / rect.width) * 100),
        );
        const yPercent = Math.min(
          100,
          Math.max(0, ((event.clientY - rect.top) / rect.height) * 100),
        );

        card.style.setProperty("--glow-x", `${xPercent}%`);
        card.style.setProperty("--glow-y", `${yPercent}%`);
        card.style.setProperty("--glow-intensity", intensity.toFixed(3));
      });
    };

    const onMouseLeave = () => {
      resetGlow();
    };

    glowZoneNode.addEventListener("mousemove", onMouseMove);
    glowZoneNode.addEventListener("mouseleave", onMouseLeave);

    return () => {
      glowZoneNode.removeEventListener("mousemove", onMouseMove);
      glowZoneNode.removeEventListener("mouseleave", onMouseLeave);
      resetGlow();
    };
  }, [glowEnabled]);

  return (
    <section
      ref={sectionRef}
      className="relative pt-0 pb-20 md:pb-28"
      aria-labelledby="projects-grid-title"
    >
      <SectionRadialGlow />

      <div className="mx-auto max-w-6xl px-4">
        <motion.header
          {...getMotionProps(isMobile, {
            initial: shouldAnimateIntro ? "hidden" : false,
            animate: "show",
          })}
          className="mx-auto max-w-3xl text-center"
          variants={headingContainerVariants}
          custom={phaseDelay}
        >
          <motion.p
            variants={headingItemVariants}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:text-white/60"
          >
            Build Library
          </motion.p>
          <motion.h2
            id="projects-grid-title"
            variants={headingItemVariants}
            className="mt-4 text-3xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl"
          >
            Selected Builds
          </motion.h2>
        </motion.header>

        <div ref={glowZoneRef} className="projects-glow-zone relative mt-10">
          {glowEnabled ? <div ref={spotlightRef} className="projects-spotlight" aria-hidden="true" /> : null}

          <motion.div
            {...getMotionProps(isMobile, {
              initial: shouldAnimateIntro ? "hidden" : false,
              animate: "show",
            })}
            className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-2"
            variants={cardsContainerVariants}
            custom={phaseDelay + 0.15}
          >
          {featuredProjects.map((project) => {
            return (
              <motion.article
                key={project.id}
                variants={cardVariants}
                className={`overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.03] ${
                  glowEnabled ? "projects-glow-card" : ""
                }`}
              >
                <Link
                  to={project.projectHref}
                  aria-label={`Open ${project.title} project page`}
                  className="group block overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <img
                    src={project.preview}
                    alt={`${project.title} preview`}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </Link>

                <div className="mt-5">
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    <Link
                      to={project.projectHref}
                      className="transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-white/72">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <StackPill key={`${project.id}-${item}`} label={item} />
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      to={project.projectHref}
                      className="inline-flex items-center gap-2 px-0 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-accent dark:text-white dark:hover:text-accent"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M9 6h10M9 12h10M9 18h10" />
                        <path d="M4 6h.01M4 12h.01M4 18h.01" />
                      </svg>
                      Details
                    </Link>

                    <div className="ml-auto flex items-center gap-2">
                      {project.demoHref ? (
                        <a
                          href={project.demoHref}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary inline-flex h-10 items-center gap-2 px-4 text-sm"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <path d="M14 4h6v6" />
                            <path d="M10 14 20 4" />
                            <path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
                          </svg>
                          Live Demo
                        </a>
                      ) : (
                        <span className="inline-flex h-10 items-center rounded-md border border-slate-300 bg-slate-100 px-4 text-sm font-semibold text-slate-500 dark:border-white/15 dark:bg-white/[0.05] dark:text-white/55">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
