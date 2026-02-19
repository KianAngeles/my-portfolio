import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { featuredProjects as projects } from "@/data/projects";
import SectionRadialGlowAlt from "@/components/ui/SectionRadialGlowAlt";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

type FeaturedProjectProps = {
  shouldAnimateIntro: boolean;
  phaseDelay: number;
};

const sectionVariants = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({
    opacity: 1,
    transition: {
      delayChildren: delay,
      staggerChildren: 0.12,
    },
  }),
};

const columnVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const contentItemVariants = {
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

function getFeaturedLinqly() {
  return (
    projects.find((project) => {
      const name = String(project.title ?? project.name ?? "").trim().toLowerCase();
      return name === "linqly";
    }) ?? null
  );
}

function getFeatureBullets(project: any) {
  const stack = Array.isArray(project.tech)
    ? project.tech
    : Array.isArray(project.stack)
      ? project.stack
      : [];
  const description = String(project.description ?? "").toLowerCase();
  const bullets: string[] = [];

  if (stack.some((item: string) => /react|vue|angular|next/i.test(item))) {
    bullets.push("Modern frontend workflow built for fast iteration.");
  }
  if (stack.some((item: string) => /node|express|mongo|mysql|php/i.test(item))) {
    bullets.push("Full-stack architecture connecting UI, API, and database.");
  }
  if (
    stack.some((item: string) => /socket|realtime|real-time/i.test(item)) ||
    /real-time/.test(description)
  ) {
    bullets.push("Realtime messaging patterns for responsive user conversations.");
  }
  if (stack.some((item: string) => /jwt|auth/i.test(item)) || /auth/.test(description)) {
    bullets.push("Authentication-ready flow for secure user sessions.");
  }

  const fallback = [
    "Full-stack workflow from UI interactions to backend services.",
    "Production-focused implementation with scalable patterns.",
    "Responsive experience tuned for desktop and mobile usage.",
  ];

  return [...bullets, ...fallback].slice(0, 3);
}

export default function FeaturedProject({ shouldAnimateIntro, phaseDelay }: FeaturedProjectProps) {
  const project = getFeaturedLinqly();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!project) return null;

  const stack = Array.isArray(project.tech)
    ? project.tech
    : Array.isArray(project.stack)
      ? project.stack
      : [];
  const featureBullets = getFeatureBullets(project);
  const liveHref = project.liveUrl ?? project.demoHref ?? null;
  const repoHref = project.repoUrl ?? project.sourceHref ?? null;

  return (
    <section className="relative pt-0 pb-14 md:pb-16" aria-labelledby="featured-project-title">
      <SectionRadialGlowAlt />

      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          className="overflow-hidden rounded-3xl border border-slate-300/70 bg-white/75 p-6 shadow-[0_14px_50px_rgba(2,6,23,0.06)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_18px_55px_rgba(148,163,184,0.07)] sm:p-8"
          variants={sectionVariants}
          custom={phaseDelay}
          initial={shouldAnimateIntro ? "hidden" : false}
          animate="show"
        >
          <motion.div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center" variants={sectionVariants}>
            <motion.div variants={columnVariants}>
              <motion.div variants={contentVariants}>
                <motion.p
                  variants={contentItemVariants}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-white/62"
                >
                  Featured Project
                </motion.p>

                <motion.h2
                  id="featured-project-title"
                  variants={contentItemVariants}
                  className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
                >
                  {project.title}
                </motion.h2>

                <motion.p
                  variants={contentItemVariants}
                  className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-white/75 sm:text-base"
                >
                  {project.description} Designed to feel quick, clear, and production-ready for real user workflows.
                </motion.p>

                <motion.div variants={contentItemVariants} className="mt-6 flex flex-wrap gap-2">
                  {stack.map((item: string) => (
                    <span
                      key={`linqly-tech-${item}`}
                      className="inline-flex items-center rounded-full border border-slate-300/70 bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/85"
                    >
                      {item}
                    </span>
                  ))}
                </motion.div>

                {(liveHref || repoHref) && (
                  <motion.div variants={contentItemVariants} className="mt-6 flex flex-wrap items-center gap-3">
                    {liveHref ? (
                      <a
                        href={liveHref}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary inline-flex h-10 items-center px-4 text-sm"
                      >
                        Live Demo
                      </a>
                    ) : null}

                    {repoHref ? (
                      <a
                        href={repoHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center rounded-md border border-slate-300/80 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-accent hover:text-accent dark:border-white/20 dark:bg-white/[0.05] dark:text-white dark:hover:border-accent dark:hover:text-accent"
                      >
                        View Code
                      </a>
                    ) : null}
                  </motion.div>
                )}

                <motion.ul variants={contentItemVariants} className="mt-6 space-y-2">
                  {featureBullets.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700 dark:text-white/72">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </motion.ul>

                <motion.div variants={contentItemVariants} className="mt-6">
                  <Link
                    to={project.projectHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-accent dark:text-white dark:hover:text-accent"
                  >
                    Explore Project
                    <span aria-hidden>&rarr;</span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div variants={columnVariants} className="group [perspective:1100px]">
              <motion.div
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : {
                        y: -3,
                        rotateX: 1,
                        rotateY: -1,
                      }
                }
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-2xl border border-slate-300/70 bg-slate-950/10 shadow-[0_12px_30px_rgba(2,6,23,0.12)] dark:border-white/10 dark:bg-white/[0.03]"
              >
                {project.preview ? (
                  <img
                    src={project.preview}
                    alt={`${project.title} project preview`}
                    className="aspect-[16/10] w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                ) : (
                  <div className="aspect-[16/10] w-full bg-gradient-to-br from-sky-500/20 via-blue-500/10 to-transparent" />
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#02061790] via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-sm font-semibold text-white">{project.title}</p>
                  <p className="mt-1 text-xs text-white/80">Realtime messaging platform</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
