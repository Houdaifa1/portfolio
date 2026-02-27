import { useState, useEffect } from 'react';

export default function WebservGame({ active }) {
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/index.html');
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState(null);
  const [conns, setConns] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!active) { setMethod('GET'); setPath('/index.html'); setSending(false); setResponse(null); setConns([]); setTotal(0); }
  }, [active]);

  const RS = {
    'GET /index.html': { s: 200, b: '<html><h1>Hello from Webserv!</h1></html>', sz: '238B' },
    'GET /api/users': { s: 200, b: '[{"id":1},{"id":2}]', sz: '20B' },
    'GET /secret': { s: 403, b: '403 Forbidden', sz: '13B' },
    'GET /missing': { s: 404, b: '404 Not Found', sz: '12B' },
    'POST /api/data': { s: 201, b: '{"created":true,"id":42}', sz: '24B' },
    'DELETE /api/users/1': { s: 200, b: '{"deleted":true}', sz: '16B' },
  };

  const send = () => {
    setSending(true); setResponse(null);
    const key = `${method} ${path}`, res = RS[key] || { s: 200, b: `Response for ${method} ${path}`, sz: '40B' };
    const id = Date.now();
    setConns(c => [{ id, method, path, status: 'connecting' }, ...c.slice(0, 4)]);
    setTotal(n => n + 1);
    setTimeout(() => setConns(c => c.map(x => x.id === id ? { ...x, status: 'processing' } : x)), 280);
    setTimeout(() => { setResponse({ ...res, method, path, ms: Math.floor(Math.random() * 8 + 2) }); setConns(c => c.map(x => x.id === id ? { ...x, status: 'done', code: res.s } : x)); setSending(false); }, 700);
  };

  const sc = s => s >= 200 && s < 300 ? '#00ff88' : s >= 300 && s < 400 ? '#ffc142' : '#ff3b5c';
  const mc = { GET: '#00d4ff', POST: '#00ff88', DELETE: '#ff3b5c' };

  return (
    <div style={{ width: '100%', maxWidth: 580, fontFamily: 'var(--mono)', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: 'rgba(3,6,12,0.78)', border: '1px solid var(--border)', borderRadius: 6, padding: '12px 14px' }}>
        <div style={{ color: 'var(--text3)', fontSize: 8, letterSpacing: 2, marginBottom: 8 }}>HTTP REQUEST BUILDER — poll()/select() non-blocking I/O</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {['GET', 'POST', 'DELETE'].map(m => (
            <button key={m} data-h onClick={() => setMethod(m)}
              style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '3px 10px', background: method === m ? `${mc[m]}22` : 'transparent', border: `1px solid ${method === m ? mc[m] : 'var(--border)'}`, color: method === m ? mc[m] : 'var(--text2)', cursor: 'none', transition: 'all .2s', borderRadius: 3 }}>{m}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: 'var(--text3)', fontSize: 9, flexShrink: 0 }}>localhost:8080</span>
          <input value={path} onChange={e => setPath(e.target.value)}
            style={{ flex: 1, background: 'rgba(12,20,36,0.75)', border: '1px solid var(--border)', borderRadius: 3, padding: '4px 8px', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 11, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = '#00d4ff'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          <button data-h onClick={send} disabled={sending}
            style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '4px 14px', background: sending ? 'transparent' : '#00d4ff', border: 'none', color: sending ? '#00d4ff' : '#07090e', cursor: 'none', fontWeight: 700, letterSpacing: 1, borderRadius: 3, opacity: sending ? .7 : 1 }}>
            {sending ? '...' : 'SEND'}
          </button>
        </div>
        <div style={{ marginTop: 6, fontSize: 8, color: 'var(--text3)' }}>Try: /index.html · /secret · /missing · /api/users · /api/data</div>
      </div>
      {response && (
        <div style={{ background: 'rgba(3,6,12,0.78)', border: `1px solid ${sc(response.s)}44`, borderRadius: 6, padding: '12px 14px', animation: 'fadeUp .3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: `${sc(response.s)}22`, border: `1px solid ${sc(response.s)}55`, color: sc(response.s), padding: '2px 10px', borderRadius: 3, fontSize: 11, fontWeight: 700 }}>{response.s}</span>
              <span style={{ color: 'var(--text3)', fontSize: 8 }}>{response.ms}ms · {response.sz}</span>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: 8 }}>HTTP/1.1 · no external libs</span>
          </div>
          <div style={{ background: 'rgba(12,20,36,0.75)', borderRadius: 3, padding: '8px 10px', color: '#00ff88', fontSize: 11, wordBreak: 'break-all', lineHeight: 1.7 }}>{response.b}</div>
        </div>
      )}
      <div style={{ background: 'rgba(3,6,12,0.78)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px' }}>
        <div style={{ color: 'var(--text3)', fontSize: 8, letterSpacing: 2, marginBottom: 6 }}>CONNECTIONS · {total} total</div>
        {conns.length === 0
          ? <div style={{ color: 'var(--text3)', fontSize: 10 }}>No requests yet</div>
          : conns.map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, lineHeight: 2, fontSize: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.status === 'done' ? sc(c.code || 200) : c.status === 'processing' ? '#ffc142' : '#2e4055', flexShrink: 0 }} />
              <span style={{ color: mc[c.method] || '#00d4ff', width: 44, flexShrink: 0 }}>{c.method}</span>
              <span style={{ color: 'var(--text2)', flex: 1 }}>{c.path}</span>
              <span style={{ color: 'var(--text3)', fontSize: 8 }}>{c.status === 'done' ? c.code : c.status}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
