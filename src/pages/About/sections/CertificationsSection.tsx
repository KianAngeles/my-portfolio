import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CardSwap, { Card } from "@/components/CardSwap";
import SectionRadialGlowAlt from "@/components/ui/SectionRadialGlowAlt";
import comptiaItfCertImage from "@/assets/images/certifications/Comptia-ITF-Cert.png";
import freeCodeCampBackendCertImage from "@/assets/images/certifications/freecodecamp-backend-development-apis-cert.png";
import freeCodeCampJsAlgoCertImage from "@/assets/images/certifications/freecodecamp-legacy-javascript-algo-datastruct-cert.png";
import freeCodeCampResponsiveCertImage from "@/assets/images/certifications/freecodecamp-legacy-responsive-web-design-cert.png";

const CERTIFICATIONS = [
  {
    id: "comptia-itf-plus",
    title: "CompTIA IT Fundamentals (ITF+)",
    issuer: "CompTIA",
    issued: "2023-11-23",
    credentialId: "COMP001022402258",
    summary:
      "Validates foundational knowledge in IT concepts, infrastructure, software development, database fundamentals, and security principles.",
    focusAreas: ["IT Fundamentals", "Infrastructure", "Security", "Databases"],
    track: "Foundational IT",
    link: "https://www.credly.com/badges/802dee08-e76a-4932-aeaa-36dbd246169e/public_url",
    image: comptiaItfCertImage,
  },
  {
    id: "freecodecamp-responsive-web-design",
    title: "Legacy Responsive Web Design V8",
    issuer: "freeCodeCamp",
    issued: "2024-09-05",
    credentialId: "responsive-web-design",
    summary:
      "Covers HTML, CSS, accessibility, responsive layouts, and foundational web development principles through hands-on projects.",
    focusAreas: ["HTML", "CSS", "Responsive Design"],
    track: "Frontend",
    link: "https://www.freecodecamp.org/certification/kianangeles/responsive-web-design",
    image: freeCodeCampResponsiveCertImage,
  },
  {
    id: "freecodecamp-backend-apis",
    title: "Back End Development and APIs V8",
    issuer: "freeCodeCamp",
    issued: "2025-09-27",
    credentialId: "back-end-development-and-apis",
    summary:
      "Covers Node.js, Express, RESTful API development, database integration, and backend architecture through project-based learning.",
    focusAreas: ["Node.js", "Express", "APIs", "Databases"],
    track: "Backend",
    link: "https://www.freecodecamp.org/certification/kianangeles/back-end-development-and-apis",
    image: freeCodeCampBackendCertImage,
  },
  {
    id: "freecodecamp-javascript-algorithms",
    title: "Legacy JavaScript Algorithms and Data Structures V7",
    issuer: "freeCodeCamp",
    issued: "2025-09-25",
    credentialId: "javascript-algorithms-and-data-structures",
    summary:
      "Covers core JavaScript concepts, algorithmic problem solving, data structures, and foundational programming logic through structured challenges.",
    focusAreas: ["JavaScript", "Algorithms", "Data Structures"],
    track: "Programming",
    link: "https://www.freecodecamp.org/certification/kianangeles/javascript-algorithms-and-data-structures",
    image: freeCodeCampJsAlgoCertImage,
  },
];

const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const STACK_ENTRY_X = [-12, 0, 12, -8];
const STACK_ENTRY_Y = [24, 20, 26, 22];
const STACK_ENTRY_ROTATION = [-3, 0, 3, -2];

function createFadeUpItemVariants(prefersReducedMotion: boolean) {
  return {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 8,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.18 : 0.34,
        ease: REVEAL_EASE,
      },
    },
  };
}

function createStaggerContainerVariants(
  delayChildren: number,
  staggerChildren: number,
  prefersReducedMotion: boolean,
) {
  return {
    hidden: {},
    show: {
      transition: prefersReducedMotion
        ? { delayChildren: 0, staggerChildren: 0 }
        : { delayChildren, staggerChildren },
    },
  };
}

function createStackLayerVariants(prefersReducedMotion: boolean) {
  return {
    hidden: (index: number) => ({
      opacity: 0,
      y: prefersReducedMotion ? 0 : STACK_ENTRY_Y[index % STACK_ENTRY_Y.length],
      x: prefersReducedMotion ? 0 : STACK_ENTRY_X[index % STACK_ENTRY_X.length],
      rotateZ: prefersReducedMotion ? 0 : STACK_ENTRY_ROTATION[index % STACK_ENTRY_ROTATION.length],
      scale: prefersReducedMotion ? 1 : 0.98,
    }),
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      rotateZ: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.18 : 0.42,
        ease: REVEAL_EASE,
      },
    },
  };
}

export default function CertificationsSection() {
  const prefersReducedMotion = !!useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualAdvanceSignal, setManualAdvanceSignal] = useState(0);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const activeCertification = CERTIFICATIONS[activeIndex] ?? CERTIFICATIONS[0];

  const fadeUpItemVariants = useMemo(
    () => createFadeUpItemVariants(prefersReducedMotion),
    [prefersReducedMotion],
  );
  const headerContainerVariants = useMemo(
    () => createStaggerContainerVariants(0, 0.1, prefersReducedMotion),
    [prefersReducedMotion],
  );
  const stackContainerVariants = useMemo(
    () => createStaggerContainerVariants(0.35, 0.12, prefersReducedMotion),
    [prefersReducedMotion],
  );
  const panelRevealContainerVariants = useMemo(
    () => createStaggerContainerVariants(0.85, 0.1, prefersReducedMotion),
    [prefersReducedMotion],
  );
  const stackLayerVariants = useMemo(
    () => createStackLayerVariants(prefersReducedMotion),
    [prefersReducedMotion],
  );
  const topCardPulseAnimation = useMemo(() => {
    if (!hasEnteredView || prefersReducedMotion) return undefined;

    return {
      boxShadow: [
        "0 12px 26px -20px rgba(15, 23, 42, 0.26)",
        "0 22px 42px -18px rgba(59, 130, 246, 0.36)",
        "0 12px 26px -20px rgba(15, 23, 42, 0.26)",
      ],
      transition: {
        delay: 0.9,
        duration: 0.18,
        times: [0, 0.5, 1],
        ease: "easeInOut",
      },
    };
  }, [hasEnteredView, prefersReducedMotion]);

  const handleNextCertificate = () => {
    setManualAdvanceSignal((signal) => signal + 1);
  };

  return (
    <motion.section
      className="relative pt-0 pb-20 md:pb-28"
      aria-labelledby="certifications-title"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      onViewportEnter={() => {
        setHasEnteredView(true);
      }}
    >
      <SectionRadialGlowAlt />

      <div className="mx-auto max-w-6xl px-4">
        <motion.header
          className="mx-auto max-w-3xl text-center"
          variants={headerContainerVariants}
        >
          <motion.p variants={fadeUpItemVariants} className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:text-white/60">
            Credentials
          </motion.p>
          <motion.h2
            variants={fadeUpItemVariants}
            id="certifications-title"
            className="mt-4 text-3xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl"
          >
            Certifications
          </motion.h2>
          <motion.p variants={fadeUpItemVariants} className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-white/65 sm:text-base">
            Verified learning milestones that support how I design, build, and
            ship reliable software.
          </motion.p>
          <motion.span
            variants={fadeUpItemVariants}
            className="mx-auto mt-5 block h-px w-14 bg-gradient-to-r from-transparent via-accent/70 to-transparent"
          />
        </motion.header>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <motion.article
            className="rounded-3xl p-6 text-slate-900 dark:text-white sm:p-7"
            variants={panelRevealContainerVariants}
          >
            <motion.p variants={fadeUpItemVariants} className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-200/75">
              {activeCertification.track}
            </motion.p>
            <motion.h3 variants={fadeUpItemVariants} className="mt-3 text-2xl font-semibold leading-tight">
              {activeCertification.title}
            </motion.h3>
            <motion.p variants={fadeUpItemVariants} className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-white/78">
              {activeCertification.summary}
            </motion.p>

            <motion.div variants={fadeUpItemVariants} className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/[0.02]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-white/55">
                  Issuer
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-white/88">
                  {activeCertification.issuer}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/[0.02]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-white/55">
                  Issued
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-white/88">
                  {activeCertification.issued}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/75 p-3 sm:col-span-2 dark:border-white/10 dark:bg-white/[0.02]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-white/55">
                  Credential ID
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-white/88">
                  {activeCertification.credentialId}
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUpItemVariants}
              className="mt-4 rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/[0.02]"
            >
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-white/55">
                Focus Areas
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-white/88">
                {activeCertification.focusAreas.join(" | ")}
              </p>
            </motion.div>

            <motion.div variants={fadeUpItemVariants} className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={activeCertification.link}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex items-center px-4 py-2 text-sm"
              >
                View Certificate
              </a>
              <button
                type="button"
                onClick={handleNextCertificate}
                className="btn-primary inline-flex items-center px-4 py-2 text-sm"
              >
                Next
              </button>
            </motion.div>
          </motion.article>

          <motion.div
            className="relative min-h-[540px] overflow-visible rounded-3xl"
            style={{ perspective: 1200 }}
            variants={stackContainerVariants}
          >
            <CardSwap
              width={410}
              height={250}
              cardDistance={44}
              verticalDistance={32}
              delay={5200}
              pauseOnHover={true}
              easing="smooth"
              onCardClick={setActiveIndex}
              onActiveCardChange={setActiveIndex}
              manualAdvanceSignal={manualAdvanceSignal}
              containerClassName="!bottom-1/2 !right-12 !translate-x-0 !translate-y-1/2 !origin-right max-[900px]:!right-6 max-[768px]:!right-3 max-[768px]:!translate-x-0 max-[768px]:!translate-y-1/2 max-[480px]:!right-2 max-[480px]:!translate-x-0 max-[480px]:!translate-y-1/2"
            >
              {CERTIFICATIONS.map((certification, index) => (
                <Card
                  key={certification.id}
                  customClass="!border-0 !bg-transparent !p-0 !shadow-none !backdrop-blur-none overflow-hidden"
                >
                  <motion.div
                    className="h-full w-full"
                    variants={stackLayerVariants}
                    custom={index}
                  >
                    <motion.div
                      className="h-full w-full rounded-[inherit]"
                      animate={index === 0 ? topCardPulseAnimation : undefined}
                    >
                      <img
                        src={certification.image}
                        alt={`${certification.title} preview`}
                        className="h-full w-full object-contain object-center"
                      />
                    </motion.div>
                  </motion.div>
                </Card>
              ))}
            </CardSwap>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}


