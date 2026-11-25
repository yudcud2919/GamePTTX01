import React, { useEffect, useRef } from 'react';

/**
 * 60FPS Living Winter Pixel-Art Coastal Panorama (HTML5 Canvas)
 * Features:
 * - Subtle mouse parallax depth across 5 scenic layers
 * - Gentle shimmering aurora ribbon & twinkling pixel stars
 * - Bobbing distant fishing boat ("Chiếc thuyền ngoài xa") with animated water lantern reflections
 * - Sweeping warm lighthouse beam, cozy glowing cabin with rising pixel chimney smoke
 * - Twinkling Christmas fairy lights on snow-capped pine trees
 * - 3 depth layers of drifting snow + floating warm golden lantern motes
 */
export const DynamicWinterCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; tx: number; ty: number }>({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Logical pixel-art-friendly internal resolution for crisp retro feel
    const W = 720;
    const H = 405;
    canvas.width = W;
    canvas.height = H;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Deterministic stars
    const stars = Array.from({ length: 48 }, (_, i) => ({
      x: (i * 97 + 23) % W,
      y: (i * 53 + 11) % 165,
      size: i % 5 === 0 ? 2 : 1,
      phase: i * 0.9,
      speed: 1.2 + (i % 4) * 0.5,
    }));

    // 3-depth snowflakes
    const snow = Array.from({ length: 85 }, (_, i) => {
      const layer = i % 3; // 0: far, 1: mid, 2: near
      return {
        x: (i * 41) % W,
        y: (i * 29) % H,
        size: layer === 2 ? 3 : layer === 1 ? 2 : 1,
        vy: layer === 2 ? 28 : layer === 1 ? 18 : 11,
        vx: -4 - layer * 2.5,
        swayPhase: i * 0.7,
        alpha: layer === 2 ? 0.85 : layer === 1 ? 0.6 : 0.35,
      };
    });

    // Floating chimney smoke puffs from right cabin
    const smoke = Array.from({ length: 12 }, (_, i) => ({
      age: i / 12,
      drift: (i % 3) * 0.4,
    }));

    // Floating warm golden embers / fairy motes
    const embers = Array.from({ length: 18 }, (_, i) => ({
      x: 420 + ((i * 59) % 280),
      y: 260 + ((i * 37) % 130),
      phase: i * 1.1,
      speed: 0.7 + (i % 4) * 0.25,
    }));

    // Pine trees
    const pines = [
      { x: 32, y: 270, s: 1.25 },
      { x: 76, y: 278, s: 1.0 },
      { x: 122, y: 290, s: 0.85 },
      { x: 560, y: 286, s: 0.9 },
      { x: 616, y: 266, s: 1.28 },
      { x: 672, y: 275, s: 1.08 },
    ];

    let rafId = 0;
    let last = performance.now();

    const drawPine = (
      x: number,
      y: number,
      s: number,
      t: number,
      seed: number
    ) => {
      ctx.save();
      ctx.translate(Math.round(x), Math.round(y));
      ctx.scale(s, s);

      // Trunk
      ctx.fillStyle = '#3b2b23';
      ctx.fillRect(12, 42, 6, 12);

      // 3 evergreen pixel tiers
      const drawTri = (topY: number, halfW: number, h: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(15, topY);
        ctx.lineTo(15 + halfW, topY + h);
        ctx.lineTo(15 - halfW, topY + h);
        ctx.closePath();
        ctx.fill();
      };

      drawTri(0, 14, 19, '#234c43');
      drawTri(11, 17, 21, '#1d4039');
      drawTri(23, 20, 22, '#16322d');

      // Snow cap
      drawTri(0, 7, 9, 'rgba(238,245,241,0.86)');

      // Twinkling Christmas fairy lights
      const lights = [
        { lx: 11, ly: 17, c: '#f5d497' },
        { lx: 19, ly: 26, c: '#e07c7f' },
        { lx: 9, ly: 35, c: '#a7d4bf' },
        { lx: 21, ly: 38, c: '#f5d497' },
      ];
      lights.forEach((l, idx) => {
        const pulse = 0.45 + 0.55 * Math.sin(t * 2.4 + seed * 1.7 + idx * 1.3);
        ctx.fillStyle = l.c;
        ctx.globalAlpha = pulse;
        ctx.fillRect(l.lx, l.ly, 2, 2);
      });
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now * 0.001;

      // Smooth mouse parallax interpolation
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * Math.min(1, dt * 4);
      m.y += (m.ty - m.y) * Math.min(1, dt * 4);

      ctx.imageSmoothingEnabled = false;

      // 1. TWILIGHT WINTER SKY GRADIENT
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 265);
      skyGrad.addColorStop(0, '#09141d');
      skyGrad.addColorStop(0.4, '#16313d');
      skyGrad.addColorStop(0.75, '#426267');
      skyGrad.addColorStop(0.95, '#bd8f72');
      skyGrad.addColorStop(1, '#183037');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, 265);

      // Soft Sunrise / Horizon Glow
      const glow = ctx.createRadialGradient(
        515 - m.x * 8,
        235 - m.y * 5,
        10,
        515 - m.x * 8,
        235 - m.y * 5,
        220
      );
      glow.addColorStop(0, 'rgba(245, 212, 151, 0.52)');
      glow.addColorStop(0.5, 'rgba(142, 195, 207, 0.14)');
      glow.addColorStop(1, 'rgba(22, 49, 61, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, 265);

      // Subtle Animated Northern Aurora Wave
      ctx.save();
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const baseY = 58 + i * 16;
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= W; x += 24) {
          const wave =
            Math.sin(x * 0.012 + t * 0.45 + i * 0.8) * 14 +
            Math.cos(x * 0.006 - t * 0.25) * 8;
          ctx.lineTo(x, baseY + wave);
        }
        ctx.strokeStyle =
          i % 2 === 0
            ? 'rgba(167, 212, 191, 0.09)'
            : 'rgba(142, 195, 207, 0.07)';
        ctx.lineWidth = 14;
        ctx.stroke();
      }
      ctx.restore();

      // 2. TWINKLING PIXEL STARS + MOON
      stars.forEach((s) => {
        const a = 0.25 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.fillStyle = `rgba(251, 248, 241, ${a.toFixed(2)})`;
        ctx.fillRect(
          Math.round(s.x - m.x * 4),
          Math.round(s.y - m.y * 2),
          s.size,
          s.size
        );
      });

      const moonX = Math.round(528 - m.x * 5);
      const moonY = Math.round(62 - m.y * 3);
      ctx.fillStyle = 'rgba(251, 244, 226, 0.92)';
      ctx.fillRect(moonX, moonY + 3, 24, 18);
      ctx.fillRect(moonX + 3, moonY, 18, 24);
      ctx.fillStyle = 'rgba(226, 215, 194, 0.5)';
      ctx.fillRect(moonX + 7, moonY + 7, 5, 5);

      // 3. DISTANT SNOWY MOUNTAIN RANGE (Layer parallax)
      const mtOx = -m.x * 9;
      ctx.fillStyle = '#1f3a43';
      ctx.beginPath();
      ctx.moveTo(-20 + mtOx, 255);
      ctx.lineTo(72 + mtOx, 178);
      ctx.lineTo(150 + mtOx, 212);
      ctx.lineTo(240 + mtOx, 158);
      ctx.lineTo(335 + mtOx, 206);
      ctx.lineTo(426 + mtOx, 168);
      ctx.lineTo(535 + mtOx, 214);
      ctx.lineTo(626 + mtOx, 164);
      ctx.lineTo(745 + mtOx, 212);
      ctx.lineTo(745 + mtOx, 260);
      ctx.lineTo(-20 + mtOx, 260);
      ctx.closePath();
      ctx.fill();

      // Snow caps on peaks
      ctx.fillStyle = 'rgba(226, 237, 234, 0.52)';
      [
        [240, 158],
        [426, 168],
        [626, 164],
      ].forEach(([px, py]) => {
        ctx.beginPath();
        ctx.moveTo(px + mtOx, py);
        ctx.lineTo(px + 22 + mtOx, py + 17);
        ctx.lineTo(px + 4 + mtOx, py + 20);
        ctx.lineTo(px - 18 + mtOx, py + 16);
        ctx.closePath();
        ctx.fill();
      });

      // 4. MISTY WINTER BAY + ANIMATED WATER SHIMMER
      const waterGrad = ctx.createLinearGradient(0, 252, 0, H);
      waterGrad.addColorStop(0, '#4e6c73');
      waterGrad.addColorStop(0.52, '#1b3540');
      waterGrad.addColorStop(1, '#0d1c24');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 252, W, H - 252);

      // Animated gentle water reflections
      for (let i = 0; i < 8; i++) {
        const rx =
          450 +
          Math.sin(t * 1.4 + i * 0.9) * 10 +
          i * 3 -
          m.x * 11;
        const ry = 266 + i * 8;
        const rw = Math.max(18, 68 - i * 6);
        ctx.fillStyle = `rgba(245, 212, 151, ${(0.32 - i * 0.032).toFixed(2)})`;
        ctx.fillRect(Math.round(rx), ry, rw, 2);
      }

      // Drifting horizontal morning sea mist bands
      for (let i = 0; i < 3; i++) {
        const mx = ((t * (10 + i * 4) + i * 260) % (W + 240)) - 120;
        const mistGrad = ctx.createLinearGradient(mx, 0, mx + 180, 0);
        mistGrad.addColorStop(0, 'rgba(220,234,232,0)');
        mistGrad.addColorStop(0.5, 'rgba(220,234,232,0.11)');
        mistGrad.addColorStop(1, 'rgba(220,234,232,0)');
        ctx.fillStyle = mistGrad;
        ctx.fillRect(mx, 238 + i * 11, 180, 12);
      }

      // 5. DISTANT BOBBING PIXEL FISHING BOAT ("Chiếc thuyền ngoài xa")
      const boatX = Math.round(458 - m.x * 12 + Math.sin(t * 0.5) * 4);
      const boatY = Math.round(234 + Math.sin(t * 1.55) * 2.2);
      ctx.save();
      ctx.translate(boatX, boatY);
      ctx.fillStyle = '#172930';
      ctx.fillRect(8, 17, 48, 6);
      ctx.fillStyle = '#203840';
      ctx.fillRect(3, 14, 58, 4);
      ctx.fillStyle = '#27434b';
      ctx.fillRect(22, 7, 16, 8);
      // Glowing lantern window
      ctx.fillStyle = '#f5d497';
      ctx.fillRect(27, 10, 5, 3);
      // Mast & sail
      ctx.fillStyle = '#192d34';
      ctx.fillRect(17, -9, 2, 24);
      ctx.fillStyle = 'rgba(224,234,230,0.78)';
      ctx.beginPath();
      ctx.moveTo(19, -7);
      ctx.lineTo(39, 6);
      ctx.lineTo(19, 7);
      ctx.closePath();
      ctx.fill();
      // Bow lantern glow
      ctx.fillStyle = '#f5d497';
      ctx.fillRect(54, 10, 3, 3);
      ctx.restore();

      // 6. FOREGROUND SNOWY SHORE + COZY CABIN + LIGHTHOUSE BEAM
      const fgOx = -m.x * 18;
      ctx.fillStyle = '#13282e';
      ctx.beginPath();
      ctx.moveTo(-25 + fgOx, 318);
      ctx.lineTo(140 + fgOx, 305);
      ctx.lineTo(255 + fgOx, 336);
      ctx.lineTo(345 + fgOx, 358);
      ctx.lineTo(510 + fgOx, 348);
      ctx.lineTo(645 + fgOx, 312);
      ctx.lineTo(745 + fgOx, 322);
      ctx.lineTo(745 + fgOx, H + 10);
      ctx.lineTo(-25 + fgOx, H + 10);
      ctx.closePath();
      ctx.fill();

      // Snow rim
      ctx.strokeStyle = 'rgba(224, 236, 233, 0.36)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-25 + fgOx, 320);
      ctx.lineTo(140 + fgOx, 307);
      ctx.lineTo(255 + fgOx, 338);
      ctx.lineTo(345 + fgOx, 360);
      ctx.lineTo(510 + fgOx, 350);
      ctx.lineTo(645 + fgOx, 314);
      ctx.lineTo(745 + fgOx, 324);
      ctx.stroke();

      // Cozy Glowing Timber Cabin on Right Shore
      const cabX = Math.round(528 + fgOx);
      const cabY = 297;
      // Chimney + animated rising pixel smoke
      ctx.fillStyle = '#47362e';
      ctx.fillRect(cabX + 34, cabY + 2, 5, 11);
      smoke.forEach((p) => {
        p.age = (p.age + dt * 0.24) % 1;
        const sx = cabX + 36 + Math.sin(p.age * 5 + p.drift) * 6 + p.age * 10;
        const sy = cabY - p.age * 36;
        const sz = 2 + Math.floor(p.age * 4);
        ctx.fillStyle = `rgba(226, 236, 234, ${((1 - p.age) * 0.42).toFixed(2)})`;
        ctx.fillRect(Math.round(sx), Math.round(sy), sz, sz);
      });

      // Cabin walls & roof
      ctx.fillStyle = '#3b2e28';
      ctx.fillRect(cabX + 6, cabY + 12, 38, 22);
      ctx.fillStyle = '#274540';
      ctx.beginPath();
      ctx.moveTo(cabX + 2, cabY + 14);
      ctx.lineTo(cabX + 25, cabY - 2);
      ctx.lineTo(cabX + 48, cabY + 14);
      ctx.closePath();
      ctx.fill();
      // Roof snow trim
      ctx.strokeStyle = 'rgba(241, 247, 243, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cabX + 3, cabY + 13);
      ctx.lineTo(cabX + 25, cabY - 1);
      ctx.lineTo(cabX + 47, cabY + 13);
      ctx.stroke();
      // Warm flickering windows
      const winAlpha = 0.85 + 0.15 * Math.sin(t * 4.5);
      ctx.fillStyle = `rgba(245, 212, 151, ${winAlpha.toFixed(2)})`;
      ctx.fillRect(cabX + 11, cabY + 18, 8, 7);
      ctx.fillRect(cabX + 31, cabY + 18, 8, 7);
      // Door & holly wreath
      ctx.fillStyle = '#5c3f30';
      ctx.fillRect(cabX + 22, cabY + 21, 6, 13);
      ctx.fillStyle = '#c75b5f';
      ctx.fillRect(cabX + 24, cabY + 24, 2, 2);

      // Foreground Pine Trees with twinkling Christmas lights
      pines.forEach((p, idx) => {
        drawPine(p.x + fgOx, p.y, p.s, t, idx + 1);
      });

      // Warm Golden Floating Lantern Motes
      embers.forEach((e) => {
        const ey = e.y - ((t * 10 * e.speed + e.phase * 20) % 90);
        const ex = e.x + Math.sin(t * 1.4 + e.phase) * 8 + fgOx * 0.5;
        const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.5 + e.phase));
        ctx.fillStyle = `rgba(245, 212, 151, ${alpha.toFixed(2)})`;
        ctx.fillRect(Math.round(ex), Math.round(ey), 2, 2);
      });

      // 7. 3-LAYER GENTLY SWIRLING PIXEL SNOW
      snow.forEach((f) => {
        f.y += f.vy * dt;
        f.x += (f.vx + Math.sin(t * 1.2 + f.swayPhase) * 6) * dt;
        if (f.y > H + 4) {
          f.y = -4;
          f.x = Math.random() * W;
        }
        if (f.x < -4) f.x = W + 4;
        if (f.x > W + 4) f.x = -4;

        ctx.fillStyle = `rgba(251, 248, 241, ${f.alpha})`;
        ctx.fillRect(Math.round(f.x), Math.round(f.y), f.size, f.size);
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pixelated pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
  );
};
