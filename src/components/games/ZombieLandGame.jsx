import { useState, useEffect, useRef } from 'react';

export default function ZombieLandGame({ active }) {
  const canvas = useRef(null);
  const state = useRef(null);
  const raf = useRef(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [started, setStarted] = useState(false);
  const [winner, setWinner] = useState(null);

  const PLAYER_COL = '#00ff88', AI_COL = '#ff3b5c', BALL_COL = '#ccff44';
  const W = 560, H = 300, GH = 68, GW = 12, PR = 22, BR = 9, MAX = 5;
  const FIXED_SPEED = 6.5;

  // Safe X constants: AI stays off the right wall to prevent wall-trapping
  const AI_HOME_X = W - PR - GW - 38;  // comfortable guard position
  const AI_MIN_X  = W / 2 + PR;        // never cross centre
  const AI_MAX_X  = W - PR - GW - 26;  // never press into the right wall

  const initState = () => ({
    ball: { x: W / 2, y: H / 2, vx: (Math.random() > .5 ? 1 : -1) * FIXED_SPEED, vy: (Math.random() - .5) * 3.2 },
    p1: { x: PR + GW + 4, y: H / 2 }, p2: { x: AI_HOME_X, y: H / 2 },
    score: { p1: 0, p2: 0 }, mouse: { x: W / 4, y: H / 2 }, on: true,
    aiNudge: 0, // random Y offset refreshed on each AI touch to break repeating loops
  });

  useEffect(() => {
    if (!active) {
      if (raf.current) cancelAnimationFrame(raf.current);
      state.current = null;
      setScore({ p1: 0, p2: 0 }); setStarted(false); setWinner(null);
    }
  }, [active]);

  const start = () => {
    setWinner(null); setScore({ p1: 0, p2: 0 }); setStarted(true);
    state.current = initState();
    const c = canvas.current; if (!c) return;
    const onMove = e => {
      if (!state.current) return;
      const r = c.getBoundingClientRect();
      state.current.mouse = { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
    };
    c.addEventListener('mousemove', onMove);
    const ctx = c.getContext('2d');
    const goaly = H / 2 - GH / 2, goalY2 = H / 2 + GH / 2;

    const loop = () => {
      const s = state.current; if (!s || !s.on) return;

      // ── AI logic ───────────────────────────────────────────────
      // Y: predict where ball arrives at AI's X (simulate wall bounces)
      let targetY = H / 2;
      if (s.ball.vx > 0) {
        const timeToAI = (s.p2.x - s.ball.x) / s.ball.vx;
        if (timeToAI > 0) {
          let predY = s.ball.y + s.ball.vy * timeToAI;
          // Fold prediction back through top/bottom walls
          predY = ((predY % (2 * H)) + 2 * H) % (2 * H);
          if (predY > H) predY = 2 * H - predY;
          targetY = predY + s.aiNudge;
        }
      }
      // Ball moving away → guard centre
      targetY = Math.max(PR, Math.min(H - PR, targetY));

      const AI_SPD = 4.5;
      const dyAI = targetY - s.p2.y;
      s.p2.y += Math.sign(dyAI) * Math.min(Math.abs(dyAI), AI_SPD);
      s.p2.y = Math.max(PR, Math.min(H - PR, s.p2.y));

      // X: hold home position — never drift into the wall
      const ballApproaching = s.ball.vx > 0 && s.ball.x > W / 2;
      const desiredX = ballApproaching ? AI_HOME_X : AI_HOME_X - 10;
      s.p2.x += (desiredX - s.p2.x) * 0.1;
      s.p2.x = Math.max(AI_MIN_X, Math.min(AI_MAX_X, s.p2.x));
      // ── end AI logic ───────────────────────────────────────────

      s.p1.x += (Math.max(PR + GW + 4, Math.min(W / 2 - PR, s.mouse.x)) - s.p1.x) * .22;
      s.p1.y += (Math.max(PR, Math.min(H - PR, s.mouse.y)) - s.p1.y) * .22;

      s.ball.x += s.ball.vx; s.ball.y += s.ball.vy;
      if (s.ball.y - BR <= 0) { s.ball.y = BR; s.ball.vy = Math.abs(s.ball.vy); }
      if (s.ball.y + BR >= H) { s.ball.y = H - BR; s.ball.vy = -Math.abs(s.ball.vy); }

      [[s.p1.x, s.p1.y], [s.p2.x, s.p2.y]].forEach(([px, py], i) => {
        const dx = s.ball.x - px, dy = s.ball.y - py, d = Math.sqrt(dx * dx + dy * dy);
        if (d < PR + BR) {
          const n = PR + BR, nx = dx / d, ny = dy / d;
          s.ball.vx = nx * FIXED_SPEED;
          s.ball.vy = ny * FIXED_SPEED + (Math.random() - 0.5) * 1.0;
          s.ball.x = px + nx * (n + 1); s.ball.y = py + ny * (n + 1);
          // Refresh nudge on every AI touch so bounce angles always vary
          if (i === 1) s.aiNudge = (Math.random() - 0.5) * 18;
        }
      });

      const inGoal = s.ball.y >= goaly && s.ball.y <= goalY2;
      if (s.ball.x - BR <= GW && inGoal) {
        s.score.p2++; setScore({ ...s.score });
        Object.assign(s, { ball: { x: W / 2, y: H / 2, vx: FIXED_SPEED, vy: (Math.random() - .5) * 3 }, p1: { x: PR + GW + 4, y: H / 2 }, p2: { x: AI_HOME_X, y: H / 2 }, aiNudge: 0 });
        if (s.score.p2 >= MAX) { s.on = false; setWinner('AI'); c.removeEventListener('mousemove', onMove); return; }
      }
      if (s.ball.x + BR >= W - GW && inGoal) {
        s.score.p1++; setScore({ ...s.score });
        Object.assign(s, { ball: { x: W / 2, y: H / 2, vx: -FIXED_SPEED, vy: (Math.random() - .5) * 3 }, p1: { x: PR + GW + 4, y: H / 2 }, p2: { x: AI_HOME_X, y: H / 2 }, aiNudge: 0 });
        if (s.score.p1 >= MAX) { s.on = false; setWinner('YOU'); c.removeEventListener('mousemove', onMove); return; }
      }
      if (s.ball.x - BR <= GW && !inGoal) { s.ball.x = GW + BR; s.ball.vx = Math.abs(s.ball.vx); }
      if (s.ball.x + BR >= W - GW && !inGoal) { s.ball.x = W - GW - BR; s.ball.vx = -Math.abs(s.ball.vx); }

      ctx.fillStyle = '#020c06'; ctx.fillRect(0, 0, W, H);
      const rg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
      rg.addColorStop(0, '#041a08'); rg.addColorStop(1, '#020c06');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
      ctx.setLineDash([7, 5]); ctx.strokeStyle = 'rgba(0,255,136,.15)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(0,255,136,.12)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(W / 2, H / 2, 46, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(0,255,136,.08)'; ctx.strokeStyle = PLAYER_COL + '55'; ctx.lineWidth = 2;
      ctx.fillRect(0, goaly, GW, GH); ctx.strokeRect(0, goaly, GW, GH);
      ctx.fillStyle = 'rgba(255,59,92,.08)'; ctx.strokeStyle = AI_COL + '55';
      ctx.fillRect(W - GW, goaly, GW, GH); ctx.strokeRect(W - GW, goaly, GW, GH);
      [[s.p1.x, s.p1.y, PLAYER_COL], [s.p2.x, s.p2.y, AI_COL]].forEach(([px, py, col]) => {
        ctx.shadowColor = col; ctx.shadowBlur = 20;
        const g = ctx.createRadialGradient(px - 5, py - 5, 0, px, py, PR);
        g.addColorStop(0, col + 'cc'); g.addColorStop(1, col + '33');
        ctx.beginPath(); ctx.arc(px, py, PR, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.shadowColor = BALL_COL; ctx.shadowBlur = 20;
      const bg = ctx.createRadialGradient(s.ball.x - 3, s.ball.y - 3, 0, s.ball.x, s.ball.y, BR);
      bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, BALL_COL);
      ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, BR, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = 'bold 40px JetBrains Mono'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(0,255,136,.12)'; ctx.fillText(s.score.p1, W / 4, H / 2 + 14);
      ctx.fillStyle = 'rgba(255,59,92,.12)'; ctx.fillText(s.score.p2, 3 * W / 4, H / 2 + 14);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => c.removeEventListener('mousemove', onMove);
  };

  const restart = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    state.current = null; setWinner(null); setScore({ p1: 0, p2: 0 }); setStarted(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ width: '100%', maxWidth: 560, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: PLAYER_COL, boxShadow: `0 0 8px ${PLAYER_COL}` }} />
          <span style={{ color: PLAYER_COL, fontWeight: 700 }}>YOU</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: PLAYER_COL, minWidth: 22, textAlign: 'center' }}>{score.p1}</span>
        </div>
        <div style={{ color: 'var(--text3)', fontSize: 8, letterSpacing: 2, textAlign: 'center', lineHeight: 1.6 }}>🧟 ZOMBIE LAND<br />FIRST TO {MAX} GOALS</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: AI_COL, minWidth: 22, textAlign: 'center' }}>{score.p2}</span>
          <span style={{ color: AI_COL, fontWeight: 700 }}>AI</span>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: AI_COL, boxShadow: `0 0 8px ${AI_COL}` }} />
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', maxWidth: 560, borderRadius: 8, overflow: 'hidden', border: '1px solid #0d2e14', boxShadow: '0 0 40px rgba(0,255,136,.1)' }}>
        <canvas ref={canvas} width={W} height={H} style={{ display: 'block', width: '100%', height: 'auto' }} />
        {!started && !winner && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,10,4,.9)', backdropFilter: 'blur(6px)', gap: 14 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(0,255,136,.5)', letterSpacing: 3 }}>MOVE MOUSE TO CONTROL · LEFT HALF</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 28, fontWeight: 800, letterSpacing: -1, color: '#00ff88' }}>🧟 ZOMBIE LAND</div>
            <div style={{ display: 'flex', gap: 20, fontFamily: 'var(--mono)', fontSize: 10 }}>
              <span style={{ color: PLAYER_COL }}>⬤ YOU</span><span style={{ color: '#2e4055' }}>vs</span><span style={{ color: AI_COL }}>AI ⬤</span>
            </div>
            <button data-h onClick={start}
              style={{ fontFamily: 'var(--mono)', fontSize: 11, padding: '9px 26px', background: '#00ff88', border: 'none', color: '#020c06', fontWeight: 700, letterSpacing: 2, cursor: 'none', transition: 'box-shadow .2s' }}
              onMouseEnter={e => e.target.style.boxShadow = '0 0 28px rgba(0,255,136,.7)'}
              onMouseLeave={e => e.target.style.boxShadow = 'none'}>▶ START GAME</button>
          </div>
        )}
        {winner && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,10,4,.93)', backdropFilter: 'blur(6px)', gap: 12 }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 38, fontWeight: 800, letterSpacing: -2, color: winner === 'YOU' ? PLAYER_COL : AI_COL }}>
              {winner === 'YOU' ? '🏆 YOU WIN!' : '💀 AI WINS'}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>{score.p1} — {score.p2}</div>
            <button data-h onClick={() => { restart(); setTimeout(start, 50); }}
              style={{ fontFamily: 'var(--mono)', fontSize: 11, padding: '9px 26px', background: winner === 'YOU' ? 'rgba(0,255,136,.12)' : 'rgba(255,59,92,.12)', border: `1px solid ${winner === 'YOU' ? PLAYER_COL : AI_COL}`, color: winner === 'YOU' ? PLAYER_COL : AI_COL, cursor: 'none', letterSpacing: 2, transition: 'all .2s' }}>↺ REMATCH</button>
          </div>
        )}
      </div>
    </div>
  );
}
