import { useEffect, useRef } from 'react';

export default function SpaceCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    // Stars
    const STAR_COUNT = 340;
    const COLS = ['#e8f0ff', '#c8d8ff', '#ffd8a8', '#a8d0ff', '#ffffff'];
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random() * 0.65 + 0.2,
      speed: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2,
      color: COLS[Math.floor(Math.random() * COLS.length)],
    }));

    // Shooting stars
    const shoots = [];
    function spawnShoot() {
      shoots.push({
        x: Math.random() * W * 1.2 - W * 0.1,
        y: Math.random() * H * 0.5,
        len: 60 + Math.random() * 90,
        angle: Math.PI * 0.76 + Math.random() * 0.28,
        speed: 6 + Math.random() * 6,
        life: 1,
        decay: 0.016 + Math.random() * 0.016,
      });
    }

    let tick = 0;
    let rafId;

    function draw() {
      rafId = requestAnimationFrame(draw);
      tick += 0.01;

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#03050d');
      bg.addColorStop(1, '#07090f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Nebula glows
      [
        [W * 0.75, H * 0.25, W * 0.30, 'rgba(0,50,200,0.07)'],
        [W * 0.15, H * 0.60, W * 0.22, 'rgba(0,120,255,0.05)'],
        [W * 0.50, H * 0.45, W * 0.38, 'rgba(5,20,70,0.07)'],
        [W * 0.88, H * 0.78, W * 0.18, 'rgba(70,10,110,0.06)'],
      ].forEach(([nx, ny, nr, nc]) => {
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
        g.addColorStop(0, nc); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });

      // Stars with twinkle
      stars.forEach(s => {
        const tw = s.alpha * (0.65 + 0.35 * Math.sin(tick * s.speed * 3 + s.phase));
        ctx.globalAlpha = tw;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.r > 1.0) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
          glow.addColorStop(0, `rgba(180,210,255,${tw * 0.22})`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      });

      // Shooting stars
      if (Math.random() < 0.004) spawnShoot();
      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i];
        const ex = s.x + Math.cos(s.angle) * s.len;
        const ey = s.y + Math.sin(s.angle) * s.len;
        const grad = ctx.createLinearGradient(s.x, s.y, ex, ey);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.5, `rgba(200,225,255,${s.life * 0.55})`);
        grad.addColorStop(1, `rgba(255,255,255,${s.life * 0.85})`);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y); ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.3; ctx.stroke();
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= s.decay;
        if (s.life <= 0) shoots.splice(i, 1);
      }
    }

    draw();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="space-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'block' }}
    />
  );
}
