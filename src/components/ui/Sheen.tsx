import { motion } from "framer-motion";
import useIsMobile from "@/hooks/useIsMobile";
import { getMotionProps } from "@/utils/motion";

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
  const isMobile = useIsMobile();

  if (!active || reducedMotion || isMobile) return null;

  return (
    <motion.span
      {...getMotionProps(isMobile, {
        initial: { x: "-120%", opacity: 0 },
        animate: { x: "120%", opacity: [0, 0.55, 0] },
        transition: { duration, ease: "easeInOut" },
      })}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/80 ${className}`}
      onAnimationComplete={onComplete}
    />
  );
}
