const MOBILE_MOTION_KEYS = new Set([
  "initial",
  "animate",
  "exit",
  "transition",
  "whileHover",
  "whileTap",
  "whileInView",
  "viewport",
]);

export function getMotionProps(isMobile, props = {}) {
  if (!props || typeof props !== "object") return {};
  if (!isMobile) return props;

  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !MOBILE_MOTION_KEYS.has(key)),
  );
}

