import { useEffect, useRef } from 'react';

// ══════════════════════════════════════════════════════════════════
//  SpaceCanvas — Canvas 2D only. Zero external deps. No WebGL.
//  Green airglow is ANIMATED — drifting light pools at the horizon
//  at different depths/speeds → genuine 3D parallax feel.
// ══════════════════════════════════════════════════════════════════

function mkRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), s | 1) ^ (s + Math.imul(s ^ (s >>> 7), s | 61))) >>> 0;
    return s / 4294967296;
  };
}

// ── Static nebula — drawn ONCE to offscreen canvas ────────────────
// NOTE: green airglow is NOT here — it lives in the animated layer
function buildNebula(W, H) {
  const off = new OffscreenCanvas(W, H);
  const ctx = off.getContext('2d');

  // 1. Base black
  ctx.fillStyle = '#000408';
  ctx.fillRect(0, 0, W, H);

  // 2. Cold indigo sky
  const sky = ctx.createRadialGradient(W * 0.4, H * 0.1, 0, W * 0.5, H * 0.5, H * 1.3);
  sky.addColorStop(0,    'rgba(6,14,55,0.65)');
  sky.addColorStop(0.45, 'rgba(3,8,32,0.30)');
  sky.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // 3. Diagonal galactic band
  ctx.save();
  ctx.translate(W * 0.45, H * 0.5);
  ctx.rotate(-0.55);
  const bandW = W * 0.55, bandH = H * 1.6;
  const band = ctx.createLinearGradient(-bandW / 2, 0, bandW / 2, 0);
  band.addColorStop(0,    'rgba(0,0,0,0)');
  band.addColorStop(0.25, 'rgba(14,40,110,0.20)');
  band.addColorStop(0.45, 'rgba(25,65,160,0.28)');
  band.addColorStop(0.50, 'rgba(40,90,200,0.32)');
  band.addColorStop(0.55, 'rgba(25,65,160,0.28)');
  band.addColorStop(0.75, 'rgba(14,40,110,0.20)');
  band.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = band;
  ctx.fillRect(-bandW / 2, -bandH / 2, bandW, bandH);
  ctx.restore();

  // 4. Galactic centre — warm amber nucleus
  const gcX = W * 0.44, gcY = H * 0.62;
  const gc = ctx.createRadialGradient(gcX, gcY, 0, gcX, gcY, W * 0.18);
  gc.addColorStop(0,    'rgba(220,150,40,0.50)');
  gc.addColorStop(0.20, 'rgba(180,110,20,0.28)');
  gc.addColorStop(0.55, 'rgba(90,50,8,0.12)');
  gc.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = gc;
  ctx.fillRect(0, 0, W, H);
  const gcInner = ctx.createRadialGradient(gcX, gcY, 0, gcX, gcY, W * 0.06);
  gcInner.addColorStop(0,   'rgba(255,200,90,0.45)');
  gcInner.addColorStop(0.4, 'rgba(200,130,30,0.18)');
  gcInner.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = gcInner;
  ctx.fillRect(0, 0, W, H);

  // 5. Teal-blue star-forming regions
  [
    { x: 0.35, y: 0.30, r: 0.14, a: 0.32 },
    { x: 0.42, y: 0.48, r: 0.10, a: 0.24 },
    { x: 0.50, y: 0.22, r: 0.09, a: 0.20 },
    { x: 0.31, y: 0.55, r: 0.12, a: 0.22 },
  ].forEach(t => {
    const g = ctx.createRadialGradient(t.x * W, t.y * H, 0, t.x * W, t.y * H, t.r * W);
    g.addColorStop(0,   `rgba(15,140,175,${t.a})`);
    g.addColorStop(0.4, `rgba(8,90,120,${t.a * 0.45})`);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });

  // 6. Warm amber dust lanes
  [
    { x: 0.41, y: 0.58, rx: 0.18, ry: 0.10, a: 0.28 },
    { x: 0.46, y: 0.44, rx: 0.12, ry: 0.18, a: 0.22 },
    { x: 0.38, y: 0.70, rx: 0.20, ry: 0.08, a: 0.20 },
    { x: 0.50, y: 0.35, rx: 0.10, ry: 0.15, a: 0.18 },
  ].forEach(d => {
    ctx.save();
    ctx.translate(d.x * W, d.y * H);
    ctx.scale(1, d.ry / d.rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, d.rx * W);
    g.addColorStop(0,   `rgba(210,120,20,${d.a})`);
    g.addColorStop(0.5, `rgba(140,70,10,${d.a * 0.4})`);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, d.rx * W, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // 7. Cold blue-grey wisps
  [
    { x: 0.20, y: 0.25, r: 0.22, a: 0.14 },
    { x: 0.72, y: 0.35, r: 0.18, a: 0.12 },
    { x: 0.15, y: 0.60, r: 0.20, a: 0.13 },
    { x: 0.80, y: 0.55, r: 0.16, a: 0.10 },
    { x: 0.60, y: 0.15, r: 0.18, a: 0.11 },
  ].forEach(w => {
    const g = ctx.createRadialGradient(w.x * W, w.y * H, 0, w.x * W, w.y * H, w.r * W);
    g.addColorStop(0,   `rgba(40,55,110,${w.a})`);
    g.addColorStop(0.5, `rgba(20,28,65,${w.a * 0.5})`);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });

  // 8. Dark molecular clouds
  [
    { x: 0.38, y: 0.42, rx: 0.08, ry: 0.12, a: 0.62 },
    { x: 0.46, y: 0.30, rx: 0.06, ry: 0.10, a: 0.55 },
    { x: 0.43, y: 0.55, rx: 0.07, ry: 0.08, a: 0.50 },
    { x: 0.34, y: 0.65, rx: 0.09, ry: 0.07, a: 0.48 },
    { x: 0.50, y: 0.47, rx: 0.05, ry: 0.09, a: 0.45 },
  ].forEach(d => {
    ctx.save();
    ctx.translate(d.x * W, d.y * H);
    ctx.scale(1, d.ry / d.rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, d.rx * W);
    g.addColorStop(0,   `rgba(0,1,4,${d.a})`);
    g.addColorStop(0.5, `rgba(0,1,4,${d.a * 0.5})`);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, d.rx * W, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  ctx.globalCompositeOperation = 'source-over';

  // 9. Dense MW star pillar
  const pr = mkRng(0xABC99881);
  const mwX = W * 0.43;
  for (let i = 0; i < 6500; i++) {
    const u1 = pr() + 1e-10, u2 = pr();
    const gauss = Math.sqrt(-2 * Math.log(u1)) * Math.cos(Math.PI * 2 * u2);
    const y  = pr() * H * 0.90;
    const pX = mwX + (y / H) * W * 0.030;
    const sp = W * (0.038 + (y / H) * 0.018);
    const x  = pX + gauss * sp;
    if (x < 0 || x > W) continue;
    const dc  = Math.abs(x - pX) / sp;
    const brt = Math.pow(Math.max(0, 1 - dc * 0.72), 1.85);
    if (brt < 0.04) continue;
    ctx.globalAlpha = (pr() * 0.22 + 0.06) * brt;
    ctx.fillStyle   = dc < 0.30 ? '#cce0ff' : '#dce8ff';
    ctx.beginPath();
    ctx.arc(x, y, pr() * 0.22 + 0.05, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 10. Background haze — 8 000 faint stars
  const br = mkRng(0x11223344);
  for (let i = 0; i < 8000; i++) {
    ctx.globalAlpha = br() * 0.12 + 0.02;
    ctx.fillStyle   = '#b0c6ff';
    ctx.beginPath();
    ctx.arc(br() * W, br() * H * 0.96, br() * 0.20 + 0.06, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 11. Mid stars — 3 000, spectral palette
  const SPEC = ['#e4eeff','#d8e8ff','#f2f2ff','#fff8f0','#ffeedd','#ffd490','#ffb870','#ff9850'];
  const mr = mkRng(0x55667788);
  for (let i = 0; i < 3000; i++) {
    ctx.globalAlpha = mr() * 0.34 + 0.12;
    ctx.fillStyle   = SPEC[Math.floor(mr() * SPEC.length)];
    ctx.beginPath();
    ctx.arc(mr() * W, mr() * H * 0.93, mr() * 0.44 + 0.14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 12. Vignette
  const vig = ctx.createRadialGradient(W * 0.44, H * 0.44, H * 0.12, W * 0.44, H * 0.44, H);
  vig.addColorStop(0,    'rgba(0,0,0,0)');
  vig.addColorStop(0.55, 'rgba(0,0,0,0)');
  vig.addColorStop(0.80, 'rgba(0,0,0,0.42)');
  vig.addColorStop(1,    'rgba(0,1,5,0.94)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  return off;
}

// ── Bright twinkling star data ────────────────────────────────────
function buildBrightStars(W, H, count = 220) {
  const COLS = ['#ffffff','#eef4ff','#fff9f0','#ffeedd','#ffd08a','#ffba70'];
  const rng  = mkRng(0xCAFE0001);
  return Array.from({ length: count }, () => {
    const r = rng() * 1.30 + 0.55;
    const col = COLS[Math.floor(rng() * COLS.length)];
    return {
      x: rng() * W, y: rng() * H * 0.90,
      r, col,
      base:  rng() * 0.42 + 0.58,
      speed: rng() * 0.8  + 0.4,
      phase: rng() * Math.PI * 2,
      spike: r > 1.05,
      spikeLen: r * 11,
    };
  });
}

// ── Animated airglow pool definitions ────────────────────────────
// Each pool is an elliptical green glow at the horizon.
// depth  → vertical position (1 = horizon edge, smaller = higher up, more "in front")
// speed  → how fast it drifts horizontally
// phase  → starting horizontal offset (so they stagger naturally)
// pulse  → alpha oscillation speed
// These pool at different depths give the 3D parallax pass-by feeling.
function buildAirglowPools(W, H) {
  return [
    // deep background pools — wide, slow, near horizon edge
    { cx: 0.18, depth: 0.96, rw: 0.28, rh: 0.06, baseA: 0.28, speed: 0.024, phase: 0.00, pulse: 0.18 },
    { cx: 0.55, depth: 0.97, rw: 0.32, rh: 0.05, baseA: 0.22, speed: 0.018, phase: 2.10, pulse: 0.22 },
    { cx: 0.82, depth: 0.95, rw: 0.25, rh: 0.06, baseA: 0.25, speed: 0.030, phase: 4.40, pulse: 0.16 },
    // mid-depth pools — medium, medium speed
    { cx: 0.35, depth: 0.91, rw: 0.22, rh: 0.05, baseA: 0.32, speed: 0.044, phase: 1.20, pulse: 0.28 },
    { cx: 0.68, depth: 0.92, rw: 0.20, rh: 0.05, baseA: 0.28, speed: 0.038, phase: 3.80, pulse: 0.24 },
    // foreground pools — smaller, faster, highest up on screen
    { cx: 0.25, depth: 0.86, rw: 0.16, rh: 0.04, baseA: 0.38, speed: 0.062, phase: 0.70, pulse: 0.35 },
    { cx: 0.60, depth: 0.88, rw: 0.18, rh: 0.04, baseA: 0.34, speed: 0.055, phase: 5.20, pulse: 0.30 },
    { cx: 0.88, depth: 0.87, rw: 0.14, rh: 0.03, baseA: 0.30, speed: 0.070, phase: 2.90, pulse: 0.40 },
  ];
}

// Draw ONE animated airglow frame (called each RAF tick)
function drawAirglow(ctx, W, H, pools, t) {
  // Base gradient band — always present, very dark, anchors the green floor
  const base = ctx.createLinearGradient(0, H * 0.74, 0, H);
  base.addColorStop(0,    'rgba(0,0,0,0)');
  base.addColorStop(0.18, 'rgba(1,22,8,0.42)');
  base.addColorStop(0.55, 'rgba(1,16,6,0.68)');
  base.addColorStop(1,    'rgba(0,8,3,0.88)');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // Animated light pools — each one drifts + breathes
  pools.forEach(p => {
    // Drift horizontally — wraps seamlessly with modulo
    const drift  = (p.cx + Math.sin(t * p.speed + p.phase) * 0.12) % 1.0;
    const cx     = drift * W;
    const cy     = p.depth * H;
    const rw     = p.rw * W;
    const rh     = p.rh * H;

    // Breathing alpha — combination of two sine waves for organic feel
    const breathe = 0.55 + 0.28 * Math.sin(t * p.pulse + p.phase)
                        + 0.17 * Math.sin(t * p.pulse * 1.618 + p.phase * 0.7);
    const alpha = p.baseA * Math.max(0.2, breathe);

    // Draw as a horizontally-stretched ellipse via ctx.scale
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, rh / rw);

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rw);
    g.addColorStop(0,    `rgba(10,130,48,${alpha})`);
    g.addColorStop(0.35, `rgba(5,80,28,${alpha * 0.55})`);
    g.addColorStop(0.65, `rgba(2,45,15,${alpha * 0.22})`);
    g.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, rw, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Mirror pool past the right edge so horizontal drift is seamless
    if (cx + rw > W) {
      ctx.save();
      ctx.translate(cx - W, cy);
      ctx.scale(1, rh / rw);
      ctx.fillStyle = ctx.createRadialGradient(0, 0, 0, 0, 0, rw) ;
      const g2 = ctx.createRadialGradient(0, 0, 0, 0, 0, rw);
      g2.addColorStop(0,    `rgba(10,130,48,${alpha})`);
      g2.addColorStop(0.35, `rgba(5,80,28,${alpha * 0.55})`);
      g2.addColorStop(0.65, `rgba(2,45,15,${alpha * 0.22})`);
      g2.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(0, 0, rw, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (cx - rw < 0) {
      ctx.save();
      ctx.translate(cx + W, cy);
      ctx.scale(1, rh / rw);
      const g3 = ctx.createRadialGradient(0, 0, 0, 0, 0, rw);
      g3.addColorStop(0,    `rgba(10,130,48,${alpha})`);
      g3.addColorStop(0.35, `rgba(5,80,28,${alpha * 0.55})`);
      g3.addColorStop(0.65, `rgba(2,45,15,${alpha * 0.22})`);
      g3.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = g3;
      ctx.beginPath();
      ctx.arc(0, 0, rw, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });
}

export default function SpaceCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');

    let nebula      = buildNebula(W, H);
    let brightStars = buildBrightStars(W, H);
    let airPools    = buildAirglowPools(W, H);

    // ── Shooting streaks ──────────────────────────────────────────
    const STREAK_COLS = [
      [0.90, 0.85, 0.72],
      [0.62, 0.76, 1.00],
    ];
    const streaks = [];

    function spawnStreak() {
      const len = 60 + Math.random() * 200;
      const ang = Math.PI * (0.72 + Math.random() * 0.32);
      streaks.push({
        x: Math.random() * W, y: Math.random() * H * 0.7,
        dx: Math.cos(ang) * len, dy: Math.sin(ang) * len * 0.28,
        vx: Math.cos(ang) * (1.4 + Math.random() * 1.2),
        vy: Math.sin(ang) * (0.4 + Math.random() * 0.5),
        life: 1.0, decay: 0.018 + Math.random() * 0.022,
        col: STREAK_COLS[Math.random() < 0.6 ? 0 : 1],
      });
    }

    function drawStreak(s) {
      const [r, g, b] = s.col;
      const grd = ctx.createLinearGradient(s.x, s.y, s.x + s.dx, s.y + s.dy);
      grd.addColorStop(0,    `rgba(${r*255|0},${g*255|0},${b*255|0},0)`);
      grd.addColorStop(0.35, `rgba(${r*255|0},${g*255|0},${b*255|0},${s.life * 0.85})`);
      grd.addColorStop(0.65, `rgba(${r*255|0},${g*255|0},${b*255|0},${s.life * 0.85})`);
      grd.addColorStop(1,    `rgba(${r*255|0},${g*255|0},${b*255|0},0)`);
      ctx.strokeStyle = grd;
      ctx.lineWidth   = 1.2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + s.dx, s.y + s.dy);
      ctx.stroke();
    }

    // ── RAF loop ──────────────────────────────────────────────────
    let rafId;
    const t0 = performance.now();

    function loop(now) {
      rafId = requestAnimationFrame(loop);
      const t = (now - t0) * 0.001;

      // 1. Static nebula blit
      ctx.drawImage(nebula, 0, 0);

      // 2. Animated green airglow — drifting 3D pools
      drawAirglow(ctx, W, H, airPools, t);

      // 3. Bright twinkling stars (drawn on top so they show through the green)
      brightStars.forEach(s => {
        const a = s.base * (0.72 + 0.28 * Math.sin(t * s.speed + s.phase));
        ctx.globalAlpha = a;
        ctx.fillStyle   = s.col;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = a * 0.08;
        const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 7);
        halo.addColorStop(0, s.col);
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 7, 0, Math.PI * 2);
        ctx.fill();

        if (s.spike) {
          ctx.lineWidth = 0.45;
          [[0, -s.spikeLen, 0, s.spikeLen], [-s.spikeLen, 0, s.spikeLen, 0]].forEach(([x1, y1, x2, y2]) => {
            const sg = ctx.createLinearGradient(s.x + x1, s.y + y1, s.x + x2, s.y + y2);
            sg.addColorStop(0,    'rgba(0,0,0,0)');
            sg.addColorStop(0.45, s.col);
            sg.addColorStop(0.55, s.col);
            sg.addColorStop(1,    'rgba(0,0,0,0)');
            ctx.globalAlpha = a * 0.16;
            ctx.strokeStyle = sg;
            ctx.beginPath();
            ctx.moveTo(s.x + x1, s.y + y1);
            ctx.lineTo(s.x + x2, s.y + y2);
            ctx.stroke();
          });
        }
      });
      ctx.globalAlpha = 1;

      // 4. Shooting streaks
      if (Math.random() < 0.004) spawnStreak();
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        drawStreak(s);
        s.x += s.vx; s.y += s.vy; s.life -= s.decay;
        if (s.life <= 0) streaks.splice(i, 1);
      }
    }

    rafId = requestAnimationFrame(loop);

    function onResize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      nebula      = buildNebula(W, H);
      brightStars = buildBrightStars(W, H);
      airPools    = buildAirglowPools(W, H);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:          0,
        zIndex:         0,
        pointerEvents: 'none',
        display:       'block',
        width:         '100vw',
        height:        '100vh',
      }}
    />
  );
}
