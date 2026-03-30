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

  const { colorMap, bumpMap } = useMemo(() => {
    const w = 1024, h = 512;

    // --- Color texture ---
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Base lunar surface - varied gray tones
    const baseGrad = ctx.createRadialGradient(512, 256, 0, 512, 256, 600);
    baseGrad.addColorStop(0, '#b0a898');
    baseGrad.addColorStop(0.5, '#9a918a');
    baseGrad.addColorStop(1, '#807870');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // Lunar maria (dark regions - basaltic plains)
    const maria = [
      { x: 350, y: 200, rx: 120, ry: 80, color: '#605848' },  // Mare Imbrium
      { x: 500, y: 250, rx: 90, ry: 70, color: '#585048' },   // Mare Serenitatis
      { x: 600, y: 280, rx: 80, ry: 60, color: '#504840' },   // Mare Tranquillitatis
      { x: 450, y: 320, rx: 70, ry: 50, color: '#585040' },   // Mare Nubium
      { x: 300, y: 160, rx: 60, ry: 45, color: '#605850' },   // Mare Frigoris (partial)
      { x: 700, y: 230, rx: 55, ry: 40, color: '#504838' },   // Mare Crisium
      { x: 400, y: 280, rx: 100, ry: 60, color: '#585048' },  // Oceanus Procellarum
    ];

    maria.forEach(m => {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.rx, m.ry, Math.random() * 0.3, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.rx);
      grad.addColorStop(0, m.color);
      grad.addColorStop(0.7, m.color + 'cc');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    });

    // Craters - various sizes
    const drawCrater = (cx: number, cy: number, radius: number) => {
      // Crater rim (lighter ring)
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180, 170, 160, ${0.3 + Math.random() * 0.3})`;
      ctx.lineWidth = radius * 0.15;
      ctx.stroke();

      // Crater floor (darker center)
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.75, 0, Math.PI * 2);
      const floorGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.75);
      floorGrad.addColorStop(0, `rgba(70, 65, 58, ${0.4 + Math.random() * 0.3})`);
      floorGrad.addColorStop(1, `rgba(90, 85, 75, ${0.2})`);
      ctx.fillStyle = floorGrad;
      ctx.fill();

      // Central peak for large craters
      if (radius > 15) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 150, 140, ${0.5})`;
        ctx.fill();
      }

      // Shadow on one side
      ctx.beginPath();
      ctx.arc(cx - radius * 0.1, cy - radius * 0.1, radius * 0.8, 0, Math.PI * 2);
      const shadowGrad = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.3, 0,
        cx, cy, radius
      );
      shadowGrad.addColorStop(0, `rgba(40, 35, 30, ${0.15})`);
      shadowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = shadowGrad;
      ctx.fill();
    };

    // Large craters
    for (let i = 0; i < 15; i++) {
      drawCrater(Math.random() * w, Math.random() * h, 20 + Math.random() * 35);
    }
    // Medium craters
    for (let i = 0; i < 50; i++) {
      drawCrater(Math.random() * w, Math.random() * h, 8 + Math.random() * 15);
    }
    // Small craters
    for (let i = 0; i < 200; i++) {
      drawCrater(Math.random() * w, Math.random() * h, 2 + Math.random() * 6);
    }

    // Surface dust/regolith texture
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
      const brightness = 80 + Math.random() * 60;
      ctx.fillStyle = `rgba(${brightness}, ${brightness - 5}, ${brightness - 10}, ${Math.random() * 0.3})`;
      ctx.fill();
    }

    // Ray patterns from major craters
    for (let r = 0; r < 5; r++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      for (let ray = 0; ray < 8; ray++) {
        const angle = (ray / 8) * Math.PI * 2 + Math.random() * 0.3;
        const length = 50 + Math.random() * 100;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx + Math.cos(angle) * length, ry + Math.sin(angle) * length);
        ctx.strokeStyle = `rgba(180, 175, 165, ${0.1 + Math.random() * 0.1})`;
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.stroke();
      }
    }

    const colorMap = new THREE.CanvasTexture(canvas);
    colorMap.wrapS = THREE.RepeatWrapping;

    // --- Bump map ---
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = w;
    bumpCanvas.height = h;
    const bctx = bumpCanvas.getContext('2d')!;
    bctx.fillStyle = '#808080';
    bctx.fillRect(0, 0, w, h);

    // Crater bumps
    for (let i = 0; i < 80; i++) {
      const cx = Math.random() * w;
      const cy = Math.random() * h;
      const radius = 3 + Math.random() * 25;
      // Rim = bright, floor = dark
      bctx.beginPath();
      bctx.arc(cx, cy, radius, 0, Math.PI * 2);
      bctx.strokeStyle = `rgba(200, 200, 200, 0.6)`;
      bctx.lineWidth = radius * 0.2;
      bctx.stroke();
      bctx.beginPath();
      bctx.arc(cx, cy, radius * 0.7, 0, Math.PI * 2);
      bctx.fillStyle = `rgba(50, 50, 50, 0.4)`;
      bctx.fill();
    }

    // Surface roughness
    for (let i = 0; i < 2000; i++) {
      bctx.beginPath();
      bctx.arc(Math.random() * w, Math.random() * h, Math.random() * 3, 0, Math.PI * 2);
      const v = 100 + Math.random() * 60;
      bctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.3)`;
      bctx.fill();
    }

    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    bumpMap.wrapS = THREE.RepeatWrapping;

    return { colorMap, bumpMap };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
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
      {/* Moon surface */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 128, 64]} />
        <meshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.08}
          shininess={2}
          specular={new THREE.Color('#222222')}
        />
      </mesh>

      {/* Subtle dust glow */}
      <mesh scale={1.02}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#a09888" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>

      {/* Faint rim light */}
      <mesh scale={1.06}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#c0b8a8" transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>

      {locations.map((loc, i) => (
        <group key={i} position={loc.position}>
          <Float speed={3} floatIntensity={0.2}>
            <mesh
              onPointerOver={() => setHoveredPoint(i)}
              onPointerOut={() => setHoveredPoint(null)}
              onClick={() => onLocationClick?.(loc.label)}
            >
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color={loc.color} />
            </mesh>
            {/* Pulse ring */}
            <mesh scale={2}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color={loc.color} transparent opacity={0.25} />
            </mesh>
            <mesh scale={3}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color={loc.color} transparent opacity={0.1} />
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
