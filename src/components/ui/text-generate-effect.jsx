import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/utils";

export function TextGenerateEffect({
  words = "",
  className,
  duration = 0.9,
  delay = 0,
}) {
  const tokens = useMemo(
    () => words.split(/\s+/).filter(Boolean),
    [words],
  );
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!tokens.length) return undefined;

    setVisibleCount(0);

    const totalMs = Math.max(350, Math.round(duration * 1000));
    const stepMs = Math.max(45, Math.round(totalMs / tokens.length));

    let intervalId = 0;
    const startTimer = window.setTimeout(() => {
      setVisibleCount(1);
      intervalId = window.setInterval(() => {
        setVisibleCount((count) => {
          if (count >= tokens.length) {
            window.clearInterval(intervalId);
            return count;
          }
          return count + 1;
        });
      }, stepMs);
    }, Math.max(0, delay));

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(intervalId);
    };
  }, [delay, duration, tokens]);

  return (
    <span className={cn("inline", className)}>
      {tokens.map((word, index) => {
        const visible = index < visibleCount;

        return (
          <span key={`${word}-${index}`} className="inline-block">
            <span
              className={cn(
                "inline-block transition-all duration-500 ease-out",
                visible
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-1 opacity-0 blur-[6px]",
              )}
            >
              {word}
            </span>
            {index < tokens.length - 1 ? "\u00A0" : null}
          </span>
        );
      })}
    </span>
  );
}
