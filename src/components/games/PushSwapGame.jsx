import { useState, useEffect, useRef } from 'react';

export default function PushSwapGame({ active }) {
  const rand = n => Array.from({ length: n }, (_, i) => i + 1).sort(() => Math.random() - .5);
  const [n, setN] = useState(8);
  const [stackA, setStackA] = useState(() => rand(8));
  const [stackB, setStackB] = useState([]);
  const [ops, setOps] = useState([]);
  const [running, setRunning] = useState(false);
  const [opCount, setOpCount] = useState(0);
  const [sorted, setSorted] = useState(false);
  const tms = useRef([]);

  const reset = (size = n) => { tms.current.forEach(clearTimeout); tms.current = []; setStackA(rand(size)); setStackB([]); setOps([]); setOpCount(0); setSorted(false); setRunning(false); };
  useEffect(() => { if (!active) reset(); }, [active]);

  const sort = () => {
    if (running) return; setRunning(true); setSorted(false);
    let A = [...stackA], B = []; const moves = [];
    const doOp = (op, a, b) => moves.push({ op, A: [...a], B: [...b] });
    const max = Math.max(...A), bits = max.toString(2).length;
    for (let d = 0; d < bits && moves.length < 200; d++) {
      const len = A.length;
      for (let i = 0; i < len && moves.length < 200; i++) {
        const top = A.shift();
        if (((top) >> d) & 1) { B.unshift(top); doOp('pb', A, B); } else { A.push(top); doOp('ra', A, B); }
      }
      while (B.length && moves.length < 200) { A.unshift(B.shift()); doOp('pa', A, B); }
    }
    A.sort((a, b) => a - b); doOp('✓', A, []);
    let delay = 0;
    moves.forEach((m, i) => {
      const t = setTimeout(() => {
        setStackA([...m.A]); setStackB([...m.B]); setOps(o => [m.op, ...o.slice(0, 14)]); setOpCount(i + 1);
        if (i === moves.length - 1) { setRunning(false); setSorted(true); }
      }, delay);
      tms.current.push(t); delay += 80;
    });
  };

  const maxV = Math.max(...stackA, ...stackB, 1);

  return (
    <div style={{ width: '100%', maxWidth: 580, fontFamily: 'var(--mono)', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text3)', fontSize: 8, letterSpacing: 2 }}>SIZE:</span>
        {[5, 8, 12, 16].map(s => (
          <button key={s} data-h onClick={() => { setN(s); reset(s); }}
            style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '2px 10px', background: n === s ? 'rgba(0,212,255,.15)' : 'transparent', border: `1px solid ${n === s ? '#00d4ff' : 'var(--border)'}`, color: n === s ? '#00d4ff' : 'var(--text2)', cursor: 'none', transition: 'all .2s', borderRadius: 3 }}>{s}</button>
        ))}
        <button data-h onClick={() => reset()}
          style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '2px 10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'none', borderRadius: 3, transition: 'all .2s' }}
          onMouseEnter={e => { e.target.style.borderColor = '#ffc142'; e.target.style.color = '#ffc142'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)'; }}>↺ shuffle</button>
        <button data-h onClick={sort} disabled={running}
          style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '2px 14px', background: running ? 'transparent' : 'rgba(0,255,136,.15)', border: `1px solid ${running ? 'var(--border)' : '#00ff88'}`, color: running ? 'var(--text3)' : '#00ff88', cursor: 'none', borderRadius: 3, transition: 'all .2s' }}>
          {running ? `sorting… ${opCount} ops` : '▶ SORT'}
        </button>
        {sorted && <span style={{ color: '#00ff88', fontSize: 9 }}>✓ {opCount} ops</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[{ label: 'Stack A', data: stackA }, { label: 'Stack B', data: stackB }].map(({ label, data }) => (
          <div key={label}>
            <div style={{ color: 'var(--text3)', fontSize: 8, letterSpacing: 2, marginBottom: 6 }}>{label} [{data.length}]</div>
            <div style={{ background: 'rgba(3,6,12,0.78)', border: '1px solid var(--border)', borderRadius: 4, padding: '8px', minHeight: 90, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
              {data.length === 0
                ? <span style={{ color: 'var(--text3)', fontSize: 9, margin: 'auto' }}>empty</span>
                : data.slice(0, 16).map((v, i) => (
                  <div key={i} style={{ flex: 1, minWidth: 5, height: `${Math.max(5, (v / maxV) * 75)}px`, background: i === 0 && !sorted ? '#00d4ff' : sorted ? '#00ff88' : `hsl(${200 + (v / maxV) * 80},70%,55%)`, borderRadius: '2px 2px 0 0', transition: 'height .12s,background .3s', boxShadow: i === 0 ? '0 0 6px rgba(0,212,255,.5)' : 'none' }} />
                ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxHeight: 48, overflow: 'hidden' }}>
        {ops.slice(0, 18).map((op, i) => (
          <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: 8, padding: '2px 6px', background: 'rgba(0,212,255,.07)', border: '1px solid rgba(0,212,255,.18)', color: i === 0 ? '#00d4ff' : 'var(--text3)', borderRadius: 3, flexShrink: 0 }}>{op}</span>
        ))}
      </div>
    </div>
  );
}
