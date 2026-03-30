import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SpaceShuttle = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.2, -0.5, 0.1]}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.12, 0.25, 1.5, 12]} />
        <meshStandardMaterial color="#d4d8e0" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.12, 0.6, 12]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Heat shield band */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.125, 0.13, 0.08, 12]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Wings */}
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.4, 0.03, 0.35]} />
        <meshStandardMaterial color="#8890a0" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Tail fin */}
      <mesh position={[0, -0.5, -0.15]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.03, 0.4, 0.25]} />
        <meshStandardMaterial color="#8890a0" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Engine nozzle */}
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.18, 0.12, 0.15, 12]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Engine glow */}
      <mesh position={[0, -0.95, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      {/* Outer engine glow */}
      <mesh position={[0, -0.95, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

export default SpaceShuttle;
