"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Camera look-at setup ────────────────────────────────────────────────────

function CameraSetup() {
  const { camera } = useThree();
  // Run once on mount to aim camera at city centre
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    camera.lookAt(0, 1.5, -1);
    done.current = true;
  });
  return null;
}

// ─── Ground plane ────────────────────────────────────────────────────────────

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#081408" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}

// ─── Road strip ──────────────────────────────────────────────────────────────

function Road({ axis }: { axis: "x" | "z" }) {
  const rot: [number, number, number] =
    axis === "x" ? [-Math.PI / 2, 0, 0] : [-Math.PI / 2, 0, Math.PI / 2];
  return (
    <group>
      <mesh rotation={rot} position={[0, 0.01, 0]}>
        <planeGeometry args={[40, 1.4]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.98} />
      </mesh>
      {/* Centre lane marker — dashed look via thin emissive strip */}
      <mesh rotation={rot} position={[0, 0.02, 0]}>
        <planeGeometry args={[40, 0.04]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.35}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

// ─── Building ────────────────────────────────────────────────────────────────

interface BuildingProps {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  hasGreenRoof?: boolean;
  hasSolar?: boolean;
  windowColor?: string;
}

function Building({
  position,
  width,
  height,
  depth,
  hasGreenRoof = false,
  hasSolar = false,
  windowColor = "#00e5ff",
}: BuildingProps) {
  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#0b1e2d"
          metalness={0.45}
          roughness={0.35}
          emissive="#050e17"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Window strip — front face */}
      <mesh position={[0, height * 0.35, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.72, 0.07]} />
        <meshStandardMaterial
          color={windowColor}
          emissive={windowColor}
          emissiveIntensity={1.0}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh position={[0, height * 0.68, depth / 2 + 0.01]}>
        <planeGeometry args={[width * 0.72, 0.07]} />
        <meshStandardMaterial
          color={windowColor}
          emissive={windowColor}
          emissiveIntensity={1.0}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Window strip — side face */}
      <mesh position={[width / 2 + 0.01, height * 0.45, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth * 0.6, 0.06]} />
        <meshStandardMaterial
          color={windowColor}
          emissive={windowColor}
          emissiveIntensity={0.7}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Green roof garden */}
      {hasGreenRoof && (
        <mesh position={[0, height + 0.06, 0]}>
          <boxGeometry args={[width, 0.12, depth]} />
          <meshStandardMaterial
            color="#1a6b28"
            roughness={0.9}
            emissive="#0a3514"
            emissiveIntensity={0.25}
          />
        </mesh>
      )}

      {/* Solar panel array */}
      {hasSolar && (
        <mesh position={[0, height + 0.07, 0]} rotation={[-0.12, 0, 0]}>
          <boxGeometry args={[width * 0.82, 0.05, depth * 0.82]} />
          <meshStandardMaterial
            color="#0e2a45"
            metalness={0.9}
            roughness={0.08}
            emissive="#051828"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

// ─── Tree ────────────────────────────────────────────────────────────────────

function Tree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.44, 6]} />
        <meshStandardMaterial color="#3d2008" roughness={0.95} />
      </mesh>
      {/* Foliage — 3 tiers for depth */}
      <mesh position={[0, 0.72, 0]}>
        <coneGeometry args={[0.38, 0.65, 7]} />
        <meshStandardMaterial color="#10521c" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.06, 0]}>
        <coneGeometry args={[0.28, 0.55, 7]} />
        <meshStandardMaterial
          color="#177027"
          roughness={0.82}
          emissive="#0b3b14"
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0, 1.34, 0]}>
        <coneGeometry args={[0.17, 0.42, 7]} />
        <meshStandardMaterial
          color="#20a038"
          roughness={0.78}
          emissive="#0f5020"
          emissiveIntensity={0.18}
        />
      </mesh>
    </group>
  );
}

// ─── Wind turbine ────────────────────────────────────────────────────────────

function WindTurbine({ position }: { position: [number, number, number] }) {
  const bladeGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (bladeGroupRef.current) {
      bladeGroupRef.current.rotation.z = clock.getElapsedTime() * 0.75;
    }
  });

  return (
    <group position={position}>
      {/* Tower */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.055, 0.095, 4.4, 8]} />
        <meshStandardMaterial color="#c2c2c2" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Nacelle housing */}
      <mesh position={[0.06, 4.5, 0.09]}>
        <boxGeometry args={[0.28, 0.16, 0.16]} />
        <meshStandardMaterial color="#d2d2d2" metalness={0.55} roughness={0.28} />
      </mesh>

      {/* Rotor + blades */}
      <group ref={bladeGroupRef} position={[0, 4.5, 0.18]}>
        <mesh>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#b8b8b8" metalness={0.65} roughness={0.2} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <mesh position={[0, 0.52, 0]}>
              <boxGeometry args={[0.045, 1.04, 0.022]} />
              <meshStandardMaterial color="#e2e8e2" metalness={0.35} roughness={0.22} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Subtle base glow */}
      <pointLight
        position={[0, 0.15, 0]}
        color="#00e676"
        intensity={0.4}
        distance={2}
      />
    </group>
  );
}

// ─── EV Car ──────────────────────────────────────────────────────────────────

function EVCar({
  lane,
  speed,
  phaseOffset,
  color,
  axis = "x",
}: {
  lane: number;
  speed: number;
  phaseOffset: number;
  color: string;
  axis?: "x" | "z";
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const pos = ((clock.getElapsedTime() * speed + phaseOffset) % 18) - 9;
    if (axis === "x") {
      groupRef.current.position.set(pos, 0.14, lane);
      groupRef.current.rotation.y = 0;
    } else {
      groupRef.current.position.set(lane, 0.14, pos);
      groupRef.current.rotation.y = Math.PI / 2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.62, 0.18, 0.28]} />
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.18}
          emissive={color}
          emissiveIntensity={0.22}
        />
      </mesh>
      {/* Cab */}
      <mesh position={[-0.06, 0.24, 0]}>
        <boxGeometry args={[0.32, 0.14, 0.22]} />
        <meshStandardMaterial
          color={color}
          metalness={0.55}
          roughness={0.22}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* Front headlight glow */}
      <pointLight
        position={[0.34, 0.09, 0]}
        color={color}
        intensity={1.8}
        distance={2.2}
      />
      {/* Undercarriage eco-glow */}
      <pointLight
        position={[0, -0.02, 0]}
        color="#00ff88"
        intensity={0.5}
        distance={0.9}
      />
    </group>
  );
}

// ─── Rising energy particles ──────────────────────────────────────────────────

const PARTICLE_COUNT = 32;

function EnergyParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        x: (Math.random() - 0.5) * 16,
        baseY: Math.random() * -3,
        z: (Math.random() - 0.5) * 12,
        speed: 0.22 + Math.random() * 0.45,
        drift: (Math.random() - 0.5) * 0.35,
        offset: (i / PARTICLE_COUNT) * Math.PI * 2,
      })),
    [],
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      const y = ((p.baseY + t * p.speed) % 9) - 1;
      dummy.position.set(
        p.x + Math.sin(t * 0.38 + p.offset) * 0.22,
        y,
        p.z + Math.cos(t * 0.25 + p.offset) * 0.18,
      );
      const s = 0.038 + Math.sin(t * 1.8 + p.offset) * 0.012;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[
        undefined as unknown as THREE.BufferGeometry,
        undefined as unknown as THREE.Material,
        PARTICLE_COUNT,
      ]}
    >
      <sphereGeometry args={[1, 5, 5]} />
      <meshStandardMaterial
        color="#00e676"
        emissive="#00c853"
        emissiveIntensity={3.5}
        transparent
        opacity={0.78}
      />
    </instancedMesh>
  );
}

// ─── Slow scene sway (reveals depth) ─────────────────────────────────────────

function SceneSway({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.06) * 0.12;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

// ─── Full city scene ──────────────────────────────────────────────────────────

const BUILDINGS: BuildingProps[] = [
  // Back-centre — tallest landmark
  { position: [0, 0, -4.2], width: 1.3, height: 7.5, depth: 1.3, hasSolar: true },
  { position: [0.9, 0, -3.2], width: 0.75, height: 3.8, depth: 0.75, hasSolar: true },
  { position: [-0.9, 0, -3.2], width: 0.75, height: 3.0, depth: 0.75, hasGreenRoof: true },

  // Back-left block
  { position: [-2.4, 0, -3.8], width: 0.9, height: 5.0, depth: 0.9, hasSolar: true },
  { position: [-1.4, 0, -3.0], width: 0.75, height: 2.5, depth: 0.75, hasGreenRoof: true },
  { position: [-3.2, 0, -2.8], width: 0.7, height: 1.8, depth: 0.7, hasGreenRoof: true },
  { position: [-2.2, 0, -2.0], width: 1.0, height: 4.5, depth: 1.0, hasSolar: true },

  // Back-right block
  { position: [2.4, 0, -3.8], width: 0.9, height: 5.5, depth: 0.9, hasSolar: true },
  { position: [1.4, 0, -3.0], width: 0.75, height: 3.2, depth: 0.75, hasSolar: true },
  { position: [3.2, 0, -2.8], width: 0.7, height: 2.0, depth: 0.7, hasGreenRoof: true },
  { position: [2.2, 0, -2.0], width: 1.0, height: 6.0, depth: 1.0, hasSolar: true },

  // Front-left block
  { position: [-2.5, 0, 2.2], width: 0.85, height: 2.2, depth: 0.85, hasGreenRoof: true },
  { position: [-3.5, 0, 1.5], width: 0.65, height: 1.5, depth: 0.65, hasGreenRoof: true },
  { position: [-2.0, 0, 3.2], width: 0.75, height: 1.8, depth: 0.75, hasSolar: true },
  { position: [-4.2, 0, 2.8], width: 0.6, height: 1.2, depth: 0.6, hasGreenRoof: true },

  // Front-right block
  { position: [2.5, 0, 2.2], width: 0.85, height: 3.0, depth: 0.85, hasSolar: true },
  { position: [3.5, 0, 1.5], width: 0.65, height: 2.2, depth: 0.65, hasGreenRoof: true },
  { position: [2.0, 0, 3.2], width: 0.75, height: 2.5, depth: 0.75, hasSolar: true },
  { position: [4.2, 0, 2.8], width: 0.6, height: 1.4, depth: 0.6, hasGreenRoof: true },
];

const TREES: Array<{ pos: [number, number, number]; scale: number }> = [
  // Street-side trees (x-road, z ± ~0.9)
  { pos: [-5, 0, 0.9], scale: 0.85 }, { pos: [-4, 0, 0.9], scale: 0.9 },
  { pos: [-3, 0, 0.9], scale: 0.8 },  { pos: [3, 0, 0.9], scale: 0.88 },
  { pos: [4, 0, 0.9], scale: 0.82 },  { pos: [5, 0, 0.9], scale: 0.9 },
  { pos: [-5, 0, -0.9], scale: 0.85 },{ pos: [-4, 0, -0.9], scale: 0.92 },
  { pos: [-3, 0, -0.9], scale: 0.8 }, { pos: [3, 0, -0.9], scale: 0.87 },
  { pos: [4, 0, -0.9], scale: 0.9 },  { pos: [5, 0, -0.9], scale: 0.83 },
  // Street-side trees (z-road, x ± ~0.9)
  { pos: [0.9, 0, 3.5], scale: 0.88 },{ pos: [-0.9, 0, 3.5], scale: 0.82 },
  { pos: [0.9, 0, -1.6], scale: 0.9 },{ pos: [-0.9, 0, -1.6], scale: 0.85 },
  // Corner parks
  { pos: [-5, 0, 3.5], scale: 1.0 },  { pos: [-5.8, 0, 2.8], scale: 0.9 },
  { pos: [-4.5, 0, 4.2], scale: 0.95 },
  { pos: [5, 0, 3.5], scale: 1.0 },   { pos: [5.8, 0, 2.8], scale: 0.88 },
  { pos: [4.5, 0, 4.2], scale: 0.92 },
  { pos: [-5, 0, -4.5], scale: 0.95 },{ pos: [-5.8, 0, -3.8], scale: 0.85 },
  { pos: [5, 0, -4.5], scale: 0.98 }, { pos: [5.8, 0, -3.8], scale: 0.87 },
  // Scattered mid-block
  { pos: [-1.5, 0, 1.3], scale: 0.78 },{ pos: [1.5, 0, 1.3], scale: 0.82 },
  { pos: [-1.5, 0, -1.8], scale: 0.8 },{ pos: [1.5, 0, -1.8], scale: 0.75 },
];

const CARS = [
  { lane: 0.32, speed: 0.72, phaseOffset: 0, color: "#00c87a", axis: "x" as const },
  { lane: -0.32, speed: 0.52, phaseOffset: 6, color: "#22D3EE", axis: "x" as const },
  { lane: 0.32, speed: 0.62, phaseOffset: 2, color: "#1FBF9F", axis: "z" as const },
  { lane: -0.32, speed: 0.82, phaseOffset: 9, color: "#69f0ae", axis: "z" as const },
  { lane: 0.32, speed: 0.45, phaseOffset: 14, color: "#00ff88", axis: "x" as const },
  { lane: -0.32, speed: 0.68, phaseOffset: 4, color: "#00bcd4", axis: "z" as const },
];

function CityScene() {
  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.28} color="#1a3320" />
      {/* Sun — cool daylight tinted green */}
      <directionalLight
        position={[8, 14, 6]}
        intensity={0.9}
        color="#c8ffd8"
        castShadow
      />
      {/* City ambient fills */}
      <pointLight position={[0, 10, 0]} intensity={2.0} color="#00e676" distance={28} />
      <pointLight position={[-6, 5, -3]} intensity={1.4} color="#1FBF9F" distance={20} />
      <pointLight position={[6, 5, 3]} intensity={1.2} color="#22D3EE" distance={20} />
      <pointLight position={[0, 3, 5]} intensity={0.8} color="#00c853" distance={14} />

      {/* ── Ground & roads ── */}
      <Ground />
      <Road axis="x" />
      <Road axis="z" />

      {/* ── Buildings ── */}
      {BUILDINGS.map((b, i) => (
        <Building
          key={i}
          {...b}
          windowColor={i % 3 === 0 ? "#00e5ff" : i % 3 === 1 ? "#00ff88" : "#40ffb0"}
        />
      ))}

      {/* ── Trees ── */}
      {TREES.map(({ pos, scale }, i) => (
        <Tree key={i} position={pos} scale={scale} />
      ))}

      {/* ── Wind turbines (back of city) ── */}
      <WindTurbine position={[-7, 0, -5.5]} />
      <WindTurbine position={[7.5, 0, -5]} />
      <WindTurbine position={[-8.5, 0, -2]} />

      {/* ── EV cars ── */}
      {CARS.map((car, i) => (
        <EVCar key={i} {...car} />
      ))}

      {/* ── Rising energy particles ── */}
      <EnergyParticles />

      {/* ── Atmospheric depth fog ── */}
      <fog attach="fog" args={["#081408", 18, 38]} />
    </>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────

export default function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        camera={{ position: [11, 8, 11], fov: 44 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.25]}
        shadows
      >
        <CameraSetup />
        <SceneSway>
          <CityScene />
        </SceneSway>
      </Canvas>
    </div>
  );
}
