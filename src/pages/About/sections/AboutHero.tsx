import { useEffect, useRef, useState } from "react";
import portraitImage from "@/assets/images/pic.webp";
import typescriptIcon from "@/assets/icons/tech/typescript.png";
import reactIcon from "@/assets/icons/marquee-tech/React.png";
import nodejsIcon from "@/assets/icons/marquee-tech/Node.js.png";
import nextjsIcon from "@/assets/icons/marquee-tech/Next.js.png";
import githubTechIcon from "@/assets/icons/tech/github.png";
import mongodbIcon from "@/assets/icons/tech/mongodb.png";
import javascriptIcon from "@/assets/icons/marquee-tech/JavaScript.png";
import flutterIcon from "@/assets/icons/tech/flutter.png";
import pythonIcon from "@/assets/icons/tech/python.png";
import linkedinSocialIcon from "@/assets/icons/socials/linkedin.png";
import githubSocialIcon from "@/assets/icons/socials/github.png";
import facebookSocialIcon from "@/assets/icons/socials/facebook.png";
import instagramSocialIcon from "@/assets/icons/socials/instagram.png";
import { profile } from "@/data/profile";
import SectionRadialGlow from "@/components/ui/SectionRadialGlow";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import useFirstVisit from "@/hooks/useFirstVisit";
import useIsMobile from "@/hooks/useIsMobile";
import "./AboutHero.css";

const GREETING_PREFIX = "Hello, I'm ";
const GREETING_NAME = "Kian Charles S. Angeles";
const FULL_GREETING = `${GREETING_PREFIX}${GREETING_NAME}`;

const ORBIT_SIZE = 520;
const ORBIT_CENTER = ORBIT_SIZE / 2;
const INNER_RING_RADIUS = 144;
const OUTER_RING_RADIUS = 206;

const INNER_RING_CIRCUMFERENCE = 2 * Math.PI * INNER_RING_RADIUS;
const OUTER_RING_CIRCUMFERENCE = 2 * Math.PI * OUTER_RING_RADIUS;

const INNER_RING_ITEMS = [
  { id: "typescript", src: typescriptIcon, label: "TypeScript", color: "#3178C6" },
  { id: "react", src: reactIcon, label: "React", color: "#61DAFB" },
  { id: "nodejs", src: nodejsIcon, label: "Node.js", color: "#68A063" },
  { id: "nextjs", src: nextjsIcon, label: "Next.js", color: "#FFFFFF" },
];

const OUTER_RING_ITEMS = [
  { id: "github", src: githubTechIcon, label: "GitHub", color: "#FFFFFF" },
  { id: "mongodb", src: mongodbIcon, label: "MongoDB", color: "#22C55E" },
  { id: "javascript", src: javascriptIcon, label: "JavaScript", color: "#F7DF1E" },
  { id: "flutter", src: flutterIcon, label: "Flutter", color: "#38BDF8" },
  { id: "python", src: pythonIcon, label: "Python", color: "#3776AB" },
];

// TODO: finalize and verify public social profile URLs in src/data/profile.js.
const SOCIAL_LINKS = [
  { label: "LinkedIn", href: profile.linkedin || "#", icon: linkedinSocialIcon },
  { label: "GitHub", href: profile.github || "#", icon: githubSocialIcon },
  { label: "Facebook", href: profile.facebook || "#", icon: facebookSocialIcon },
  { label: "Instagram", href: profile.instagram || "#", icon: instagramSocialIcon },
];

function orbitPoint(radius, index, total) {
  const angle = (index / total) * (Math.PI * 2) - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function revealClass(visible) {
  return visible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-3";
}

export default function AboutHero() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion() || isMobile;
  const { isFirstVisit, markVisited } = useFirstVisit("aboutHeroAnimated");

  const runIntro = isFirstVisit && !prefersReducedMotion;

  const [typedText, setTypedText] = useState(runIntro ? "" : FULL_GREETING);
  const [isTyping, setIsTyping] = useState(runIntro);
  const [nameSweepActive, setNameSweepActive] = useState(false);

  const [showHeadline, setShowHeadline] = useState(!runIntro);
  const [showParagraph, setShowParagraph] = useState(!runIntro);
  const [showSocials, setShowSocials] = useState(!runIntro);

  const [showOrbit, setShowOrbit] = useState(!runIntro);
  const [showPhoto, setShowPhoto] = useState(!runIntro);
  const [showInnerRing, setShowInnerRing] = useState(!runIntro);
  const [showOuterRing, setShowOuterRing] = useState(!runIntro);
  const [visibleInnerIcons, setVisibleInnerIcons] = useState(
    runIntro ? 0 : INNER_RING_ITEMS.length,
  );
  const [visibleOuterIcons, setVisibleOuterIcons] = useState(
    runIntro ? 0 : OUTER_RING_ITEMS.length,
  );
  const [rotationActive, setRotationActive] = useState(!runIntro && !prefersReducedMotion);
  const [activeTech, setActiveTech] = useState(null);
  const [centerActive, setCenterActive] = useState(false);

  const hasMarkedVisitRef = useRef(false);
  const touchResetTimeoutRef = useRef(null);

  useEffect(() => {
    let typingIntervalId;
    let sweepTimeoutId;

    if (!runIntro) {
      setTypedText(FULL_GREETING);
      setIsTyping(false);
      setNameSweepActive(false);
      return undefined;
    }

    setTypedText("");
    setIsTyping(true);
    setNameSweepActive(false);

    let charIndex = 0;
    typingIntervalId = window.setInterval(() => {
      charIndex += 1;
      setTypedText(FULL_GREETING.slice(0, charIndex));

      if (charIndex >= FULL_GREETING.length) {
        window.clearInterval(typingIntervalId);
        setIsTyping(false);
        setNameSweepActive(true);
        sweepTimeoutId = window.setTimeout(() => {
          setNameSweepActive(false);
        }, 650);
      }
    }, 46);

    return () => {
      if (typingIntervalId) window.clearInterval(typingIntervalId);
      if (sweepTimeoutId) window.clearTimeout(sweepTimeoutId);
    };
  }, [runIntro]);

  useEffect(() => {
    const timeoutIds = [];

    if (!runIntro) {
      if (isFirstVisit && prefersReducedMotion && !hasMarkedVisitRef.current) {
        markVisited();
        hasMarkedVisitRef.current = true;
      }

      setShowHeadline(true);
      setShowParagraph(true);
      setShowSocials(true);
      setShowOrbit(true);
      setShowPhoto(true);
      setShowInnerRing(true);
      setShowOuterRing(true);
      setVisibleInnerIcons(INNER_RING_ITEMS.length);
      setVisibleOuterIcons(OUTER_RING_ITEMS.length);
      setRotationActive(!prefersReducedMotion);
      return undefined;
    }

    if (!hasMarkedVisitRef.current) {
      markVisited();
      hasMarkedVisitRef.current = true;
    }

    setShowHeadline(false);
    setShowParagraph(false);
    setShowSocials(false);
    setShowOrbit(false);
    setShowPhoto(false);
    setShowInnerRing(false);
    setShowOuterRing(false);
    setVisibleInnerIcons(0);
    setVisibleOuterIcons(0);
    setRotationActive(false);

    const schedule = (delay, callback) => {
      const timeoutId = window.setTimeout(callback, delay);
      timeoutIds.push(timeoutId);
    };

    schedule(150, () => setShowHeadline(true));
    schedule(250, () => setShowParagraph(true));
    schedule(380, () => setShowSocials(true));

    schedule(520, () => setShowOrbit(true));
    schedule(700, () => setShowPhoto(true));
    schedule(820, () => setShowInnerRing(true));
    schedule(1160, () => setShowOuterRing(true));

    INNER_RING_ITEMS.forEach((_, index) => {
      schedule(1320 + index * 90, () => {
        setVisibleInnerIcons(index + 1);
      });
    });

    OUTER_RING_ITEMS.forEach((_, index) => {
      schedule(1700 + index * 90, () => {
        setVisibleOuterIcons(index + 1);
      });
    });

    schedule(2380, () => {
      setRotationActive(true);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [isFirstVisit, markVisited, prefersReducedMotion, runIntro]);

  useEffect(() => {
    return () => {
      if (touchResetTimeoutRef.current) {
        window.clearTimeout(touchResetTimeoutRef.current);
      }
    };
  }, []);

  const clearActiveTech = () => {
    if (touchResetTimeoutRef.current) {
      window.clearTimeout(touchResetTimeoutRef.current);
      touchResetTimeoutRef.current = null;
    }
    setActiveTech(null);
  };

  const handleTechTouch = (tech) => {
    setActiveTech(tech);

    if (touchResetTimeoutRef.current) {
      window.clearTimeout(touchResetTimeoutRef.current);
    }

    touchResetTimeoutRef.current = window.setTimeout(() => {
      setActiveTech(null);
      touchResetTimeoutRef.current = null;
    }, 1200);
  };

  const typedPrefix = typedText.slice(0, GREETING_PREFIX.length);
  const typedName = typedText.length > GREETING_PREFIX.length
    ? typedText.slice(GREETING_PREFIX.length)
    : "";
  const neutralOrbitAccent = "#60A5FA";
  const activeTechColor = activeTech?.color ?? null;
  const centerRingColor = activeTechColor ?? (centerActive ? neutralOrbitAccent : null);
  const centerPulseColor = activeTechColor ?? (centerActive ? neutralOrbitAccent : null);

  // TODO: replace this with your final portrait source if it changes.
  const profileImageSrc = portraitImage;

  return (
    <section
      className="relative isolate flex min-h-[calc(100dvh-84px)] w-full items-center overflow-x-clip box-border pt-28 pb-10 md:pt-32 md:pb-14"
      aria-labelledby="about-hero-title"
    >
      <SectionRadialGlow />

      <div className="container-wrapper relative z-10 max-w-[90rem]">
        <div className="grid items-center gap-14 min-[1100px]:grid-cols-[1.08fr_0.92fr] min-[1100px]:gap-16">
          <div className="order-2 lg:order-1">
            <p className="text-2xl font-semibold tracking-wide text-slate-700 dark:text-white/85 md:text-3xl">
              {typedPrefix}
              <span
                className={`font-semibold ${
                  nameSweepActive
                    ? "about-name-sweep bg-[linear-gradient(90deg,#60a5fa_0%,#dbeafe_45%,#2563eb_75%,#60a5fa_100%)] bg-[length:220%_100%] bg-clip-text text-transparent"
                    : "text-accent"
                }`}
              >
                {typedName}
              </span>
              {isTyping && <span className="ml-0.5 inline-block animate-pulse text-accent">|</span>}
            </p>

            <h1
              id="about-hero-title"
              className={`mt-4 text-5xl font-extrabold leading-tight text-slate-900 dark:text-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-6xl xl:text-7xl ${revealClass(showHeadline)}`}
            >
              About Me
            </h1>

            <p
              className={`mt-6 max-w-2xl text-lg leading-relaxed text-slate-700 dark:text-white/80 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${revealClass(showParagraph)}`}
            >
              I build full-stack web products with clean front-end systems and reliable back-end services,
              with a focus on practical performance, maintainable code, and thoughtful user experience.
            </p>

            <div
              className={`mt-9 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${revealClass(showSocials)}`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-white/70">Socials</p>
              <div className="mt-4 grid max-w-md grid-cols-2 gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="inline-flex items-center gap-3 text-base font-semibold text-slate-800 transition duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 dark:text-white/85"
                  >
                    <img
                      src={social.icon}
                      alt=""
                      className="h-6 w-6 object-contain dark:[filter:brightness(0)_invert(1)]"
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                    />
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            <div
              className={`mt-10 grid grid-cols-1 gap-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:flex sm:flex-wrap ${revealClass(showSocials)}`}
            >
              <a
                href="#"
                aria-label="Download CV"
                className="btn-primary inline-flex min-w-[320px] w-full items-center justify-center px-8 py-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:w-auto"
              >
                Download CV
              </a>
              <a
                href="/contact"
                aria-label="Contact Me"
                className="btn-primary inline-flex min-w-[320px] w-full items-center justify-center px-8 py-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:w-auto"
              >
                Contact Me
              </a>
            </div>
          </div>

          <div className="hidden min-[1100px]:order-2 min-[1100px]:block">
            <div className="mx-auto w-full max-w-[520px]">
              <div
                onMouseLeave={() => {
                  clearActiveTech();
                  setCenterActive(false);
                }}
                className={`relative h-[500px] w-full overflow-visible transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[540px] ${
                  showOrbit ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.96]"
                } ${
                  centerActive ? "scale-[1.02]" : "scale-100"
                }`}
              >
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${ORBIT_SIZE} ${ORBIT_SIZE}`} aria-hidden="true">
                  <circle
                    cx={ORBIT_CENTER}
                    cy={ORBIT_CENTER}
                    r={INNER_RING_RADIUS}
                    fill="none"
                    stroke={centerActive ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.14)"}
                    strokeWidth="1.2"
                    style={{
                      filter: centerActive ? "drop-shadow(0 0 8px rgba(59,130,246,0.24))" : "none",
                    }}
                  />
                  <circle
                    cx={ORBIT_CENTER}
                    cy={ORBIT_CENTER}
                    r={OUTER_RING_RADIUS}
                    fill="none"
                    stroke={centerActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)"}
                    strokeWidth="1.2"
                    style={{
                      filter: centerActive ? "drop-shadow(0 0 8px rgba(59,130,246,0.24))" : "none",
                    }}
                  />

                  <circle
                    cx={ORBIT_CENTER}
                    cy={ORBIT_CENTER}
                    r={INNER_RING_RADIUS}
                    fill="none"
                    stroke={centerActive ? "rgba(96,165,250,0.76)" : "rgba(96,165,250,0.5)"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={INNER_RING_CIRCUMFERENCE}
                    strokeDashoffset={showInnerRing ? 0 : INNER_RING_CIRCUMFERENCE}
                    style={{
                      filter: centerActive ? "drop-shadow(0 0 10px rgba(59,130,246,0.34))" : "none",
                      transition: prefersReducedMotion
                        ? "none"
                        : "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1), filter 300ms ease-out, stroke 300ms ease-out",
                    }}
                  />
                  <circle
                    cx={ORBIT_CENTER}
                    cy={ORBIT_CENTER}
                    r={OUTER_RING_RADIUS}
                    fill="none"
                    stroke={centerActive ? "rgba(96,165,250,0.72)" : "rgba(96,165,250,0.46)"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={OUTER_RING_CIRCUMFERENCE}
                    strokeDashoffset={showOuterRing ? 0 : OUTER_RING_CIRCUMFERENCE}
                    style={{
                      filter: centerActive ? "drop-shadow(0 0 10px rgba(59,130,246,0.3))" : "none",
                      transition: prefersReducedMotion
                        ? "none"
                        : "stroke-dashoffset 980ms cubic-bezier(0.22,1,0.36,1), filter 300ms ease-out, stroke 300ms ease-out",
                    }}
                  />
                </svg>

                <div
                  className={`pointer-events-none absolute inset-0 ${
                    rotationActive && !prefersReducedMotion ? "about-rotate-cw" : ""
                  }`}
                >
                  {OUTER_RING_ITEMS.map((item, index) => {
                    const { x, y } = orbitPoint(OUTER_RING_RADIUS, index, OUTER_RING_ITEMS.length);
                    const isVisible = visibleOuterIcons > index;
                    const isActive = activeTech?.id === item.id;
                    const isEnhanced = isActive || centerActive;
                    const needsHaloLayer = item.id === "github";
                    const iconGlow = `drop-shadow(0 0 12px ${item.color}cc) drop-shadow(0 0 24px ${item.color}99)`;

                    return (
                      <div
                        key={item.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                        }}
                      >
                        <button
                          type="button"
                          onMouseEnter={() => setActiveTech(item)}
                          onMouseLeave={clearActiveTech}
                          onFocus={() => setActiveTech(item)}
                          onBlur={clearActiveTech}
                          onTouchStart={() => handleTechTouch(item)}
                          className={`group/tech relative inline-flex h-12 w-12 items-center justify-center transition-all duration-300 ease-out focus-visible:outline-none ${
                            isVisible ? "pointer-events-auto" : "pointer-events-none"
                          } ${
                            isActive ? "z-20 scale-[1.2]" : centerActive ? "z-10 scale-105" : "scale-100"
                          }`}
                          aria-label={item.label}
                        >
                          <span
                            className={`absolute inset-[-6px] rounded-full transition-opacity duration-300 ${
                              isEnhanced ? "opacity-100" : "opacity-0"
                            }`}
                            style={{
                              background: `radial-gradient(circle, ${item.color}5c 0%, transparent 70%)`,
                            }}
                            aria-hidden="true"
                          />
                          <span
                            className={`relative inline-flex h-12 w-12 items-center justify-center transition-all duration-500 ease-out ${
                              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                            } ${rotationActive && !prefersReducedMotion ? "about-counter-outer" : ""}`}
                          >
                            <span
                              className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-1 text-xs font-medium text-white/95 backdrop-blur-md transition-all duration-200 ${
                                isActive ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                              }`}
                            >
                              {item.label}
                            </span>
                            {needsHaloLayer && (
                              <span
                                className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 ${
                                  isEnhanced ? "opacity-100" : "opacity-0"
                                }`}
                                style={{
                                  boxShadow: `0 0 12px ${item.color}cc, 0 0 24px ${item.color}80`,
                                }}
                                aria-hidden="true"
                              />
                            )}
                            <img
                              src={item.src}
                              alt={item.label}
                              className={`h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(11,30,58,0.45)] transition-[filter] duration-300 ${
                                item.id === "github" ? "dark:brightness-0 dark:invert" : ""
                              }`}
                              style={isEnhanced && item.id !== "github"
                                ? { filter: `brightness(1.08) ${iconGlow}` }
                                : undefined}
                              loading="lazy"
                              decoding="async"
                            />
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div
                  className={`pointer-events-none absolute inset-0 ${
                    rotationActive && !prefersReducedMotion ? "about-rotate-ccw" : ""
                  }`}
                >
                  {INNER_RING_ITEMS.map((item, index) => {
                    const { x, y } = orbitPoint(INNER_RING_RADIUS, index, INNER_RING_ITEMS.length);
                    const isVisible = visibleInnerIcons > index;
                    const isActive = activeTech?.id === item.id;
                    const isEnhanced = isActive || centerActive;
                    const needsHaloLayer = item.id === "nextjs";
                    const iconGlow = `drop-shadow(0 0 12px ${item.color}cc) drop-shadow(0 0 24px ${item.color}99)`;

                    return (
                      <div
                        key={item.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                        }}
                      >
                        <button
                          type="button"
                          onMouseEnter={() => setActiveTech(item)}
                          onMouseLeave={clearActiveTech}
                          onFocus={() => setActiveTech(item)}
                          onBlur={clearActiveTech}
                          onTouchStart={() => handleTechTouch(item)}
                          className={`group/tech relative inline-flex h-11 w-11 items-center justify-center transition-all duration-300 ease-out focus-visible:outline-none ${
                            isVisible ? "pointer-events-auto" : "pointer-events-none"
                          } ${
                            isActive ? "z-20 scale-[1.2]" : centerActive ? "z-10 scale-105" : "scale-100"
                          }`}
                          aria-label={item.label}
                        >
                          <span
                            className={`absolute inset-[-6px] rounded-full transition-opacity duration-300 ${
                              isEnhanced ? "opacity-100" : "opacity-0"
                            }`}
                            style={{
                              background: `radial-gradient(circle, ${item.color}5c 0%, transparent 70%)`,
                            }}
                            aria-hidden="true"
                          />
                          <span
                            className={`relative inline-flex h-11 w-11 items-center justify-center transition-all duration-500 ease-out ${
                              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                            } ${rotationActive && !prefersReducedMotion ? "about-counter-inner" : ""}`}
                          >
                            <span
                              className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-1 text-xs font-medium text-white/95 backdrop-blur-md transition-all duration-200 ${
                                isActive ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                              }`}
                            >
                              {item.label}
                            </span>
                            {needsHaloLayer && (
                              <span
                                className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 ${
                                  isEnhanced ? "opacity-100" : "opacity-0"
                                }`}
                                style={{
                                  boxShadow: `0 0 12px ${item.color}cc, 0 0 24px ${item.color}80`,
                                }}
                                aria-hidden="true"
                              />
                            )}
                            <img
                              src={item.src}
                              alt={item.label}
                              className={`h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(11,30,58,0.45)] transition-[filter] duration-300 ${
                                item.id === "nextjs" ? "dark:brightness-0 dark:invert" : ""
                              }`}
                              style={isEnhanced && item.id !== "nextjs"
                                ? { filter: `brightness(1.08) ${iconGlow}` }
                                : undefined}
                              loading="lazy"
                              decoding="async"
                            />
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {centerPulseColor && (
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${centerPulseColor}5c 0%, ${centerPulseColor}1f 40%, transparent 72%)`,
                      animation: prefersReducedMotion
                        ? "none"
                        : centerActive
                          ? "centerPulse 1.5s ease-out infinite"
                          : "aboutTechPulse 1.7s ease-out infinite",
                    }}
                    aria-hidden="true"
                  />
                )}

                <figure
                  className={`absolute left-1/2 top-1/2 h-[188px] w-[188px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-slate-300 bg-white p-1.5 shadow-2xl shadow-slate-300/55 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/20 dark:bg-white/5 dark:shadow-black/35 ${
                    showPhoto ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                  onMouseEnter={() => {
                    clearActiveTech();
                    setCenterActive(true);
                  }}
                  onMouseLeave={() => setCenterActive(false)}
                  style={centerRingColor ? {
                    borderColor: `${centerRingColor}`,
                    boxShadow: centerActive
                      ? `0 0 0 1px ${centerRingColor}80, 0 0 36px ${centerRingColor}66, 0 28px 60px -30px ${centerRingColor}88`
                      : `0 0 0 1px ${centerRingColor}66, 0 0 28px ${centerRingColor}4d, 0 26px 56px -30px ${centerRingColor}80`,
                  } : undefined}
                >
                  <img
                    src={profileImageSrc}
                    alt="Portrait of Kian Charles S. Angeles"
                    className="h-full w-full rounded-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    width="188"
                    height="188"
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
