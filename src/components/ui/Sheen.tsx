import { motion } from "framer-motion";

type SheenProps = {
  active: boolean;
  reducedMotion?: boolean;
  duration?: number;
  className?: string;
  onComplete?: () => void;
};

export default function Sheen({
  active,
  reducedMotion = false,
  duration = 0.7,
  className = "",
  onComplete,
}: SheenProps) {
  if (!active || reducedMotion) return null;

  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/80 ${className}`}
      initial={{ x: "-120%", opacity: 0 }}
      animate={{ x: "120%", opacity: [0, 0.55, 0] }}
      transition={{ duration, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    />
  );
}
