import { useEffect, useRef } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (start, end, t) => start + (end - start) * t;
const smoothstep = (a, b, x) => {
  const u = clamp((x - a) / (b - a), 0, 1);
  return u * u * (3 - 2 * u);
};

const NAVY = { r: 11, g: 30, b: 58 };
const NAVY_LIGHT = { r: 17, g: 43, b: 82 };
const ACCENT_BLUE = { r: 37, g: 99, b: 235 }; // #2563EB

const createParticle = (width, height) => {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const homeJitter = 18;

  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    dvx: (Math.random() - 0.5) * 0.12,
    dvy: (Math.random() - 0.5) * 0.12,
    hx: x + (Math.random() * 2 - 1) * homeJitter,
    hy: y + (Math.random() * 2 - 1) * homeJitter,
    p1: Math.random() * Math.PI * 2,
    p2: Math.random() * Math.PI * 2,
    r: 0.9 + Math.random() * 3,
    a: 0.3 + Math.random() * 3,
  };
};

export default function InteractiveParticleBackground({
  className = "",
  particleCount = 50,
  interactionRadius = 120,
  springK = 0.012,
  coreRadius = 8,
  localDampingStrength = 0.006,
  globalDamping = 1.25,
  homeStrength = 0.00003,
  separationDistance = 10,
  separationStrength = 0.01,
  maxSpeed = 0.2,
  baseGlow = 6,
  glowBoost = 26,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const particlesRef = useRef([]);
  const affectedRef = useRef([]);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const mouseRef = useRef({
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const host = canvas.parentElement;
    if (!host) return undefined;

    particlesRef.current = [];

    const buildParticles = () => {
      const { width, height } = sizeRef.current;
      const count = Math.max(30, Math.min(280, Math.floor(particleCount)));
      particlesRef.current = Array.from({ length: count }, () => createParticle(width, height));
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const nextWidth = Math.max(1, rect.width);
      const nextHeight = Math.max(1, rect.height);
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);

      const prevWidth = sizeRef.current.width;
      const prevHeight = sizeRef.current.height;

      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;
      canvas.width = Math.floor(nextWidth * nextDpr);
      canvas.height = Math.floor(nextHeight * nextDpr);

      ctx.setTransform(nextDpr, 0, 0, nextDpr, 0, 0);
      sizeRef.current = { width: nextWidth, height: nextHeight, dpr: nextDpr };

      if (!particlesRef.current.length) {
        buildParticles();
        return;
      }

      if (prevWidth > 0 && prevHeight > 0) {
        const sx = nextWidth / prevWidth;
        const sy = nextHeight / prevHeight;
        for (const p of particlesRef.current) {
          p.x *= sx;
          p.y *= sy;
          p.hx *= sx;
          p.hy *= sy;
        }
      }
    };

    const updateMouse = (event) => {
      const rect = host.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const inside = localX >= 0 && localX <= rect.width && localY >= 0 && localY <= rect.height;
      const mouse = mouseRef.current;

      if (!inside) {
        mouse.active = false;
        mouse.vx *= 0.85;
        mouse.vy *= 0.85;
        mouse.speed = Math.hypot(mouse.vx, mouse.vy);
        return;
      }

      if (!mouse.active) {
        mouse.px = localX;
        mouse.py = localY;
      }

      const dx = localX - mouse.px;
      const dy = localY - mouse.py;

      mouse.x = localX;
      mouse.y = localY;
      mouse.px = localX;
      mouse.py = localY;
      mouse.vx = mouse.vx * 0.7 + dx * 0.3;
      mouse.vy = mouse.vy * 0.7 + dy * 0.3;
      mouse.speed = Math.hypot(mouse.vx, mouse.vy);
      mouse.active = true;
    };

    const clearMouse = () => {
      mouseRef.current.active = false;
    };

    const draw = () => {
      const { width, height } = sizeRef.current;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const affected = affectedRef.current;
      const radius = Math.max(1, interactionRadius);
      const radiusSq = radius * radius;
      const safeCoreRadius = Math.max(1, coreRadius);
      const safeSeparationDistance = Math.max(4, separationDistance);
      const separationDistanceSq = safeSeparationDistance * safeSeparationDistance;
      const now = performance.now();

      affected.length = 0;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        // Ambient drift + subtle wander keeps particles floating when idle.
        p.vx += p.dvx * 0.015;
        p.vy += p.dvy * 0.015;
        p.vx += Math.sin(now * 0.001 + p.p1) * 0.006;
        p.vy += Math.cos(now * 0.0012 + p.p2) * 0.006;

        let hoverT = 0;
        let physicalT = 0;
        let isAffected = false;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy + 0.000001;

          if (d2 < radiusSq) {
            const d = Math.sqrt(d2);
            const dNorm = clamp(d / radius, 0, 1);
            const falloff = (1 - dNorm) * (1 - dNorm);
            const forceScale = 0.55 + 0.45 * falloff;
            const centerLimiter = 0.35 + 0.65 * smoothstep(0, safeCoreRadius, d);
            const force = springK * forceScale * centerLimiter;

            // Spring acceleration on velocity creates lag, overshoot, and settle behavior.
            p.vx += dx * force;
            p.vy += dy * force;

            // Tiny near-center nudge prevents static equilibrium at the cursor.
            if (d < safeCoreRadius) {
              const nudge = (1 - d / safeCoreRadius) * 0.05;
              p.vx += Math.cos(now * 0.012 + p.p1) * nudge;
              p.vy += Math.sin(now * 0.01 + p.p2) * nudge;
            }

            physicalT = falloff;
            hoverT = 1 - dNorm;
            isAffected = true;
            affected.push(i);
          }
        }

        const damping = isAffected ? globalDamping : 0.870;
        p.vx *= damping;
        p.vy *= damping;

        if (isAffected) {
          // Local damping controls settling rate while preserving visible oscillation.
          const localDamp = 1 - localDampingStrength * physicalT;
          p.vx *= localDamp;
          p.vy *= localDamp;
        } else {
          // Apply home spring only outside interaction so it doesn't fight cursor pull.
          p.vx += (p.hx - p.x) * homeStrength;
          p.vy += (p.hy - p.y) * homeStrength;
        }

        p.interaction = hoverT;
      }

      // Subtle neighbor repulsion near cursor prevents single-dot stacking.
      for (let i = 0; i < affected.length; i += 1) {
        const p = particles[affected[i]];
        for (let j = i + 1; j < affected.length; j += 1) {
          const q = particles[affected[j]];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 <= 0 || d2 >= separationDistanceSq) continue;

          const d = Math.sqrt(d2);
          const nx = dx / d;
          const ny = dy / d;
          const push = (1 - d / safeSeparationDistance) * separationStrength;

          p.vx -= nx * push;
          p.vy -= ny * push;
          q.vx += nx * push;
          q.vy += ny * push;
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > maxSpeed) {
          const scale = maxSpeed / speed;
          p.vx *= scale;
          p.vy *= scale;
        }

        p.x += p.vx;
        p.y += p.vy;

        const margin = 20;
        if (p.x < -margin) p.x = width + margin;
        else if (p.x > width + margin) p.x = -margin;
        if (p.y < -margin) p.y = height + margin;
        else if (p.y > height + margin) p.y = -margin;

        const yT = clamp(p.y / Math.max(1, height), 0, 1);
        const baseR = Math.round(lerp(NAVY.r, NAVY_LIGHT.r, yT));
        const baseG = Math.round(lerp(NAVY.g, NAVY_LIGHT.g, yT));
        const baseB = Math.round(lerp(NAVY.b, NAVY_LIGHT.b, yT));

        let hoverT = 0;
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < radius) {
            hoverT = 1 - clamp(d / radius, 0, 1);
          }
        }

        const glowMix = 0.55 + 0.35 * hoverT;
        const glowR = Math.round(lerp(baseR, ACCENT_BLUE.r, glowMix));
        const glowG = Math.round(lerp(baseG, ACCENT_BLUE.g, glowMix));
        const glowB = Math.round(lerp(baseB, ACCENT_BLUE.b, glowMix));

        if (hoverT > 0) {
          const lightRadius = Math.min(70, 28 + 42 * hoverT);
          const lightAlpha = 0.06 + 0.16 * hoverT;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, lightRadius);
          grad.addColorStop(0, `rgba(${glowR},${glowG},${glowB},${lightAlpha})`);
          grad.addColorStop(1, `rgba(${baseR},${baseG},${baseB},0)`);

          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, lightRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        const clampedAlpha = clamp(p.a + 0.35 * hoverT, 0, 1);
        if (hoverT > 0) {
          ctx.shadowBlur = baseGlow + glowBoost * hoverT;
          ctx.shadowColor = `rgba(${glowR},${glowG},${glowB},${0.34 + hoverT * 0.22})`;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = `rgba(255,255,255,${clampedAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";

      mouse.vx *= 0.9;
      mouse.vy *= 0.9;
      mouse.speed = Math.hypot(mouse.vx, mouse.vy);

      rafRef.current = window.requestAnimationFrame(draw);
    };

    resize();
    draw();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", updateMouse, { passive: true });
    window.addEventListener("pointerdown", updateMouse, { passive: true });
    window.addEventListener("pointerleave", clearMouse);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updateMouse);
      window.removeEventListener("pointerdown", updateMouse);
      window.removeEventListener("pointerleave", clearMouse);
    };
  }, [
    coreRadius,
    globalDamping,
    baseGlow,
    glowBoost,
    homeStrength,
    interactionRadius,
    localDampingStrength,
    maxSpeed,
    particleCount,
    separationDistance,
    separationStrength,
    springK,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
