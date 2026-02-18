import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import portraitImage from "@/assets/images/pic.jpg";
import inputFolderIcon from "@/assets/icons/node-beam/input/folder.png";
import inputFigmaIcon from "@/assets/icons/node-beam/input/figma.png";
import inputHubIcon from "@/assets/icons/node-beam/input/hub.png";
import outputReactIcon from "@/assets/icons/node-beam/output/React.png";
import outputTestingIcon from "@/assets/icons/node-beam/output/testing.png";
import outputDeploymentIcon from "@/assets/icons/node-beam/output/deployment.png";
import SoftSkillsGrid from "./SoftSkillsGrid";
import "./MagicBento.css";

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 410;
const DEFAULT_GLOW_COLOR = "96, 165, 250";
const MOBILE_BREAKPOINT = 768;

const cardData = [
  {
    color: "rgba(255, 255, 255, 0.03)",
    title: "Who I Am",
    description:
      "A calm, structured developer who values clarity, collaboration, and long-term maintainability. I enjoy turning complex requirements into reliable products people can trust.",
    label: "Who I Am",
  },
  {
    color: "rgba(255, 255, 255, 0.03)",
    title: "What I Value",
    values: [
      "Clear communication",
      "Practical execution",
      "Sustainable systems",
      "Thoughtful decisions",
    ],
    label: "What I Value",
  },
  {
    color: "rgba(255, 255, 255, 0.03)",
    title: "How I Work",
    points: [
      "Clarify the problem before touching the solution.",
      "Ship in small, testable increments.",
      "Refine for performance and readability.",
    ],
    label: "Process",
  },
  {
    color: "rgba(255, 255, 255, 0.03)",
    title: "Soft Skills",
    type: "soft-skills",
    label: "Soft Skills",
  },
  {
    color: "rgba(255, 255, 255, 0.03)",
    title: "Clarity Before Code",
    description:
        "I define the problem, align on goals, and clarify constraints before any build begins. Every project starts with clear requirements and focused direction, ensuring alignment, readiness, and technical precision from the outset.",
    label: "Inputs",
  },
  {
    color: "rgba(255, 255, 255, 0.03)",
    title: "Execution With Discipline",
    description:
      "From planning to release, I deliver clean builds, validated systems, and scalable deployments. Every project moves from implementation to testing to refinement, ensuring reliability and performance.",
    label: "Outputs",
  },
];

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const ParticleCard = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseMove = (e) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleClick = (e) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.35) 0%, rgba(${glowColor}, 0.18) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.14) 0%,
        rgba(${glowColor}, 0.07) 18%,
        rgba(${glowColor}, 0.035) 30%,
        rgba(${glowColor}, 0.015) 45%,
        rgba(${glowColor}, 0.01) 62%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll(".card");

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
        cards.forEach((card) => {
          card.style.setProperty("--glow-intensity", "0");
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardElement = card;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.75
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.75
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll(".card").forEach((card) => {
        card.style.setProperty("--glow-intensity", "0");
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid = ({ children, gridRef, style }) => (
  <div
    className="bento-section grid gap-2 p-3 w-full select-none relative"
    style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.2rem)", ...style }}
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const useBodyDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.body.classList.contains("dark");
  });

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark"));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
};

const ProcessBeamGraph = ({
  introEnabled = false,
  introActive = true,
}) => {
  const containerRef = useRef(null);
  const centerRef = useRef(null);
  const leftTopRef = useRef(null);
  const leftMidRef = useRef(null);
  const leftBottomRef = useRef(null);
  const rightTopRef = useRef(null);
  const rightMidRef = useRef(null);
  const rightBottomRef = useRef(null);
  const shouldDrawBeams = introEnabled ? introActive : true;

  const nodeStateClass = introEnabled
    ? introActive
      ? "process-node--intro-visible"
      : "process-node--intro-hidden"
    : "";

  return (
    <div
      ref={containerRef}
      className={`process-beam-zone ${introEnabled ? "process-network-intro" : ""} ${
        introEnabled && introActive ? "process-network-intro--active" : ""
      }`}
      aria-hidden="true"
    >
      <div
        ref={leftTopRef}
        className={`process-node process-node--left-top process-node--intro-leaf ${nodeStateClass}`}
        style={{ transitionDelay: introEnabled && introActive ? "1120ms" : "0ms" }}
      >
        <img src={inputFolderIcon} alt="" className="process-node-icon" />
      </div>
      <div
        ref={leftMidRef}
        className={`process-node process-node--left-mid process-node--intro-leaf ${nodeStateClass}`}
        style={{ transitionDelay: introEnabled && introActive ? "1240ms" : "0ms" }}
      >
        <img src={inputFigmaIcon} alt="" className="process-node-icon" />
      </div>
      <div
        ref={leftBottomRef}
        className={`process-node process-node--left-bottom process-node--intro-leaf ${nodeStateClass}`}
        style={{ transitionDelay: introEnabled && introActive ? "1360ms" : "0ms" }}
      >
        <img src={inputHubIcon} alt="" className="process-node-icon" />
      </div>

      <div
        ref={rightTopRef}
        className={`process-node process-node--right-top process-node--intro-leaf ${nodeStateClass}`}
        style={{ transitionDelay: introEnabled && introActive ? "1480ms" : "0ms" }}
      >
        <img src={outputReactIcon} alt="" className="process-node-icon" />
      </div>
      <div
        ref={rightMidRef}
        className={`process-node process-node--right-mid process-node--intro-leaf ${nodeStateClass}`}
        style={{ transitionDelay: introEnabled && introActive ? "1600ms" : "0ms" }}
      >
        <img src={outputTestingIcon} alt="" className="process-node-icon" />
      </div>
      <div
        ref={rightBottomRef}
        className={`process-node process-node--right-bottom process-node--intro-leaf ${nodeStateClass}`}
        style={{ transitionDelay: introEnabled && introActive ? "1720ms" : "0ms" }}
      >
        <img src={outputDeploymentIcon} alt="" className="process-node-icon" />
      </div>

      <div
        ref={centerRef}
        className={`process-node process-node--center process-node--intro-center ${nodeStateClass}`}
      >
        <img src={portraitImage} alt="" className="process-node-avatar" />
        {introEnabled ? <span className="process-center-pulse" aria-hidden="true" /> : null}
      </div>

      <AnimatedBeam
        className="process-beam-svg"
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={leftTopRef}
        curvature={46}
        duration={5.2}
        delay={0}
        pathColor="rgba(148, 163, 184, 0.32)"
        pathWidth={1.4}
        pathOpacity={0.35}
        gradientStartColor="#60a5fa"
        gradientStopColor="#38bdf8"
        draw={shouldDrawBeams}
        drawDelay={0.62}
        drawDuration={0.72}
        instant={!introEnabled}
      />
      <AnimatedBeam
        className="process-beam-svg"
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={leftMidRef}
        duration={5}
        delay={0.16}
        pathColor="rgba(148, 163, 184, 0.32)"
        pathWidth={1.4}
        pathOpacity={0.35}
        gradientStartColor="#60a5fa"
        gradientStopColor="#38bdf8"
        draw={shouldDrawBeams}
        drawDelay={0.74}
        drawDuration={0.72}
        instant={!introEnabled}
      />
      <AnimatedBeam
        className="process-beam-svg"
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={leftBottomRef}
        curvature={-46}
        duration={5.2}
        delay={0.32}
        pathColor="rgba(148, 163, 184, 0.32)"
        pathWidth={1.4}
        pathOpacity={0.35}
        gradientStartColor="#60a5fa"
        gradientStopColor="#38bdf8"
        draw={shouldDrawBeams}
        drawDelay={0.86}
        drawDuration={0.72}
        instant={!introEnabled}
      />
      <AnimatedBeam
        className="process-beam-svg"
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={rightTopRef}
        curvature={46}
        duration={5.2}
        delay={0.62}
        pathColor="rgba(148, 163, 184, 0.32)"
        pathWidth={1.4}
        pathOpacity={0.35}
        gradientStartColor="#60a5fa"
        gradientStopColor="#38bdf8"
        draw={shouldDrawBeams}
        drawDelay={0.98}
        drawDuration={0.72}
        instant={!introEnabled}
      />
      <AnimatedBeam
        className="process-beam-svg"
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={rightMidRef}
        duration={5}
        delay={0.78}
        pathColor="rgba(148, 163, 184, 0.32)"
        pathWidth={1.4}
        pathOpacity={0.35}
        gradientStartColor="#60a5fa"
        gradientStopColor="#38bdf8"
        draw={shouldDrawBeams}
        drawDelay={1.1}
        drawDuration={0.72}
        instant={!introEnabled}
      />
      <AnimatedBeam
        className="process-beam-svg"
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={rightBottomRef}
        curvature={-46}
        duration={5.2}
        delay={0.94}
        pathColor="rgba(148, 163, 184, 0.32)"
        pathWidth={1.4}
        pathOpacity={0.35}
        gradientStartColor="#60a5fa"
        gradientStopColor="#38bdf8"
        draw={shouldDrawBeams}
        drawDelay={1.22}
        drawDuration={0.72}
        instant={!introEnabled}
      />
    </div>
  );
};

const renderCardContent = ({
  card,
  textAutoHide,
  isLargeCard,
  introEnabled = false,
  introActive = true,
}) => {
  const isProcessCard = card.label === "Process" && Array.isArray(card.points);
  const isSoftSkillsCard = card.type === "soft-skills";
  const showLabel = isLargeCard;

  if (isSoftSkillsCard) {
    return (
      <SoftSkillsGrid
        introEnabled={introEnabled}
        introActive={introActive}
        introDelayMs={1020}
      />
    );
  }

  return (
  <>
    {showLabel ? (
      <div className="card__header flex justify-between gap-3 relative text-slate-900 dark:text-white">
        <span className="card__label text-base">{card.label}</span>
      </div>
    ) : null}
    <div className="card__content flex flex-col relative text-slate-900 dark:text-white">
      {isProcessCard ? (
        <ProcessBeamGraph introEnabled={introEnabled} introActive={introActive} />
      ) : null}
      <h3 className={`card__title font-normal text-base m-0 mb-2 ${textAutoHide ? "text-clamp-1" : ""}`}>{card.title}</h3>

      {card.points ? (
        <ul className="card__list">
          {card.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}

      {card.paragraphs ? (
        <div className="card__paragraphs">
          {card.paragraphs.map((paragraph) => (
            <p key={paragraph} className="card__description text-xs leading-5 opacity-90">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {card.values ? (
        <ul className="mt-1 space-y-1.5 text-xs leading-relaxed text-[color:var(--card-text)]">
          {card.values.map((value) => (
            <li key={value} className="flex items-start gap-2 text-[color:var(--card-text)] opacity-95">
              <span
                aria-hidden
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--card-text)]"
              />
              <span>{value}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {!card.points && !card.paragraphs && !card.values ? (
        <p className={`card__description text-xs leading-5 opacity-90 ${textAutoHide ? "text-clamp-2" : ""}`}>
          {card.description}
        </p>
      ) : null}
    </div>
  </>
  );
};

const MagicBento = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = false,
  introEnabled = false,
  introActive = true,
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const isDarkMode = useBodyDarkMode();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const shouldEnableBorderGlow = enableBorderGlow && isDarkMode;
  const shouldEnableSpotlight = enableSpotlight && isDarkMode;
  const shouldRunIntro = introEnabled && !isMobile;

  return (
    <>
      {shouldEnableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={shouldEnableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}
      <BentoCardGrid
        gridRef={gridRef}
        style={{
          "--accent-glow": glowColor,
        }}
      >
        <div className="card-responsive grid gap-2">
          {cardData.map((card, index) => {
            const isLargeCard = index === 2 || index === 3;
            const isLeftIntroCard = index === 0 || index === 1 || index === 3;
            const leftCardRevealOrder = index === 3 ? 2 : index;
            const baseClassName = `card flex flex-col justify-start relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(2,12,32,0.35)] ${
              shouldEnableBorderGlow ? "card--border-glow" : ""
            }`;
            const introRevealClass =
              shouldRunIntro && isLeftIntroCard
                ? introActive
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
                : "opacity-100 translate-y-0";
            const introDelayMs =
              shouldRunIntro && isLeftIntroCard && introActive
                ? 780 + leftCardRevealOrder * 130
                : 0;

            const cardStyle = {
              backgroundColor: card.color || "var(--background-dark)",
              borderColor: "var(--border-color)",
              color: "var(--card-text)",
              "--glow-x": "50%",
              "--glow-y": "50%",
              "--glow-intensity": "0",
              "--glow-radius": "220px",
              transitionDelay: `${introDelayMs}ms`,
            };

            if (enableStars) {
              return (
                <ParticleCard
                  key={index}
                  className={`${baseClassName} ${introRevealClass}`}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  {renderCardContent({
                    card,
                    textAutoHide,
                    isLargeCard,
                    introEnabled: shouldRunIntro && (index === 2 || index === 3),
                    introActive,
                  })}
                </ParticleCard>
              );
            }

            return (
              <div key={index} className={`${baseClassName} ${introRevealClass}`} style={cardStyle}>
                {renderCardContent({
                  card,
                  textAutoHide,
                  isLargeCard,
                  introEnabled: shouldRunIntro && (index === 2 || index === 3),
                  introActive,
                })}
              </div>
            );
          })}
        </div>
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
