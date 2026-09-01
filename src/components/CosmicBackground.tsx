import { useEffect, useRef } from 'react';

/**
 * Cinematic layered deep-space background.
 * Canvas-2D based (lightweight, no extra WebGL context), with:
 *  - 3 star depth layers + cosmic dust drifting toward the camera
 *  - mouse parallax (desktop) / gentle auto drift (touch)
 *  - scroll parallax at different speeds per layer
 *  - occasional shooting stars on different depth planes
 * Respects prefers-reduced-motion and scales density on small screens.
 */

interface Star {
  x: number;
  y: number;
  z: number; // depth layer 0..1 (0 = far, 1 = near)
  r: number;
  a: number;
  tw: number;
  hue: number;
}

interface Dust {
  x: number;
  y: number;
  z: number;
  speed: number;
  r: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  depth: number;
  len: number;
}

const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;
    const small = window.innerWidth < 768;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const starCount = small ? 420 : 1100;
    const dustCount = reduced ? 0 : small ? 60 : 160;

    let stars: Star[] = [];
    let dust: Dust[] = [];
    const meteors: Meteor[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const seed = () => {
      stars = Array.from({ length: starCount }, () => {
        const z = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.25 + z * 1.1,
          a: 0.25 + Math.random() * 0.6 * (0.4 + z),
          tw: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.75 ? 210 : Math.random() < 0.6 ? 190 : 265,
        };
      });
      dust = Array.from({ length: dustCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        speed: rand(0.002, 0.012),
        r: rand(0.4, 1.6),
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();

    // pointer / auto drift
    let targetX = 0;
    let targetY = 0;
    let px = 0;
    let py = 0;
    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / w - 0.5) * 2;
      targetY = (e.clientY / h - 0.5) * 2;
    };
    if (!isTouch && !reduced) window.addEventListener('mousemove', onMove, { passive: true });

    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    const spawnMeteor = () => {
      const depth = Math.random(); // 0 far (thin/slow) .. 1 near
      const fromTop = Math.random() < 0.7;
      const speed = 6 + depth * 12;
      const angle = rand(Math.PI * 0.12, Math.PI * 0.3);
      const dir = Math.random() < 0.5 ? 1 : -1;
      const x = fromTop ? rand(0, w) : dir > 0 ? -50 : w + 50;
      const y = fromTop ? rand(-40, h * 0.35) : rand(0, h * 0.5);
      meteors.push({
        x,
        y,
        vx: Math.cos(angle) * speed * dir,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: rand(60, 110),
        depth,
        len: 60 + depth * 160,
      });
    };

    let nextMeteor = performance.now() + rand(1500, 4000);
    let raf = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3);
      last = now;

      ctx.clearRect(0, 0, w, h);

      // smooth parallax easing (auto drift on touch / reduced motion)
      if (isTouch || reduced) {
        targetX = Math.sin(now * 0.00007) * 0.6;
        targetY = Math.cos(now * 0.00005) * 0.4;
      }
      px += (targetX - px) * 0.04 * dt;
      py += (targetY - py) * 0.04 * dt;

      // stars: three depth bands with different parallax + scroll speeds
      for (const s of stars) {
        const par = 4 + s.z * 26;
        const scrollPar = scrollY * (0.02 + s.z * 0.12);
        let x = s.x - px * par;
        let y = s.y - py * par - scrollPar;
        y = ((y % h) + h) % h;
        x = ((x % w) + w) % w;

        s.tw += 0.01 * dt;
        const twinkle = reduced ? 1 : 0.75 + Math.sin(s.tw) * 0.25;
        ctx.globalAlpha = s.a * twinkle;
        ctx.fillStyle =
          s.hue === 265 ? 'rgb(190,175,255)' : s.hue === 190 ? 'rgb(180,230,255)' : 'rgb(235,242,255)';
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.z > 0.92) {
          ctx.globalAlpha = s.a * 0.18 * twinkle;
          ctx.beginPath();
          ctx.arc(x, y, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // cosmic dust drifting toward the camera
      for (const d of dust) {
        d.z += d.speed * dt;
        if (d.z > 1) {
          d.z = 0.02;
          d.x = Math.random() * w;
          d.y = Math.random() * h;
        }
        const scale = 0.3 + d.z * 1.9;
        const cx = w / 2;
        const cy = h / 2;
        const x = cx + (d.x - cx) * scale - px * 40 * d.z;
        const y = cy + (d.y - cy) * scale - py * 40 * d.z - scrollY * 0.05 * d.z;
        if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;
        ctx.globalAlpha = Math.min(0.35, d.z * 0.4) * (1 - d.z * 0.3);
        ctx.fillStyle = 'rgb(200,225,255)';
        ctx.beginPath();
        ctx.arc(x, y, d.r * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // shooting stars
      if (!reduced && now > nextMeteor) {
        spawnMeteor();
        nextMeteor = now + rand(2500, 7000);
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        const accel = 1 + m.life / m.maxLife * 0.6; // realistic acceleration
        m.x += m.vx * dt * accel * 0.6;
        m.y += m.vy * dt * accel * 0.6;
        m.life += dt;
        const t = m.life / m.maxLife;
        const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        if (t >= 1 || m.x < -300 || m.x > w + 300 || m.y > h + 300) {
          meteors.splice(i, 1);
          continue;
        }
        const nx = m.vx / Math.hypot(m.vx, m.vy);
        const ny = m.vy / Math.hypot(m.vx, m.vy);
        const tailX = m.x - nx * m.len;
        const tailY = m.y - ny * m.len;
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
        grad.addColorStop(0.25, `rgba(170,215,255,${0.45 * fade})`);
        grad.addColorStop(1, 'rgba(140,180,255,0)');
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8 + m.depth * 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        const head = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 5 + m.depth * 6);
        head.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`);
        head.addColorStop(1, 'rgba(150,200,255,0)');
        ctx.fillStyle = head;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 5 + m.depth * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* deep space base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_-10%,hsl(258_90%_66%_/_0.10),transparent_55%),radial-gradient(ellipse_at_85%_15%,hsl(187_94%_53%_/_0.08),transparent_50%),radial-gradient(ellipse_at_50%_110%,hsl(258_90%_40%_/_0.12),transparent_60%)]" />
      {/* slow drifting nebula clouds */}
      <div className="nebula-layer nebula-a" />
      <div className="nebula-layer nebula-b" />
      {/* distant galaxies */}
      <div className="galaxy-smudge left-[12%] top-[18%]" />
      <div className="galaxy-smudge right-[10%] bottom-[22%] opacity-70" />
      {/* stars, dust, meteors */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* vignette to keep text contrast strong */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,hsl(222_47%_5%_/_0.75)_100%)]" />
    </div>
  );
};

export default CosmicBackground;
