import { useEffect, useRef } from 'react';

export default function SpaceCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth, H = window.innerHeight;
    let raf;

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    }
    resize();

    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(arr) { return arr[Math.floor(rand(0, arr.length - 0.01))]; }

    // ── WORLD SIZE — camera pans across this, creating infinite drift ────
    const WW = W * 4, WH = H * 4;

    // Camera — slow, organic spaceship movement
    let camX = 0, camY = 0;
    let camVX = 0.022, camVY = 0.009;

    // ── STAR COLORS from the images ──────────────────────────────────────
    // Image 1 (Spitzer infrared): mostly white/blue-white stars on dark field, warm orange clusters
    // Image 2 (Chad Powell): blue-white dominant milky way core, white surrounding stars
    const COLS_BLUE  = ['#ffffff','#f0f4ff','#e0ecff','#d0e4ff','#c4d8ff','#f8faff'];
    const COLS_WARM  = ['#ffd8a0','#ffbf78','#ff9a55','#ffeedd','#ffcc99'];
    const COLS_WHITE = ['#ffffff','#f8f8f8','#fafbff','#f4f8ff'];

    // ── LAYER 0 — faint background haze (very distant stars) ─────────────
    const bgStars = Array.from({ length: 8000 }, () => ({
      x: rand(0, WW), y: rand(0, WH),
      r: rand(0.06, 0.22),
      a: rand(0.04, 0.14),
      col: Math.random() > 0.9 ? pick(COLS_WARM) : pick(COLS_BLUE),
    }));

    // ── LAYER 1 — mid-field stars ─────────────────────────────────────────
    const midStars = Array.from({ length: 3500 }, () => ({
      x: rand(0, WW), y: rand(0, WH),
      r: rand(0.18, 0.65),
      a: rand(0.12, 0.50),
      col: Math.random() > 0.82 ? pick(COLS_WARM) : pick(COLS_BLUE),
      tw: rand(0, Math.PI * 2),
      ts: rand(0.15, 0.7),
    }));

    // ── LAYER 2 — bright foreground stars ────────────────────────────────
    const fgStars = Array.from({ length: 320 }, () => ({
      x: rand(0, WW), y: rand(0, WH),
      r: rand(0.55, 1.9),
      a: rand(0.45, 1.0),
      col: Math.random() > 0.72 ? pick(COLS_WARM) : pick(COLS_WHITE),
      tw: rand(0, Math.PI * 2),
      ts: rand(0.1, 0.5),
    }));

    // ── MILKY WAY — dense star band matching the images ───────────────────
    // Image 2: bright blue-white vertical/diagonal column
    // Image 1: horizontal band of packed red/warm stars
    const mwStars = (() => {
      const arr = [];
      const COUNT = 18000;
      for (let i = 0; i < COUNT; i++) {
        const t = rand(0, WH);
        // Band: slightly diagonal, curving — like a real galaxy arm
        const progress = t / WH;
        // Two bands combined: one diagonal (image 2 style), one horizontal (image 1 style)
        const band1CX = WW * (0.35 + progress * 0.08 + Math.sin(progress * Math.PI) * 0.06);
        const spread1 = WW * 0.09;
        const nx = (Math.random() - 0.5) * 2;
        const gx = nx * spread1 * (0.2 + Math.pow(Math.abs(nx), 0.6) * 0.8);
        const dist = Math.abs(gx) / spread1;
        const brightness = Math.pow(Math.max(0, 1 - dist), 1.6);
        if (brightness < 0.02) continue;

        // Core is blue-white (image 2), edges warm (image 1)
        let col;
        if (dist < 0.2) col = pick(COLS_BLUE.slice(0, 3));
        else if (dist < 0.55) col = pick(COLS_BLUE);
        else col = Math.random() > 0.5 ? pick(COLS_WARM) : pick(COLS_BLUE);

        arr.push({
          x: band1CX + gx,
          y: t,
          r: rand(0.06, 0.30),
          a: rand(0.05, 0.26) * brightness,
          col,
        });
      }
      return arr;
    })();

    // ── NEBULA CLOUDS — matching both images ──────────────────────────────
    // No flashy colors. Dark, subtle, realistic.
    const nebulae = [
      // Image 1 — deep red/crimson dust (Spitzer infrared galactic center)
      { cx: WW*0.36, cy: WH*0.50, rx: WW*0.18, ry: WH*0.13, col:[110,22,8],   a:0.055, rot:-0.06 },
      { cx: WW*0.28, cy: WH*0.43, rx: WW*0.12, ry: WH*0.09, col:[90,15,6],    a:0.04,  rot:0.10  },
      { cx: WW*0.50, cy: WH*0.58, rx: WW*0.10, ry: WH*0.07, col:[80,18,12],   a:0.032, rot:-0.18 },
      // Pink/magenta blobs (image 1 edges)
      { cx: WW*0.22, cy: WH*0.62, rx: WW*0.09, ry: WH*0.06, col:[100,15,35],  a:0.028, rot:0.22  },
      { cx: WW*0.60, cy: WH*0.36, rx: WW*0.08, ry: WH*0.05, col:[95,12,28],   a:0.024, rot:-0.3  },
      // Image 2 — blue-white galactic core pillar glow
      { cx: WW*0.38, cy: WH*0.46, rx: WW*0.035, ry: WH*0.22, col:[25,55,130], a:0.042, rot:0.04  },
      { cx: WW*0.37, cy: WH*0.42, rx: WW*0.02,  ry: WH*0.10, col:[40,80,180], a:0.038, rot:0.02  },
      // Green airglow at galactic horizon (image 2 bottom)
      { cx: WW*0.38, cy: WH*0.74, rx: WW*0.10, ry: WH*0.05, col:[8,75,45],   a:0.035, rot:0     },
      // Overall dark blue space field
      { cx: WW*0.65, cy: WH*0.35, rx: WW*0.25, ry: WH*0.20, col:[4,12,38],   a:0.045, rot:0.25  },
      { cx: WW*0.15, cy: WH*0.25, rx: WW*0.18, ry: WH*0.15, col:[3,10,32],   a:0.038, rot:-0.1  },
      // DARK ABSORPTION LANES — the black dust lanes cutting through (image 1)
      // Rendered as dark overlay
      { cx: WW*0.37, cy: WH*0.50, rx: WW*0.025, ry: WH*0.20, col:[0,0,0],    a:0.55,  rot:-0.04 },
      { cx: WW*0.40, cy: WH*0.48, rx: WW*0.018, ry: WH*0.14, col:[0,0,0],    a:0.40,  rot:0.07  },
      { cx: WW*0.34, cy: WH*0.52, rx: WW*0.014, ry: WH*0.10, col:[0,0,0],    a:0.30,  rot:-0.12 },
      // Faint warm galactic center glow
      { cx: WW*0.38, cy: WH*0.50, rx: WW*0.06,  ry: WH*0.04, col:[150,70,18],a:0.028, rot:0     },
    ];

    // ── DRAW NEBULA ───────────────────────────────────────────────────────
    function drawNebula(n, ox, oy) {
      const sx = ((n.cx - ox) % WW + WW) % WW;
      const sy = ((n.cy - oy) % WH + WH) % WH;
      // Only draw if near viewport (performance)
      if (sx + n.rx < -WW*0.1 || sx - n.rx > W + WW*0.1) return;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(n.rot);
      const maxR = Math.max(n.rx, n.ry);
      const [r, g, b] = n.col;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
      grad.addColorStop(0,    `rgba(${r},${g},${b},${n.a})`);
      grad.addColorStop(0.4,  `rgba(${r},${g},${b},${n.a * 0.55})`);
      grad.addColorStop(0.75, `rgba(${r},${g},${b},${n.a * 0.15})`);
      grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);
      ctx.scale(n.rx / maxR, n.ry / maxR);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, maxR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ── DRAW STAR FIELD ───────────────────────────────────────────────────
    function drawStars(stars, ox, oy, tick, useTwinkle) {
      stars.forEach(s => {
        const sx = ((s.x - ox) % WW + WW) % WW;
        const sy = ((s.y - oy) % WH + WH) % WH;
        if (sx < -2 || sx > W + 2 || sy < -2 || sy > H + 2) return;
        let a = s.a;
        if (useTwinkle && s.tw !== undefined) {
          a *= (0.72 + 0.28 * Math.sin(tick * s.ts + s.tw));
        }
        ctx.globalAlpha = a;
        ctx.fillStyle = s.col;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    // ── MAIN LOOP ─────────────────────────────────────────────────────────
    let tick = 0;

    function draw() {
      raf = requestAnimationFrame(draw);
      tick += 0.003;

      // Organic camera drift — like a spaceship on autopilot, very slow
      camVX = 0.020 + Math.sin(tick * 0.055) * 0.006;
      camVY = 0.008 + Math.cos(tick * 0.042) * 0.003;
      camX += camVX;
      camY += camVY;

      // ── Pure deep space black
      ctx.fillStyle = '#010106';
      ctx.fillRect(0, 0, W, H);

      // Layer offsets — different parallax speeds create 3D depth
      const o0x = camX * 0.12, o0y = camY * 0.12; // nebulae — slowest
      const o1x = camX * 0.20, o1y = camY * 0.20; // bg stars
      const o2x = camX * 0.40, o2y = camY * 0.40; // milky way band
      const o3x = camX * 0.55, o3y = camY * 0.55; // mid stars
      const o4x = camX * 1.0,  o4y = camY * 1.0;  // foreground — fastest

      // ── Nebulae (screen blend for emission look)
      ctx.globalCompositeOperation = 'screen';
      const nox = o0x % WW, noy = o0y % WH;
      nebulae.forEach(n => {
        // Tile in case band wraps
        drawNebula(n, nox, noy);
        drawNebula({ ...n, cx: n.cx - WW }, nox, noy);
        drawNebula({ ...n, cx: n.cx + WW }, nox, noy);
        drawNebula({ ...n, cy: n.cy - WH }, nox, noy);
        drawNebula({ ...n, cy: n.cy + WH }, nox, noy);
      });
      ctx.globalCompositeOperation = 'source-over';

      // ── Background stars
      drawStars(bgStars, o1x % WW, o1y % WH, tick, false);

      // ── Milky Way dense band
      drawStars(mwStars, o2x % WW, o2y % WH, tick, false);

      // ── Mid stars
      drawStars(midStars, o3x % WW, o3y % WH, tick, true);

      // ── Bright foreground stars with subtle glow
      fgStars.forEach(s => {
        const sx = ((s.x - o4x % WW) % WW + WW) % WW;
        const sy = ((s.y - o4y % WH) % WH + WH) % WH;
        if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) return;
        const a = s.a * (0.72 + 0.28 * Math.sin(tick * s.ts + s.tw));
        // Glow halo (subtle, not flashy)
        if (s.r > 1.0) {
          ctx.globalAlpha = a * 0.18;
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 6);
          g.addColorStop(0, s.col);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(sx, sy, s.r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = a;
        ctx.fillStyle = s.col;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // ── Deep vignette — makes it feel like a porthole or telescope
      const vig = ctx.createRadialGradient(W * 0.5, H * 0.5, H * 0.22, W * 0.5, H * 0.5, H * 0.95);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(0.65, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,4,0.78)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    }

    draw();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="space-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'block' }}
    />
  );
}
