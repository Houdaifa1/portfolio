import { useState, useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────
//  Cub3DGame — input fixed to mirror SoLongGame's proven pattern:
//
//  KEY FIX: Instead of window-level listeners gated by a `playing`
//  boolean (async, races, doesn't block scroll), we use a focusable
//  wrapper div (tabIndex=0) with onKeyDown/onKeyUp directly on it —
//  exactly like SoLong. Click → focus() synchronously. React calls
//  e.preventDefault() before the browser scrolls. Works everywhere.
// ─────────────────────────────────────────────────────────────────

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

function rotVec(x, y, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c - y * s, x * s + y * c];
}
function canMove(x, y) {
  const mx = Math.floor(x), my = Math.floor(y);
  return my >= 0 && my < ROWS && mx >= 0 && mx < COLS_M && MAP[my][mx] === 0;
}

function drawScene(ctx, W, H, px, py, dx, dy, cx, cy) {
  const sky = ctx.createLinearGradient(0, 0, 0, H / 2);
  sky.addColorStop(0, '#020408');
  sky.addColorStop(1, '#060d1a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H / 2);

  const flr = ctx.createLinearGradient(0, H / 2, 0, H);
  flr.addColorStop(0, '#050810');
  flr.addColorStop(1, '#020305');
  ctx.fillStyle = flr;
  ctx.fillRect(0, H / 2, W, H / 2);

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
    const br = Math.max(0, 1 - pd / 8) * (side === 1 ? 0.45 : 1.0);
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
  ctx.strokeStyle = 'rgba(0,180,255,0.22)';
  ctx.lineWidth = 1;
  ctx.strokeRect(mmx - 2, mmy - 2, COLS_M * MS + 4, ROWS * MS + 4);
  MAP.forEach((row, y) => row.forEach((cell, x) => {
    ctx.fillStyle = cell ? '#0a1828' : '#030609';
    ctx.fillRect(mmx + x * MS, mmy + y * MS, MS - 1, MS - 1);
  }));
  const ppx = mmx + px * MS, ppy = mmy + py * MS;
  ctx.fillStyle = '#00d4ff';
  ctx.beginPath();
  ctx.arc(ppx, ppy, 2.5, 0, Math.PI * 2);
  ctx.fill();
  const fl2 = MS * 2.8;
  ctx.strokeStyle = 'rgba(0,212,255,0.28)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ppx, ppy);
  ctx.lineTo(ppx + (dx - cx) * fl2, ppy + (dy - cy) * fl2);
  ctx.moveTo(ppx, ppy);
  ctx.lineTo(ppx + (dx + cx) * fl2, ppy + (dy + cy) * fl2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(0,212,255,0.75)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(ppx, ppy);
  ctx.lineTo(ppx + dx * fl2 * 0.6, ppy + dy * fl2 * 0.6);
  ctx.stroke();
}

// ── D-pad button ─────────────────────────────────────────────────
function Btn({ label, onPress, onRelease }) {
  return (
    <div
      onPointerDown={e => { e.preventDefault(); onPress(); }}
      onPointerUp={onRelease}
      onPointerLeave={onRelease}
      onPointerCancel={onRelease}
      style={{
        width: 44, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,212,255,0.07)',
        border: '1px solid rgba(0,212,255,0.22)',
        borderRadius: 8,
        color: '#00d4ff',
        fontSize: 18,
        userSelect: 'none',
        touchAction: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--mono)',
      }}
    >
      {label}
    </div>
  );
}

const GAME_KEYS = new Set([
  'arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' ',
]);

export default function Cub3DGame({ active }) {
  const canvasRef  = useRef(null);
  const wrapRef    = useRef(null);
  const [playing, setPlaying] = useState(false);

  // All mutable game state in one ref — no re-render on mutation
  const G = useRef({
    px: 1.5, py: 1.5,
    dx: 1,   dy: 0,
    cx: 0,   cy: 0.6,
    keys: new Set(),   // held keyboard keys (lowercased)
    btns: new Set(),   // held on-screen buttons
    raf: null,
  });

  // ── Focus wrapper on click (same trick as SoLong) ─────────────
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    wrapRef.current?.focus();
    setPlaying(true);
  }, []);

  // ── onKeyDown on the wrapper div — fires BEFORE browser scroll ─
  const handleKeyDown = useCallback((e) => {
    const k = e.key.toLowerCase();
    if (GAME_KEYS.has(k)) {
      e.preventDefault();   // ← stops page scroll, same as SoLong
      e.stopPropagation();
      G.current.keys.add(k);
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    G.current.keys.delete(e.key.toLowerCase());
  }, []);

  // ── Blur → stop playing ───────────────────────────────────────
  const handleBlur = useCallback((e) => {
    // Only deactivate if focus truly left our subtree
    if (!wrapRef.current?.contains(e.relatedTarget)) {
      setPlaying(false);
      G.current.keys.clear();
      G.current.btns.clear();
    }
  }, []);

  // ── Auto-focus when parent makes this tab active ──────────────
  useEffect(() => {
    if (active) {
      wrapRef.current?.focus();
    } else {
      setPlaying(false);
      G.current.keys.clear();
      G.current.btns.clear();
    }
  }, [active]);

  // ── Game loop ─────────────────────────────────────────────────
  useEffect(() => {
    if (!active) {
      if (G.current.raf) { cancelAnimationFrame(G.current.raf); G.current.raf = null; }
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const ROT = 0.05, SPD = 0.07;

    // Draw initial idle frame
    const s = G.current;
    drawScene(ctx, W, H, s.px, s.py, s.dx, s.dy, s.cx, s.cy);

    const loop = () => {
      const s = G.current;
      const k = s.keys, b = s.btns;

      const fwd   = k.has('arrowup')    || k.has('w') || b.has('w');
      const back  = k.has('arrowdown')  || k.has('s') || b.has('s');
      const left  = k.has('arrowleft')  || k.has('a') || b.has('a');
      const right = k.has('arrowright') || k.has('d') || b.has('d');

      if (right) { [s.dx, s.dy] = rotVec(s.dx, s.dy, +ROT); [s.cx, s.cy] = rotVec(s.cx, s.cy, +ROT); }
      if (left)  { [s.dx, s.dy] = rotVec(s.dx, s.dy, -ROT); [s.cx, s.cy] = rotVec(s.cx, s.cy, -ROT); }
      if (fwd) {
        if (canMove(s.px + s.dx * SPD, s.py)) s.px += s.dx * SPD;
        if (canMove(s.px, s.py + s.dy * SPD)) s.py += s.dy * SPD;
      }
      if (back) {
        if (canMove(s.px - s.dx * SPD, s.py)) s.px -= s.dx * SPD;
        if (canMove(s.px, s.py - s.dy * SPD)) s.py -= s.dy * SPD;
      }

      drawScene(ctx, W, H, s.px, s.py, s.dx, s.dy, s.cx, s.cy);
      s.raf = requestAnimationFrame(loop);
    };

    G.current.raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(G.current.raf); G.current.raf = null; };
  }, [active]);

  // On-screen button helpers
  const press   = key => () => G.current.btns.add(key);
  const release = key => () => G.current.btns.delete(key);

  return (
    <div
      ref={wrapRef}
      tabIndex={0}                    // ← makes div focusable, same as SoLong
      onKeyDown={handleKeyDown}       // ← fires sync, preventDefault blocks scroll
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, outline: 'none' }}
    >
      {/* Canvas viewport */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 560 }}>
        <canvas
          ref={canvasRef}
          width={560}
          height={360}
          onClick={handleClick}
          style={{
            display: 'block', width: '100%', height: 'auto',
            border: `1px solid ${playing ? 'rgba(0,212,255,0.55)' : 'var(--border)'}`,
            borderRadius: 6,
            cursor: playing ? 'crosshair' : 'pointer',
            outline: 'none',
            transition: 'border-color .2s',
          }}
        />

        {/* Click-to-play overlay */}
        {!playing && (
          <div
            onClick={handleClick}
            style={{
              position: 'absolute', inset: 0, borderRadius: 6, cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
              background: 'rgba(3,5,12,0.75)',
            }}
          >
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11, color: '#00d4ff',
              letterSpacing: 2, textTransform: 'uppercase',
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.32)',
              padding: '10px 24px', borderRadius: 4,
            }}>
              ▶ CLICK TO PLAY
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 9,
              color: 'rgba(0,212,255,0.35)', letterSpacing: 1.5,
            }}>
              WASD · ARROWS · OR TAP BUTTONS BELOW
            </div>
          </div>
        )}
      </div>

      {/* On-screen D-pad */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Btn label="↑" onPress={press('w')}  onRelease={release('w')} />
        <div style={{ display: 'flex', gap: 4 }}>
          <Btn label="←" onPress={press('a')} onRelease={release('a')} />
          <Btn label="↓" onPress={press('s')} onRelease={release('s')} />
          <Btn label="→" onPress={press('d')} onRelease={release('d')} />
        </div>
      </div>

      <div style={{
        fontFamily: 'var(--mono)', fontSize: 9,
        color: playing ? 'rgba(0,212,255,0.5)' : '#2a4055',
        letterSpacing: 1.5, textTransform: 'uppercase',
        transition: 'color .3s',
      }}>
        {playing
          ? 'WASD / ARROWS OR TAP BUTTONS · CLICK OUTSIDE TO STOP'
          : 'CLICK VIEWPORT OR TAP BUTTONS TO PLAY'}
      </div>
    </div>
  );
}
