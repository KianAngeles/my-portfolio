import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const OVERLAY_Z_INDEX = 2147483647;

export function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  children,
}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const viewportRef = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const syncCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      viewportRef.current = { width, height, dpr };
    };

    syncCanvasSize();
    window.addEventListener("resize", syncCanvasSize);

    return () => {
      window.removeEventListener("resize", syncCanvasSize);
    };
  }, []);

  const applyEasing = useCallback(
    (value) => {
      switch (easing) {
        case "linear":
          return value;
        case "ease-in":
          return value * value;
        case "ease-in-out":
          return value < 0.5 ? 2 * value * value : (4 - 2 * value) * value - 1;
        default:
          return value * (2 - value);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frameId;

    const drawFrame = (timestamp) => {
      const { width, height } = viewportRef.current;

      context.clearRect(0, 0, width, height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = applyEasing(elapsed / duration);
        const distance = progress * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - progress);

        const startX = spark.x + distance * Math.cos(spark.angle);
        const startY = spark.y + distance * Math.sin(spark.angle);
        const endX = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const endY = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        context.strokeStyle = sparkColor;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();

        return true;
      });

      frameId = requestAnimationFrame(drawFrame);
    };

    frameId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(frameId);
  }, [
    applyEasing,
    duration,
    extraScale,
    sparkColor,
    sparkCount,
    sparkRadius,
    sparkSize,
  ]);

  return (
    <div
      style={{ width: "100%", height: "100%", position: "relative" }}
      onClick={(event) => {
        const now = performance.now();

        const newSparks = Array.from({ length: sparkCount }, (_, index) => ({
          x: event.clientX,
          y: event.clientY,
          angle: (2 * Math.PI * index) / sparkCount,
          startTime: now,
        }));

        sparksRef.current.push(...newSparks);
      }}
    >
      {typeof document !== "undefined"
        ? createPortal(
            <canvas
              ref={canvasRef}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: OVERLAY_Z_INDEX,
                pointerEvents: "none",
              }}
            />,
            document.body
          )
        : null}
      {children}
    </div>
  );
}

export function SpotlightCard({
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.25)",
  children,
}) {
  const cardRef = useRef(null);
  const [spotlight, setSpotlight] = useState({
    x: "50%",
    y: "50%",
    opacity: 0,
  });

  const handlePointerMove = (event) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setSpotlight({
      x: `${x}px`,
      y: `${y}px`,
      opacity: 1,
    });
  };

  const showSpotlight = () => {
    setSpotlight((prev) => ({ ...prev, opacity: 1 }));
  };

  const hideSpotlight = () => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`.trim()}
      onMouseMove={handlePointerMove}
      onMouseEnter={showSpotlight}
      onMouseLeave={hideSpotlight}
      onFocusCapture={showSpotlight}
      onBlurCapture={hideSpotlight}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(220px circle at ${spotlight.x} ${spotlight.y}, ${spotlightColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default {
  ClickSpark,
  SpotlightCard,
};
