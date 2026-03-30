import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import Moon3D from './Moon3D';

interface MoonSceneProps {
  onLocationClick?: (loc: string) => void;
}

const MoonScene = ({ onLocationClick }: MoonSceneProps) => {
  return (
    <Canvas className="!absolute inset-0">
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 5, 10]} intensity={1.2} />
      <directionalLight position={[-5, 3, 5]} intensity={0.6} />
      <Suspense fallback={null}>
        <Stars radius={100} depth={50} count={2000} factor={3} fade />
        <Moon3D onLocationClick={onLocationClick} />
      </Suspense>
      <OrbitControls enableZoom={true} enablePan={false} minDistance={4} maxDistance={10} />
    </Canvas>
  );
};

export default MoonScene;
