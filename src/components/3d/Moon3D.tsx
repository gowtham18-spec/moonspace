import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';

interface Moon3DProps {
  onLocationClick?: (loc: string) => void;
}

const Moon3D = ({ onLocationClick }: Moon3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#64748b';
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 15 + 5, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  const locations = [
    { position: [1.2, 0.5, 1.8] as [number, number, number], label: "Apollo 11 Site", color: "#f59e0b" },
    { position: [-1.5, 0.8, 1.2] as [number, number, number], label: "Lunar Hotel", color: "#06b6d4" },
    { position: [0.8, -1.2, 1.5] as [number, number, number], label: "Dark Side Observatory", color: "#8b5cf6" },
    { position: [-0.5, 1.5, 0.8] as [number, number, number], label: "Artemis Base", color: "#ec4899" },
  ];

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>
      {/* Glow */}
      <mesh scale={1.05}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.05} />
      </mesh>

      {locations.map((loc, i) => (
        <group key={i} position={loc.position}>
          <Float speed={3} floatIntensity={0.2}>
            <mesh
              onPointerOver={() => setHoveredPoint(i)}
              onPointerOut={() => setHoveredPoint(null)}
              onClick={() => onLocationClick?.(loc.label)}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color={loc.color} />
            </mesh>
            <mesh scale={1.5}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color={loc.color} transparent opacity={0.3} />
            </mesh>
          </Float>
          {hoveredPoint === i && (
            <Html distanceFactor={6}>
              <div className="glass-card px-3 py-1.5 text-xs whitespace-nowrap" style={{ color: loc.color }}>
                {loc.label}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
};

export default Moon3D;
