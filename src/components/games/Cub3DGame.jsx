import { useState, useEffect, useRef } from 'react';

const MAP = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,0,1,0,0,1],
  [1,0,1,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,1],
  [1,0,0,0,1,0,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,0,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
];
const ROWS = MAP.length, COLS_M = MAP[0].length;

// Canvas uses y-axis pointing DOWN.
// Rotating by +angle = clockwise = turning RIGHT.
// Rotating by -angle = counter-clockwise = turning LEFT.
function rotVec(x, y, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c - y * s, x * s + y * c];
}

function open(x, y) {
  const mx = Math.floor(x), my = Math.floor(y);
  return my >= 0 && my < ROWS && mx >= 0 && mx < COLS_M && MAP[my][mx] === 0;
}

function drawScene(ctx, W, H, px, py, dx, dy, cx, cy) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, H / 2);
  sky.addColorStop(0, '#020408'); sky.addColorStop(1, '#060d1a');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H / 2);
  // Floor
  const flr = ctx.createLinearGradient(0, H / 2, 0, H);
  flr.addColorStop(0, '#050810'); flr.addColorStop(1, '#020305');
  ctx.fillStyle = flr; ctx.fillRect(0, H / 2, W, H / 2);

  // DDA raycasting
  for (let col = 0; col < W; col++) {
    const camX = 2 * col / W - 1;
    const rdx = dx + cx * camX, rdy = dy + cy * camX;
    let mx = Math.floor(px), my = Math.floor(py);
    const ddx = rdx === 0 ? 1e30 : Math.abs(1 / rdx);
    const ddy = rdy === 0 ? 1e30 : Math.abs(1 / rdy);
    const sx = rdx < 0 ? -1 : 1, sy = rdy < 0 ? -1 : 1;
    let sdx = rdx < 0 ? (px - mx) * ddx : (mx + 1 - px) * ddx;
    let sdy = rdy < 0 ? (py - my) * ddy : (my + 1 - py) * ddy;
    let side = 0;
    for (let i = 0; i < 80; i++) {
      if (sdx < sdy) { sdx += ddx; mx += sx; side = 0; }
      else           { sdy += ddy; my += sy; side = 1; }
      if (MAP[my]?.[mx] === 1) break;
    }
    const pd = side === 0
      ? (mx - px + (1 - sx) / 2) / rdx
      : (my - py + (1 - sy) / 2) / rdy;
    const wh = Math.min(H, Math.floor(H / Math.max(pd, 0.01)));
    const wt = Math.floor((H - wh) / 2);
    const br  = Math.max(0, 1 - pd / 8) * (side === 1 ? 0.45 : 1.0);
    // Cyan-blue palette matching the site accent colors
    ctx.fillStyle = `rgb(0,${Math.floor(80 + 132 * br)},${Math.floor(160 + 95 * br)})`;
    ctx.fillRect(col, wt, 1, wh);
    if (wh > 4) {
      ctx.fillStyle = `rgba(0,212,255,${0.1 * br})`;
      ctx.fillRect(col, wt, 1, 2);
    }
  }

  // Minimap
  const MS = 10, mmx = W - COLS_M * MS - 8, mmy = 8;
  ctx.fillStyle = 'rgba(2,4,10,0.9)';
  ctx.fillRect(mmx - 2, mmy - 2, COLS_M * MS + 4, ROWS * MS + 4);
  ctx.strokeStyle = 'rgba(0,180,255,0.22)'; ctx.lineWidth = 1;
  ctx.strokeRect(mmx - 2, mmy - 2, COLS_M * MS + 4, ROWS * MS + 4);
  MAP.forEach((row, y) => row.forEach((c, x) => {
    ctx.fillStyle = c ? '#0a1828' : '#030609';
    ctx.fillRect(mmx + x * MS, mmy + y * MS, MS - 1, MS - 1);
  }));
  const ppx = mmx + px * MS, ppy = mmy + py * MS;
  ctx.fillStyle = '#00d4ff';
  ctx.beginPath(); ctx.arc(ppx, ppy, 2.5, 0, Math.PI * 2); ctx.fill();
  const fl2 = MS * 2.8;
  ctx.strokeStyle = 'rgba(0,212,255,0.28)'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ppx, ppy); ctx.lineTo(ppx + (dx - cx) * fl2, ppy + (dy - cy) * fl2);
  ctx.moveTo(ppx, ppy); ctx.lineTo(ppx + (dx + cx) * fl2, ppy + (dy + cy) * fl2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(0,212,255,0.75)'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ppx, ppy); ctx.lineTo(ppx + dx * fl2 * 0.6, ppy + dy * fl2 * 0.6);
  ctx.stroke();
}

export default function Cub3DGame({ active }) {
  const canvasRef = useRef(null);
  const keysRef   = useRef(new Set());
  const stateRef  = useRef({ px: 1.5, py: 1.5, dx: 1, dy: 0, cx: 0, cy: 0.6 });
  const rafRef    = useRef(null);
  const [focused, setFocused] = useState(false);

  // Game loop — runs when active
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const ROT = 0.05, SPD = 0.07;

    const loop = () => {
      const s = stateRef.current;
      const k = keysRef.current;

      // RIGHT turn = clockwise = +ROT  (y-axis points down in canvas)
      if (k.has('ArrowRight') || k.has('d')) {
        [s.dx, s.dy] = rotVec(s.dx, s.dy, +ROT);
        [s.cx, s.cy] = rotVec(s.cx, s.cy, +ROT);
      }
      // LEFT turn  = counter-clockwise = -ROT
      if (k.has('ArrowLeft')  || k.has('a')) {
        [s.dx, s.dy] = rotVec(s.dx, s.dy, -ROT);
        [s.cx, s.cy] = rotVec(s.cx, s.cy, -ROT);
      }
      if (k.has('ArrowUp')   || k.has('w')) {
        if (open(s.px + s.dx * SPD, s.py)) s.px += s.dx * SPD;
        if (open(s.px, s.py + s.dy * SPD)) s.py += s.dy * SPD;
      }
      if (k.has('ArrowDown') || k.has('s')) {
        if (open(s.px - s.dx * SPD, s.py)) s.px -= s.dx * SPD;
        if (open(s.px, s.py - s.dy * SPD)) s.py -= s.dy * SPD;
      }

      drawScene(ctx, W, H, s.px, s.py, s.dx, s.dy, s.cx, s.cy);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); rafRef.current = null; };
  }, [active]);

  // Key handlers — attached to canvas via React props (not window).
  // Because the canvas has tabIndex=0 and is focused, these only fire
  // when the game is active. No global listeners, no bleed into the page.
  const handleKeyDown = e => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
      e.preventDefault();  // block page scroll — works because canvas is the focused element
    }
    keysRef.current.add(e.key);
  };

  const handleKeyUp   = e => keysRef.current.delete(e.key);
  const handleBlur    = () => { keysRef.current.clear(); setFocused(false); };
  const handleFocus   = () => setFocused(true);
  const handleClick   = e => { e.stopPropagation(); canvasRef.current?.focus(); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 560 }}>
        <canvas
          ref={canvasRef}
          width={560}
          height={360}
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            display: 'block', width: '100%', height: 'auto',
            border: `1px solid ${focused ? 'rgba(0,212,255,0.55)' : 'var(--border)'}`,
            borderRadius: 6,
            cursor: focused ? 'crosshair' : 'pointer',
            outline: 'none',
            transition: 'border-color .2s',
          }}
        />
        {!focused && (
          <div
            onClick={handleClick}
            style={{
              position: 'absolute', inset: 0, borderRadius: 6, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(3,5,12,0.72)',
            }}
          >
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11, color: '#00d4ff',
              letterSpacing: 2, textTransform: 'uppercase',
              background: 'rgba(0,212,255,0.07)',
              border: '1px solid rgba(0,212,255,0.3)',
              padding: '10px 24px', borderRadius: 4,
            }}>
              ▶ CLICK TO PLAY
            </div>
          </div>
        )}
      </div>
      <div style={{
        display: 'flex', gap: 18, fontFamily: 'var(--mono)', fontSize: 9,
        color: focused ? 'rgba(0,212,255,0.65)' : '#3a5470',
        letterSpacing: 1.5, textTransform: 'uppercase', transition: 'color .3s',
      }}>
        <span>W / ↑ &nbsp;forward</span>
        <span>S / ↓ &nbsp;back</span>
        <span>A / ← &nbsp;turn left</span>
        <span>D / → &nbsp;turn right</span>
        {focused && <span style={{ color: '#243850' }}>· click outside to release</span>}
      </div>
    </div>
  );
}
