import { useEffect, useRef, useState } from "react";
import { SpotlightCard } from "@appletosolutions/reactbits";
import { Layers } from "@/components/animate-ui/icons/layers";
import { Sparkles } from "@/components/animate-ui/icons/sparkles";
import { Activity } from "@/components/animate-ui/icons/activity";
import { Gauge } from "@/components/animate-ui/icons/gauge";
import SectionRadialGlow from "@/components/ui/SectionRadialGlow";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import useIsMobile from "@/hooks/useIsMobile";
import { resume } from "@/data/resume";

const ABOUT_QUICK_SEEN_KEY = "homeAboutQuickSeen";

const QUICK_CARDS = [
  {
    id: "fullstack",
    title: "Full-Stack Development",
    description:
      "Building complete products across frontend interfaces, backend services, and reliable data flows.",
    Icon: Layers,
  },
  {
    id: "interactive",
    title: "Interactive UI",
    description:
      "Designing polished user experiences with thoughtful motion, clear hierarchy, and responsive behavior.",
    Icon: Sparkles,
  },
  {
    id: "realtime",
    title: "Real-Time Features",
    description:
      "Implementing live updates, event-driven interactions, and collaborative experiences for modern apps.",
    Icon: Activity,
  },
  {
    id: "optimized",
    title: "Clean & Optimized Code",
    description:
      "Focusing on maintainable architecture, performance-minded decisions, and practical developer experience.",
    Icon: Gauge,
  },
];

function MailIcon({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PinIcon({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 22s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconBackdrop({ id, isHovered }) {
  if (id === "fullstack") {
    return (
      <>
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <span
            className={`block h-8 w-8 rounded-md border border-accent/30 bg-accent/10 opacity-0 ${
              isHovered ? "icon-fx-plane-back" : ""
            }`}
          />
        </span>
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <span
            className={`block h-8 w-8 rounded-md border border-accent/20 opacity-0 ${
              isHovered ? "icon-fx-plane-front" : ""
            }`}
          />
        </span>
      </>
    );
  }

  if (id === "interactive") {
    return (
      <span
        className={`pointer-events-none absolute inset-0 -translate-x-[140%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 dark:via-white/50 ${
          isHovered ? "icon-fx-glint" : ""
        }`}
        aria-hidden="true"
      />
    );
  }

  if (id === "realtime") {
    return (
      <>
        <span
          className={`pointer-events-none absolute inset-1 rounded-full border border-accent/40 opacity-0 ${
            isHovered ? "icon-fx-radar-ring" : ""
          }`}
          aria-hidden="true"
        />
        <span
          className={`pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/35 opacity-0 blur-[2px] ${
            isHovered ? "icon-fx-radar-core" : ""
          }`}
          aria-hidden="true"
        />
      </>
    );
  }

  if (id === "optimized") {
    return (
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 translate-y-3 items-center gap-1"
        aria-hidden="true"
      >
        <span
          className={`h-0.5 w-2 rounded-full bg-accent/55 opacity-0 ${
            isHovered ? "icon-fx-tick-1" : ""
          }`}
        />
        <span
          className={`h-0.5 w-2 rounded-full bg-accent/55 opacity-0 ${
            isHovered ? "icon-fx-tick-2" : ""
          }`}
        />
        <span
          className={`h-0.5 w-2 rounded-full bg-accent/55 opacity-0 ${
            isHovered ? "icon-fx-tick-3" : ""
          }`}
        />
      </span>
    );
  }

  return null;
}

function SpotlightFeatureCard({ id, title, description, Icon, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);
  const iconWrapperClass =
    id === "interactive"
      ? "relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-md"
      : "relative inline-flex h-10 w-10 items-center justify-center";

  return (
    <div
      className="group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
    >
      <SpotlightCard
        className="flex h-full flex-col rounded-2xl border border-navy/10 bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-navy-light/40"
        spotlightColor="rgba(37, 99, 235, 0.22)"
      >
        <div className={iconWrapperClass}>
          <IconBackdrop id={id} isHovered={isHovered} />
          <Icon
            className="relative z-10 h-6 w-6 text-black transition-colors duration-300 dark:text-white"
            animate={!isMobile && isHovered}
            aria-hidden="true"
          />
        </div>
        <h3 className="mt-4">{title}</h3>
        <p className="mt-3">{description}</p>
      </SpotlightCard>
    </div>
  );
}

export default function AboutQuick() {
  const sectionRef = useRef(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion() || isMobile;
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(ABOUT_QUICK_SEEN_KEY) === "1";
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return undefined;
    }

    const sectionNode = sectionRef.current;
    if (!sectionNode) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          window.sessionStorage.setItem(ABOUT_QUICK_SEEN_KEY, "1");
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(sectionNode);

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const revealClass = prefersReducedMotion
    ? "opacity-100"
    : `transition-all duration-[600ms] ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`;

  return (
    <div className="relative overflow-visible">
      <SectionRadialGlow />

      <section
        ref={sectionRef}
        id="about"
        className="relative isolate w-full py-20 md:py-24"
      >
        <div className="container-wrapper relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className={revealClass}>
              <h2>About Me</h2>
              <div
                aria-hidden
                className="mt-3 h-1 w-14 rounded-full bg-accent/70"
              />

              <p className="mt-6 max-w-prose">
                I am a developer focused on shipping web experiences that feel
                fast, thoughtful, and dependable. I take pride in building
                interfaces that are not only visually polished but also intuitive
                and responsive. I enjoy working across the stack, from crafting
                seamless front-end interactions to designing reliable back-end
                systems. Turning ideas into maintainable products is something I
                genuinely value in every project I take on. My goal is to create
                solutions that users can trust and confidently rely on every day.
              </p>

              <p className="mt-6 max-w-prose">
                Beyond development, I'm constantly exploring new tools,
                frameworks, and best practices to refine my craft and stay ahead
                in a rapidly evolving tech landscape. I value clean architecture,
                scalable systems, and thoughtful user experiences that balance
                performance with simplicity. Collaboration and continuous learning
                drive me, whether I'm working independently or as part of a team.
              </p>

              <div className="mt-8 flex flex-col items-start gap-4 min-[570px]:flex-row min-[570px]:items-center min-[570px]:gap-8">
                <div className="flex items-center gap-3">
                  <MailIcon className="h-5 w-5 shrink-0 text-black dark:text-white" aria-hidden />
                  <a
                    href="mailto:you@example.com"
                    className="underline-offset-4 hover:underline"
                  >
                    angeleskiancharles@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <PinIcon className="h-5 w-5 shrink-0 text-black dark:text-white" aria-hidden />
                  <span>Angeles City, Pampanga</span>
                </div>
              </div>

              <a
                href={resume.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-8 inline-flex w-fit"
              >
                Download Resume
              </a>
            </div>

            <div className="hidden gap-6 sm:grid sm:grid-cols-2">
              {QUICK_CARDS.map(({ id, title, description, Icon }, index) => (
                <div
                  key={id}
                  className={revealClass}
                  style={
                    prefersReducedMotion
                      ? undefined
                      : { transitionDelay: `${index * 100}ms` }
                  }
                >
                  <SpotlightFeatureCard
                    id={id}
                    title={title}
                    description={description}
                    Icon={Icon}
                    isMobile={isMobile}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

