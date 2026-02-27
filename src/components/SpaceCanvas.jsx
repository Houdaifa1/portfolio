import { useEffect, useRef } from 'react';

export default function SpaceCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    function rand(a, b) { return a + Math.random() * (b - a); }
    function hash(x, y) {
      let h = (x * 374761393 + y * 668265263) >>> 0;
      h = ((h ^ (h >> 13)) * 1274126177) >>> 0;
      return (h >>> 0) / 4294967296;
    }

    // ── 1. PURE BLACK BASE ───────────────────────────────────────────────
    ctx.fillStyle = '#000508';
    ctx.fillRect(0, 0, W, H);

    // ── 2. DARK BLUE AMBIENT SKY (the deep navy of the photo) ────────────
    // The photo has a subtle deep blue-teal gradient across the whole sky
    const skyGrad = ctx.createRadialGradient(W * 0.35, H * 0.15, 0, W * 0.5, H * 0.5, H * 1.1);
    skyGrad.addColorStop(0,   'rgba(5, 18, 55, 0.55)');
    skyGrad.addColorStop(0.4, 'rgba(3, 12, 38, 0.35)');
    skyGrad.addColorStop(1,   'rgba(0,  0,  0, 0)');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // ── 3. MILKY WAY CORE GLOW — the blue-white pillar ───────────────────
    // In the photo: bright column coming from bottom-center going up-left
    // Warm yellow-green at base, cyan middle, blue-white upper
    const mwX = W * 0.38; // slight left of center

    // Wide outer halo — deep blue
    const mwOuter = ctx.createRadialGradient(mwX, H * 0.55, 0, mwX, H * 0.5, W * 0.28);
    mwOuter.addColorStop(0,   'rgba(18, 45, 120, 0.38)');
    mwOuter.addColorStop(0.5, 'rgba(8,  22,  70, 0.18)');
    mwOuter.addColorStop(1,   'rgba(0,   0,   0, 0)');
    ctx.fillStyle = mwOuter;
    ctx.fillRect(0, 0, W, H);

    // Middle glow — brighter blue
    const mwMid = ctx.createRadialGradient(mwX, H * 0.45, 0, mwX, H * 0.42, W * 0.14);
    mwMid.addColorStop(0,   'rgba(35, 85, 180, 0.42)');
    mwMid.addColorStop(0.4, 'rgba(18, 50, 130, 0.22)');
    mwMid.addColorStop(1,   'rgba(0,   0,   0, 0)');
    ctx.fillStyle = mwMid;
    ctx.fillRect(0, 0, W, H);

    // Bright inner core — white-blue at top of pillar
    const mwInner = ctx.createRadialGradient(mwX * 0.98, H * 0.28, 0, mwX * 0.98, H * 0.28, W * 0.07);
    mwInner.addColorStop(0,   'rgba(140, 175, 255, 0.35)');
    mwInner.addColorStop(0.5, 'rgba( 60, 100, 200, 0.15)');
    mwInner.addColorStop(1,   'rgba(  0,   0,   0, 0)');
    ctx.fillStyle = mwInner;
    ctx.fillRect(0, 0, W, H);

    // ── 4. GALACTIC CENTER HOT SPOT — warm yellow/orange core ────────────
    // The bright warm blob at the bottom of the pillar (where it meets horizon)
    const gcX = mwX * 1.01, gcY = H * 0.68;
    const gcGlow = ctx.createRadialGradient(gcX, gcY, 0, gcX, gcY, W * 0.09);
    gcGlow.addColorStop(0,   'rgba(200, 160, 50, 0.40)');
    gcGlow.addColorStop(0.3, 'rgba(100,  80, 20, 0.20)');
    gcGlow.addColorStop(1,   'rgba(  0,   0,  0, 0)');
    ctx.fillStyle = gcGlow;
    ctx.fillRect(0, 0, W, H);

    // Cyan transition above warm core
    const cyanGlow = ctx.createRadialGradient(gcX, gcY - H * 0.06, 0, gcX, gcY - H * 0.06, W * 0.07);
    cyanGlow.addColorStop(0,   'rgba(30, 180, 140, 0.28)');
    cyanGlow.addColorStop(0.5, 'rgba(10,  90,  70, 0.12)');
    cyanGlow.addColorStop(1,   'rgba( 0,   0,   0, 0)');
    ctx.fillStyle = cyanGlow;
    ctx.fillRect(0, 0, W, H);

    // ── 5. GREEN AIRGLOW at horizon — exactly like the photo ─────────────
    const greenGrad = ctx.createLinearGradient(0, H * 0.72, 0, H);
    greenGrad.addColorStop(0,   'rgba(0, 0, 0, 0)');
    greenGrad.addColorStop(0.3, 'rgba(4, 55, 22, 0.55)');
    greenGrad.addColorStop(0.7, 'rgba(2, 38, 15, 0.75)');
    greenGrad.addColorStop(1,   'rgba(0, 12,  5, 0.9)');
    ctx.fillStyle = greenGrad;
    ctx.fillRect(0, 0, W, H);

    // Green glow pool left side (photo has it left of center)
    const greenPool = ctx.createRadialGradient(W * 0.28, H * 0.88, 0, W * 0.28, H * 0.88, W * 0.22);
    greenPool.addColorStop(0,   'rgba(10, 100, 40, 0.45)');
    greenPool.addColorStop(0.5, 'rgba( 4,  50, 18, 0.20)');
    greenPool.addColorStop(1,   'rgba( 0,   0,  0, 0)');
    ctx.fillStyle = greenPool;
    ctx.fillRect(0, 0, W, H);

    // ── 6. DENSE STAR FIELD — thousands of real-looking stars ────────────
    // Photo has THOUSANDS of sharp white stars. Not glowing blobs.

    // Far background stars — very faint, blue-tinted (the haze)
    for (let i = 0; i < 8000; i++) {
      const x = rand(0, W);
      const y = rand(0, H * 0.92);
      // Denser near the milky way band (left-center)
      const distFromBand = Math.abs(x - mwX) / W;
      const bandBoost = Math.max(0, 1 - distFromBand * 3.5);
      if (Math.random() > 0.25 + bandBoost * 0.55) continue;
      const a = rand(0.04, 0.18) * (0.5 + bandBoost * 0.5);
      ctx.globalAlpha = a;
      ctx.fillStyle = '#c8d8ff';
      ctx.beginPath();
      ctx.arc(x, y, rand(0.08, 0.28), 0, Math.PI * 2);
      ctx.fill();
    }

    // Mid stars — brighter, mixed colors
    const MID_COLS = ['#ffffff','#e8f0ff','#d8e8ff','#fff4e8','#ffd8b0'];
    for (let i = 0; i < 3500; i++) {
      const x = rand(0, W);
      const y = rand(0, H * 0.9);
      const distFromBand = Math.abs(x - mwX) / W;
      const bandBoost = Math.max(0, 1 - distFromBand * 2.8);
      const r = rand(0.15, 0.55);
      const a = rand(0.12, 0.50) * (0.6 + bandBoost * 0.4);
      ctx.globalAlpha = a;
      ctx.fillStyle = MID_COLS[Math.floor(rand(0, MID_COLS.length))];
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bright foreground stars — sharp, occasional
    for (let i = 0; i < 260; i++) {
      const x = rand(0, W);
      const y = rand(0, H * 0.88);
      const r = rand(0.5, 1.6);
      const a = rand(0.55, 1.0);
      ctx.globalAlpha = a;
      const warm = Math.random() > 0.78;
      ctx.fillStyle = warm ? '#ffd0a0' : '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      // Very subtle glow on the biggest ones only
      if (r > 1.1) {
        ctx.globalAlpha = a * 0.12;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
        g.addColorStop(0, warm ? '#ffd0a0' : '#c8d8ff');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // ── 7. MILKY WAY DENSE STAR BAND — the packed pillar of stars ────────
    // This is the KEY thing in the photo — thousands of packed stars
    // forming the actual visible shape of the galaxy arm
    for (let i = 0; i < 6000; i++) {
      // Gaussian distribution around the MW pillar
      const u1 = Math.random(), u2 = Math.random();
      const gauss = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      // Pillar: slightly diagonal (top goes left, bottom slightly right)
      const yPos = rand(0, H * 0.85);
      const progress = yPos / H;
      const pillarX = mwX + progress * W * 0.04; // slight diagonal
      const spread = W * (0.045 + progress * 0.025);
      const x = pillarX + gauss * spread;
      if (x < 0 || x > W) continue;
      const distFromCenter = Math.abs(x - pillarX) / spread;
      const brightness = Math.pow(Math.max(0, 1 - distFromCenter * 0.7), 1.8);
      if (brightness < 0.05) continue;
      const r = rand(0.06, 0.32);
      const a = rand(0.08, 0.35) * brightness;
      ctx.globalAlpha = a;
      // Core stars bluer-white, edge stars warmer
      ctx.fillStyle = distFromCenter < 0.4 ? '#dce8ff' : '#e8eeff';
      ctx.beginPath();
      ctx.arc(x, yPos, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── 8. DARK ABSORPTION LANE — the black rift down the MW center ───────
    // Photo has a clear dark lane cutting through the bright pillar
    const laneGrad = ctx.createLinearGradient(mwX - 20, 0, mwX + 20, 0);
    laneGrad.addColorStop(0,    'rgba(0,0,0,0)');
    laneGrad.addColorStop(0.25, 'rgba(0,0,0,0.12)');
    laneGrad.addColorStop(0.5,  'rgba(0,0,4,0.55)');
    laneGrad.addColorStop(0.75, 'rgba(0,0,0,0.12)');
    laneGrad.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = laneGrad;
    ctx.fillRect(mwX - 20, H * 0.1, 40, H * 0.65);

    // ── 9. DEEP VIGNETTE — edges go to pure black ─────────────────────────
    const vig = ctx.createRadialGradient(W * 0.42, H * 0.42, H * 0.15, W * 0.42, H * 0.42, H);
    vig.addColorStop(0,    'rgba(0,0,0,0)');
    vig.addColorStop(0.55, 'rgba(0,0,0,0)');
    vig.addColorStop(0.78, 'rgba(0,0,0,0.35)');
    vig.addColorStop(1,    'rgba(0,0,4,0.92)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    // ── RESIZE: just redraw ───────────────────────────────────────────────
    // (static image, resize just stretches — acceptable for bg)

  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="space-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}
