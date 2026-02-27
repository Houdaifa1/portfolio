import { useState, useEffect, useRef } from 'react';

export default function Born2berootGame({ active }) {
  const initRules = [
    { id: 'ssh', label: 'SSH port 4242', desc: 'Non-standard port (not 22)', enabled: true, secure: true },
    { id: 'root', label: 'Root SSH login', desc: 'Direct root login via SSH', enabled: false, secure: false },
    { id: 'ufw', label: 'UFW Firewall', desc: 'Uncomplicated Firewall active', enabled: true, secure: true },
    { id: 'pwd', label: 'Password policy', desc: 'Min 10 chars, uppercase, digit', enabled: true, secure: true },
    { id: 'sudo', label: 'Sudo logging', desc: 'All sudo cmds logged', enabled: true, secure: true },
    { id: 'http', label: 'Open port 80', desc: 'HTTP exposed publicly', enabled: false, secure: false },
  ];
  const [rules, setRules] = useState(initRules);
  const [attacks, setAttacks] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [blocked, setBlocked] = useState(0);
  const [hit, setHit] = useState(0);
  const tms = useRef([]);

  useEffect(() => {
    if (!active) { tms.current.forEach(clearTimeout); tms.current = []; setRules(initRules); setAttacks([]); setScanning(false); setBlocked(0); setHit(0); }
  }, [active]);

  const scan = () => {
    setScanning(true); setAttacks([]); setBlocked(0); setHit(0);
    const atks = [
      { label: 'SSH brute force port 22', ok: !!rules.find(r => r.id === 'ssh')?.enabled },
      { label: 'Root login attempt', ok: !rules.find(r => r.id === 'root')?.enabled },
      { label: 'Port scan 0-1024', ok: !!rules.find(r => r.id === 'ufw')?.enabled },
      { label: 'Weak password crack', ok: !!rules.find(r => r.id === 'pwd')?.enabled },
      { label: 'Privilege escalation', ok: !!rules.find(r => r.id === 'sudo')?.enabled },
      { label: 'HTTP exploit :80', ok: !rules.find(r => r.id === 'http')?.enabled },
    ];
    let b = 0, h = 0;
    atks.forEach((a, i) => {
      const t = setTimeout(() => {
        if (a.ok) b++; else h++;
        setAttacks(p => [...p, { ...a, id: i }]); setBlocked(b); setHit(h);
        if (i === atks.length - 1) setScanning(false);
      }, (i + 1) * 380);
      tms.current.push(t);
    });
  };

  const score = Math.max(0, 100 - hit * 18);

  return (
    <div style={{ width: '100%', maxWidth: 580, fontFamily: 'var(--mono)', fontSize: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {rules.map(r => {
          const ok = r.enabled === r.secure;
          return (
            <div key={r.id} data-h onClick={() => setRules(p => p.map(x => x.id === r.id ? { ...x, enabled: !x.enabled } : x))}
              style={{ background: ok ? 'rgba(0,255,136,.06)' : 'rgba(255,59,92,.06)', border: `1px solid ${ok ? 'rgba(0,255,136,.25)' : 'rgba(255,59,92,.25)'}`, borderRadius: 5, padding: '9px 11px', cursor: 'none', transition: 'all .2s', userSelect: 'none' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = ok ? '#00ff88' : '#ff3b5c'}
              onMouseLeave={e => e.currentTarget.style.borderColor = ok ? 'rgba(0,255,136,.25)' : 'rgba(255,59,92,.25)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ color: ok ? '#00ff88' : '#ff3b5c', fontWeight: 600, fontSize: 10 }}>{r.label}</span>
                <div style={{ width: 26, height: 14, background: r.enabled ? '#00ff88' : '#ff3b5c', borderRadius: 7, position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 2, left: r.enabled ? 13 : 2, width: 10, height: 10, background: 'white', borderRadius: '50%', transition: 'left .2s' }} />
                </div>
              </div>
              <div style={{ color: 'var(--text3)', fontSize: 8, lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button data-h onClick={scan} disabled={scanning}
          style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '6px 16px', background: 'rgba(255,59,92,.12)', border: `1px solid ${scanning ? 'rgba(255,59,92,.3)' : '#ff3b5c'}`, color: '#ff3b5c', cursor: 'none', letterSpacing: 1, transition: 'all .2s' }}>
          {scanning ? '▶ ATTACKING…' : '⚡ SIMULATE ATTACK'}
        </button>
        {attacks.length > 0 && !scanning && (
          <span style={{ color: score >= 80 ? '#00ff88' : score >= 50 ? '#ffc142' : '#ff3b5c', fontSize: 10, fontWeight: 700 }}>
            Score: {score}/100 {score === 100 ? '🛡️' : score >= 80 ? '✓' : score >= 50 ? '⚠' : '💀'}
          </span>
        )}
      </div>
      {attacks.length > 0 && (
        <div style={{ background: 'rgba(3,6,12,0.78)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {attacks.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, animation: 'fadeUp .3s ease' }}>
              <span style={{ color: a.ok ? '#00ff88' : '#ff3b5c', flexShrink: 0, width: 12 }}>{a.ok ? '✓' : '✗'}</span>
              <span style={{ color: 'var(--text2)', flex: 1 }}>{a.label}</span>
              <span style={{ color: a.ok ? '#00ff88' : '#ff3b5c', fontSize: 8 }}>{a.ok ? 'BLOCKED' : 'BREACHED'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
