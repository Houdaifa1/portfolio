import { useState, useEffect } from 'react';
import { rafScrollTo } from '../utils/scroll';

export default function Hero() {
  const [typed, setTyped] = useState('');
  const full = 'Backend & DevOps Engineer';

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i <= full.length) { setTyped(full.slice(0, i)); i++; }
      else clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, []);

  const openCV = () => window.dispatchEvent(new CustomEvent('open-cv-download'));

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2, background: 'transparent' }}>
      <div style={{ padding: '120px 24px 80px', width: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20%', right: '12%', width: 420, height: 420, background: 'radial-gradient(circle,rgba(0,85,255,.12) 0%,transparent 68%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '18%', left: '18%', width: 260, height: 260, background: 'radial-gradient(circle,rgba(0,212,255,.08) 0%,transparent 68%)', pointerEvents: 'none' }} />

        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#00d4ff', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeUp .7s ease both' }}>
          <span style={{ width: 36, height: 1, background: '#00d4ff', display: 'block' }} /> Available for work · Morocco 🇲🇦
        </div>

        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(64px,10vw,140px)', fontWeight: 800, lineHeight: .88, letterSpacing: -4, marginBottom: 36 }}>
          <span style={{ display: 'block', color: '#f0f6ff', animation: 'fadeUp .7s .1s ease both', opacity: 0, animationFillMode: 'forwards' }}>HOUDAIFA</span>
          <span style={{ display: 'block', position: 'relative', color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,.35)', animation: 'fadeUp .7s .2s ease both', opacity: 0, animationFillMode: 'forwards' }}>
            DRAHM
            <span style={{ position: 'absolute', left: 0, top: 0, background: 'linear-gradient(120deg,#00d4ff,#0066ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', clipPath: 'inset(0 100% 0 0)', animation: 'wipe 1.1s .85s cubic-bezier(.77,0,.18,1) forwards' }}>DRAHM</span>
          </span>
        </h1>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 17, color: '#c0d8f0', marginBottom: 16, minHeight: 24, animation: 'fadeUp .7s .35s ease both', opacity: 0, animationFillMode: 'forwards' }}>
          <span style={{ color: '#00ff88' }}>&gt;</span> {typed}<span style={{ display: 'inline-block', width: 8, height: 17, background: '#00d4ff', marginLeft: 2, animation: 'blink 1s infinite', verticalAlign: 'middle' }} />
        </div>

        <p style={{ maxWidth: 520, fontSize: 19, lineHeight: 1.82, color: '#a8c4dc', marginBottom: 44, animation: 'fadeUp .7s .45s ease both', opacity: 0, animationFillMode: 'forwards' }}>
          Building production-grade systems from scratch — microservices, real-time architectures, containerized infrastructure, and deep C/C++ systems engineering.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 24, animation: 'fadeUp .7s .55s ease both', opacity: 0, animationFillMode: 'forwards' }}>
          <button onClick={() => rafScrollTo('projects')} data-h
            style={{ padding: '14px 32px', background: '#00d4ff', color: '#07090e', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'box-shadow .2s', borderRadius: 8 }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 36px rgba(0,212,255,.6)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>VIEW PROJECTS →</button>
          <button onClick={() => rafScrollTo('contact')} data-h
            style={{ padding: '14px 32px', background: 'transparent', color: '#a8c4dc', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(168,196,220,.3)', cursor: 'pointer', transition: 'all .2s', borderRadius: 8 }}
            onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff'; e.currentTarget.style.borderColor = '#00d4ff'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#a8c4dc'; e.currentTarget.style.borderColor = 'rgba(168,196,220,.3)'; }}>GET IN TOUCH</button>
        </div>

        {/* CV file-card download */}
        <div
          onClick={openCV}
          data-h
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            padding: '12px 18px',
            background: 'rgba(10,16,28,0.7)',
            border: '1px solid rgba(0,212,255,0.14)',
            borderRadius: 10,
            cursor: 'pointer',
            fontFamily: 'var(--mono)',
            transition: 'all 0.22s ease',
            animation: 'fadeUp .7s .65s ease both', opacity: 0, animationFillMode: 'forwards',
            position: 'relative', overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,212,255,0.06)';
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.1)';
            e.currentTarget.querySelector('.cv-arrow').style.transform = 'translateY(2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(10,16,28,0.7)';
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.14)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.querySelector('.cv-arrow').style.transform = 'translateY(0)';
          }}
        >
          {/* PDF icon */}
          <div style={{
            width: 32, height: 38, position: 'relative', flexShrink: 0,
          }}>
            <div style={{
              width: 32, height: 38,
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {/* Folded corner */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 0, height: 0,
                borderStyle: 'solid',
                borderWidth: '0 8px 8px 0',
                borderColor: `transparent rgba(0,212,255,0.3) transparent transparent`,
              }} />
              <span style={{ fontSize: 9, color: '#00d4ff', fontWeight: 700, letterSpacing: 0 }}>PDF</span>
            </div>
          </div>

          {/* File info */}
          <div>
            <div style={{ fontSize: 11, color: '#c0d8f0', letterSpacing: 0.5, marginBottom: 3 }}>
              Houdaifa_Drahm_CV.pdf
            </div>
            <div style={{ fontSize: 10, color: '#4a6480', display: 'flex', gap: 10 }}>
              <span>94K</span>
              <span>·</span>
              <span>Mar 2026</span>
              <span>·</span>
              <span style={{ color: '#00ff8888' }}>1 page</span>
            </div>
          </div>

          {/* Download arrow */}
          <div className="cv-arrow" style={{
            marginLeft: 8, fontSize: 14, color: '#00d4ff',
            transition: 'transform 0.2s ease',
          }}>
            ⬇
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 36, left: 48, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 10, color: '#4a6480', letterSpacing: 2, animation: 'fadeUp .7s .8s ease both', opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ width: 1, height: 36, background: 'linear-gradient(#00d4ff,transparent)' }} /> SCROLL
        </div>
      </div>
    </section>
  );
}
