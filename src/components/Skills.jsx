export default function Skills() {
  const cats = [
    { l: 'Languages', t: 'Core', icon: '{ }', tags: ['C', 'C++', 'JavaScript ES2022+', 'TypeScript', 'Python', 'Bash'], accent: '#00d4ff' },
    { l: 'Backend', t: 'Services', icon: '⚡', tags: ['Node.js', 'NestJS', 'REST APIs', 'WebSockets', 'Socket.io', 'JWT Auth', 'HTTP/1.1'], accent: '#5ab4d6' },
    { l: 'Infrastructure', t: 'DevOps', icon: '🐳', tags: ['Docker', 'Docker Compose', 'Kubernetes', 'GitHub Actions', 'DigitalOcean', 'Nginx TLS', 'CI/CD'], accent: '#7ec8e3' },
    { l: 'Low-level', t: 'Systems', icon: '⚙', tags: ['POSIX Threads', 'Mutexes', 'Semaphores', 'Signal Handling', 'poll()/select()', 'GDB'], accent: '#00d4ff' },
    { l: 'Graphics', t: '3D & Games', icon: '🎮', tags: ['Raycasting', 'MinilibX', 'OpenGL', '3D Math', 'Sprite Rendering', 'Game Loop'], accent: '#5ab4d6' },
    { l: 'Networking', t: 'TCP/IP', icon: '🌐', tags: ['Subnetting', 'CIDR', 'IPv4 Routing', 'TCP/UDP Sockets', 'HTTP/1.1'], accent: '#7ec8e3' },
    { l: 'Data', t: 'Databases', icon: '🗄', tags: ['PostgreSQL', 'MariaDB'], accent: '#00d4ff' },
    { l: 'Human', t: 'Languages', icon: '🌍', tags: ['Arabic — Native', 'English — Professional', 'French — Professional'], accent: '#5ab4d6' },
  ];

  return (
    <section id="skills" style={{ padding: '120px 0', background: 'transparent', zIndex: 2 }}>
      <div style={{ padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 64 }} className="reveal">
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#00d4ff', letterSpacing: 2 }}>01</span>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, letterSpacing: -2, color: '#f0f6ff' }}>Skills</h2>
          <div style={{ flex: 1, maxWidth: 200, height: 1, background: 'var(--border)' }} />
        </div>
        <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {cats.map((c, ci) => {
            const spanMap = { 0: 2, 1: 1, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2 };
            const span = spanMap[ci] || 1;
            return (
              <div key={c.t} className="reveal"
                style={{
                  transitionDelay: `${ci * 60}ms`,
                  gridColumn: `span ${span}`,
                  background: 'rgba(10,18,32,0.82)',
                  border: `1px solid ${c.accent}18`,
                  padding: '28px 26px',
                  transition: 'border-color .25s,background .25s,box-shadow .25s,opacity .7s ease,transform .7s ease',
                  position: 'relative', overflow: 'hidden', borderRadius: 12, backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}50`; e.currentTarget.style.background = '#131f2e'; e.currentTarget.style.boxShadow = `0 8px 40px ${c.accent}0a`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.accent}18`; e.currentTarget.style.background = '#0f1824'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: `linear-gradient(180deg,${c.accent},${c.accent}00)` }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: c.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 5 }}>{c.l}</div>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800, color: '#f0f6ff', letterSpacing: -.5 }}>{c.t}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 22, opacity: .5 }}>{c.icon}</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {c.tags.map(t => (
                    <span key={t} data-h
                      style={{ fontFamily: 'var(--mono)', fontSize: 11, padding: '5px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#b0cce0', transition: 'all .18s', cursor: 'none', letterSpacing: .3 }}
                      onMouseEnter={e => { e.target.style.background = `${c.accent}14`; e.target.style.borderColor = `${c.accent}55`; e.target.style.color = c.accent; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.color = '#b0cce0'; }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
