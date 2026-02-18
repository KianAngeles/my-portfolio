import { featuredProjects } from "@/data/projects";
import SectionRadialGlow from "@/components/ui/SectionRadialGlow";
import { motion } from "framer-motion";

type ProjectsHeroProps = {
  shouldAnimateIntro: boolean;
  phaseDelay: number;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({
    opacity: 1,
    transition: {
      delayChildren: delay,
      staggerChildren: 0.1,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ProjectsHero({ shouldAnimateIntro, phaseDelay }: ProjectsHeroProps) {
  return (
    <section className="relative pt-28 pb-8 md:pt-32 md:pb-12" aria-labelledby="projects-hero-title">
      <SectionRadialGlow />

      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={containerVariants}
          custom={phaseDelay}
          initial={shouldAnimateIntro ? "hidden" : false}
          animate="show"
        >
          <motion.p
            variants={itemVariants}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 dark:text-white/60"
          >
            Portfolio Work
          </motion.p>
          <motion.h1
            id="projects-hero-title"
            variants={itemVariants}
            className="mt-4 text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl"
          >
            Projects
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-white/70 sm:text-base"
          >
            A focused look at products I have built across frontend, backend, and full-stack workflows.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-6 inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/20 dark:bg-white/5 dark:text-white/80"
          >
            {featuredProjects.length}+ projects in this archive
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
