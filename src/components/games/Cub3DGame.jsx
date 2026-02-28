import { useState, useEffect, useRef, useCallback } from 'react';

// --- map data ---
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
const ROWS = MAP.length;
const COLS = MAP[0].length;

// --- vector rotation (y down) ---
function rotVec(x, y, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c - y * s, x * s + y * c];
}

// --- collision check ---
function isOpen(x, y) {
  const mx = Math.floor(x);
  const my = Math.floor(y);
  return my >= 0 && my < ROWS && mx >= 0 && mx < COLS && MAP[my][mx] === 0;
}

// --- raycasting draw function (optimised) ---
function drawScene(ctx, W, H, px, py, dx, dy, cx, cy) {
  // sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, H / 2);
  sky.addColorStop(0, '#020408');
  sky.addColorStop(1, '#060d1a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H / 2);

  // floor gradient
  const floor = ctx.createLinearGradient(0, H / 2, 0, H);
  floor.addColorStop(0, '#050810');
  floor.addColorStop(1, '#020305');
  ctx.fillStyle = floor;
  ctx.fillRect(0, H / 2, W, H / 2);

  // raycast loop
  for (let col = 0; col < W; col++) {
    const camX = (2 * col) / W - 1;
    const rdx = dx + cx * camX;
    const rdy = dy + cy * camX;

    let mx = Math.floor(px);
    let my = Math.floor(py);

    const ddx = rdx === 0 ? 1e30 : Math.abs(1 / rdx);
    const ddy = rdy === 0 ? 1e30 : Math.abs(1 / rdy);

    const stepX = rdx < 0 ? -1 : 1;
    const stepY = rdy < 0 ? -1 : 1;

    let sideDistX = rdx < 0 ? (px - mx) * ddx : (mx + 1 - px) * ddx;
    let sideDistY = rdy < 0 ? (py - my) * ddy : (my + 1 - py) * ddy;

    let side = 0;
    for (let i = 0; i < 80; i++) {
      if (sideDistX < sideDistY) {
        sideDistX += ddx;
        mx += stepX;
        side = 0;
      } else {
        sideDistY += ddy;
        my += stepY;
        side = 1;
      }
      if (MAP[my]?.[mx] === 1) break;
    }

    const perpDist = side === 0
      ? (mx - px + (1 - stepX) / 2) / rdx
      : (my - py + (1 - stepY) / 2) / rdy;

    const lineHeight = Math.min(H, Math.floor(H / Math.max(perpDist, 0.01)));
    const drawStart = (H - lineHeight) / 2;
    const brightness = Math.max(0, 1 - perpDist / 8) * (side === 1 ? 0.45 : 1.0);

    // wall color (cyan-blue)
    const gVal = Math.floor(80 + 132 * brightness);
    const bVal = Math.floor(160 + 95 * brightness);
    ctx.fillStyle = `rgb(0,${gVal},${bVal})`;
    ctx.fillRect(col, drawStart, 1, lineHeight);
    if (lineHeight > 4) {
      ctx.fillStyle = `rgba(0,212,255,${0.1 * brightness})`;
      ctx.fillRect(col, drawStart, 1, 2);
    }
  }

  // minimap
  const MS = 10;
  const mmX = W - COLS * MS - 8;
  const mmY = 8;

  ctx.fillStyle = 'rgba(2,4,10,0.9)';
  ctx.fillRect(mmX - 2, mmY - 2, COLS * MS + 4, ROWS * MS + 4);
  ctx.strokeStyle = 'rgba(0,180,255,0.22)';
  ctx.lineWidth = 1;
  ctx.strokeRect(mmX - 2, mmY - 2, COLS * MS + 4, ROWS * MS + 4);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      ctx.fillStyle = MAP[y][x] ? '#0a1828' : '#030609';
      ctx.fillRect(mmX + x * MS, mmY + y * MS, MS - 1, MS - 1);
    }
  }

  const ppx = mmX + px * MS;
  const ppy = mmY + py * MS;

  ctx.fillStyle = '#00d4ff';
  ctx.beginPath();
  ctx.arc(ppx, ppy, 2.5, 0, 2 * Math.PI);
  ctx.fill();

  const fl = MS * 2.8;
  ctx.strokeStyle = 'rgba(0,212,255,0.28)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ppx, ppy);
  ctx.lineTo(ppx + (dx - cx) * fl, ppy + (dy - cy) * fl);
  ctx.moveTo(ppx, ppy);
  ctx.lineTo(ppx + (dx + cx) * fl, ppy + (dy + cy) * fl);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0,212,255,0.75)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ppx, ppy);
  ctx.lineTo(ppx + dx * fl * 0.6, ppy + dy * fl * 0.6);
  ctx.stroke();
}

export default function Cub3DGame({ active }) {
  const canvasRef = useRef(null);
  const keysRef = useRef(new Set());
  const stateRef = useRef({
    px: 1.5, py: 1.5,
    dx: 1, dy: 0,
    cx: 0, cy: 0.6,
  });
  const rafRef = useRef(null);
  const [focused, setFocused] = useState(false);

  // --- key handling directly on canvas ---
  const handleKeyDown = useCallback((e) => {
    const key = e.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(key)) {
      e.preventDefault();
      e.stopPropagation();
      keysRef.current.add(key);
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    keysRef.current.delete(e.key);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
    keysRef.current.clear();
  }, []);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleCanvasClick = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.focus();
      setTimeout(() => canvasRef.current?.focus(), 10);
    }
  }, []);

  // --- Determine if the game loop should run ---
  const loopActive = active || focused;

  // --- Game loop (starts when loopActive becomes true) ---
  useEffect(() => {
    if (!loopActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const ROT = 0.05;
    const SPD = 0.07;

    const loop = () => {
      const s = stateRef.current;
      const keys = keysRef.current;

      if (keys.has('ArrowRight') || keys.has('d')) {
        [s.dx, s.dy] = rotVec(s.dx, s.dy, ROT);
        [s.cx, s.cy] = rotVec(s.cx, s.cy, ROT);
      }
      if (keys.has('ArrowLeft') || keys.has('a')) {
        [s.dx, s.dy] = rotVec(s.dx, s.dy, -ROT);
        [s.cx, s.cy] = rotVec(s.cx, s.cy, -ROT);
      }
      if (keys.has('ArrowUp') || keys.has('w')) {
        if (isOpen(s.px + s.dx * SPD, s.py)) s.px += s.dx * SPD;
        if (isOpen(s.px, s.py + s.dy * SPD)) s.py += s.dy * SPD;
      }
      if (keys.has('ArrowDown') || keys.has('s')) {
        if (isOpen(s.px - s.dx * SPD, s.py)) s.px -= s.dx * SPD;
        if (isOpen(s.px, s.py - s.dy * SPD)) s.py -= s.dy * SPD;
      }

      drawScene(ctx, W, H, s.px, s.py, s.dx, s.dy, s.cx, s.cy);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [loopActive]);

  // --- Reset player position when component becomes completely inactive ---
  useEffect(() => {
    if (!active && !focused) {
      stateRef.current = { px: 1.5, py: 1.5, dx: 1, dy: 0, cx: 0, cy: 0.6 };
    }
  }, [active, focused]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 560 }}>
        <canvas
          ref={canvasRef}
          width={560}
          height={360}
          tabIndex={0}
          onClick={handleCanvasClick}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            border: `1px solid ${focused ? 'rgba(0,212,255,0.55)' : 'var(--border)'}`,
            borderRadius: 6,
            cursor: focused ? 'crosshair' : 'pointer',
            outline: 'none',
            transition: 'border-color .2s',
          }}
        />
        {!focused && (
          <div
            onClick={handleCanvasClick}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(3,5,12,0.72)',
            }}
          >
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: '#00d4ff',
              letterSpacing: 2,
              textTransform: 'uppercase',
              background: 'rgba(0,212,255,0.07)',
              border: '1px solid rgba(0,212,255,0.3)',
              padding: '10px 24px',
              borderRadius: 4,
            }}>
              ▶ CLICK TO PLAY
            </div>
          </div>
        )}
      </div>
      <div style={{
        display: 'flex',
        gap: 18,
        fontFamily: 'var(--mono)',
        fontSize: 9,
        color: focused ? 'rgba(0,212,255,0.65)' : '#3a5470',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        transition: 'color .3s',
      }}>
        <span>W / ↑ forward</span>
        <span>S / ↓ back</span>
        <span>A / ← turn left</span>
        <span>D / → turn right</span>
        {focused && <span style={{ color: '#243850' }}>· click outside to release</span>}
      </div>
    </div>
  );
}