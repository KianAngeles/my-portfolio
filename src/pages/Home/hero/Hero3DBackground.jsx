import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { HeaderScene } from "@/features/three";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

export default function Hero3DBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [particleCount, setParticleCount] = useState(1500);

  useEffect(() => {
    let frameId = null;

    const calculateParticleCount = () => {
      const isMobile = window.innerWidth < 640;
      let count = isMobile ? 700 : 1500;

      if (
        typeof navigator !== "undefined" &&
        typeof navigator.hardwareConcurrency === "number" &&
        navigator.hardwareConcurrency <= 4
      ) {
        count = Math.floor(count * 0.7);
      }

      return count;
    };

    const updateCount = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => setParticleCount(calculateParticleCount()));
    };

    updateCount();
    window.addEventListener("resize", updateCount);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateCount);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 7], fov: 55 }}
        frameloop={prefersReducedMotion ? "demand" : "always"}
      >
        <ambientLight intensity={0.55} />
        <HeaderScene count={particleCount} reducedMotion={prefersReducedMotion} />
      </Canvas>
    </div>
  );
}
