import { Children } from "react";
import { cn } from "@/lib/utils";

export function OrbitingCircles({
  children,
  radius = 140,
  reverse = false,
  duration = 24,
  iconSize = 44,
  className,
}) {
  const items = Children.toArray(children);
  const count = Math.max(items.length, 1);

  return (
    <div className={cn("pointer-events-none absolute left-1/2 top-1/2", className)} aria-hidden="true">
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "absolute left-1/2 top-1/2 pointer-events-auto inline-flex items-center justify-center",
            reverse
              ? "animate-[orbit-path-reverse_linear_infinite]"
              : "animate-[orbit-path_linear_infinite]"
          )}
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            marginLeft: `${-iconSize / 2}px`,
            marginTop: `${-iconSize / 2}px`,
            animationDuration: `${duration}s`,
            animationDelay: `-${(duration * index) / count}s`,
            offsetPath: `circle(${radius}px at 50% 50%)`,
            offsetRotate: "0deg",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
