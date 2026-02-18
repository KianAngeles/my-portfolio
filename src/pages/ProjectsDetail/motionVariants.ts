const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type StaggerOptions = {
  delayChildren?: number;
  staggerChildren?: number;
};

type ItemOptions = {
  distance?: number;
  duration?: number;
  delay?: number;
};

export function containerStagger(
  reduceMotion: boolean,
  options: StaggerOptions = {},
) {
  const { delayChildren = 0.08, staggerChildren = 0.08 } = options;

  return {
    hidden: {},
    show: {
      transition: {
        delayChildren: reduceMotion ? 0.02 : delayChildren,
        staggerChildren: reduceMotion ? 0.04 : staggerChildren,
      },
    },
  };
}

export function itemFadeUp(
  reduceMotion: boolean,
  options: ItemOptions = {},
) {
  const { distance = 8, duration = 0.32, delay = 0 } = options;

  return {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : distance,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.18 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: EASE_OUT,
      },
    },
  };
}

export function itemSlideRight(
  reduceMotion: boolean,
  options: ItemOptions = {},
) {
  const { distance = 24, duration = 0.4, delay = 0 } = options;

  return {
    hidden: {
      opacity: 0,
      x: reduceMotion ? 0 : distance,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: reduceMotion ? 0.18 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: EASE_OUT,
      },
    },
  };
}

export function chipStagger(
  reduceMotion: boolean,
  options: StaggerOptions = {},
) {
  const { delayChildren = 0.05, staggerChildren = 0.06 } = options;

  return containerStagger(reduceMotion, { delayChildren, staggerChildren });
}

export function metaRowStagger(
  reduceMotion: boolean,
  options: StaggerOptions = {},
) {
  const { delayChildren = 0.72, staggerChildren = 0.1 } = options;

  return containerStagger(reduceMotion, { delayChildren, staggerChildren });
}
