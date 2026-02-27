import { useState, useEffect } from 'react';

export default function NetPracticeGame({ active }) {
  const [ip, setIp] = useState('192.168.1.0');
  const [prefix, setPrefix] = useState(24);
  const [result, setResult] = useState(null);

  useEffect(() => { if (!active) { setIp('192.168.1.0'); setPrefix(24); setResult(null); } }, [active]);

  const calc = () => {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return setResult({ err: 'Invalid IP address' });
    const mask = prefix === 0 ? 0 : (-1 << (32 - prefix)) >>> 0;
    const ip32 = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
    const net = (ip32 & mask) >>> 0, bcast = (net | (~mask >>> 0)) >>> 0;
    const hosts = prefix >= 31 ? prefix === 32 ? 1 : 2 : Math.pow(2, 32 - prefix) - 2;
    const toIP = n => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
    setResult({
      network: toIP(net) + '/' + prefix, mask: toIP(mask), broadcast: toIP(bcast),
      first: toIP(net + 1), last: toIP(bcast - 1), hosts,
      class_: parts[0] < 128 ? 'A' : parts[0] < 192 ? 'B' : parts[0] < 224 ? 'C' : 'D/E',
      private_: parts[0] === 10 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168),
    });
  };

  return (
    <div style={{ width: '100%', maxWidth: 580, fontFamily: 'var(--mono)', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: 'rgba(3,6,12,0.78)', border: '1px solid var(--border)', borderRadius: 6, padding: '12px 14px' }}>
        <div style={{ color: 'var(--text3)', fontSize: 8, letterSpacing: 2, marginBottom: 10 }}>SUBNET CALCULATOR — TCP/IP from scratch</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={ip} onChange={e => setIp(e.target.value)} placeholder="192.168.1.0"
            style={{ flex: 1, minWidth: 120, background: 'rgba(12,20,36,0.75)', border: '1px solid var(--border)', borderRadius: 3, padding: '5px 8px', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 11, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = '#00d4ff'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          <span style={{ color: 'var(--text3)' }}>/</span>
          <input type="number" min="0" max="32" value={prefix} onChange={e => setPrefix(Number(e.target.value))}
            style={{ width: 50, background: 'rgba(12,20,36,0.75)', border: '1px solid var(--border)', borderRadius: 3, padding: '5px 8px', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 11, outline: 'none', textAlign: 'center' }}
            onFocus={e => e.target.style.borderColor = '#00d4ff'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          <button data-h onClick={calc} style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '5px 16px', background: '#00d4ff', border: 'none', color: '#07090e', cursor: 'none', fontWeight: 700, letterSpacing: 1, borderRadius: 3 }}>CALCULATE</button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          {['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12', '10.42.0.0/16'].map(ex => {
            const [eip, ep] = ex.split('/');
            return <button key={ex} data-h onClick={() => { setIp(eip); setPrefix(Number(ep)); }}
              style={{ fontFamily: 'var(--mono)', fontSize: 8, padding: '2px 8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text3)', cursor: 'none', borderRadius: 3, transition: 'all .2s' }}
              onMouseEnter={e => { e.target.style.borderColor = '#00d4ff'; e.target.style.color = '#00d4ff'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text3)'; }}>{ex}</button>;
          })}
        </div>
      </div>
      {result && (result.err
        ? <div style={{ color: '#ff3b5c', fontSize: 10, padding: '8px 12px', background: 'rgba(255,59,92,.1)', border: '1px solid rgba(255,59,92,.3)', borderRadius: 5 }}>{result.err}</div>
        : <div style={{ background: 'rgba(3,6,12,0.78)', border: '1px solid rgba(0,212,255,.25)', borderRadius: 6, padding: '12px 14px', animation: 'fadeUp .3s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[['Network', result.network], ['Subnet mask', result.mask], ['Broadcast', result.broadcast], ['First host', result.first], ['Last host', result.last], ['Usable hosts', result.hosts.toLocaleString()], ['Class', result.class_], ['Private', result.private_ ? 'Yes (RFC 1918)' : 'No (Public)']].map(([k, v]) => (
              <div key={k} style={{ background: 'rgba(12,20,36,0.75)', borderRadius: 3, padding: '7px 10px' }}>
                <div style={{ color: 'var(--text3)', fontSize: 8, letterSpacing: 1, marginBottom: 3 }}>{k}</div>
                <div style={{ color: '#00d4ff', fontSize: 11, fontWeight: 600 }}>{String(v)}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(12,20,36,0.75)', borderRadius: 3 }}>
            <div style={{ color: 'var(--text3)', fontSize: 8, letterSpacing: 1, marginBottom: 6 }}>CIDR VISUAL /{prefix}</div>
            <div style={{ display: 'flex', gap: 1 }}>
              {Array.from({ length: 32 }, (_, i) => (
                <div key={i} style={{ flex: 1, height: 12, background: i < prefix ? '#00d4ff' : '#1e2d40', borderRadius: 1, transition: 'background .3s', boxShadow: i < prefix ? '0 0 3px rgba(0,212,255,.4)' : 'none' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, color: 'var(--text3)', fontSize: 7 }}>
              <span>network ({prefix} bits)</span><span>host ({32 - prefix} bits)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
