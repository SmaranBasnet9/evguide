"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Stylised low-poly car ────────────────────────────────────────────────────

function StyledCar({
  color,
  position,
  yOffset = 0,
  facingSign = 1,       // 1 = slight left-turn, -1 = slight right-turn
  floatSpeed = 0.5,
  floatOffset = 0,
}: {
  color: string;
  position: [number, number, number];
  yOffset?: number;
  facingSign?: number;
  floatSpeed?: number;
  floatOffset?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * floatSpeed + floatOffset) * 0.1;
    // Gentle slow rotation around y-axis
    groupRef.current.rotation.y = facingSign * (0.38 + Math.sin(t * 0.18 + floatOffset) * 0.06);
  });

  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.25,
        metalness: 0.75,
        roughness: 0.25,
      }),
    [color],
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.55,
        metalness: 0.1,
        roughness: 0.05,
        transparent: true,
        opacity: 0.45,
      }),
    [color],
  );

  const wheelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1a1a",
        metalness: 0.7,
        roughness: 0.35,
      }),
    [],
  );

  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#888888",
        metalness: 0.9,
        roughness: 0.1,
      }),
    [],
  );

  const lightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 4,
      }),
    [],
  );

  const tailMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ff3322",
        emissive: "#ff1100",
        emissiveIntensity: 2.5,
      }),
    [],
  );

  // Wheel positions [x, z]
  const wheelPos: [number, number][] = [
    [0.88, 0.55],
    [0.88, -0.55],
    [-0.82, 0.55],
    [-0.82, -0.55],
  ];

  return (
    <group ref={groupRef} position={position}>
      {/* ── Body ── */}
      <mesh material={bodyMat} position={[0, 0.22, 0]}>
        <boxGeometry args={[2.55, 0.52, 1.08]} />
      </mesh>

      {/* ── Cabin / roof ── */}
      <mesh material={bodyMat} position={[0.06, 0.62, 0]}>
        <boxGeometry args={[1.45, 0.38, 0.9]} />
      </mesh>

      {/* ── Hood (sloped box) ── */}
      <mesh material={bodyMat} position={[1.0, 0.35, 0]} rotation={[0, 0, -0.28]}>
        <boxGeometry args={[0.52, 0.08, 1.0]} />
      </mesh>

      {/* ── Boot/trunk (sloped box) ── */}
      <mesh material={bodyMat} position={[-0.98, 0.35, 0]} rotation={[0, 0, 0.28]}>
        <boxGeometry args={[0.52, 0.08, 1.0]} />
      </mesh>

      {/* ── Front glass ── */}
      <mesh material={glassMat} position={[0.76, 0.58, 0]} rotation={[0, 0, 0.62]}>
        <boxGeometry args={[0.55, 0.04, 0.82]} />
      </mesh>

      {/* ── Rear glass ── */}
      <mesh material={glassMat} position={[-0.72, 0.58, 0]} rotation={[0, 0, -0.62]}>
        <boxGeometry args={[0.55, 0.04, 0.82]} />
      </mesh>

      {/* ── Side windows ── */}
      <mesh material={glassMat} position={[0.06, 0.63, 0.46]}>
        <boxGeometry args={[1.3, 0.32, 0.04]} />
      </mesh>
      <mesh material={glassMat} position={[0.06, 0.63, -0.46]}>
        <boxGeometry args={[1.3, 0.32, 0.04]} />
      </mesh>

      {/* ── Wheels ── */}
      {wheelPos.map(([wx, wz], i) => (
        <group key={i} position={[wx, -0.1, wz]}>
          {/* Tyre */}
          <mesh material={wheelMat} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.1, 8, 14]} />
          </mesh>
          {/* Rim */}
          <mesh material={rimMat} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.22, 8]} />
          </mesh>
        </group>
      ))}

      {/* ── Headlights ── */}
      <mesh material={lightMat} position={[1.29, 0.24, 0.36]}>
        <sphereGeometry args={[0.07, 7, 7]} />
      </mesh>
      <mesh material={lightMat} position={[1.29, 0.24, -0.36]}>
        <sphereGeometry args={[0.07, 7, 7]} />
      </mesh>

      {/* ── Tail lights ── */}
      <mesh material={tailMat} position={[-1.29, 0.24, 0.36]}>
        <boxGeometry args={[0.04, 0.12, 0.28]} />
      </mesh>
      <mesh material={tailMat} position={[-1.29, 0.24, -0.36]}>
        <boxGeometry args={[0.04, 0.12, 0.28]} />
      </mesh>

      {/* ── Ground reflection glow ── */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.08}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── Scene ────────────────────────────────────────────────────────────────────

function Scene({
  colorA,
  colorB,
  separationX,
}: {
  colorA: string;
  colorB: string;
  separationX: number;
}) {
  return (
    <>
      <ambientLight intensity={0.08} />
      {/* Per-car key lights */}
      <pointLight position={[-separationX, 2.5, 3]} intensity={4} color={colorA} />
      <pointLight position={[-separationX, -1, 2]} intensity={1.5} color={colorA} />
      <pointLight position={[separationX, 2.5, 3]} intensity={4} color={colorB} />
      <pointLight position={[separationX, -1, 2]} intensity={1.5} color={colorB} />
      {/* Fill */}
      <pointLight position={[0, 4, -2]} intensity={1} color="#ffffff" />

      <StyledCar
        color={colorA}
        position={[-separationX, 0, 0]}
        facingSign={1}
        floatSpeed={0.45}
        floatOffset={0}
      />
      <StyledCar
        color={colorB}
        position={[separationX, 0, 0]}
        facingSign={-1}
        floatSpeed={0.5}
        floatOffset={Math.PI}
      />
    </>
  );
}

// ── Exported component ───────────────────────────────────────────────────────

interface CompareDual3DSceneProps {
  colorA?: string;
  colorB?: string;
  opacity?: number;
  cameraZ?: number;
  cameraY?: number;
  separationX?: number;
}

export default function CompareDual3DScene({
  colorA = "#1FBF9F",
  colorB = "#22D3EE",
  opacity = 0.45,
  cameraZ = 9,
  cameraY = 1.5,
  separationX = 3.6,
}: CompareDual3DSceneProps) {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ opacity }}>
      <Canvas
        camera={{ position: [0, cameraY, cameraZ], fov: 52 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.2]}
      >
        <Scene colorA={colorA} colorB={colorB} separationX={separationX} />
      </Canvas>
    </div>
  );
}
