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
        <style>{`
          @keyframes cvPulse {
            0%,100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.0), 0 0 18px rgba(0,212,255,0.06); }
            50%      { box-shadow: 0 0 0 6px rgba(0,212,255,0.0), 0 0 28px rgba(0,212,255,0.13); }
          }
          @keyframes cvFloat {
            0%,100% { transform: translateY(0px); }
            50%      { transform: translateY(-3px); }
          }
          @keyframes cvArrowBounce {
            0%,100% { transform: translateY(0); }
            50%      { transform: translateY(3px); }
          }
          @keyframes cvDot {
            0%,100% { opacity: 0.3; } 50% { opacity: 1; }
          }
          .cv-card { animation: fadeUp .7s .65s ease both, cvFloat 3.8s 1.4s ease-in-out infinite; }
          .cv-card:hover { animation: none !important; }
          .cv-card-arrow { animation: cvArrowBounce 1.6s 1.8s ease-in-out infinite; }
          .cv-card:hover .cv-card-arrow { animation: none; transform: translateY(3px) !important; }
        `}</style>

        <div
          onClick={openCV}
          data-h
          className="cv-card"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            padding: '11px 16px 11px 14px',
            background: 'rgba(8,13,24,0.75)',
            border: '1px solid rgba(0,212,255,0.16)',
            borderRadius: 10,
            cursor: 'pointer',
            fontFamily: 'var(--mono)',
            transition: 'background 0.22s, border-color 0.22s, box-shadow 0.22s',
            opacity: 0, animationFillMode: 'forwards',
            position: 'relative', overflow: 'hidden',
            animationName: 'fadeUp, cvFloat',
            animationDuration: '.7s, 3.8s',
            animationDelay: '.65s, 1.4s',
            animationTimingFunction: 'ease, ease-in-out',
            animationFillMode: 'forwards, none',
            animationIterationCount: '1, infinite',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,212,255,0.07)';
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)';
            e.currentTarget.style.boxShadow = '0 0 36px rgba(0,212,255,0.14), inset 0 0 20px rgba(0,212,255,0.03)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(8,13,24,0.75)';
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.16)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Shimmer sweep on hover */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(105deg,transparent 40%,rgba(0,212,255,0.04) 50%,transparent 60%)',
            borderRadius: 10,
          }} />

          {/* PDF icon */}
          <div style={{ width: 30, height: 36, flexShrink: 0, position: 'relative' }}>
            <div style={{
              width: 30, height: 36,
              background: 'rgba(0,212,255,0.07)',
              border: '1px solid rgba(0,212,255,0.18)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 0, height: 0, borderStyle: 'solid',
                borderWidth: '0 7px 7px 0',
                borderColor: 'transparent rgba(0,212,255,0.28) transparent transparent',
              }} />
              <span style={{ fontSize: 8, color: '#00d4ff', fontWeight: 700 }}>PDF</span>
            </div>
          </div>

          {/* File info */}
          <div>
            <div style={{ fontSize: 11, color: '#d0e4f4', letterSpacing: 0.4, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
              Houdaifa_Drahm_CV.pdf
              {/* live dot */}
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#00ff88',
                display: 'inline-block',
                animation: 'cvDot 2s ease-in-out infinite',
                boxShadow: '0 0 6px #00ff88',
              }} />
            </div>
            <div style={{ fontSize: 9, color: '#3a5470', display: 'flex', gap: 8, letterSpacing: 0.3 }}>
              <span>94K</span><span>·</span><span>Mar 2026</span><span>·</span>
              <span style={{ color: 'rgba(0,255,136,0.5)' }}>1 page</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="cv-card-arrow" style={{
            marginLeft: 6, fontSize: 13, color: '#00d4ff', flexShrink: 0,
            transition: 'transform 0.2s ease',
          }}>⬇</div>
        </div>

        <div style={{ position: 'absolute', bottom: 36, left: 48, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 10, color: '#4a6480', letterSpacing: 2, animation: 'fadeUp .7s .8s ease both', opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ width: 1, height: 36, background: 'linear-gradient(#00d4ff,transparent)' }} /> SCROLL
        </div>
      </div>
    </section>
  );
}
