"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Torus, Trail } from "@react-three/drei";
import * as THREE from "three";

// ─── Floating energy orb ────────────────────────────────────────────────────

function EnergyOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.18;
  });

  return (
    <Sphere ref={meshRef} args={[1.4, 64, 64]}>
      <MeshDistortMaterial
        color="#1FBF9F"
        emissive="#0D6B5A"
        emissiveIntensity={0.5}
        distort={0.35}
        speed={2.5}
        roughness={0.1}
        metalness={0.6}
        transparent
        opacity={0.88}
      />
    </Sphere>
  );
}

// ─── Orbiting ring ───────────────────────────────────────────────────────────

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
  tubeRadius = 0.025,
}: {
  radius: number;
  tilt: number;
  speed: number;
  color: string;
  tubeRadius?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = clock.getElapsedTime() * speed;
  });

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      <Torus args={[radius, tubeRadius, 16, 120]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          transparent
          opacity={0.55}
          roughness={0.05}
          metalness={0.9}
        />
      </Torus>
    </group>
  );
}

// ─── Floating particle ───────────────────────────────────────────────────────

function Particle({ position, speed, size }: { position: THREE.Vector3; speed: number; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed + offset;
    meshRef.current.position.y = position.y + Math.sin(t) * 0.4;
    meshRef.current.position.x = position.x + Math.cos(t * 0.7) * 0.15;
    const pulse = 0.8 + Math.sin(t * 2) * 0.2;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color="#22D3EE"
        emissive="#22D3EE"
        emissiveIntensity={2}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

// ─── Particle field ──────────────────────────────────────────────────────────

function ParticleField() {
  const particles = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3 - 1,
      ),
      speed: 0.3 + Math.random() * 0.5,
      size: 0.02 + Math.random() * 0.04,
    }));
  }, []);

  return (
    <>
      {particles.map((p) => (
        <Particle key={p.id} position={p.position} speed={p.speed} size={p.size} />
      ))}
    </>
  );
}

// ─── Orbiting satellite dot ──────────────────────────────────────────────────

function SatelliteDot({ orbitRadius, speed, offset }: { orbitRadius: number; speed: number; offset: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed + offset;
    meshRef.current.position.x = Math.cos(t) * orbitRadius;
    meshRef.current.position.z = Math.sin(t) * orbitRadius * 0.4;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshStandardMaterial
        color="#C8FF00"
        emissive="#C8FF00"
        emissiveIntensity={3}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// ─── Full scene ──────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 4, 4]} intensity={2.5} color="#1FBF9F" />
      <pointLight position={[-4, -2, 2]} intensity={1.5} color="#22D3EE" />
      <pointLight position={[0, -4, -2]} intensity={1} color="#0D6B5A" />

      {/* Core orb */}
      <EnergyOrb />

      {/* Orbiting rings */}
      <OrbitRing radius={2.2} tilt={Math.PI / 6} speed={0.18} color="#1FBF9F" />
      <OrbitRing radius={2.8} tilt={Math.PI / 3} speed={-0.12} color="#22D3EE" tubeRadius={0.018} />
      <OrbitRing radius={3.4} tilt={Math.PI / 1.5} speed={0.09} color="#0D9B77" tubeRadius={0.012} />

      {/* Satellite dots on rings */}
      <SatelliteDot orbitRadius={2.2} speed={0.5} offset={0} />
      <SatelliteDot orbitRadius={2.8} speed={-0.35} offset={Math.PI} />
      <SatelliteDot orbitRadius={3.4} speed={0.28} offset={Math.PI / 2} />

      {/* Floating particles */}
      <ParticleField />
    </>
  );
}

// ─── Exported component ──────────────────────────────────────────────────────

export default function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
