import { useState, useEffect, useRef, useCallback } from 'react';

const btnStyle = { fontFamily: 'var(--mono)', fontSize: 12, width: 32, height: 32, background: 'rgba(12,20,36,0.75)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'none', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' };

export default function SoLongGame({ active }) {
  const GRID = [
    '11111111111',
    '1P000000001',
    '10110010001',
    '10000C00001',
    '10101010001',
    '10000000CE1',
    '11111111111',
  ];

  const initState = () => {
    let px = 1, py = 1, coins = [];
    GRID.forEach((row, y) => row.split('').forEach((c, x) => {
      if (c === 'P') { px = x; py = y; }
      if (c === 'C') coins.push({ x, y, got: false });
    }));
    return { px, py, coins, moves: 0, won: false };
  };

  const [state, setState] = useState(initState);
  useEffect(() => { if (!active) setState(initState()); }, [active]);

  const move = useCallback((dx, dy) => {
    setState(s => {
      if (s.won) return s;
      const nx = s.px + dx, ny = s.py + dy;
      if (ny < 0 || ny >= GRID.length || nx < 0 || nx >= GRID[0].length) return s;
      if (GRID[ny][nx] === '1') return s;
      const coins = s.coins.map(c => c.x === nx && c.y === ny ? { ...c, got: true } : c);
      const allCoins = coins.every(c => c.got);
      const won = allCoins && GRID[ny][nx] === 'E';
      return { ...s, px: nx, py: ny, coins, moves: s.moves + 1, won };
    });
  }, []);

  const soLongRef = useRef(null);
  useEffect(() => { if (active && soLongRef.current) soLongRef.current.focus(); }, [active]);

  const handleSoLongKey = useCallback((e) => {
    const k = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
    if (k[e.key]) { e.preventDefault(); e.stopPropagation(); move(...k[e.key]); }
  }, [move]);

  const allCoins = state.coins.every(c => c.got);
  const CW = 36;

  return (
    <div ref={soLongRef} tabIndex={0} onKeyDown={handleSoLongKey} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, outline: 'none' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
        Moves: {state.moves} · Coins: {state.coins.filter(c => c.got).length}/{state.coins.length} · {allCoins ? 'Find the exit E!' : 'Collect all coins first'}
      </div>
      <div style={{ border: '2px solid var(--border)', borderRadius: 6, overflow: 'hidden', boxShadow: '0 0 24px rgba(0,212,255,.1)' }}>
        {GRID.map((row, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {row.split('').map((cell, x) => {
              const isPlayer = state.px === x && state.py === y;
              const coinHere = state.coins.find(c => c.x === x && c.y === y);
              const bg = cell === '1' ? '#0d1520' : cell === 'E' && allCoins ? 'rgba(0,255,136,.25)' : '#07090e';
              return (
                <div key={x} style={{ width: CW, height: CW, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, border: cell === 'E' && allCoins ? '1px solid #00ff8855' : 'none', transition: 'background .3s' }}>
                  {isPlayer ? '🧑'
                    : cell === '1' ? <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1e2d40,#0f1622)' }} />
                    : cell === 'E' ? <span style={{ fontSize: 14, opacity: allCoins ? 1 : .3, transition: 'opacity .3s' }}>🚪</span>
                    : coinHere && !coinHere.got ? <span style={{ fontSize: 12, animation: 'pulse 1.5s infinite' }}>🪙</span>
                    : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {state.won && <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: '#00ff88', fontWeight: 700, animation: 'fadeUp .4s ease' }}>🎉 Escaped in {state.moves} moves!</div>}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <button data-h onClick={() => move(0, -1)} style={btnStyle}>↑</button>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button data-h onClick={() => move(-1, 0)} style={btnStyle}>←</button>
          <button data-h onClick={() => move(0, 1)} style={btnStyle}>↓</button>
          <button data-h onClick={() => move(1, 0)} style={btnStyle}>→</button>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text3)', letterSpacing: 1, marginTop: 2 }}>Click game · WASD / ARROW KEYS</div>
      </div>
      {state.won && (
        <button data-h onClick={() => setState(initState())} style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '5px 16px', background: 'rgba(0,255,136,.12)', border: '1px solid #00ff88', color: '#00ff88', cursor: 'none', borderRadius: 3 }}>▶ PLAY AGAIN</button>
      )}
    </div>
  );
}
