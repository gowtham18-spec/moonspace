import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';

const Earth = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { colorMap, bumpMap } = useMemo(() => {
    // --- Realistic Earth color texture ---
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Deep ocean base gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#1a3a6e');
    oceanGrad.addColorStop(0.2, '#1b4f8a');
    oceanGrad.addColorStop(0.5, '#1565a8');
    oceanGrad.addColorStop(0.8, '#1b4f8a');
    oceanGrad.addColorStop(1, '#1a3a6e');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Add ocean color variation
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = Math.random() * 30 + 10;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${20 + Math.random() * 30}, ${70 + Math.random() * 40}, ${140 + Math.random() * 40}, 0.3)`;
      ctx.fill();
    }

    // Continents - rough landmass shapes
    const drawContinent = (cx: number, cy: number, size: number, color: string, irregularity = 0.4) => {
      const points = 12 + Math.floor(Math.random() * 8);
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const radius = size * (1 + (Math.random() - 0.5) * irregularity);
        const px = cx + Math.cos(angle) * radius * (1.2 + Math.random() * 0.5);
        const py = cy + Math.sin(angle) * radius * (0.8 + Math.random() * 0.3);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    // Major landmasses
    // North America
    drawContinent(220, 140, 70, '#2d6a1e');
    drawContinent(200, 120, 50, '#3a7d2e');
    drawContinent(250, 160, 40, '#2a5e1a');
    // South America  
    drawContinent(280, 300, 45, '#347524');
    drawContinent(270, 340, 35, '#2d6a1e');
    // Europe
    drawContinent(500, 130, 35, '#4a8a3a');
    drawContinent(520, 140, 25, '#3a7d2e');
    // Africa
    drawContinent(520, 240, 65, '#5a8a30');
    drawContinent(530, 280, 50, '#4d7d28');
    drawContinent(510, 220, 40, '#6a9a40');
    // Asia
    drawContinent(650, 140, 90, '#3a7d2e');
    drawContinent(700, 160, 70, '#4a8a3a');
    drawContinent(750, 180, 50, '#2d6a1e');
    drawContinent(620, 120, 55, '#347524');
    // India
    drawContinent(660, 230, 30, '#5a8a30');
    // Australia
    drawContinent(800, 320, 45, '#8a6a30');
    drawContinent(810, 310, 35, '#7a5a28');
    // Antarctica
    drawContinent(512, 480, 80, '#d8e8f0');
    drawContinent(512, 490, 60, '#e0f0f8');

    // Add terrain detail (mountains, deserts, forests)
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = Math.random() * 8 + 2;
      const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      // Only add detail on land (green-ish pixels)
      if (pixel[1] > 80) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        const shade = Math.random();
        if (shade < 0.3) {
          ctx.fillStyle = `rgba(90, 70, 30, ${Math.random() * 0.4})`; // desert
        } else if (shade < 0.6) {
          ctx.fillStyle = `rgba(20, 80, 15, ${Math.random() * 0.5})`; // dark forest
        } else {
          ctx.fillStyle = `rgba(100, 100, 90, ${Math.random() * 0.3})`; // mountains
        }
        ctx.fill();
      }
    }

    // Ice caps
    const iceGrad1 = ctx.createRadialGradient(512, 0, 0, 512, 0, 200);
    iceGrad1.addColorStop(0, 'rgba(230, 240, 255, 0.9)');
    iceGrad1.addColorStop(0.5, 'rgba(200, 220, 240, 0.4)');
    iceGrad1.addColorStop(1, 'rgba(200, 220, 240, 0)');
    ctx.fillStyle = iceGrad1;
    ctx.fillRect(0, 0, 1024, 80);

    const colorMap = new THREE.CanvasTexture(canvas);
    colorMap.wrapS = THREE.RepeatWrapping;

    // --- Bump map ---
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 1024;
    bumpCanvas.height = 512;
    const bctx = bumpCanvas.getContext('2d')!;
    bctx.fillStyle = '#000';
    bctx.fillRect(0, 0, 1024, 512);

    // Copy land areas as bright regions for bump
    const imgData = ctx.getImageData(0, 0, 1024, 512);
    const bumpData = bctx.getImageData(0, 0, 1024, 512);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const g = imgData.data[i + 1];
      if (g > 80) {
        const height = Math.min(255, g * 1.5);
        bumpData.data[i] = height;
        bumpData.data[i + 1] = height;
        bumpData.data[i + 2] = height;
      }
      bumpData.data[i + 3] = 255;
    }
    bctx.putImageData(bumpData, 0, 0);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    bumpMap.wrapS = THREE.RepeatWrapping;

    return { colorMap, bumpMap };
  }, []);

  const cloudTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 1024, 512);

    // Cloud bands and swirls
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const w = Math.random() * 120 + 30;
      const h = Math.random() * 30 + 10;
      const opacity = Math.random() * 0.6 + 0.1;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * 0.5 - 0.25);
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
      ctx.restore();
    }

    // Cyclone patterns
    for (let c = 0; c < 4; c++) {
      const cx = Math.random() * 1024;
      const cy = 150 + Math.random() * 200;
      for (let s = 0; s < 20; s++) {
        const angle = s * 0.5;
        const dist = s * 3;
        const sx = cx + Math.cos(angle) * dist;
        const sy = cy + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(sx, sy, 8 + Math.random() * 12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 - s * 0.01})`;
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = t * 0.06;
      cloudsRef.current.rotation.x = Math.sin(t * 0.02) * 0.02;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <group>
        {/* Earth surface */}
        <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <sphereGeometry args={[1.5, 128, 64]} />
          <meshPhongMaterial
            map={colorMap}
            bumpMap={bumpMap}
            bumpScale={0.05}
            specularMap={bumpMap}
            specular={new THREE.Color('#334466')}
            shininess={15}
          />
        </mesh>

        {/* Cloud layer */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.52, 64, 32]} />
          <meshPhongMaterial map={cloudTexture} transparent opacity={0.45} depthWrite={false} />
        </mesh>

        {/* Inner atmosphere glow */}
        <mesh scale={1.03}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color="#4a9eff" transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>

        {/* Outer atmosphere */}
        <mesh scale={1.12}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color="#6ab7ff" transparent opacity={0.04} side={THREE.BackSide} />
        </mesh>

        {/* Atmospheric rim */}
        <mesh scale={1.2}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color="#87ceeb" transparent opacity={0.02} side={THREE.BackSide} />
        </mesh>

        {hovered && (
          <Html distanceFactor={8}>
            <div className="glass-card px-3 py-1.5 text-xs text-primary whitespace-nowrap">
              Earth Spaceport
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
};

export default Earth;
