import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import "./SoftSkillsGrid.css";

const SOFT_SKILLS = [
  {
    id: "adaptability",
    title: "Adaptability",
    paragraph:
      "I stay flexible under changing requirements without losing clarity or quality by responding quickly to feedback, adapting priorities without chaos, and protecting long-term maintainability.",
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    paragraph:
      "I isolate root causes, simplify constraints, and build practical solutions that last by debugging systematically, reducing complexity into parts, and validating with small iterations.",
  },
  {
    id: "collaboration",
    title: "Collaboration",
    paragraph:
      "I keep stakeholders aligned through clear updates and shared understanding by clarifying expectations early, communicating progress consistently, and listening before proposing solutions.",
  },
  {
    id: "patience",
    title: "Patience",
    paragraph:
      "I do not rush fragile solutions; quality comes from careful iteration and discipline by staying composed under pressure, improving details thoughtfully, and preferring stable, clean outcomes.",
  },
  {
    id: "time-management",
    title: "Time Management",
    paragraph:
      "I plan work with clear priorities and realistic pacing by breaking delivery into milestones, protecting focus for deep tasks, and finishing high-impact work on schedule.",
  },
  {
    id: "communication",
    title: "Communication",
    paragraph:
      "I keep communication direct and useful by sharing context early, giving concise status updates, and making decisions visible so teams can move confidently.",
  },
  {
    id: "ownership",
    title: "Ownership",
    paragraph:
      "I take responsibility from planning to release by closing feedback loops, fixing issues without delay, and ensuring outcomes are stable before handoff.",
  },
  {
    id: "decision-making",
    title: "Decision Making",
    paragraph:
      "I make decisions with both speed and care by weighing tradeoffs clearly, choosing practical paths forward, and revisiting assumptions when new data appears.",
  },
];

const TILE_TRANSITION = {
  duration: 0.28,
  ease: [0.16, 1, 0.3, 1],
};

export default function SoftSkillsGrid({
  introEnabled = false,
  introActive = true,
  introDelayMs = 0,
}) {
  const [activeId, setActiveId] = useState(null);
  const hasActive = activeId !== null;

  const toggleTile = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const onTileKeyDown = (event, id) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTile(id);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 shrink-0">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Soft Skills</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-white/65">The human strengths behind how I build and collaborate.</p>
      </div>

      <div className="soft-skills-scroll min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="soft-skills-grid grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
          {SOFT_SKILLS.map((skill, index) => {
            const isActive = activeId === skill.id;
            const isDimmed = hasActive && !isActive;
            const shouldHideForIntro = introEnabled && !introActive;
            const cascadeDelay = introEnabled && introActive ? introDelayMs / 1000 + index * 0.08 : 0;

            return (
              <motion.div
                key={skill.id}
                layout
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onClick={() => toggleTile(skill.id)}
                onKeyDown={(event) => onTileKeyDown(event, skill.id)}
                className={cn(
                  "group relative h-fit self-start cursor-pointer rounded-xl border border-slate-400 bg-transparent px-4 py-3 text-left outline-none transition-[opacity,transform,border-color,box-shadow] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-sky-300/60 dark:border-white/10 dark:bg-transparent",
                  isActive && "border-sky-300/40 dark:border-sky-300/30",
                  isDimmed ? "opacity-55 scale-[0.96]" : "opacity-100 scale-100"
                )}
                initial={introEnabled ? { opacity: 0, y: 14 } : false}
                animate={{
                  opacity: shouldHideForIntro ? 0 : 1,
                  y: shouldHideForIntro ? 14 : 0,
                }}
                whileHover={{
                  y: -3,
                  borderColor: "rgba(125, 211, 252, 0.3)",
                  boxShadow: "0 10px 24px rgba(2, 12, 32, 0.3)",
                }}
                transition={{
                  ...TILE_TRANSITION,
                  duration: 0.42,
                  delay: cascadeDelay,
                }}
              >
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{skill.title}</h4>

                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-3 border-t border-slate-200 pt-3 dark:border-white/12"
                    >
                      <p className="text-xs leading-relaxed text-slate-700 dark:text-white/78">{skill.paragraph}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
