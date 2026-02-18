import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LightRays from "@/components/LightRays";
import Footer from "@/components/layout/Footer";
import Sheen from "@/components/ui/Sheen";
import SectionRadialGlow from "@/components/ui/SectionRadialGlow";
import SectionRadialGlowAlt from "@/components/ui/SectionRadialGlowAlt";
import useFirstVisit from "@/hooks/useFirstVisit";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import {
  chipStagger,
  containerStagger,
  itemFadeUp,
  itemSlideRight,
  metaRowStagger,
} from "@/pages/ProjectsDetail/motionVariants";
import "./project-detail-glow.css";

type ProjectDetailLayoutProps = {
  project: any;
  category: string;
  timeline: string;
  role: string;
  stack?: string[];
  demoHref?: string;
  videoHref?: string;
  videoPoster?: string;
  videoPlaceholderText?: string;
  overview: string[];
  focusAreas: string[];
  outcomes: string[];
};

const revealViewport = { once: false, amount: 0.3 };

function boxRevealVariants(reduceMotion: boolean) {
  return {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 18,
      filter: reduceMotion ? "blur(0px)" : "blur(6px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0.18 : 0.42,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
}

function StackPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-white/15 dark:bg-white/[0.05] dark:text-white/80">
      {label}
    </span>
  );
}

export default function ProjectDetailLayout({
  project,
  category,
  timeline,
  role,
  stack,
  demoHref,
  videoHref,
  videoPoster,
  videoPlaceholderText,
  overview,
  focusAreas,
  outcomes,
}: ProjectDetailLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.body.classList.contains("dark");
  });
  const [glowEnabled, setGlowEnabled] = useState(false);
  const [showCtaSheen, setShowCtaSheen] = useState(false);
  const detailsGlowZoneRef = useRef<HTMLDivElement | null>(null);
  const detailsSpotlightRef = useRef<HTMLDivElement | null>(null);
  const hasMarkedVisitRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isFirstVisit, markVisited } = useFirstVisit(`projectDetailAnimated-${project.id}`);

  const displayStack = stack ?? project.stack;
  const displayDemoHref = demoHref ?? project.demoHref;
  const displayVideoHref = videoHref ?? null;
  const displayVideoPoster = videoPoster ?? project.preview;
  const displayVideoPlaceholderText =
    videoPlaceholderText ?? "Add a demo video file and set videoHref in this project detail data.";
  const shouldAnimateIntro = isFirstVisit && !prefersReducedMotion;

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
    if (typeof window === "undefined") return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setGlowEnabled(canHover && !prefersReducedMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isFirstVisit || hasMarkedVisitRef.current) return undefined;

    hasMarkedVisitRef.current = true;
    markVisited();
    return undefined;
  }, [isFirstVisit, markVisited]);

  useEffect(() => {
    if (!shouldAnimateIntro || prefersReducedMotion || !displayDemoHref) return undefined;

    const timerId = window.setTimeout(() => {
      setShowCtaSheen(true);
    }, 1500);

    return () => window.clearTimeout(timerId);
  }, [displayDemoHref, prefersReducedMotion, shouldAnimateIntro]);

  useEffect(() => {
    if (!glowEnabled) return undefined;

    const glowZoneNode = detailsGlowZoneRef.current;
    const spotlightNode = detailsSpotlightRef.current;
    if (!glowZoneNode || !spotlightNode) return undefined;

    const cards = Array.from(
      glowZoneNode.querySelectorAll<HTMLElement>(".project-detail-glow-card"),
    );

    const nearDistance = 220;
    const fadeDistance = 560;

    const resetGlow = () => {
      spotlightNode.style.opacity = "0";
      cards.forEach((card) => {
        card.style.setProperty("--glow-intensity", "0");
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      const zoneRect = glowZoneNode.getBoundingClientRect();
      const isInside =
        event.clientX >= zoneRect.left &&
        event.clientX <= zoneRect.right &&
        event.clientY >= zoneRect.top &&
        event.clientY <= zoneRect.bottom;

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
    <main className="relative isolate min-h-screen overflow-x-clip bg-gradient-to-b from-slate-50 via-sky-50/70 to-white dark:from-navy dark:to-navy-light">
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
        {isDarkMode && (
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
      </div>

      <div className="relative z-10">
        <section className="relative pt-28 pb-10 md:pt-32 md:pb-14">
          <SectionRadialGlow />
          <div className="mx-auto max-w-6xl px-4">
            <motion.div
              variants={containerStagger(prefersReducedMotion, {
                delayChildren: 0.04,
                staggerChildren: 0.1,
              })}
              initial={shouldAnimateIntro ? "hidden" : false}
              animate="show"
            >
              <motion.div variants={itemFadeUp(prefersReducedMotion, { distance: 8, duration: 0.28 })}>
                <Link
                  to="/projects"
                  className="inline-flex items-center text-sm font-semibold text-slate-700 transition-colors hover:text-accent dark:text-white/85 dark:hover:text-accent"
                >
                  &lt; Back to Projects
                </Link>
              </motion.div>

              <motion.header
                className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
                variants={containerStagger(prefersReducedMotion, {
                  delayChildren: 0.12,
                  staggerChildren: 0.16,
                })}
              >
                <motion.div
                  variants={containerStagger(prefersReducedMotion, {
                    delayChildren: 0.08,
                    staggerChildren: 0.12,
                  })}
                >
                  <motion.p
                    variants={itemFadeUp(prefersReducedMotion, { distance: 8, duration: 0.32 })}
                    className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:text-white/60"
                  >
                    {category}
                  </motion.p>
                  <motion.h1
                    variants={itemFadeUp(prefersReducedMotion, { distance: 16, duration: 0.5 })}
                    className="mt-4 text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl"
                  >
                    {project.title}
                  </motion.h1>
                  <motion.p
                    variants={itemFadeUp(prefersReducedMotion, { distance: 12, duration: 0.4 })}
                    className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-white/75"
                  >
                    {project.description}
                  </motion.p>

                  <motion.div
                    className="mt-5 flex flex-wrap gap-2"
                    variants={chipStagger(prefersReducedMotion, {
                      delayChildren: 0.1,
                      staggerChildren: 0.1,
                    })}
                  >
                    {displayStack.map((item: string) => (
                      <motion.div
                        key={`${project.id}-${item}`}
                        variants={itemFadeUp(prefersReducedMotion, { distance: 8, duration: 0.3 })}
                      >
                        <StackPill label={item} />
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    className="mt-6 flex flex-wrap items-center gap-3"
                    variants={itemFadeUp(prefersReducedMotion, {
                      distance: 10,
                      duration: 0.36,
                      delay: 0.08,
                    })}
                  >
                    {displayDemoHref ? (
                      <a
                        href={displayDemoHref}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary relative isolate inline-flex items-center overflow-hidden px-4 py-2 text-sm"
                      >
                        <span className="relative z-10">Live Demo</span>
                        <Sheen
                          active={showCtaSheen}
                          reducedMotion={prefersReducedMotion}
                          duration={0.7}
                          className="-inset-y-1"
                          onComplete={() => setShowCtaSheen(false)}
                        />
                      </a>
                    ) : null}

                    {project.sourceHref ? (
                      <a
                        href={project.sourceHref}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary inline-flex items-center px-4 py-2 text-sm"
                      >
                        Source Code
                      </a>
                    ) : null}
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={itemSlideRight(prefersReducedMotion, {
                    distance: 36,
                    duration: 0.55,
                    delay: 0.42,
                  })}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-2 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <img
                    src={project.preview}
                    alt={`${project.title} preview`}
                    className="aspect-[16/10] w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                </motion.div>
              </motion.header>
            </motion.div>
          </div>
        </section>

        <section className="relative pt-0 pb-20 md:pb-28">
          <SectionRadialGlowAlt />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-140px] top-[62%] h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-accent/20 blur-[130px] dark:bg-accent/30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[4%] top-[68%] h-[220px] w-[220px] -translate-y-1/2 rounded-full bg-sky-300/14 blur-[90px] dark:bg-sky-300/22"
          />

          <div ref={detailsGlowZoneRef} className="project-detail-glow-zone mx-auto max-w-6xl px-4">
            {glowEnabled ? (
              <div ref={detailsSpotlightRef} className="project-detail-spotlight" aria-hidden="true" />
            ) : null}

            <motion.div
              className="relative z-10 grid gap-6 lg:grid-cols-3"
              variants={metaRowStagger(prefersReducedMotion, {
                delayChildren: 0.08,
                staggerChildren: 0.16,
              })}
              initial={shouldAnimateIntro ? "hidden" : false}
              whileInView={shouldAnimateIntro ? "show" : undefined}
              viewport={shouldAnimateIntro ? revealViewport : undefined}
            >
              <motion.article
                variants={boxRevealVariants(prefersReducedMotion)}
                className={`rounded-2xl border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.03] ${
                  glowEnabled ? "project-detail-glow-card" : ""
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-white/55">Timeline</p>
                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{timeline}</p>
              </motion.article>

              <motion.article
                variants={boxRevealVariants(prefersReducedMotion)}
                className={`rounded-2xl border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.03] ${
                  glowEnabled ? "project-detail-glow-card" : ""
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-white/55">Role</p>
                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{role}</p>
              </motion.article>

              <motion.article
                variants={boxRevealVariants(prefersReducedMotion)}
                className={`rounded-2xl border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.03] ${
                  glowEnabled ? "project-detail-glow-card" : ""
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-white/55">Category</p>
                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{category}</p>
              </motion.article>
            </motion.div>

            <motion.div
              className="relative z-10 mt-6 grid gap-6 lg:grid-cols-3"
              variants={containerStagger(prefersReducedMotion, {
                delayChildren: 0.08,
                staggerChildren: 0.14,
              })}
              initial={shouldAnimateIntro ? "hidden" : false}
              whileInView={shouldAnimateIntro ? "show" : undefined}
              viewport={shouldAnimateIntro ? revealViewport : undefined}
            >
              <motion.article
                variants={boxRevealVariants(prefersReducedMotion)}
                className={`rounded-3xl border border-slate-200 bg-white/80 p-6 dark:border-white/10 dark:bg-white/[0.03] lg:col-span-2 ${
                  glowEnabled ? "project-detail-glow-card" : ""
                }`}
              >
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Project Overview</h2>
                <div className="mt-4 space-y-3">
                  {overview.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-slate-700 dark:text-white/75">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.article>

              <motion.article
                variants={boxRevealVariants(prefersReducedMotion)}
                className={`rounded-3xl border border-slate-200 bg-white/80 p-6 dark:border-white/10 dark:bg-white/[0.03] ${
                  glowEnabled ? "project-detail-glow-card" : ""
                }`}
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Focus Areas</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-white/75">
                  {focusAreas.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </motion.article>
            </motion.div>

            <motion.div
              className="relative z-10 mt-6"
              variants={containerStagger(prefersReducedMotion, { delayChildren: 0.08, staggerChildren: 0.12 })}
              initial={shouldAnimateIntro ? "hidden" : false}
              whileInView={shouldAnimateIntro ? "show" : undefined}
              viewport={shouldAnimateIntro ? revealViewport : undefined}
            >
              <motion.article
                variants={boxRevealVariants(prefersReducedMotion)}
                className={`rounded-3xl border border-slate-200 bg-white/80 p-6 dark:border-white/10 dark:bg-white/[0.03] ${
                  glowEnabled ? "project-detail-glow-card" : ""
                }`}
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Outcome</h3>
                <ul className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-white/75 md:grid-cols-2">
                  {outcomes.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </motion.article>
            </motion.div>

            <motion.div
              className="relative z-10 mt-6"
              variants={containerStagger(prefersReducedMotion, { delayChildren: 0.08, staggerChildren: 0.12 })}
              initial={shouldAnimateIntro ? "hidden" : false}
              whileInView={shouldAnimateIntro ? "show" : undefined}
              viewport={shouldAnimateIntro ? revealViewport : undefined}
            >
              <motion.article
                variants={boxRevealVariants(prefersReducedMotion)}
                className={`rounded-3xl border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-6 ${
                  glowEnabled ? "project-detail-glow-card" : ""
                }`}
              >
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">Quick Demo</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-white/65">
                  Short walkthrough of the product in action.
                </p>

                {displayVideoHref ? (
                  <motion.div
                    className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-black/20"
                    initial={
                      shouldAnimateIntro
                        ? prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, clipPath: "inset(10% 0 0 0 round 1rem)" }
                        : false
                    }
                    whileInView={
                      shouldAnimateIntro
                        ? prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 1, clipPath: "inset(0% 0 0 0 round 1rem)" }
                        : undefined
                    }
                    viewport={shouldAnimateIntro ? revealViewport : undefined}
                    transition={{
                      duration: prefersReducedMotion ? 0.18 : 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <video
                      className="aspect-video w-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                      poster={displayVideoPoster}
                    >
                      <source src={displayVideoHref} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </motion.div>
                ) : (
                  <motion.div
                    className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-100/70 p-5 text-sm text-slate-600 dark:border-white/20 dark:bg-white/[0.02] dark:text-white/60"
                    variants={itemFadeUp(prefersReducedMotion, { distance: 8, duration: 0.24 })}
                  >
                    {displayVideoPlaceholderText}
                  </motion.div>
                )}
              </motion.article>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
