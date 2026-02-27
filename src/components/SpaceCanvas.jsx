import { useEffect, useRef } from 'react';

// ══════════════════════════════════════════════════════════════════
//  SpaceCanvas — Canvas 2D only. Zero external deps. No WebGL.
//
//  Visual: matches the portfolio background —
//    diagonal galactic band · warm amber dust lanes ·
//    teal-blue star pools · dark molecular clouds ·
//    spectral stars with twinkle · occasional shooting stars
//
//  PERF strategy:
//    • Nebula + static stars → drawn ONCE to an offscreen canvas
//    • Each frame → blit offscreen (1 drawImage call) + draw
//      twinkling bright stars + update shooting streaks
//    • No pixel-level work per frame → stays at 60fps
// ══════════════════════════════════════════════════════════════════

// ── Seeded deterministic random ──────────────────────────────────
function mkRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), s | 1) ^ (s + Math.imul(s ^ (s >>> 7), s | 61))) >>> 0;
    return s / 4294967296;
  };
}

// ── Value noise (1 octave) ────────────────────────────────────────
// Used to give organic variation to gradient positions / sizes
function hash2(x, y) {
  let h = (((x * 374761393 + y * 668265263) >>> 0) ^ ((x * 374761393 + y * 668265263) >>> 13));
  h = Math.imul(h, 1274126177) >>> 0;
  return (h >>> 0) / 4294967296;
}

// ── Draw the static nebula background to an offscreen canvas ─────
function buildNebula(W, H) {
  const off = new OffscreenCanvas(W, H);
  const ctx = off.getContext('2d');
  const rng = mkRng(0xDEAD1337);

  // 1. BASE — deep black
  ctx.fillStyle = '#000408';
  ctx.fillRect(0, 0, W, H);

  // 2. COLD AMBIENT SKY — deep indigo blue
  const sky = ctx.createRadialGradient(W * 0.4, H * 0.1, 0, W * 0.5, H * 0.5, H * 1.3);
  sky.addColorStop(0,    'rgba(6,14,55,0.65)');
  sky.addColorStop(0.45, 'rgba(3,8,32,0.30)');
  sky.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // 3. DIAGONAL GALACTIC BAND — wide diffuse glow
  // The band goes from lower-left to upper-right, like in the photo.
  // We fake the diagonal by rotating a linear gradient strip.
  ctx.save();
  ctx.translate(W * 0.45, H * 0.5);
  ctx.rotate(-0.55); // ~31° diagonal
  const bandW = W * 0.55;
  const bandH = H * 1.6;
  const band = ctx.createLinearGradient(-bandW / 2, 0, bandW / 2, 0);
  band.addColorStop(0,    'rgba(0,0,0,0)');
  band.addColorStop(0.25, 'rgba(14,40,110,0.20)');
  band.addColorStop(0.45, 'rgba(25,65,160,0.28)');
  band.addColorStop(0.50, 'rgba(40,90,200,0.32)');   // bright core
  band.addColorStop(0.55, 'rgba(25,65,160,0.28)');
  band.addColorStop(0.75, 'rgba(14,40,110,0.20)');
  band.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = band;
  ctx.fillRect(-bandW / 2, -bandH / 2, bandW, bandH);
  ctx.restore();

  // 4. GALACTIC CENTRE — warm amber/orange nucleus
  const gcX = W * 0.44, gcY = H * 0.62;
  const gc = ctx.createRadialGradient(gcX, gcY, 0, gcX, gcY, W * 0.18);
  gc.addColorStop(0,    'rgba(220,150,40,0.50)');
  gc.addColorStop(0.20, 'rgba(180,110,20,0.28)');
  gc.addColorStop(0.55, 'rgba(90,50,8,0.12)');
  gc.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = gc;
  ctx.fillRect(0, 0, W, H);

  // Brighter pinpoint core
  const gcInner = ctx.createRadialGradient(gcX, gcY, 0, gcX, gcY, W * 0.06);
  gcInner.addColorStop(0,   'rgba(255,200,90,0.45)');
  gcInner.addColorStop(0.4, 'rgba(200,130,30,0.18)');
  gcInner.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = gcInner;
  ctx.fillRect(0, 0, W, H);

  // 5. TEAL-BLUE star-forming regions
  const teals = [
    { x: 0.35, y: 0.30, r: 0.14, a: 0.32 },
    { x: 0.42, y: 0.48, r: 0.10, a: 0.24 },
    { x: 0.50, y: 0.22, r: 0.09, a: 0.20 },
    { x: 0.31, y: 0.55, r: 0.12, a: 0.22 },
  ];
  teals.forEach(t => {
    const g = ctx.createRadialGradient(t.x * W, t.y * H, 0, t.x * W, t.y * H, t.r * W);
    g.addColorStop(0,   `rgba(15,140,175,${t.a})`);
    g.addColorStop(0.4, `rgba(8,90,120,${t.a * 0.45})`);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });

  // 6. WARM AMBER DUST LANES — overlapping warm blobs
  const ambers = [
    { x: 0.41, y: 0.58, rx: 0.18, ry: 0.10, a: 0.28 },
    { x: 0.46, y: 0.44, rx: 0.12, ry: 0.18, a: 0.22 },
    { x: 0.38, y: 0.70, rx: 0.20, ry: 0.08, a: 0.20 },
    { x: 0.50, y: 0.35, rx: 0.10, ry: 0.15, a: 0.18 },
  ];
  ambers.forEach(d => {
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

  // 7. COLD BLUE-GREY WISPS — outer edges
  const wisps = [
    { x: 0.20, y: 0.25, r: 0.22, a: 0.14 },
    { x: 0.72, y: 0.35, r: 0.18, a: 0.12 },
    { x: 0.15, y: 0.60, r: 0.20, a: 0.13 },
    { x: 0.80, y: 0.55, r: 0.16, a: 0.10 },
    { x: 0.60, y: 0.15, r: 0.18, a: 0.11 },
  ];
  wisps.forEach(w => {
    const g = ctx.createRadialGradient(w.x * W, w.y * H, 0, w.x * W, w.y * H, w.r * W);
    g.addColorStop(0,   `rgba(40,55,110,${w.a})`);
    g.addColorStop(0.5, `rgba(20,28,65,${w.a * 0.5})`);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });

  // 8. DARK MOLECULAR CLOUDS — absorb light near the band
  const darks = [
    { x: 0.38, y: 0.42, rx: 0.08, ry: 0.12, a: 0.62 },
    { x: 0.46, y: 0.30, rx: 0.06, ry: 0.10, a: 0.55 },
    { x: 0.43, y: 0.55, rx: 0.07, ry: 0.08, a: 0.50 },
    { x: 0.34, y: 0.65, rx: 0.09, ry: 0.07, a: 0.48 },
    { x: 0.50, y: 0.47, rx: 0.05, ry: 0.09, a: 0.45 },
  ];
  darks.forEach(d => {
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

  // 9. GREEN AIRGLOW at horizon
  const airglow = ctx.createLinearGradient(0, H * 0.68, 0, H);
  airglow.addColorStop(0,    'rgba(0,0,0,0)');
  airglow.addColorStop(0.22, 'rgba(3,52,18,0.52)');
  airglow.addColorStop(0.65, 'rgba(2,36,12,0.75)');
  airglow.addColorStop(1,    'rgba(0,10,4,0.90)');
  ctx.fillStyle = airglow;
  ctx.fillRect(0, 0, W, H);

  const airPool = ctx.createRadialGradient(W * 0.30, H * 0.91, 0, W * 0.30, H * 0.91, W * 0.26);
  airPool.addColorStop(0,   'rgba(8,95,34,0.42)');
  airPool.addColorStop(0.5, 'rgba(3,48,15,0.16)');
  airPool.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = airPool;
  ctx.fillRect(0, 0, W, H);

  // 10. DENSE MILKY WAY STAR PILLAR — Gaussian cross-section packed stars
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

  // 11. BACKGROUND STAR HAZE — 8 000 faint blue-white dots
  const br = mkRng(0x11223344);
  for (let i = 0; i < 8000; i++) {
    ctx.globalAlpha = br() * 0.12 + 0.02;
    ctx.fillStyle   = '#b0c6ff';
    ctx.beginPath();
    ctx.arc(br() * W, br() * H * 0.96, br() * 0.20 + 0.06, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 12. MID STARS — 3 000, spectral palette
  const SPEC = [
    '#e4eeff','#d8e8ff','#f2f2ff','#fff8f0',
    '#ffeedd','#ffd490','#ffb870','#ff9850',
  ];
  const mr = mkRng(0x55667788);
  for (let i = 0; i < 3000; i++) {
    ctx.globalAlpha = mr() * 0.34 + 0.12;
    ctx.fillStyle   = SPEC[Math.floor(mr() * SPEC.length)];
    ctx.beginPath();
    ctx.arc(mr() * W, mr() * H * 0.93, mr() * 0.44 + 0.14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 13. VIGNETTE — edges to near-black
  const vig = ctx.createRadialGradient(W * 0.44, H * 0.44, H * 0.12, W * 0.44, H * 0.44, H);
  vig.addColorStop(0,    'rgba(0,0,0,0)');
  vig.addColorStop(0.55, 'rgba(0,0,0,0)');
  vig.addColorStop(0.80, 'rgba(0,0,0,0.42)');
  vig.addColorStop(1,    'rgba(0,1,5,0.94)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  return off;
}

// ── Bright twinkling star data (animated layer) ───────────────────
function buildBrightStars(W, H, count = 220) {
  const COLS = ['#ffffff','#eef4ff','#fff9f0','#ffeedd','#ffd08a','#ffba70'];
  const rng  = mkRng(0xCAFE0001);
  return Array.from({ length: count }, () => {
    const r   = rng() * 1.30 + 0.55;
    const col = COLS[Math.floor(rng() * COLS.length)];
    return {
      x:     rng() * W,
      y:     rng() * H * 0.90,
      r,
      base:  rng() * 0.42 + 0.58,       // base alpha
      speed: rng() * 0.8 + 0.4,          // twinkle speed
      phase: rng() * Math.PI * 2,         // twinkle phase
      col,
      spike: r > 1.05,                    // diffraction spike?
      spikeLen: r * 11,
    };
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

    // Build static nebula once
    let nebula = buildNebula(W, H);

    // Build bright star data
    let brightStars = buildBrightStars(W, H);

    // ── Shooting streaks ──────────────────────────────────────────
    const STREAK_COLS = [
      [0.90, 0.85, 0.72],  // warm white
      [0.62, 0.76, 1.00],  // blue-white
    ];
    const streaks = [];

    function spawnStreak() {
      const len = 60 + Math.random() * 200;
      const ang = Math.PI * (0.72 + Math.random() * 0.32); // slightly downward
      const sx  = Math.random() * W;
      const sy  = Math.random() * H * 0.7;
      const col = STREAK_COLS[Math.random() < 0.6 ? 0 : 1];
      streaks.push({
        x: sx, y: sy,
        dx: Math.cos(ang) * len,
        dy: Math.sin(ang) * len * 0.28,
        vx: Math.cos(ang) * (1.4 + Math.random() * 1.2),
        vy: Math.sin(ang) * (0.4 + Math.random() * 0.5),
        life: 1.0,
        decay: 0.018 + Math.random() * 0.022,
        col,
      });
    }

    function drawStreak(s) {
      const grd = ctx.createLinearGradient(
        s.x, s.y,
        s.x + s.dx, s.y + s.dy
      );
      const [r, g, b] = s.col;
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

    // ── Main RAF loop ─────────────────────────────────────────────
    let rafId;
    let t0 = performance.now();

    function loop(now) {
      rafId = requestAnimationFrame(loop);
      const t = (now - t0) * 0.001; // seconds

      // 1. Blit static nebula — single drawImage call
      ctx.drawImage(nebula, 0, 0);

      // 2. Bright twinkling stars
      brightStars.forEach(s => {
        const a = s.base * (0.72 + 0.28 * Math.sin(t * s.speed + s.phase));
        ctx.globalAlpha = a;
        ctx.fillStyle   = s.col;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Soft halo
        ctx.globalAlpha = a * 0.08;
        const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 7);
        halo.addColorStop(0, s.col);
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 7, 0, Math.PI * 2);
        ctx.fill();

        // 4-point diffraction spike on larger stars
        if (s.spike) {
          ctx.lineWidth = 0.45;
          [[0, -s.spikeLen, 0, s.spikeLen], [-s.spikeLen, 0, s.spikeLen, 0]].forEach(([x1, y1, x2, y2]) => {
            const sg = ctx.createLinearGradient(s.x + x1, s.y + y1, s.x + x2, s.y + y2);
            sg.addColorStop(0,    'rgba(0,0,0,0)');
            sg.addColorStop(0.45, s.col);
            sg.addColorStop(0.55, s.col);
            sg.addColorStop(1,    'rgba(0,0,0,0)');
            ctx.globalAlpha  = a * 0.16;
            ctx.strokeStyle  = sg;
            ctx.beginPath();
            ctx.moveTo(s.x + x1, s.y + y1);
            ctx.lineTo(s.x + x2, s.y + y2);
            ctx.stroke();
          });
        }
      });
      ctx.globalAlpha = 1;

      // 3. Shooting streaks
      if (Math.random() < 0.004) spawnStreak();
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        drawStreak(s);
        s.x    += s.vx;
        s.y    += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) streaks.splice(i, 1);
      }
    }

    rafId = requestAnimationFrame(loop);

    // ── Resize ────────────────────────────────────────────────────
    function onResize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      nebula       = buildNebula(W, H);
      brightStars  = buildBrightStars(W, H);
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
