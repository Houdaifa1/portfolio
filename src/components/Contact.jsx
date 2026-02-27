export default function Contact() {
  const links = [
    { icon: '✉', label: 'houdaifadrahm@gmail.com', sub: 'Email', href: 'mailto:houdaifadrahm@gmail.com' },
    { icon: '↗', label: 'github.com/Houdaifa1', sub: 'GitHub', href: 'https://github.com/Houdaifa1' },
    { icon: 'in', label: 'linkedin.com/in/houdaifa-drahm', sub: 'LinkedIn', href: 'https://linkedin.com/in/houdaifa-drahm' },
    { icon: '☎', label: '+212 644 645 877', sub: 'Phone', href: 'tel:+212644645877' },
  ];

  return (
    <section id="contact" style={{ padding: '120px 48px 100px', background: 'transparent', zIndex: 2 }}>
      <div>
        <div style={{ textAlign: 'center', marginBottom: 72 }} className="reveal">
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#00d4ff', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 24 }}>04 · Get in touch</div>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 800, letterSpacing: -4, lineHeight: .9, fontSize: 'clamp(56px,10vw,110px)' }}>
            <div style={{ color: '#f0f6ff' }}>LET'S</div>
            <div style={{ WebkitTextStroke: '2px rgba(240,246,255,.7)', color: 'transparent' }}>BUILD</div>
            <div style={{ background: 'linear-gradient(135deg,#00d4ff,#0055ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TOGETHER</div>
          </div>
          <p style={{ fontSize: 17, color: '#a8c4dc', marginTop: 28, lineHeight: 1.75, margin: '28px auto 0' }}>
            Open to Backend, DevOps & Systems Engineering roles — let's build something great.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
          {links.map(l => (
            <a key={l.sub} href={l.href} target="_blank" rel="noopener noreferrer" data-h
              style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '28px 24px', background: 'rgba(10,18,32,0.82)', border: '1px solid rgba(0,212,255,.12)', borderRadius: 12, backdropFilter: 'blur(8px)', textDecoration: 'none', transition: 'all .22s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,.45)'; e.currentTarget.style.background = '#131f2e'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,212,255,.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,.12)'; e.currentTarget.style.background = '#0f1824'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#4a6480', letterSpacing: 2, textTransform: 'uppercase' }}>{l.sub}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 16, color: '#00d4ff', opacity: .7 }}>{l.icon}</span>
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: '#c8dff0', letterSpacing: .3, lineHeight: 1.5, wordBreak: 'break-all' }}>{l.label}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
