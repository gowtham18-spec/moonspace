import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import StarField from './StarField';
import Earth from './Earth';
import SpaceShuttle from './SpaceShuttle';

const HeroScene = () => {
  return (
    <Canvas className="!absolute inset-0" dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
      <ambientLight intensity={0.15} color="#8899bb" />
      <directionalLight position={[8, 4, 6]} intensity={1.8} color="#fff5e0" />
      <directionalLight position={[-3, -2, -4]} intensity={0.15} color="#4466aa" />
      <pointLight position={[0, 0, 10]} intensity={0.3} color="#aaccff" />
      <Suspense fallback={null}>
        <StarField count={8000} />
        <group position={[-3, -1, -2]}>
          <Earth />
        </group>
        <group position={[2, 1, 0]}>
          <SpaceShuttle />
        </group>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
    </Canvas>
  );
};

export default HeroScene;
