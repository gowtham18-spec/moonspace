import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import Moon3D from './Moon3D';

interface MoonSceneProps {
  onLocationClick?: (loc: string) => void;
}

const MoonScene = ({ onLocationClick }: MoonSceneProps) => {
  return (
    <Canvas className="!absolute inset-0" dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
      <ambientLight intensity={0.1} color="#8899bb" />
      <directionalLight position={[8, 3, 5]} intensity={2} color="#fff8e8" castShadow />
      <directionalLight position={[-5, -2, -3]} intensity={0.08} color="#334466" />
      <Suspense fallback={null}>
        <Stars radius={100} depth={50} count={3000} factor={3} fade />
        <Moon3D onLocationClick={onLocationClick} />
      </Suspense>
      <OrbitControls enableZoom={true} enablePan={false} minDistance={4} maxDistance={10} />
    </Canvas>
  );
};

export default MoonScene;
