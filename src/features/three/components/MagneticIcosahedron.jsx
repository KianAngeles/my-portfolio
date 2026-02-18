import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const shockVertexShader = `
uniform float uTime;
uniform float uIntensity;
uniform float uFrequency;

float noise(vec3 p) {
  float n =
    sin(p.x * uFrequency + uTime * 0.85) *
    sin(p.y * (uFrequency * 1.17) + uTime * 0.72) *
    sin(p.z * (uFrequency * 1.09) + uTime * 0.61);
  return n;
}

void main() {
  vec3 displaced = position + normal * (noise(position) * uIntensity);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;

const shockFragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;

void main() {
  gl_FragColor = vec4(uColor, uOpacity);
}
`;

const MagneticIcosahedron = forwardRef(function MagneticIcosahedron(
  {
    radius = 2.2,
    detail = 1,
    shock = 0,
    reducedMotion = false,
    maxTilt = 0.35,
    baseEmissiveIntensity = 0.15,
    hoverEmissiveIntensity = 0.35,
    ...meshProps
  },
  forwardedRef
) {
  const groupRef = useRef(null);
  const meshRef = useRef(null);
  const baseMaterialRef = useRef(null);
  const shockMaterialRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const shockUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uFrequency: { value: 1.6 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color("#8FB5FF") },
    }),
    []
  );

  useImperativeHandle(forwardedRef, () => groupRef.current);
  useCursor(hovered);

  useFrame((state, delta) => {
    if (!groupRef.current || !baseMaterialRef.current || !shockMaterialRef.current) return;
    const reducedShock = reducedMotion ? shock * 0.3 : shock;

    const idleX = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.26) * 0.03;
    const idleY = reducedMotion ? 0 : Math.cos(state.clock.elapsedTime * 0.32) * 0.06;

    const targetRotX = hovered && !reducedMotion ? -pointerRef.current.y * maxTilt : idleX;
    const targetRotY = hovered && !reducedMotion ? pointerRef.current.x * maxTilt : idleY;

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      8,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      8,
      delta
    );

    const scaleTarget = (hovered && !reducedMotion ? 1.05 : 1) + reducedShock * 0.02;
    const nextScale = THREE.MathUtils.damp(groupRef.current.scale.x, scaleTarget, 8, delta);
    groupRef.current.scale.setScalar(nextScale);

    const intensityTarget =
      hovered && !reducedMotion ? hoverEmissiveIntensity : baseEmissiveIntensity;
    baseMaterialRef.current.emissiveIntensity = THREE.MathUtils.damp(
      baseMaterialRef.current.emissiveIntensity,
      intensityTarget + reducedShock * 0.25,
      8,
      delta
    );

    shockUniforms.uTime.value += delta;
    shockUniforms.uIntensity.value = THREE.MathUtils.damp(
      shockUniforms.uIntensity.value,
      reducedShock * 0.14,
      10,
      delta
    );
    shockUniforms.uOpacity.value = THREE.MathUtils.damp(
      shockUniforms.uOpacity.value,
      reducedShock * 0.4,
      10,
      delta
    );
  });

  return (
    <group ref={groupRef} {...meshProps}>
      <mesh
        ref={meshRef}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerMove={(event) => {
          event.stopPropagation();
          if (!meshRef.current) return;

          const localPoint = meshRef.current.worldToLocal(event.point.clone());
          pointerRef.current.x = THREE.MathUtils.clamp(localPoint.x / radius, -1, 1);
          pointerRef.current.y = THREE.MathUtils.clamp(localPoint.y / radius, -1, 1);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
          pointerRef.current.x = 0;
          pointerRef.current.y = 0;
        }}
      >
        <icosahedronGeometry args={[radius, detail]} />
        <meshStandardMaterial
          ref={baseMaterialRef}
          color="#ffffff"
          emissive="#7EA6FF"
          emissiveIntensity={baseEmissiveIntensity}
          wireframe
          transparent
          opacity={0.38}
        />
      </mesh>

      <mesh scale={1.004} raycast={() => null}>
        <icosahedronGeometry args={[radius, detail + 1]} />
        <shaderMaterial
          ref={shockMaterialRef}
          uniforms={shockUniforms}
          vertexShader={shockVertexShader}
          fragmentShader={shockFragmentShader}
          wireframe
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
});

export default MagneticIcosahedron;
