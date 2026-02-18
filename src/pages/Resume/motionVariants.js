export const EASE_OUT = [0.16, 1, 0.3, 1];

export function containerStagger(
  prefersReducedMotion = false,
  delayChildren = 0,
  staggerChildren = 0.1,
) {
  return {
    hidden: {},
    show: {
      transition: prefersReducedMotion
        ? {
            delayChildren: 0,
            staggerChildren: 0,
          }
        : {
            delayChildren,
            staggerChildren,
          },
    },
  };
}

export function fadeUp(
  prefersReducedMotion = false,
  delay = 0,
  y = 8,
  duration = 0.36,
) {
  return {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : y,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.18 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: EASE_OUT,
      },
    },
  };
}

export function lineDraw(
  prefersReducedMotion = false,
  delay = 0.08,
  duration = 0.42,
) {
  return {
    hidden: {
      opacity: prefersReducedMotion ? 0 : 1,
      scaleX: prefersReducedMotion ? 1 : 0,
    },
    show: {
      opacity: 1,
      scaleX: 1,
      transition: {
        duration: prefersReducedMotion ? 0.18 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: EASE_OUT,
      },
    },
  };
}

export function wipeReveal(
  prefersReducedMotion = false,
  delay = 0.08,
  duration = 0.46,
) {
  return {
    hidden: prefersReducedMotion
      ? {
          opacity: 0,
          y: 0,
        }
      : {
          opacity: 1,
          clipPath: "inset(0 100% 0 0)",
        },
    show: prefersReducedMotion
      ? {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.18,
            delay: 0,
            ease: EASE_OUT,
          },
        }
      : {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          transition: {
            duration,
            delay,
            ease: EASE_OUT,
          },
        },
  };
}
