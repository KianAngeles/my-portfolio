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
  },
  {
    id: "stack",
    label: "Stack Tools",
    value: `${getUniqueStackCount()}+`,
  },
  {
    id: "focus",
    label: "Current Focus",
    value: "Full-Stack",
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
              className="rounded-2xl border border-slate-200 bg-white/75 p-5 text-center dark:border-white/10 dark:bg-white/[0.03]"
            >
              <p className="text-3xl font-semibold tracking-tight text-black dark:text-white">{item.value}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-white/65">{item.label}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
