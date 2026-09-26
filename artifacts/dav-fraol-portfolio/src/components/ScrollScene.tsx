import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, RoundedBox } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Color, FogExp2, MathUtils, Vector3, type Group } from 'three';

gsap.registerPlugin(ScrollTrigger);

type SceneProps = {
  progress: number;
};

type JourneyProps = SceneProps & {
  compact: boolean;
  reducedMotion: boolean;
};

const BLUE = '#35c7ff';
const ICE = '#f4f8ff';
const journeyColors = ['#35c7ff', '#a5b4ff', '#ffb56b', '#ff718f', '#5ce0c1', '#7eb8ff', '#35c7ff', '#b6a7ff', '#54d8ff', '#35c7ff'];

const cameraStops = [
  { x: 0, y: 0.15, z: 8, tx: 0, ty: 0, tz: -2.2, roll: 0 },
  { x: 1.45, y: 0.4, z: 2.2, tx: 0.2, ty: 0.08, tz: -6.8, roll: -0.02 },
  { x: -1.25, y: 0.28, z: -8.8, tx: 0.15, ty: 0.12, tz: -13.2, roll: 0.018 },
  { x: 1.1, y: -0.32, z: -23.8, tx: -0.2, ty: 0.05, tz: -29, roll: -0.025 },
  { x: -1.05, y: 0.35, z: -36.5, tx: 0.05, ty: -0.1, tz: -41.8, roll: 0.02 },
  { x: 0.1, y: 0.12, z: -47, tx: 0, ty: 0, tz: -51, roll: 0 },
] as const;

function supportsWebGL() {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function usePointer(reducedMotion: boolean, compact: boolean) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (reducedMotion || compact) return;
    const onMove = (event: PointerEvent) => setPointer({
      x: (event.clientX / window.innerWidth - 0.5) * 2,
      y: (event.clientY / window.innerHeight - 0.5) * 2,
    });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [compact, reducedMotion]);
  return pointer;
}

function StarField({ compact }: { compact: boolean }) {
  const count = compact ? 180 : 620;
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 26;
      values[index * 3 + 1] = (Math.random() - 0.5) * 15;
      values[index * 3 + 2] = -Math.random() * 64 - 2;
    }
    return values;
  }, [count]);
  const ref = useRef<import('three').Points>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.004;
    ref.current.rotation.x = Math.sin(performance.now() * 0.00008) * 0.035;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={BLUE} size={compact ? 0.025 : 0.035} transparent opacity={0.52} sizeAttenuation />
    </points>
  );
}

function LightTrail({ radius = 1.5, color = BLUE, tilt = 0 }: { radius?: number; color?: string; tilt?: number }) {
  const points = useMemo(() => Array.from({ length: 20 }, (_, index) => {
    const angle = (index / 19) * Math.PI * 2;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(angle * 2) * 0.12] as [number, number, number];
  }), [radius]);
  return <Line points={points} color={color} transparent opacity={0.72} lineWidth={0.7} rotation={[tilt, 0.15, 0.2]} />;
}

function DevCore({ progress, pointer, compact, reducedMotion }: { progress: number; pointer: { x: number; y: number }; compact: boolean; reducedMotion: boolean }) {
  const ref = useRef<Group>(null);
  const inner = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!ref.current || !inner.current) return;
    const world = Math.min(9, Math.floor(progress * 10));
    const destinationScale = world === 9 ? 1.35 : world === 3 ? 1.18 : world === 5 ? 1.08 : 1;
    ref.current.rotation.x = MathUtils.damp(ref.current.rotation.x, pointer.y * 0.18 + progress * 1.8, 4, delta);
    ref.current.rotation.y = MathUtils.damp(ref.current.rotation.y, pointer.x * 0.22 + progress * 2.4, 4, delta);
    ref.current.position.x = MathUtils.damp(ref.current.position.x, pointer.x * (compact ? 0.18 : 0.42), 4, delta);
    ref.current.position.y = MathUtils.damp(ref.current.position.y, pointer.y * (compact ? -0.12 : -0.28), 4, delta);
    ref.current.position.z = MathUtils.damp(ref.current.position.z, -2.2 - progress * 55, 4, delta);
    ref.current.scale.setScalar(MathUtils.damp(ref.current.scale.x, destinationScale, 4, delta));
    if (!reducedMotion) inner.current.rotation.z += delta * (0.22 + progress * 0.7);
  });
  return (
    <group ref={ref} position={[0, 0, -2.2]}>
      <RoundedBox args={[1.75, 1.75, 1.75]} radius={0.18} smoothness={4}>
        <meshPhysicalMaterial color="#122c48" metalness={0.82} roughness={0.2} clearcoat={0.75} clearcoatRoughness={0.15} />
      </RoundedBox>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <octahedronGeometry args={[1.18, 1]} />
        <meshPhysicalMaterial color={BLUE} emissive={BLUE} emissiveIntensity={1.2} metalness={0.2} roughness={0.15} transmission={0.42} transparent opacity={0.72} />
      </mesh>
      <group ref={inner}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[1.55, 0.025, 10, 96]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0.24, 0]}>
          <torusGeometry args={[1.25, 0.035, 10, 96]} />
          <meshBasicMaterial color={ICE} transparent opacity={0.5} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.52, 1]} />
          <meshBasicMaterial color={ICE} wireframe transparent opacity={0.76} />
        </mesh>
        <LightTrail radius={1.95} tilt={Math.PI / 3} />
        <LightTrail radius={2.12} color="#87e4ff" tilt={-Math.PI / 5} />
      </group>
      <pointLight color={BLUE} intensity={compact ? 2 : 3.8} distance={8} />
    </group>
  );
}

function WorldArchitecture({ index, active, compact }: { index: number; active: number; compact: boolean }) {
  const focus = Math.max(0, 1 - Math.abs(active - index) * 0.4);
  const color = journeyColors[index];
  const group = useRef<Group>(null);
  const worldZ = -index * 7.2 - 3;
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * (index === 5 ? 0.05 : 0.018);
    const distance = Math.min(1, Math.abs(active - index));
    group.current.position.x = MathUtils.damp(group.current.position.x, Math.sin(performance.now() * 0.00025 + index) * (0.08 + distance * 0.18), 3, delta);
    group.current.position.z = MathUtils.damp(group.current.position.z, worldZ + Math.sin(performance.now() * 0.00045 + index) * distance * 1.8, 3, delta);
    const scale = 0.68 + focus * 0.48;
    group.current.scale.setScalar(MathUtils.damp(group.current.scale.x, scale, 3, delta));
  });
  const z = worldZ;
  if (index === 0) return null;
  return (
    <group ref={group} position={[(index % 2 ? 2.5 : -2.5) * focus, (index % 3 - 1) * 0.55, z]} scale={0.72 + focus * 0.38}>
      {index === 1 && Array.from({ length: compact ? 3 : 6 }, (_, item) => (
        <RoundedBox key={item} args={[1.8, 0.04, 1.1]} position={[(item % 3) * 1.35 - 1.35, Math.floor(item / 3) * 0.85 - 0.4, 0]} radius={0.04} smoothness={2}>
          <meshPhysicalMaterial color="#c4d6e8" metalness={0.4} roughness={0.3} transmission={0.15} transparent opacity={0.64} />
        </RoundedBox>
      ))}
      {index === 2 && Array.from({ length: 5 }, (_, item) => (
        <mesh key={item} position={[(item - 2) * 0.65, Math.sin(item) * 0.55, 0]} rotation={[0.3, item * 0.28, item * 0.2]}>
          <boxGeometry args={[0.5, 1.3 + item * 0.12, 0.05]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.58} />
        </mesh>
      ))}
      {index === 3 && Array.from({ length: 5 }, (_, item) => (
        <group key={item} position={[(item - 2) * 0.72, Math.sin(item) * 0.7, 0]}>
          <mesh rotation={[0, item * 0.2, 0.18]}>
            <boxGeometry args={[0.58, 0.42, 0.04]} />
            <meshPhysicalMaterial color="#152c48" emissive={color} emissiveIntensity={0.15} metalness={0.6} roughness={0.26} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.58, 0.015, 0.015]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      ))}
      {index === 4 && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.35, 0.28, 18, 64]} />
            <meshPhysicalMaterial color="#101e32" metalness={0.92} roughness={0.15} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.72, 0.06, 12, 64]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.62, 32]} />
            <meshPhysicalMaterial color="#07111f" metalness={0.3} roughness={0.18} transmission={0.2} />
          </mesh>
        </>
      )}
      {index === 5 && Array.from({ length: compact ? 5 : 9 }, (_, item) => (
        <group key={item} position={[Math.cos(item) * 1.55, Math.sin(item * 1.7) * 1.1, Math.sin(item) * 0.6]}>
          <mesh>
            <icosahedronGeometry args={[0.12 + (item % 3) * 0.04, 1]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <Line points={[[0, 0, 0], [-Math.cos(item) * 1.55, -Math.sin(item * 1.7) * 1.1, -Math.sin(item) * 0.6]]} color={color} transparent opacity={0.25} lineWidth={0.5} />
        </group>
      ))}
      {index === 6 && Array.from({ length: 4 }, (_, item) => (
        <mesh key={item} position={[(item - 1.5) * 0.8, (item % 2) * 0.55 - 0.25, 0]} rotation={[0, item * 0.2, 0]}>
          <boxGeometry args={[0.5, 0.82, 0.05]} />
          <meshPhysicalMaterial color="#102c46" emissive={color} emissiveIntensity={0.45} metalness={0.5} roughness={0.25} transmission={0.2} />
        </mesh>
      ))}
      {index === 7 && (
        <group>
          <mesh>
            <icosahedronGeometry args={[1.35, 2]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0.22} />
          </mesh>
          {Array.from({ length: compact ? 8 : 16 }, (_, item) => (
            <mesh key={item} position={[Math.sin(item * 2.4) * 1.45, Math.cos(item * 1.4) * 1.2, Math.sin(item) * 1.25]}>
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshBasicMaterial color={item % 3 === 0 ? ICE : color} />
            </mesh>
          ))}
        </group>
      )}
      {index === 8 && [0, 1, 2].map((item) => (
        <group key={item} position={[(item - 1) * 1.4, (item % 2) * 0.8 - 0.4, item * 0.3]}>
          <mesh rotation={[0.2, item * 0.3, 0.15]}>
            <planeGeometry args={[1.5, 0.9]} />
            <meshPhysicalMaterial color="#163653" emissive={color} emissiveIntensity={0.15} metalness={0.4} roughness={0.22} transmission={0.12} transparent opacity={0.82} side={2} />
          </mesh>
          <Line points={[[-0.5, -0.2, 0.01], [0.2, -0.2, 0.01], [0.45, 0.2, 0.01]]} color={color} transparent opacity={0.65} lineWidth={0.8} />
        </group>
      ))}
      {index === 9 && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.7, 0.055, 12, 96]} />
            <meshBasicMaterial color={color} transparent opacity={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.12, 0.12, 16, 96]} />
            <meshPhysicalMaterial color="#102942" emissive={color} emissiveIntensity={0.5} metalness={0.72} roughness={0.16} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.62, 24, 24]} />
            <meshPhysicalMaterial color="#153d5c" emissive={color} emissiveIntensity={1.1} transmission={0.35} transparent opacity={0.8} />
          </mesh>
          <pointLight color={color} intensity={4} distance={8} />
        </group>
      )}
    </group>
  );
}

function CinematicLighting({ active, reducedMotion }: { active: number; reducedMotion: boolean }) {
  const key = useRef<import('three').DirectionalLight>(null);
  const rim = useRef<import('three').PointLight>(null);
  const fill = useRef<import('three').PointLight>(null);
  const colors = useMemo(() => journeyColors.map((color) => new Color(color)), []);
  const activeColor = useMemo(() => new Color(BLUE), []);

  useFrame((_, delta) => {
    const index = Math.min(journeyColors.length - 1, Math.max(0, Math.floor(active)));
    activeColor.lerp(colors[index], Math.min(1, delta * 4));
    if (key.current) {
      key.current.position.x = MathUtils.damp(key.current.position.x, Math.sin(active * 0.72) * 4.5, 2.5, delta);
      key.current.position.y = MathUtils.damp(key.current.position.y, 3.5 + Math.cos(active * 0.5) * 1.2, 2.5, delta);
      key.current.position.z = MathUtils.damp(key.current.position.z, 4 - active * 3.4, 2.5, delta);
      key.current.intensity = MathUtils.damp(key.current.intensity, 1.1 + (1 - Math.abs(active - index)) * 0.7, 2.5, delta);
    }
    if (rim.current) {
      rim.current.color.copy(activeColor);
      rim.current.position.x = MathUtils.damp(rim.current.position.x, Math.cos(active * 0.8) * 4, 2.5, delta);
      rim.current.position.z = MathUtils.damp(rim.current.position.z, -8 - active * 5.4, 2.5, delta);
      rim.current.intensity = MathUtils.damp(rim.current.intensity, reducedMotion ? 1.2 : 2.2 + Math.sin(active * Math.PI) * 1.6, 2.5, delta);
    }
    if (fill.current) {
      fill.current.position.y = MathUtils.damp(fill.current.position.y, -2 + Math.sin(active * 1.4) * 1.5, 2.5, delta);
      fill.current.intensity = MathUtils.damp(fill.current.intensity, 0.7 + active * 0.08, 2.5, delta);
    }
  });

  return (
    <>
      <ambientLight intensity={0.16} color="#6c88aa" />
      <directionalLight ref={key} position={[4, 5, 3]} intensity={1.1} color="#d7e8ff" />
      <pointLight ref={rim} position={[0, 1, -8]} intensity={2.2} distance={16} color={BLUE} />
      <pointLight ref={fill} position={[-4, -2, 2]} intensity={0.8} distance={12} color="#6689b5" />
    </>
  );
}

function DepthRibbons({ compact }: { compact: boolean }) {
  const group = useRef<Group>(null);
  const ribbons = useMemo(() => Array.from({ length: compact ? 4 : 8 }, (_, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const offset = Math.floor(index / 2);
    return {
      x: side * (3.6 + (offset % 2) * 0.8),
      y: (offset - 1.5) * 1.6,
      z: -5 - offset * 13,
      color: index % 3 === 0 ? ICE : BLUE,
      opacity: index % 3 === 0 ? 0.2 : 0.34,
    };
  }), [compact]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, Math.sin(performance.now() * 0.00015) * 0.035, 2, delta);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, Math.cos(performance.now() * 0.00012) * 0.018, 2, delta);
  });

  return (
    <group ref={group}>
      {ribbons.map((ribbon, index) => (
        <Line
          key={index}
          points={[
            [ribbon.x - 1.2, ribbon.y - 1.5, ribbon.z],
            [ribbon.x + 0.5, ribbon.y + 0.5, ribbon.z - 1.3],
            [ribbon.x - 0.2, ribbon.y + 1.9, ribbon.z - 2.8],
          ]}
          color={ribbon.color}
          transparent
          opacity={ribbon.opacity}
          lineWidth={index % 3 === 0 ? 0.4 : 0.7}
        />
      ))}
    </group>
  );
}

function CameraController({ progress, pointer, reducedMotion }: SceneProps & { pointer: { x: number; y: number }; reducedMotion: boolean }) {
  const { camera } = useThree();
  const target = useRef(new Vector3(0, 0, -3));
  const rig = useMemo(() => {
    const proxy = { ...cameraStops[0] };
    const timeline = gsap.timeline({ paused: true });
    cameraStops.slice(1).forEach((stop, index) => {
      timeline.to(proxy, {
        ...stop,
        duration: index === cameraStops.length - 2 ? 0.24 : 0.19,
        ease: index === cameraStops.length - 2 ? 'power2.out' : 'sine.inOut',
      });
    });
    return { proxy, timeline };
  }, []);
  useFrame((_, delta) => {
    rig.timeline.progress(progress);
    const desiredX = rig.proxy.x + pointer.x * 0.22;
    const desiredY = rig.proxy.y - pointer.y * 0.12;
    const desiredZ = rig.proxy.z;
    camera.position.x = MathUtils.damp(camera.position.x, desiredX, reducedMotion ? 7 : 3.4, delta);
    camera.position.y = MathUtils.damp(camera.position.y, desiredY, reducedMotion ? 7 : 3.4, delta);
    camera.position.z = MathUtils.damp(camera.position.z, desiredZ, reducedMotion ? 7 : 3.4, delta);
    target.current.set(
      rig.proxy.tx + pointer.x * 0.1,
      rig.proxy.ty - pointer.y * 0.06,
      rig.proxy.tz,
    );
    camera.lookAt(target.current);
    camera.rotation.z = MathUtils.damp(camera.rotation.z, rig.proxy.roll + pointer.x * 0.008, 3, delta);
    const perspectiveCamera = camera as import('three').PerspectiveCamera;
    perspectiveCamera.fov = MathUtils.damp(perspectiveCamera.fov, 44 + Math.sin(progress * Math.PI) * 3, 3, delta);
    perspectiveCamera.updateProjectionMatrix();
  });
  useEffect(() => {
    return () => {
      rig.timeline.kill();
    };
  }, [rig]);
  return null;
}

function Universe({ progress, compact, reducedMotion }: JourneyProps) {
  const pointer = usePointer(reducedMotion, compact);
  const active = Math.min(9, progress * 10);
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new FogExp2('#03060b', compact ? 0.035 : 0.022);
    scene.background = new Color('#03060b');
    return () => { scene.fog = null; };
  }, [compact, scene]);
  return (
    <>
      <CinematicLighting active={active} reducedMotion={reducedMotion} />
      <StarField compact={compact} />
      <DepthRibbons compact={compact} />
      <CameraController progress={progress} pointer={pointer} reducedMotion={reducedMotion} />
      <group position={[0, 0, 0]}>
        <DevCore progress={progress} pointer={pointer} compact={compact} reducedMotion={reducedMotion} />
        {journeyColors.map((_, index) => <WorldArchitecture key={index} index={index} active={active} compact={compact} />)}
      </group>
    </>
  );
}

function SceneFallback() {
  return <div className="scene-fallback" aria-hidden="true"><div className="fallback-orbit" /><div className="fallback-core" /></div>;
}

export function ScrollScene({ progress }: SceneProps) {
  const [webgl, setWebgl] = useState(true);
  const [compact, setCompact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    setWebgl(supportsWebGL());
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(motion.matches);
      setCompact(window.innerWidth < 800 || (navigator.hardwareConcurrency || 8) <= 4);
    };
    const updateVisibility = () => setPageVisible(document.visibilityState === 'visible');
    update();
    updateVisibility();
    motion.addEventListener('change', update);
    window.addEventListener('resize', update);
    document.addEventListener('visibilitychange', updateVisibility);
    const lenis = motion.matches ? null : new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on('scroll', onLenisScroll);
    const raf = (time: number) => {
      if (!document.hidden) lenis?.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(1000, 16);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => {
      motion.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      document.removeEventListener('visibilitychange', updateVisibility);
      lenis?.off('scroll', onLenisScroll);
      gsap.ticker.remove(raf);
      window.clearTimeout(refresh);
      lenis?.destroy();
    };
  }, []);
  if (!webgl) return <SceneFallback />;
  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        frameloop={pageVisible ? 'always' : 'never'}
        dpr={compact ? [0.7, 1] : [1, 1.5]}
        performance={{ min: compact ? 0.45 : 0.62, debounce: 200 }}
        camera={{ position: [0, 0, 8], fov: 44, near: 0.1, far: 100 }}
        gl={{ antialias: !compact, alpha: true, powerPreference: compact ? 'low-power' : 'high-performance' }}
        fallback={<SceneFallback />}
      >
        <Universe progress={progress} compact={compact} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

export default ScrollScene;