import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "../materials/RippleIcoMaterial";

const RippleIcosahedron = forwardRef(function RippleIcosahedron(
  {
    radius = 1.45,
    detail = 9,
    color = "#F5F8FF",
    frequency = 1.4,
    baseIntensity = 0.02,
    hoverIntensity = 0.22,
    shock = 0,
    reducedMotion = false,
    ...meshProps
  },
  forwardedRef
) {
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const overlayMaterialRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const shockTint = useMemo(() => new THREE.Color("#9ABEFF"), []);
  const colorTargetRef = useRef(new THREE.Color(color));

  useImperativeHandle(forwardedRef, () => meshRef.current);
  useCursor(hovered);

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    const reducedShock = reducedMotion ? shock * 0.3 : shock;

    if (!reducedMotion) {
      materialRef.current.uTime += delta;
    }

    const targetIntensity = (hovered ? hoverIntensity : baseIntensity) + reducedShock * 0.18;
    materialRef.current.uIntensity = THREE.MathUtils.lerp(
      materialRef.current.uIntensity,
      targetIntensity,
      0.08
    );

    colorTargetRef.current.copy(baseColor).lerp(shockTint, reducedShock * 0.35);
    materialRef.current.uColor.lerp(colorTargetRef.current, 0.12);

    const targetScale = (hovered ? 1.03 : 1) + reducedShock * 0.015;
    const nextScale = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08);
    meshRef.current.scale.setScalar(nextScale);

    if (overlayMaterialRef.current) {
      const targetOpacity = reducedShock * 0.26;
      overlayMaterialRef.current.opacity = THREE.MathUtils.lerp(
        overlayMaterialRef.current.opacity,
        targetOpacity,
        0.12
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      {...meshProps}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered(false);
      }}
    >
      <icosahedronGeometry args={[radius, detail]} />
      <rippleIcoMaterial
        ref={materialRef}
        key="ripple-ico-material"
        uFrequency={frequency}
        uIntensity={baseIntensity}
        uColor={baseColor.clone()}
      />
      <mesh scale={1.005} raycast={() => null}>
        <icosahedronGeometry args={[radius, detail]} />
        <meshBasicMaterial
          ref={overlayMaterialRef}
          color="#9ABEFF"
          transparent
          opacity={0}
          wireframe
          depthWrite={false}
        />
      </mesh>
    </mesh>
  );
});

export default RippleIcosahedron;
