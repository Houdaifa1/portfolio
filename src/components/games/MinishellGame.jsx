import { useState, useEffect, useRef, useCallback } from 'react';

export default function MinishellGame({ active }) {
  const initHistory = [
    { t: 'sys', v: '╭─────────────────────────────────────────╮' },
    { t: 'sys', v: '│  Minishell v1.0 · built from scratch in C │' },
    { t: 'sys', v: '╰─────────────────────────────────────────╯' },
    { t: 'sys', v: '' },
    { t: 'h', v: '┌─ Available Commands ──────────────────┐' },
    { t: 'k', v: '│  ls          list project directories  │' },
    { t: 'k', v: '│  pwd         print working directory   │' },
    { t: 'k', v: '│  whoami      display user info         │' },
    { t: 'k', v: '│  skills      list tech stack           │' },
    { t: 'k', v: '│  ps          running processes         │' },
    { t: 'k', v: '│  env         environment variables     │' },
    { t: 'k', v: '│  git log     commit history            │' },
    { t: 'k', v: '│  uname -a    system info               │' },
    { t: 'k', v: '│  cat <file>  read file contents        │' },
    { t: 'k', v: '│  echo <txt>  print text                │' },
    { t: 'k', v: '│  clear       clear terminal            │' },
    { t: 'h', v: '└────────────────────────────────────────┘' },
    { t: 'sys', v: '' },
  ];

  const [history, setHistory] = useState(initHistory);
  const [input, setInput] = useState('');
  const [cmdHist, setCmdHist] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setHistory(initHistory);
      setInput(''); setCmdHist([]); setHIdx(-1);
    }
  }, [active]);

  const CMDS = {
    help: [
      { t: 'h', v: '┌─ Available Commands ──────────────────┐' },
      { t: 'k', v: '│  ls          list project directories  │' },
      { t: 'k', v: '│  pwd         print working directory   │' },
      { t: 'k', v: '│  whoami      display user info         │' },
      { t: 'k', v: '│  skills      list tech stack           │' },
      { t: 'k', v: '│  ps          running processes         │' },
      { t: 'k', v: '│  env         environment variables     │' },
      { t: 'k', v: '│  git log     commit history            │' },
      { t: 'k', v: '│  uname -a    system info               │' },
      { t: 'k', v: '│  cat <file>  read file contents        │' },
      { t: 'k', v: '│  echo <txt>  print text                │' },
      { t: 'k', v: '│  clear       clear terminal            │' },
      { t: 'h', v: '└────────────────────────────────────────┘' },
    ],
    ls: [
      { t: 'd', v: '  📁 drwxr-xr-x  ft_transcendence/' },
      { t: 'd', v: '  📁 drwxr-xr-x  webserv/' },
      { t: 'd', v: '  📁 drwxr-xr-x  inception/' },
      { t: 'd', v: '  📁 drwxr-xr-x  minishell/' },
      { t: 'd', v: '  📁 drwxr-xr-x  push_swap/' },
      { t: 'd', v: '  📁 drwxr-xr-x  so_long/' },
      { t: 'd', v: '  📁 drwxr-xr-x  cub3d/' },
      { t: 'o', v: '  📄 -rw-r--r--  README.md' },
      { t: 'o', v: '  📄 -rw-r--r--  Makefile' },
    ],
    pwd: [{ t: 'o', v: '  /home/houdaifa/42/projects' }],
    whoami: [
      { t: 'g', v: '  houdaifa — Backend & DevOps Engineer' },
      { t: 'g', v: '  @ 1337 School · UM6P · Benguerir' },
    ],
    skills: [
      { t: 'g', v: '  ── Languages ─────────────────────────' },
      { t: 'g', v: '  C · C++ · JavaScript · TypeScript · Bash' },
      { t: 'g', v: '  ── Backend ───────────────────────────' },
      { t: 'g', v: '  Node.js · NestJS · Socket.io · JWT' },
      { t: 'g', v: '  ── DevOps ────────────────────────────' },
      { t: 'g', v: '  Docker · K8s · GitHub Actions · DO' },
      { t: 'g', v: '  ── Systems ───────────────────────────' },
      { t: 'g', v: '  POSIX · pthreads · Mutexes · poll()' },
      { t: 'g', v: '  ── Databases ─────────────────────────' },
      { t: 'g', v: '  PostgreSQL · MariaDB' },
    ],
    'git log': [
      { t: 'y', v: '  a3f9c12  feat: ft_transcendence → DO' },
      { t: 'y', v: '  b1e4d88  build: HTTP/1.1 server scratch' },
      { t: 'y', v: '  c7a2f01  feat: Docker Compose infra' },
      { t: 'y', v: '  d9e3b44  fix: zero data races philos' },
      { t: 'y', v: '  e2a1c77  feat: Unix shell pipes+signals' },
      { t: 'y', v: '  f8b355   feat: so_long 2D game MinilibX' },
      { t: 'y', v: '  g9c144   feat: cub3d raycasting engine' },
    ],
    ps: [
      { t: 'o', v: '  PID  CMD' },
      { t: 'o', v: '  ─────────────────────────────────────' },
      { t: 'o', v: '  001  nginx (TLS termination)' },
      { t: 'o', v: '  002  node dist/main.js' },
      { t: 'o', v: '  042  ./minishell' },
      { t: 'o', v: '  100  docker-compose up' },
    ],
    'uname -a': [{ t: 'o', v: '  Linux 1337-school 5.15.0 #42 SMP x86_64 GNU/Linux' }],
    env: [
      { t: 'o', v: '  NODE_ENV=production' },
      { t: 'o', v: '  DATABASE_URL=postgresql://localhost:5432/ft_db' },
      { t: 'o', v: '  JWT_SECRET=***hidden***' },
      { t: 'o', v: '  PORT=3000' },
    ],
    clear: 'clear',
  };

  const CAT = {
    'README.md': [
      { t: 'h', v: '  # Houdaifa Drahm — 42 Network' },
      { t: 'o', v: '  Building from scratch since day one.' },
      { t: 'o', v: '  ft_transcendence | webserv | inception' },
      { t: 'o', v: '  minishell | push_swap | so_long | cub3d' },
    ],
    'Makefile': [
      { t: 'o', v: '  all: build test deploy' },
      { t: 'o', v: '  build:   docker-compose up --build -d' },
      { t: 'o', v: '  deploy:  gh workflow run ci.yml' },
    ],
  };

  const COLS = { sys: '#1e3348', info: '#4a7090', h: '#00d4ff', k: '#5a8aaa', o: '#8fa8c0', d: '#00d4ff', g: '#00ff88', y: '#ffc142', r: '#ff3b5c', cmd: '#e0eaf8' };

  const run = useCallback((cmd) => {
    const c = cmd.trim(); if (!c) return;
    setCmdHist(p => [c, ...p.slice(0, 49)]); setHIdx(-1);
    const cat = c.match(/^cat (.+)$/);
    if (cat) { const f = cat[1], res = CAT[f] || [{ t: 'r', v: `  cat: ${f}: No such file or directory` }]; setHistory(h => [...h, { t: 'cmd', v: c }, ...res, { t: 'sys', v: '' }]); return; }
    const echo = c.match(/^echo (.*)$/);
    if (echo) { setHistory(h => [...h, { t: 'cmd', v: c }, { t: 'o', v: `  ${echo[1]}` }, { t: 'sys', v: '' }]); return; }
    const fn = CMDS[c];
    if (!fn) { setHistory(h => [...h, { t: 'cmd', v: c }, { t: 'r', v: `  minishell: command not found: ${c}` }, { t: 'sys', v: '' }]); return; }
    if (fn === 'clear') { setHistory([]); return; }
    setHistory(h => [...h, { t: 'cmd', v: c }, ...fn, { t: 'sys', v: '' }]);
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const handleKeyDown = useCallback((e) => {
    e.stopPropagation();
    if (e.key === 'Enter') { e.preventDefault(); run(input); setInput(''); }
    if (e.key === 'ArrowUp') { e.preventDefault(); const i = Math.min(hIdx + 1, cmdHist.length - 1); setHIdx(i); setInput(cmdHist[i] || ''); }
    if (e.key === 'ArrowDown') { e.preventDefault(); const i = Math.max(hIdx - 1, -1); setHIdx(i); setInput(i === -1 ? '' : cmdHist[i] || ''); }
    if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(CMDS).find(c => c.startsWith(input)); if (m) setInput(m); }
  }, [input, hIdx, cmdHist, run]);

  return (
    <div style={{ background: '#020508', border: '1px solid #0d2035', borderRadius: 12, overflow: 'hidden', fontFamily: 'var(--mono)', fontSize: 13, boxShadow: '0 0 0 1px rgba(0,212,255,.05),0 32px 64px rgba(0,0,0,.85)', width: '100%', maxWidth: 600 }}
      onClick={() => inputRef.current?.focus()}>
      <div style={{ background: 'linear-gradient(90deg,#0a1520,#0c1828)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #0d2035', userSelect: 'none' }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {['#ff3b5c', '#ffc142', '#00ff88'].map(c => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}66` }} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontSize: 11, color: '#3a6080', letterSpacing: 1 }}>houdaifa@1337</span>
          <span style={{ color: '#1e3a55', margin: '0 6px' }}>—</span>
          <span style={{ fontSize: 11, color: '#2a5070', letterSpacing: 1 }}>minishell</span>
        </div>
        <span style={{ fontSize: 10, color: '#1a3248', letterSpacing: .5 }}>bash 5.2</span>
      </div>
      <div ref={bodyRef} style={{ height: 300, overflowY: 'auto', padding: '14px 0 8px', display: 'flex', flexDirection: 'column', scrollbarWidth: 'thin', scrollbarColor: '#1a3248 transparent' }}>
        {history.map((l, i) => (
          <div key={i} style={{ lineHeight: 1.6, color: COLS[l.t] || '#8fa8c0', display: 'flex', alignItems: 'flex-start', gap: 8, paddingLeft: l.t === 'cmd' ? 16 : 0, flexShrink: 0, minHeight: l.v === '' ? 8 : undefined }}>
            {l.t === 'cmd' && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                <span style={{ color: '#00d4ff66', fontSize: 11 }}>houdaifa@1337</span>
                <span style={{ color: '#2a4a60', fontSize: 11 }}>:</span>
                <span style={{ color: '#00ff8866', fontSize: 11 }}>~/projects</span>
                <span style={{ color: '#ffc14280', fontSize: 11 }}>$</span>
              </div>
            )}
            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{l.v}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #0d2035', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, background: '#030609' }}>
        <span style={{ color: '#00d4ff66', fontSize: 11, flexShrink: 0 }}>houdaifa@1337</span>
        <span style={{ color: '#2a4a60', fontSize: 11, flexShrink: 0 }}>:</span>
        <span style={{ color: '#00ff8866', fontSize: 11, flexShrink: 0 }}>~/projects</span>
        <span style={{ color: '#ffc14299', fontSize: 11, flexShrink: 0 }}>$</span>
        <input ref={inputRef} value={input} autoFocus spellCheck={false} autoComplete="off"
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e0eaf8', fontFamily: 'var(--mono)', fontSize: 13, flex: 1, caretColor: '#00d4ff' }} />
        <span style={{ width: 8, height: 14, background: '#00d4ff', display: 'inline-block', animation: 'blink 1s infinite', opacity: .8, flexShrink: 0 }} />
      </div>
      <div style={{ background: '#030609', borderTop: '1px solid #0a1820', padding: '6px 16px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {['help', 'ls', 'whoami', 'skills', 'git log'].map(cmd => (
          <span key={cmd} data-h onClick={e => { e.stopPropagation(); run(cmd); }}
            style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#2a5070', letterSpacing: .5, cursor: 'none', transition: 'color .15s', padding: '1px 0' }}
            onMouseEnter={e => e.target.style.color = '#00d4ff'}
            onMouseLeave={e => e.target.style.color = '#2a5070'}>
            {cmd}
          </span>
        ))}
      </div>
    </div>
  );
}
