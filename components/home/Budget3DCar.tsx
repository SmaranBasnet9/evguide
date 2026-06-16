"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Low-poly EV car (shared geometry, accent-coloured per card) ───────────────

function Car({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle float
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.06;
    // Slow y-axis rotation (slight 3/4 view swing)
    groupRef.current.rotation.y = 0.42 + Math.sin(t * 0.22) * 0.08;
  });

  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.35,
        metalness: 0.8,
        roughness: 0.18,
      }),
    [color],
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.7,
        metalness: 0.05,
        roughness: 0.04,
        transparent: true,
        opacity: 0.42,
      }),
    [color],
  );

  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0e0e12",
        metalness: 0.6,
        roughness: 0.4,
      }),
    [],
  );

  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c0c0c8",
        metalness: 0.95,
        roughness: 0.08,
      }),
    [],
  );

  const headMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 5,
      }),
    [],
  );

  const tailMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ff2211",
        emissive: "#ff1100",
        emissiveIntensity: 3,
      }),
    [],
  );

  const wheelPos: [number, number][] = [
    [0.82, 0.52],
    [0.82, -0.52],
    [-0.76, 0.52],
    [-0.76, -0.52],
  ];

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh material={bodyMat} position={[0, 0.22, 0]}>
        <boxGeometry args={[2.4, 0.5, 1.04]} />
      </mesh>
      {/* Cabin */}
      <mesh material={bodyMat} position={[0.05, 0.6, 0]}>
        <boxGeometry args={[1.35, 0.36, 0.86]} />
      </mesh>
      {/* Hood slope */}
      <mesh material={bodyMat} position={[0.96, 0.34, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.48, 0.07, 0.96]} />
      </mesh>
      {/* Boot slope */}
      <mesh material={bodyMat} position={[-0.92, 0.34, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.48, 0.07, 0.96]} />
      </mesh>
      {/* Front glass */}
      <mesh material={glassMat} position={[0.72, 0.57, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.52, 0.04, 0.78]} />
      </mesh>
      {/* Rear glass */}
      <mesh material={glassMat} position={[-0.68, 0.57, 0]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.52, 0.04, 0.78]} />
      </mesh>
      {/* Side windows */}
      <mesh material={glassMat} position={[0.04, 0.61, 0.44]}>
        <boxGeometry args={[1.22, 0.3, 0.04]} />
      </mesh>
      <mesh material={glassMat} position={[0.04, 0.61, -0.44]}>
        <boxGeometry args={[1.22, 0.3, 0.04]} />
      </mesh>
      {/* Wheels */}
      {wheelPos.map(([wx, wz], i) => (
        <group key={i} position={[wx, -0.09, wz]}>
          <mesh material={darkMat} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26, 0.09, 7, 12]} />
          </mesh>
          <mesh material={rimMat} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.2, 7]} />
          </mesh>
        </group>
      ))}
      {/* Headlights */}
      <mesh material={headMat} position={[1.22, 0.23, 0.32]}>
        <sphereGeometry args={[0.06, 6, 6]} />
      </mesh>
      <mesh material={headMat} position={[1.22, 0.23, -0.32]}>
        <sphereGeometry args={[0.06, 6, 6]} />
      </mesh>
      {/* Tail lights */}
      <mesh material={tailMat} position={[-1.22, 0.23, 0.32]}>
        <boxGeometry args={[0.04, 0.1, 0.24]} />
      </mesh>
      <mesh material={tailMat} position={[-1.22, 0.23, -0.32]}>
        <boxGeometry args={[0.04, 0.1, 0.24]} />
      </mesh>
      {/* Ground glow */}
      <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 1.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.12}
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Scene({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={0.06} />
      <pointLight position={[0, 3, 4]} intensity={5} color={color} />
      <pointLight position={[0, -1, 2]} intensity={2} color={color} />
      <pointLight position={[-3, 2, -1]} intensity={1.2} color="#ffffff" />
      <Car color={color} />
    </>
  );
}

interface Budget3DCarProps {
  color: string;
}

export default function Budget3DCar({ color }: Budget3DCarProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 5.5], fov: 46 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1]}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene color={color} />
    </Canvas>
  );
}
