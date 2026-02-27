import { useState, useEffect } from 'react';

export default function DockerGame({ active }) {
  const initContainers = [
    { id: 'nginx', name: 'nginx:alpine', status: 'running', port: '443:443', cpu: 12, mem: 24, col: '#00ff88', icon: '🌐' },
    { id: 'mariadb', name: 'mariadb:10.6', status: 'running', port: '3306:3306', cpu: 8, mem: 156, col: '#ffc142', icon: '🗄️' },
    { id: 'wordpress', name: 'wordpress:latest', status: 'running', port: '80:80', cpu: 22, mem: 88, col: '#00d4ff', icon: '📝' },
  ];
  const [containers, setContainers] = useState(initContainers);
  const [logs, setLogs] = useState([
    { t: 0, v: '[inception] All containers healthy ✓' },
    { t: 1, v: '[nginx] TLS OK' },
    { t: 2, v: '[mariadb] Pool ready' },
    { t: 3, v: '[wordpress] Started :80' },
  ]);

  useEffect(() => {
    if (!active) {
      setContainers(initContainers);
      setLogs([{ t: 0, v: '[inception] All containers healthy ✓' }, { t: 1, v: '[nginx] TLS OK' }, { t: 2, v: '[mariadb] Pool ready' }, { t: 3, v: '[wordpress] Started :80' }]);
    }
  }, [active]);

  const addLog = msg => setLogs(l => [{ t: Date.now(), v: msg }, ...l.slice(0, 7)]);
  const toggle = id => {
    const c = containers.find(x => x.id === id);
    const ns = c.status === 'running' ? 'stopped' : 'running';
    setContainers(p => p.map(x => x.id === id ? { ...x, status: ns } : x));
    addLog(`[docker] ${id} ${ns} ✓`);
  };
  const restart = id => {
    setContainers(p => p.map(x => x.id === id ? { ...x, status: 'restarting' } : x));
    addLog(`[docker] Restarting ${id}...`);
    setTimeout(() => { setContainers(p => p.map(x => x.id === id ? { ...x, status: 'running' } : x)); addLog(`[docker] ${id} started ✓`); }, 1400);
  };

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setContainers(c => c.map(x => x.status === 'running' ? { ...x, cpu: Math.max(1, Math.min(95, x.cpu + (Math.random() * 8 - 4))) } : x)), 900);
    return () => clearInterval(t);
  }, [active]);

  const sCol = { running: '#00ff88', stopped: '#ff3b5c', restarting: '#ffc142' };

  return (
    <div style={{ width: '100%', maxWidth: 580, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 10 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
        <span style={{ color: 'var(--text2)' }}>inception_network</span>
        <span style={{ color: 'var(--text3)' }}>· bridge · 172.18.0.0/16</span>
      </div>
      {containers.map(c => (
        <div key={c.id} style={{ background: 'rgba(12,20,36,0.75)', border: '1px solid var(--border)', borderRadius: 5, padding: '12px 16px', transition: 'border-color .3s', borderColor: c.status === 'running' ? 'var(--border2)' : 'var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{c.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>{c.port}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '2px 7px', background: `${sCol[c.status]}18`, border: `1px solid ${sCol[c.status]}44`, color: sCol[c.status], borderRadius: 3 }}>
                {c.status === 'restarting' ? '↻ restart' : c.status === 'running' ? '● running' : '○ stopped'}
              </span>
              <button data-h onClick={() => restart(c.id)}
                style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '2px 8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'none', borderRadius: 3, transition: 'all .2s' }}
                onMouseEnter={e => { e.target.style.borderColor = '#ffc142'; e.target.style.color = '#ffc142'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)'; }}>↻</button>
              <button data-h onClick={() => toggle(c.id)}
                style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '2px 8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'none', borderRadius: 3, transition: 'all .2s' }}
                onMouseEnter={e => { e.target.style.borderColor = c.status === 'running' ? '#ff3b5c' : '#00ff88'; e.target.style.color = c.status === 'running' ? '#ff3b5c' : '#00ff88'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)'; }}>
                {c.status === 'running' ? '⏹' : '▶'}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text3)', width: 24 }}>CPU</span>
            <div style={{ flex: 1, height: 2, background: 'var(--bg)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${c.cpu}%`, background: c.cpu > 70 ? '#ff3b5c' : c.cpu > 40 ? '#ffc142' : c.col, borderRadius: 2, transition: 'width .8s ease' }} />
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text3)', width: 26, textAlign: 'right' }}>{Math.round(c.cpu)}%</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text3)', width: 40, textAlign: 'right' }}>{c.mem}MB</span>
          </div>
        </div>
      ))}
      <div style={{ background: 'rgba(3,6,12,0.78)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 10, lineHeight: 1.9, maxHeight: 90, overflowY: 'auto' }}>
        {logs.map((l, i) => <div key={l.t + i} style={{ color: i === 0 ? '#00ff88' : 'var(--text3)' }}>{l.v}</div>)}
      </div>
    </div>
  );
}
