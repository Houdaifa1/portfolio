import { useState, useEffect, useRef } from 'react';

export default function PhilosophersGame({ active }) {
  const [on, setOn] = useState(false);
  const [phils, setPhils] = useState(Array.from({ length: 5 }, (_, i) => ({ id: i, state: 'thinking', meals: 0 })));
  const [forks, setForks] = useState(Array(5).fill(false));
  const [tick, setTick] = useState(0);
  const ref = useRef({ phils: Array.from({ length: 5 }, (_, i) => ({ id: i, state: 'thinking', meals: 0 })), forks: Array(5).fill(false), tick: 0 });

  useEffect(() => {
    if (!active) {
      setOn(false);
      ref.current = { phils: Array.from({ length: 5 }, (_, i) => ({ id: i, state: 'thinking', meals: 0 })), forks: Array(5).fill(false), tick: 0 };
      setPhils(Array.from({ length: 5 }, (_, i) => ({ id: i, state: 'thinking', meals: 0 })));
      setForks(Array(5).fill(false)); setTick(0);
    }
  }, [active]);

  useEffect(() => {
    if (!on) return;
    const iv = setInterval(() => {
      const s = ref.current; s.tick++;
      s.phils = s.phils.map((p, i) => {
        const L = i, R = (i + 1) % 5;
        if (p.state === 'thinking') { if (!s.forks[L] && !s.forks[R] && Math.random() > .55) { s.forks[L] = true; s.forks[R] = true; return { ...p, state: 'eating', meals: p.meals + 1 }; } return p; }
        if (p.state === 'eating') { if (Math.random() > .45) { s.forks[L] = false; s.forks[R] = false; return { ...p, state: 'thinking' }; } return { ...p, meals: p.meals + 1 }; }
        return p;
      });
      setPhils([...s.phils]); setForks([...s.forks]); setTick(s.tick);
    }, 450);
    return () => clearInterval(iv);
  }, [on]);

  const N = 5, R = 90, cx = 150, cy = 150;

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width={300} height={300}>
        <circle cx={cx} cy={cy} r={54} fill="var(--surface)" stroke="var(--border)" strokeWidth={1} />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="#2e4055" fontSize={9} fontFamily="JetBrains Mono">dining table</text>
        {Array.from({ length: N }, (_, i) => {
          const a = (i * 2 * Math.PI / N) - Math.PI / 2 + Math.PI / N, fr = 72, x = cx + Math.cos(a) * fr, y = cy + Math.sin(a) * fr;
          return <g key={i}><circle cx={x} cy={y} r={9} fill={forks[i] ? '#ffc142' : 'var(--surface2)'} stroke={forks[i] ? '#ffc142' : 'var(--border)'} strokeWidth={1} style={{ transition: 'all .35s' }} /><text x={x} y={y + 3} textAnchor="middle" fontSize={8}>🍴</text></g>;
        })}
        {Array.from({ length: N }, (_, i) => {
          const a = (i * 2 * Math.PI / N) - Math.PI / 2, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, p = phils[i], e = p.state === 'eating';
          return <g key={i}>
            <circle cx={x} cy={y} r={22} fill={e ? 'rgba(0,255,136,.18)' : 'rgba(46,64,85,.4)'} stroke={e ? '#00ff88' : '#2e4055'} strokeWidth={1.5} style={{ transition: 'all .4s' }} />
            <text x={x} y={y - 3} textAnchor="middle" fontSize={15}>{e ? '😋' : '🤔'}</text>
            <text x={x} y={y + 13} textAnchor="middle" fontSize={7} fill="#2e4055" fontFamily="JetBrains Mono">P{i}</text>
            {e && <circle cx={x} cy={y} r={26} fill="none" stroke="#00ff88" strokeWidth={.8} strokeDasharray="3,4" style={{ animation: 'spin 2s linear infinite' }} />}
          </g>;
        })}
      </svg>
      <div style={{ flex: 1, minWidth: 160 }}>
        {phils.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 10, lineHeight: 2.1 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.state === 'eating' ? '#00ff88' : '#2e4055', boxShadow: p.state === 'eating' ? '0 0 8px #00ff88' : 'none', transition: 'all .3s', flexShrink: 0 }} />
            <span style={{ color: '#2e4055', width: 18 }}>P{p.id}</span>
            <span style={{ color: p.state === 'eating' ? '#00ff88' : 'var(--text2)', width: 64 }}>{p.state}</span>
            <span style={{ color: '#2e4055' }}>×{p.meals}</span>
          </div>
        ))}
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, marginTop: 10, color: 'var(--text3)', lineHeight: 2 }}>
          <div>Cycles: {tick}</div>
          <div style={{ color: '#00ff88' }}>Deadlocks: 0 ✓</div>
          <div style={{ color: '#00ff88' }}>Deaths: 0 ✓</div>
        </div>
        <button data-h onClick={() => setOn(r => !r)}
          style={{ marginTop: 10, fontFamily: 'var(--mono)', fontSize: 10, padding: '6px 16px', background: on ? 'rgba(255,59,92,.12)' : 'rgba(0,255,136,.12)', border: `1px solid ${on ? '#ff3b5c' : '#00ff88'}`, color: on ? '#ff3b5c' : '#00ff88', cursor: 'none', letterSpacing: 1, transition: 'all .2s' }}>
          {on ? '⏹ STOP' : '▶ START'}
        </button>
      </div>
    </div>
  );
}
