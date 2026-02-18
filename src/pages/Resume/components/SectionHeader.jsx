import { motion } from "framer-motion";
import { fadeUp, lineDraw } from "../motionVariants";

const MotionIndex = motion.span;
const MotionTitle = motion.h2;
const MotionDivider = motion.span;

export default function SectionHeader({
  index,
  title,
  prefersReducedMotion = false,
}) {
  return (
    <header className="mb-5 flex items-center gap-3">
      <MotionIndex
        variants={fadeUp(prefersReducedMotion, 0, 6, 0.24)}
        className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-white/45"
      >
        {index}
      </MotionIndex>
      <MotionTitle
        variants={fadeUp(prefersReducedMotion, 0.12, 6, 0.28)}
        className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-white/65"
      >
        {title}
      </MotionTitle>
      <MotionDivider
        variants={lineDraw(prefersReducedMotion, 0.06, 0.4)}
        className="h-px flex-1 bg-slate-300/70 dark:bg-white/12"
        style={{ transformOrigin: "left" }}
      />
    </header>
  );
}
