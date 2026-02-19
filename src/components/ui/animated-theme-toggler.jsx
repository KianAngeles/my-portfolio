import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

import { cn } from "@/lib/utils";

export const AnimatedThemeToggler = ({
  isDark: isDarkProp,
  onToggle,
  className,
  duration = 400,
  disableAnimationBelow,
  ...props
}) => {
  const [internalIsDark, setInternalIsDark] = useState(false);
  const [isBelowAnimationBreakpoint, setIsBelowAnimationBreakpoint] = useState(false);
  const buttonRef = useRef(null);
  const isControlled = typeof isDarkProp === "boolean";

  const isDark = useMemo(
    () => (isControlled ? isDarkProp : internalIsDark),
    [internalIsDark, isControlled, isDarkProp]
  );

  useEffect(() => {
    if (isControlled) return undefined;

    const updateTheme = () => {
      setInternalIsDark(document.body.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [isControlled]);

  useEffect(() => {
    if (typeof disableAnimationBelow !== "number" || disableAnimationBelow <= 0) {
      setIsBelowAnimationBreakpoint(false);
      return undefined;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${disableAnimationBelow}px)`);

    const updateMatch = () => {
      setIsBelowAnimationBreakpoint(mediaQuery.matches);
    };

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);

    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, [disableAnimationBelow]);

  const runToggle = useCallback(() => {
    if (onToggle) {
      flushSync(() => {
        onToggle();
      });
      return;
    }

    setInternalIsDark((prevIsDark) => {
      const nextIsDark = !prevIsDark;
      document.body.classList.toggle("dark", nextIsDark);
      localStorage.setItem("theme", nextIsDark ? "dark" : "light");
      return nextIsDark;
    });
  }, [onToggle]);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    if (isBelowAnimationBreakpoint || !document.startViewTransition) {
      runToggle();
      return;
    }

    await document.startViewTransition(() => {
      runToggle();
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    document.documentElement.animate({
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRadius}px at ${x}px ${y}px)`,
      ],
    }, {
      duration,
      easing: "ease-in-out",
      pseudoElement: "::view-transition-new(root)",
    });
  }, [duration, isBelowAnimationBreakpoint, runToggle]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(className)}
      {...props}>
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
