import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Moon3D from './Moon3D';

interface MoonSceneProps {
  onLocationClick?: (loc: string) => void;
}

/** Soft blue-white fill light that follows the cursor for a parallax lighting response. */
const CursorLight = () => {
  const ref = useRef<THREE.PointLight>(null);

  useFrame(({ pointer, clock }) => {
    if (!ref.current) return;
    const idle = clock.getElapsedTime() * 0.3;
    const tx = (pointer.x || Math.sin(idle) * 0.4) * 6;
    const ty = (pointer.y || Math.cos(idle) * 0.3) * 4;
    ref.current.position.x += (tx - ref.current.position.x) * 0.05;
    ref.current.position.y += (ty - ref.current.position.y) * 0.05;
  });

  return <pointLight ref={ref} position={[0, 0, 6]} intensity={12} distance={22} decay={2} color="#bcd8ff" />;
};

const MoonScene = ({ onLocationClick }: MoonSceneProps) => {
  return (
    <Canvas className="!absolute inset-0" dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
      <ambientLight intensity={0.1} color="#8899bb" />
      <directionalLight position={[8, 3, 5]} intensity={2} color="#fff8e8" castShadow />
      <directionalLight position={[-5, -2, -3]} intensity={0.08} color="#334466" />
      <CursorLight />
      <Suspense fallback={null}>
        <Stars radius={100} depth={50} count={3000} factor={3} fade />
        <Moon3D onLocationClick={onLocationClick} />
      </Suspense>
      <OrbitControls enableZoom={true} enablePan={false} minDistance={4} maxDistance={10} />
    </Canvas>
  );
};

export default MoonScene;
