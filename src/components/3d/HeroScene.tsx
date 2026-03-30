import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import StarField from './StarField';
import Earth from './Earth';
import SpaceShuttle from './SpaceShuttle';

const HeroScene = () => {
  return (
    <Canvas className="!absolute inset-0">
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} />
      <Suspense fallback={null}>
        <StarField />
        <group position={[-3, -1, -2]}>
          <Earth />
        </group>
        <group position={[2, 1, 0]}>
          <SpaceShuttle />
        </group>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
    </Canvas>
  );
};

export default HeroScene;
