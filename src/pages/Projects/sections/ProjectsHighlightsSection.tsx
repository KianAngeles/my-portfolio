import { featuredProjects } from "@/data/projects";
import SectionRadialGlowAlt from "@/components/ui/SectionRadialGlowAlt";
import { motion } from "framer-motion";
import useIsMobile from "@/hooks/useIsMobile";
import { getMotionProps } from "@/utils/motion";

type ProjectsHighlightsSectionProps = {
  shouldAnimateIntro: boolean;
  phaseDelay: number;
};

const rowVariants = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({
    opacity: 1,
    transition: {
      delayChildren: delay,
      staggerChildren: 0.1,
    },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function getUniqueStackCount() {
  const allStackItems = featuredProjects.flatMap((project) => project.stack);
  return new Set(allStackItems).size;
}

const HIGHLIGHTS = [
  {
    id: "projects",
    label: "Projects",
    value: `${featuredProjects.length}+`,
    glow: "from-cyan-400/20 via-blue-400/10 to-transparent",
  },
  {
    id: "stack",
    label: "Stack Tools",
    value: `${getUniqueStackCount()}+`,
    glow: "from-sky-400/20 via-indigo-400/10 to-transparent",
  },
  {
    id: "focus",
    label: "Current Focus",
    value: "Full-Stack",
    glow: "from-blue-400/20 via-cyan-400/10 to-transparent",
  },
];

export default function ProjectsHighlightsSection({
  shouldAnimateIntro,
  phaseDelay,
}: ProjectsHighlightsSectionProps) {
  const isMobile = useIsMobile();

  return (
    <section className="relative pt-0 pb-14 md:pb-16" aria-labelledby="projects-highlights-title">
      <SectionRadialGlowAlt />

      <div className="mx-auto max-w-6xl px-4">
        <h2 id="projects-highlights-title" className="sr-only">
          Project Highlights
        </h2>

        <motion.div
          {...getMotionProps(isMobile, {
            initial: shouldAnimateIntro ? "hidden" : false,
            animate: "show",
          })}
          className="grid gap-4 sm:grid-cols-3"
          variants={rowVariants}
          custom={phaseDelay}
        >
          {HIGHLIGHTS.map((item) => (
            <motion.article
              key={item.id}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/75 p-5 text-center shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] transition duration-300 ease-out hover:-translate-y-1 hover:border-blue-300/70 hover:bg-white/90 hover:shadow-[0_18px_40px_-20px_rgba(56,189,248,0.45)] focus-within:-translate-y-1 focus-within:border-blue-300/70 focus-within:bg-white/90 focus-within:shadow-[0_18px_40px_-20px_rgba(56,189,248,0.45)] dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-sky-300/35 dark:hover:bg-white/[0.06] dark:focus-within:border-sky-300/35 dark:focus-within:bg-white/[0.06] motion-reduce:transform-none"
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 ${item.glow}`}
              />
              <p className="relative text-3xl font-semibold tracking-tight text-black transition-colors duration-300 group-hover:text-blue-700 group-focus-within:text-blue-700 dark:text-white dark:group-hover:text-sky-200 dark:group-focus-within:text-sky-200">
                {item.value}
              </p>
              <p className="relative mt-2 text-sm text-slate-600 transition-colors duration-300 group-hover:text-slate-800 group-focus-within:text-slate-800 dark:text-white/65 dark:group-hover:text-white/85 dark:group-focus-within:text-white/85">
                {item.label}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
