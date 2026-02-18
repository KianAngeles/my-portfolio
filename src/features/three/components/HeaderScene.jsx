import { useMemo, useRef, useState } from "react";
import { PointMaterial, Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import MagneticIcosahedron from "./MagneticIcosahedron";
import RippleIcosahedron from "./RippleIcosahedron";

const INTRO_DURATION = 2.5;
const PRIMARY_START = [0.3, 0.35, -5.2];
const PRIMARY_TARGET = [2.3, 1.0, -4.6];
const SECONDARY_START = [-0.3, -0.45, -6.9];
const SECONDARY_TARGET = [-2.0, -1.6, -7.2];
const PRIMARY_X_BOUNDS = { min: -0.4, max: 2.7 };
const SECONDARY_X_BOUNDS = { min: -2.3, max: 0.4 };
const CLASH_DISTANCE = 3.9;
const CLASH_COOLDOWN_SEC = 1.1;

function createPositions(count) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = THREE.MathUtils.randFloatSpread(20);
    positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(12);
    positions[i * 3 + 2] = THREE.MathUtils.randFloat(-12, 6);
  }

  return positions;
}

export default function HeaderScene({ count = 1500, reducedMotion = false }) {
  const groupRef = useRef(null);
  const normalIcoRef = useRef(null);
  const rippleIcoRef = useRef(null);
  const [shock, setShock] = useState(0);
  const shockRef = useRef(0);
  const shockStateRef = useRef(0);
  const lastShockTimeRef = useRef(-Infinity);
  const normalWorldPos = useMemo(() => new THREE.Vector3(), []);
  const rippleWorldPos = useMemo(() => new THREE.Vector3(), []);

  const whitePositions = useMemo(() => createPositions(count), [count]);
  const accentCount = Math.max(50, Math.floor(count * 0.12));
  const accentPositions = useMemo(() => createPositions(accentCount), [accentCount]);

  useFrame((state, delta) => {
    const introProgress = reducedMotion
      ? 1
      : Math.min(state.clock.elapsedTime / INTRO_DURATION, 1);
    const introEase = 1 - (1 - introProgress) ** 3;

    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.02;
      groupRef.current.rotation.x += delta * 0.004;

      const targetX = state.pointer.x * 0.14;
      const targetY = state.pointer.y * 0.1;
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.03
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.03
      );
      groupRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.5;
    }

    if (normalIcoRef.current) {
      normalIcoRef.current.position.set(
        THREE.MathUtils.lerp(PRIMARY_START[0], PRIMARY_TARGET[0], introEase),
        THREE.MathUtils.lerp(PRIMARY_START[1], PRIMARY_TARGET[1], introEase),
        THREE.MathUtils.lerp(PRIMARY_START[2], PRIMARY_TARGET[2], introEase)
      );
      normalIcoRef.current.position.x = THREE.MathUtils.clamp(
        normalIcoRef.current.position.x,
        PRIMARY_X_BOUNDS.min,
        PRIMARY_X_BOUNDS.max
      );
    }

    if (rippleIcoRef.current) {
      rippleIcoRef.current.position.set(
        THREE.MathUtils.lerp(SECONDARY_START[0], SECONDARY_TARGET[0], introEase),
        THREE.MathUtils.lerp(SECONDARY_START[1], SECONDARY_TARGET[1], introEase),
        THREE.MathUtils.lerp(SECONDARY_START[2], SECONDARY_TARGET[2], introEase)
      );
      rippleIcoRef.current.position.x = THREE.MathUtils.clamp(
        rippleIcoRef.current.position.x,
        SECONDARY_X_BOUNDS.min,
        SECONDARY_X_BOUNDS.max
      );

      if (!reducedMotion) {
        rippleIcoRef.current.rotation.y -= delta * 0.03;
        rippleIcoRef.current.rotation.x += delta * 0.012;
      }
    }

    shockRef.current = THREE.MathUtils.damp(
      shockRef.current,
      0,
      reducedMotion ? 8 : 6,
      delta
    );

    if (normalIcoRef.current && rippleIcoRef.current) {
      normalIcoRef.current.getWorldPosition(normalWorldPos);
      rippleIcoRef.current.getWorldPosition(rippleWorldPos);
      const distance = normalWorldPos.distanceTo(rippleWorldPos);

      if (
        distance <= CLASH_DISTANCE &&
        state.clock.elapsedTime - lastShockTimeRef.current >= CLASH_COOLDOWN_SEC
      ) {
        shockRef.current = reducedMotion ? 0.3 : 1;
        lastShockTimeRef.current = state.clock.elapsedTime;
      }
    }

    if (Math.abs(shockRef.current - shockStateRef.current) > 0.002) {
      shockStateRef.current = shockRef.current;
      setShock(shockRef.current);
    }
  });

  return (
    <group ref={groupRef}>
      <Points positions={whitePositions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#ffffff"
          opacity={0.28}
          size={0.022}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <Points positions={accentPositions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#2563EB"
          opacity={0.2}
          size={0.026}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <MagneticIcosahedron
        ref={normalIcoRef}
        position={PRIMARY_START}
        rotation={[0.45, 0.25, 0]}
        radius={2.2}
        detail={1}
        shock={shock}
        reducedMotion={reducedMotion}
      />

      <RippleIcosahedron
        ref={rippleIcoRef}
        position={SECONDARY_START}
        rotation={[0.2, -0.5, 0]}
        color="#ffffff"
        radius={1.45}
        detail={10}
        frequency={1.35}
        baseIntensity={0.018}
        hoverIntensity={0.24}
        shock={shock}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}
