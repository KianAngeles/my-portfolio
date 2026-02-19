import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import useIsMobile from "@/hooks/useIsMobile";
import SectionRadialGlow from "@/components/ui/SectionRadialGlow";
import { featuredProjects } from "@/data/projects";

const FEATURED_PROJECTS_SEEN_KEY = "homeFeaturedProjectsSeen";

const MAX_TILT_DEG = 14;

const SHINE_VARIANTS = {
  linqly: {
    "--shineTint": "37, 99, 235",
    "--shineRadialLight": "0.12",
    "--shineRadialDark": "0.22",
    "--shineBand": "0.12",
  },
  thryve: {
    "--shineTint": "255, 255, 255",
    "--shineRadialLight": "0.09",
    "--shineRadialDark": "0.18",
    "--shineBand": "0.1",
  },
  default: {
    "--shineTint": "255, 255, 255",
    "--shineRadialLight": "0.09",
    "--shineRadialDark": "0.18",
    "--shineBand": "0.1",
  },
};

const HOME_FEATURED_PROJECT_IDS = new Set(["linqly", "thryve"]);
const homeFeaturedProjects = featuredProjects.filter((project) =>
  HOME_FEATURED_PROJECT_IDS.has(project.id),
);

function StackPill({ label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-navy/5 px-3 py-1 text-xs font-medium text-navy backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white/80">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
      {label}
    </span>
  );
}

function TiltShineCard({
  children,
  variant,
  className = "",
  prefersReducedMotion,
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const shineVariant =
    SHINE_VARIANTS[variant?.toLowerCase()] ?? SHINE_VARIANTS.default;

  const resetCardState = () => {
    const node = cardRef.current;
    if (!node) return;
    node.style.setProperty("--mx", "50%");
    node.style.setProperty("--my", "40%");
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
  };

  const updateCardFromPointer = (event) => {
    const node = cardRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const mx = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );
    const my = Math.min(
      Math.max((event.clientY - rect.top) / rect.height, 0),
      1,
    );
    const rotateY = (mx - 0.5) * MAX_TILT_DEG;
    const rotateX = (0.5 - my) * MAX_TILT_DEG;

    node.style.setProperty("--mx", `${(mx * 100).toFixed(2)}%`);
    node.style.setProperty("--my", `${(my * 100).toFixed(2)}%`);
    node.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
    node.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
  };

  useEffect(() => {
    resetCardState();
  }, []);

  const hoverStateClass = prefersReducedMotion
    ? "hover:border-navy/35 dark:hover:border-white/45 hover:shadow-[12px_14px_42px_-18px_rgba(255,255,255,0.35)] dark:hover:shadow-[12px_14px_44px_-20px_rgba(255,255,255,0.3)]"
    : "hover:border-navy/40 dark:hover:border-white/55 hover:shadow-[12px_14px_42px_-18px_rgba(255,255,255,0.5)] dark:hover:shadow-[12px_14px_44px_-20px_rgba(255,255,255,0.34)]";

  const baseStyle = {
    "--mx": "50%",
    "--my": "40%",
    "--rx": "0deg",
    "--ry": "0deg",
    ...shineVariant,
  };

  return (
    <div
      ref={cardRef}
      className={`group relative h-full overflow-hidden rounded-3xl border border-navy/18 bg-transparent shadow-[10px_12px_36px_-20px_rgba(255,255,255,0.42)] backdrop-blur-md transition-[transform,border-color,box-shadow] duration-200 ease-out dark:border-white/30 dark:shadow-[10px_12px_38px_-22px_rgba(255,255,255,0.28)] ${
        !prefersReducedMotion && isHovered ? "will-change-transform" : ""
      } ${hoverStateClass} ${className}`}
      style={
        prefersReducedMotion
          ? baseStyle
          : {
              ...baseStyle,
              transform: `perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))${
                isHovered ? " translateY(-2px)" : ""
              }`,
            }
      }
      onMouseEnter={(event) => {
        setIsHovered(true);
        if (prefersReducedMotion) return;
        updateCardFromPointer(event);
      }}
      onMouseMove={(event) => {
        if (prefersReducedMotion || !isHovered) return;
        updateCardFromPointer(event);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (prefersReducedMotion) return;
        resetCardState();
      }}
    >
      {!prefersReducedMotion && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-30 rounded-[inherit] transition-opacity duration-200 ${
            isHovered ? "opacity-90" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 rounded-[inherit]"
            style={{
              background:
                "radial-gradient(circle at var(--mx) var(--my), rgba(var(--shineTint), calc(var(--shineRadialDark) * 0.65)) 0%, rgba(var(--shineTint), calc(var(--shineRadialDark) * 0.35)) 34%, transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 rounded-[inherit] dark:hidden"
            style={{
              background:
                "radial-gradient(circle at var(--mx) var(--my), rgba(11, 30, 58, var(--shineRadialLight)) 0%, rgba(11, 30, 58, calc(var(--shineRadialLight) * 0.4)) 30%, transparent 60%)",
            }}
          />
          <div
            className="absolute inset-[-10%] rounded-[inherit]"
            style={{
              transform: "translateX(calc((var(--mx) - 50%) * 0.2))",
              background:
                "linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, var(--shineBand)) 40%, transparent 70%)",
            }}
          />
        </div>
      )}

      {prefersReducedMotion && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-30 rounded-[inherit] transition-opacity duration-200 ${
            isHovered ? "opacity-80" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 rounded-[inherit]"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(11, 30, 58, 0.09) 0%, transparent 58%)",
            }}
          />
        </div>
      )}

      <div className="relative z-20 flex h-full flex-col p-6 sm:p-7">
        {children}
      </div>
    </div>
  );
}

function ProjectCard({ project, delay, isVisible, prefersReducedMotion }) {
  const revealClass = prefersReducedMotion
    ? "opacity-100 translate-y-0"
    : `transition-all duration-[700ms] ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`;

  const previewClass = prefersReducedMotion
    ? "aspect-[16/10] w-full object-cover"
    : "aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]";

  return (
    <article className={revealClass} style={{ transitionDelay: delay }}>
      <TiltShineCard variant={project.id ?? project.title} prefersReducedMotion={prefersReducedMotion}>
        <div>
          <h3>{project.title}</h3>
          <p className="mt-3 max-w-prose">{project.description}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <StackPill key={item} label={item} />
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-navy/10 bg-navy/5 dark:border-white/10 dark:bg-white/[0.03]">
          <img
            src={project.preview}
            alt={`${project.title} preview`}
            className={previewClass}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="relative z-40 mt-6 flex items-center justify-between">
          <Link
            to={project.projectHref}
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy transition-colors duration-200 hover:text-accent dark:text-white dark:hover:text-accent"
          >
            View project
            <span aria-hidden>-&gt;</span>
          </Link>
          {project.demoHref ? (
            <a
              href={project.demoHref}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex items-center px-4 py-1.5 text-sm"
            >
              Live Demo
            </a>
          ) : project.sourceHref ? (
            <a
              href={project.sourceHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-navy/15 bg-white/65 px-4 py-1.5 text-sm font-semibold text-navy transition-colors duration-200 hover:border-accent/40 hover:text-accent dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-accent/55 dark:hover:text-accent"
            >
              View Code
            </a>
          ) : (
            <span className="inline-flex items-center rounded-full border border-navy/10 bg-navy/5 px-4 py-1.5 text-sm font-semibold text-navy/50 dark:border-white/15 dark:bg-white/5 dark:text-white/45">
              Coming Soon
            </span>
          )}
        </div>
      </TiltShineCard>
    </article>
  );
}

export default function FeaturedProjects() {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion() || isMobile;
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(FEATURED_PROJECTS_SEEN_KEY) === "1";
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return undefined;
    }

    const node = sectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          window.sessionStorage.setItem(FEATURED_PROJECTS_SEEN_KEY, "1");
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const headerRevealClass = prefersReducedMotion
    ? "opacity-100 translate-y-0"
    : `transition-all duration-[650ms] ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`;

  return (
    <div className="relative overflow-visible">
      <SectionRadialGlow />

      <section
        ref={sectionRef}
        id="projects"
        className="relative isolate w-full py-15 md:py-20"
      >
        <div className="container-wrapper relative">
          <div className={`mx-auto max-w-3xl text-center ${headerRevealClass}`}>
            <h2>Featured Projects</h2>
            <p className="mt-4">
              A quick look at two builds that highlight practical engineering,
              thoughtful product decisions, and clean delivery.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            {homeFeaturedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                isVisible={isVisible}
                prefersReducedMotion={prefersReducedMotion}
                delay={prefersReducedMotion ? "0ms" : `${120 + index * 120}ms`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

