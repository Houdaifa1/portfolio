export default function About() {
  const stats = [
    { n: '10+', l: 'Projects Built', icon: '⚡', color: '#00d4ff' },
    { n: '1337', l: 'School, UM6P', icon: '🎓', color: '#5ab4d6' },
    { n: '3', l: 'Human Languages', icon: '🌍', color: '#7ec8e3' },
    { n: '2', l: 'Database Engines', icon: '🗄️', color: '#00d4ff' },
    { n: '4', l: 'Systems Projects', icon: '⚙️', color: '#5ab4d6' },
    { n: '1', l: 'Live Platform', icon: '🚀', color: '#7ec8e3' },
  ];

  return (
    <section id="about" className="about-section" style={{ padding: '120px 48px', background: 'transparent', zIndex: 2 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 60 }} className="reveal">
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#00d4ff', letterSpacing: 2 }}>03</span>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, letterSpacing: -2, color: '#f0f6ff' }}>About</h2>
          <div style={{ flex: 1, maxWidth: 200, height: 1, background: 'var(--border)' }} />
        </div>
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div className="reveal-left">
            {[
              <><strong style={{ color: '#f0f6ff', fontWeight: 700 }}>Backend & DevOps Engineer</strong> from Morocco, completing the engineering program at <strong style={{ color: '#00d4ff', fontWeight: 700 }}>1337 School, UM6P Benguerir</strong>. The program is built around practical engineering projects and peer review.</>,
              <>I like starting with a clear problem and working through the full implementation. At 1337, that means writing the code, testing it, reviewing it with peers, and being able to explain every decision.</>,
              <>My work spans <strong style={{ color: '#00d4ff', fontWeight: 700 }}>C/C++ systems and raycasting engines</strong>, <strong style={{ color: '#00d4ff', fontWeight: 700 }}>NestJS services</strong>, WebSockets, TCP/IP networking, containers, and deployment on DigitalOcean.</>,
              <>I am fluent in <strong style={{ color: '#7ec8e3', fontWeight: 700 }}>Arabic, English, and French</strong>, and I enjoy working with teams that care about clear code and reliable systems.</>,
            ].map((t, i) => <p key={i} style={{ fontSize: 17, lineHeight: 1.9, color: '#a8c4dc', marginBottom: 22 }}>{t}</p>)}
          </div>
          <div className="reveal-right" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, transitionDelay: '150ms' }}>
            {stats.map(({ n, l, icon, color }) => (
              <div key={l}
                style={{ background: 'rgba(10,18,32,0.82)', border: `1px solid ${color}22`, padding: '22px 20px', transition: 'all .3s', position: 'relative', overflow: 'hidden', borderRadius: 12 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color + '55'; e.currentTarget.style.background = '#131f2e'; e.currentTarget.style.boxShadow = `0 0 28px ${color}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = color + '22'; e.currentTarget.style.background = '#0f1824'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ position: 'absolute', top: 10, right: 14, fontSize: 18, opacity: .4 }}>{icon}</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 36, fontWeight: 800, letterSpacing: -2, color, lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#6a90b0', letterSpacing: 2, textTransform: 'uppercase', marginTop: 7, lineHeight: 1.5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
