/**
 * Usage:
 * import SkillsExpertiseSection from "./sections/SkillsExpertiseSection";
 * ...
 * <SkillsExpertiseSection />
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import { SpotlightCard } from "@appletosolutions/reactbits";
import "./skills-marquee.css";
import SectionRadialGlow from "@/components/ui/SectionRadialGlow";
import angularIcon from "@/assets/icons/marquee-tech/Angular.png";
import css3Icon from "@/assets/icons/marquee-tech/CSS3.png";
import expressIcon from "@/assets/icons/marquee-tech/Express.png";
import figmaIcon from "@/assets/icons/marquee-tech/figma.png";
import flutterIcon from "@/assets/icons/marquee-tech/flutter.png";
import gitIcon from "@/assets/icons/marquee-tech/Git.png";
import html5Icon from "@/assets/icons/marquee-tech/HTML5.png";
import javaIcon from "@/assets/icons/marquee-tech/Java.png";
import javascriptIcon from "@/assets/icons/marquee-tech/JavaScript.png";
import mongoDbIcon from "@/assets/icons/marquee-tech/MongoDB.png";
import mySqlIcon from "@/assets/icons/marquee-tech/MySQL.png";
import nextJsIcon from "@/assets/icons/marquee-tech/Next.js.png";
import nodeJsIcon from "@/assets/icons/marquee-tech/Node.js.png";
import phpIcon from "@/assets/icons/marquee-tech/PHP.png";
import pythonIcon from "@/assets/icons/marquee-tech/python.png";
import reactIcon from "@/assets/icons/marquee-tech/React.png";
import tailwindCssIcon from "@/assets/icons/marquee-tech/Tailwind CSS.png";
import typescriptIcon from "@/assets/icons/marquee-tech/typescript.png";
import wordpressIcon from "@/assets/icons/marquee-tech/WordPress.png";
import { Layers } from "@/components/animate-ui/icons/layers";
import { Settings } from "@/components/animate-ui/icons/settings";
import { Users } from "@/components/animate-ui/icons/users";
import { BorderBeam } from "@/components/ui/border-beam";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import useFirstVisit from "@/hooks/useFirstVisit";
import useIsMobile from "@/hooks/useIsMobile";
import { getMotionProps } from "@/utils/motion";

type TraitIconVariant = "systems" | "quality" | "collaboration" | "growth";

type DriveItem = {
  title: string;
  description: string;
  icon: TraitIconVariant;
};

type StatItem = {
  target: number;
  suffix: string;
  label: string;
  accentClass: string;
};

type TechLogo = {
  name: string;
  src: string;
  darkToWhite?: boolean;
};

type TechLogoChipProps = {
  logo: TechLogo;
  itemClassName?: string;
};

const TECH_LOGOS: TechLogo[] = [
  { name: "TypeScript", src: typescriptIcon },
  { name: "React", src: reactIcon },
  { name: "Node.js", src: nodeJsIcon },
  { name: "Next.js", src: nextJsIcon, darkToWhite: true },
  { name: "Tailwind CSS", src: tailwindCssIcon },
  { name: "MongoDB", src: mongoDbIcon },
  { name: "Express", src: expressIcon, darkToWhite: true },
  { name: "Figma", src: figmaIcon },
  { name: "Flutter", src: flutterIcon },
  { name: "Java", src: javaIcon },
  { name: "Python", src: pythonIcon },
  { name: "MySQL", src: mySqlIcon },
  { name: "Git", src: gitIcon },
  { name: "HTML5", src: html5Icon },
  { name: "CSS3", src: css3Icon },
  { name: "JavaScript", src: javascriptIcon },
  { name: "PHP", src: phpIcon },
  { name: "Angular", src: angularIcon },
  { name: "WordPress", src: wordpressIcon, darkToWhite: true },
];

const DRIVE_ITEMS: DriveItem[] = [
  {
    title: "System Thinking",
    description: "I design features with architecture, scale, and future maintenance in mind.",
    icon: "systems",
  },
  {
    title: "Quality by Default",
    description: "I prioritize clean structure, stable behavior, and measurable performance.",
    icon: "quality",
  },
  {
    title: "Clear Collaboration",
    description: "I keep communication direct so teams can move quickly with fewer handoff gaps.",
    icon: "collaboration",
  },
];

const STATS: StatItem[] = [
  { target: 3, suffix: "+", label: "Years Building", accentClass: "text-black dark:text-white" },
  { target: 28, suffix: "+", label: "Tech Stacks Explored", accentClass: "text-black dark:text-white" },
  { target: 9, suffix: "+", label: "Core Technologies", accentClass: "text-black dark:text-white" },
  { target: 99, suffix: "%", label: "Delivery Focus", accentClass: "text-black dark:text-white" },
];

const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const COUNT_DURATION_MS = 1050;

const headerVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: REVEAL_EASE },
  },
};

const marqueeVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: REVEAL_EASE },
  },
};

const cardsParentVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.02,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.985,
    boxShadow: "0 0 0 rgba(0,0,0,0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    boxShadow: "0 18px 40px -28px rgba(15, 62, 150, 0.55)",
    transition: { duration: 0.62, ease: REVEAL_EASE },
  },
};

function TraitIcon({ variant, animate }: { variant: TraitIconVariant; animate: boolean }) {
  if (variant === "systems") {
    return <Settings size={16} className="h-4 w-4" animate={animate} aria-hidden="true" />;
  }

  if (variant === "quality") {
    return <Layers size={16} className="h-4 w-4" animate={animate} aria-hidden="true" />;
  }

  if (variant === "collaboration") {
    return <Users size={16} className="h-4 w-4" animate={animate} aria-hidden="true" />;
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M12 4v13m0 0 4-4m-4 4-4-4" />
      <rect x="5" y="17" width="14" height="3" rx="1.5" />
    </svg>
  );
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function TechLogoChip({ logo, itemClassName = "" }: TechLogoChipProps) {
  return (
    <li className={itemClassName}>
      <div className="group/logo flex min-w-[96px] flex-col items-center justify-center gap-1 px-1 text-center text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:text-slate-900 dark:text-white/65 dark:hover:text-white">
        <img
          src={logo.src}
          alt={logo.name}
          className={`h-9 w-9 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition-all duration-200 group-hover/logo:scale-105 group-hover/logo:brightness-110 group-hover/logo:drop-shadow-[0_10px_22px_rgba(37,99,235,0.4)] ${
            logo.darkToWhite ? "dark:brightness-0 dark:invert" : ""
          }`}
          loading="lazy"
        />
        <span className="text-sm font-medium">{logo.name}</span>
      </div>
    </li>
  );
}

export default function SkillsExpertiseSection() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion() || isMobile;
  const { isFirstVisit, markVisited } = useFirstVisit("aboutSkillsExpertiseAnimated");
  const shouldAnimateIntro = isFirstVisit && !prefersReducedMotion;
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.body.classList.contains("dark");
  });
  const [activeTrait, setActiveTrait] = useState<TraitIconVariant | null>(null);
  const [marqueeActive, setMarqueeActive] = useState(!shouldAnimateIntro && !isMobile);
  const [hasPlayedSequence, setHasPlayedSequence] = useState(!shouldAnimateIntro);
  const [countActive, setCountActive] = useState(false);

  const statTargets = useMemo(() => STATS.map((stat) => stat.target), []);
  const [statValues, setStatValues] = useState<number[]>(() =>
    shouldAnimateIntro ? statTargets.map(() => 0) : statTargets,
  );

  const headerControls = useAnimationControls();
  const marqueeControls = useAnimationControls();
  const cardsControls = useAnimationControls();
  const hasMarkedVisitRef = useRef(false);

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
    if (shouldAnimateIntro) {
      headerControls.set("hidden");
      marqueeControls.set("hidden");
      cardsControls.set("hidden");
      setMarqueeActive(false);
      setHasPlayedSequence(false);
      setCountActive(false);
      setStatValues(statTargets.map(() => 0));
      return;
    }

    headerControls.set("visible");
    marqueeControls.set("visible");
    cardsControls.set("visible");
    setMarqueeActive(!isMobile);
    setHasPlayedSequence(true);
    setCountActive(false);
    setStatValues(statTargets);

    if (isFirstVisit && !hasMarkedVisitRef.current) {
      markVisited();
      hasMarkedVisitRef.current = true;
    }
  }, [
    cardsControls,
    headerControls,
    isFirstVisit,
    markVisited,
    marqueeControls,
    shouldAnimateIntro,
    statTargets,
  ]);

  const playSequence = useCallback(async () => {
    if (!shouldAnimateIntro || hasPlayedSequence) return;

    setHasPlayedSequence(true);
    if (!hasMarkedVisitRef.current) {
      markVisited();
      hasMarkedVisitRef.current = true;
    }

    await headerControls.start("visible");
    await marqueeControls.start("visible");
    setMarqueeActive(!isMobile);
    await cardsControls.start("visible");
    setCountActive(true);
  }, [
    cardsControls,
    hasPlayedSequence,
    headerControls,
    markVisited,
    marqueeControls,
    shouldAnimateIntro,
  ]);

  useEffect(() => {
    if (!countActive) return;
    if (prefersReducedMotion) {
      setStatValues(statTargets);
      return;
    }

    let frameId = 0;
    const startedAt = performance.now();

    const update = (now: number) => {
      const progress = Math.min((now - startedAt) / COUNT_DURATION_MS, 1);
      const easedProgress = easeOutCubic(progress);

      setStatValues(
        statTargets.map((target) => Math.round(target * easedProgress)),
      );

      if (progress < 1) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    frameId = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(frameId);
  }, [countActive, prefersReducedMotion, statTargets]);

  return (
    <motion.section
      {...getMotionProps(isMobile, {
        viewport: { once: true, amount: 0.35 },
      })}
      className="relative isolate pt-0 pb-20 md:pb-28"
      aria-labelledby="skills-expertise-title"
      onViewportEnter={() => {
        void playSequence();
      }}
    >
      {isDarkMode && <SectionRadialGlow />}

      <div className="mx-auto max-w-6xl px-4">
        <motion.header
          {...getMotionProps(isMobile, {
            initial: shouldAnimateIntro ? "hidden" : "visible",
            animate: headerControls,
          })}
          className="mx-auto max-w-3xl text-center"
          variants={headerVariants}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:text-white/60">Technical Foundation</p>
          <h2 id="skills-expertise-title" className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            Skills & Expertise
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-white/65 sm:text-base">
            Tools and practices I rely on to build reliable products, clear interfaces, and maintainable systems.
          </p>
        </motion.header>

        <div className="relative left-1/2 mt-12 w-[min(92vw,86rem)] -translate-x-1/2">
          <motion.div
            {...getMotionProps(isMobile, {
              initial: shouldAnimateIntro ? "hidden" : "visible",
              animate: marqueeControls,
            })}
            className="relative"
            variants={marqueeVariants}
          >
            {isMobile ? (
              <div className="skills-marquee-mobile py-2">
                <p className="mb-3 px-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-600 dark:text-white/58">
                  Swipe To See More
                </p>
                <div className="skills-marquee-mobile-scroll px-3 pb-2">
                  <ul className="skills-marquee-mobile-track flex w-max items-center gap-6">
                    {TECH_LOGOS.map((logo) => (
                      <TechLogoChip
                        key={`mobile-${logo.name}`}
                        logo={logo}
                        itemClassName="skills-marquee-mobile-item"
                      />
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="skills-marquee py-2">
                <div className={`skills-marquee-track ${marqueeActive ? "skills-marquee-track--active" : ""}`}>
                  {[0, 1].map((copyIndex) => (
                    <ul
                      key={copyIndex}
                      data-duplicate={copyIndex === 1 ? "true" : "false"}
                      className="flex min-w-max items-center gap-8 px-3"
                      aria-hidden={copyIndex === 1}
                    >
                      {TECH_LOGOS.map((logo) => (
                        <TechLogoChip key={`${copyIndex}-${logo.name}`} logo={logo} />
                      ))}
                    </ul>
                  ))}
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-slate-100 to-transparent dark:from-navy" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-slate-100 to-transparent dark:from-navy" />
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          {...getMotionProps(isMobile, {
            initial: shouldAnimateIntro ? "hidden" : "visible",
            animate: cardsControls,
          })}
          className="mt-10 grid gap-6 lg:grid-cols-2"
          variants={cardsParentVariants}
        >
          <motion.div variants={cardVariants} className="h-full">
            <SpotlightCard
              className="h-full rounded-3xl border border-slate-200 bg-white/70 p-8 transition-all duration-300 dark:border-white/10 dark:bg-white/[0.02]"
              spotlightColor="rgba(37, 99, 235, 0.2)"
            >
              <header>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">What Drives My Work</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-white/60">
                  Core principles that shape how I approach planning, building, and shipping.
                </p>
              </header>

              <ul className="mt-7 space-y-4">
                {DRIVE_ITEMS.map((item) => (
                  <li
                    key={item.title}
                    className="group/trait flex items-start gap-4 rounded-2xl border border-transparent p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:hover:border-white/15 dark:hover:bg-white/[0.04]"
                    onMouseEnter={() => setActiveTrait(item.icon)}
                    onMouseLeave={() => setActiveTrait((current) => (current === item.icon ? null : current))}
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-black transition-all duration-200 group-hover/trait:border-sky-300/60 group-hover/trait:bg-sky-100 group-hover/trait:text-sky-700 group-hover/trait:shadow-[0_0_24px_-10px_rgba(96,165,250,0.9)] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:group-hover/trait:border-sky-300/40 dark:group-hover/trait:bg-sky-400/20 dark:group-hover/trait:text-sky-100">
                      <TraitIcon variant={item.icon} animate={!isMobile && activeTrait === item.icon} />
                    </span>
                    <span>
                      <span className="block text-base font-semibold text-slate-900 dark:text-white">{item.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-600 dark:text-white/65">{item.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </motion.div>

          <motion.div variants={cardVariants} className="h-full">
            <SpotlightCard
              className="h-full rounded-3xl border border-slate-200 bg-white/70 p-8 transition-all duration-300 dark:border-white/10 dark:bg-white/[0.02]"
              spotlightColor="rgba(37, 99, 235, 0.2)"
            >
              <header>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">By The Numbers</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-white/60">A quick snapshot of delivery pace and technical range.</p>
              </header>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {STATS.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white/75 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/25 dark:hover:bg-white/[0.045]"
                  >
                    <p className={`text-3xl font-semibold tracking-tight sm:text-4xl ${stat.accentClass}`}>
                      {statValues[index]}{stat.suffix}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="relative mt-5 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/10 via-white/90 to-slate-100 px-4 py-3 text-center transition-colors duration-200 hover:border-accent/35 hover:from-accent/15 hover:via-white dark:from-accent/15 dark:via-white/[0.04] dark:to-navy-light/60 dark:hover:from-accent/20 dark:hover:via-white/[0.06]">
                <p className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-800 dark:text-white/85">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 3v4m0 10v4M3 12h4m10 0h4" />
                    <circle cx="12" cy="12" r="4.5" />
                  </svg>
                  Current focus: scalable product architecture and high-clarity user journeys.
                </p>
                {!isMobile ? (
                  <BorderBeam
                    duration={8}
                    size={88}
                    initialOffset={25}
                    borderWidth={1.2}
                    colorFrom="#3b82f6"
                    colorTo="#93c5fd"
                    className="opacity-95"
                  />
                ) : null}
                {!isMobile ? (
                  <BorderBeam
                    duration={8}
                    size={110}
                    initialOffset={75}
                    borderWidth={1.8}
                    colorFrom="#22d3ee"
                    colorTo="#60a5fa"
                    className="opacity-75"
                  />
                ) : null}
              </div>
            </SpotlightCard>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
