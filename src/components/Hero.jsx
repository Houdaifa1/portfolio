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
          @keyframes cvFloat {
            0%,100% { transform: translateY(0px); }
            50%      { transform: translateY(-4px); }
          }
          @keyframes cvArrowBounce {
            0%,100% { transform: translateY(0); }
            50%      { transform: translateY(4px); }
          }
          @keyframes cvDot {
            0%,100% { opacity: 0.4; transform: scale(1); }
            50%      { opacity: 1; transform: scale(1.3); }
          }
          @keyframes cvGlow {
            0%,100% { box-shadow: 0 0 18px rgba(0,212,255,0.35), 0 0 40px rgba(0,102,255,0.18); }
            50%      { box-shadow: 0 0 28px rgba(0,212,255,0.55), 0 0 60px rgba(0,102,255,0.28); }
          }
          @keyframes cvShimmer {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
          .cv-card {
            animation:
              fadeUp .7s .65s ease both,
              cvFloat 3.8s 1.4s ease-in-out infinite,
              cvGlow 3.8s 1.4s ease-in-out infinite;
          }
          .cv-card:hover {
            animation: none !important;
          }
          .cv-card .cv-shimmer {
            animation: cvShimmer 3.2s 2s ease-in-out infinite;
          }
          .cv-card:hover .cv-shimmer {
            animation: cvShimmer 0.7s ease-in-out forwards;
          }
          .cv-card-arrow { animation: cvArrowBounce 1.6s 1.8s ease-in-out infinite; }
          .cv-card:hover .cv-card-arrow { animation: none; transform: translateY(4px) !important; }
        `}</style>

        <div
          onClick={openCV}
          data-h
          className="cv-card"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            padding: '13px 20px 13px 16px',
            background: 'linear-gradient(135deg, rgba(0,60,140,0.55) 0%, rgba(0,30,80,0.65) 100%)',
            border: '1px solid rgba(0,212,255,0.45)',
            borderRadius: 10,
            cursor: 'pointer',
            fontFamily: 'var(--mono)',
            transition: 'background 0.22s, border-color 0.22s, box-shadow 0.22s, transform 0.15s',
            opacity: 0, animationFillMode: 'forwards',
            position: 'relative', overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,90,200,0.65) 0%, rgba(0,50,120,0.75) 100%)';
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.75)';
            e.currentTarget.style.boxShadow = '0 0 48px rgba(0,212,255,0.5), 0 0 90px rgba(0,100,255,0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,60,140,0.55) 0%, rgba(0,30,80,0.65) 100%)';
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.45)';
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Shimmer sweep */}
          <div className="cv-shimmer" style={{
            position: 'absolute', top: 0, left: 0,
            width: '40%', height: '100%',
            background: 'linear-gradient(105deg, transparent 0%, rgba(0,212,255,0.12) 50%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: 10,
          }} />

          {/* PDF icon */}
          <div style={{ width: 30, height: 36, flexShrink: 0 }}>
            <div style={{
              width: 30, height: 36,
              background: 'rgba(0,212,255,0.15)',
              border: '1px solid rgba(0,212,255,0.4)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 0, height: 0, borderStyle: 'solid',
                borderWidth: '0 8px 8px 0',
                borderColor: 'transparent rgba(0,212,255,0.6) transparent transparent',
              }} />
              <span style={{ fontSize: 8, color: '#00d4ff', fontWeight: 700 }}>PDF</span>
            </div>
          </div>

          {/* File info */}
          <div>
            <div style={{ fontSize: 11, color: '#e8f4ff', letterSpacing: 0.5, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7, fontWeight: 600 }}>
              Houdaifa_Drahm_CV.pdf
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#00ff88',
                display: 'inline-block',
                animation: 'cvDot 2s ease-in-out infinite',
                boxShadow: '0 0 8px #00ff88',
              }} />
            </div>
            <div style={{ fontSize: 9, color: 'rgba(0,212,255,0.55)', display: 'flex', gap: 8, letterSpacing: 0.3 }}>
              <span>94K</span><span>·</span><span>Mar 2026</span><span>·</span>
              <span style={{ color: 'rgba(0,255,136,0.7)' }}>1 page</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="cv-card-arrow" style={{
            marginLeft: 4, fontSize: 14, color: '#00d4ff', flexShrink: 0,
            transition: 'transform 0.2s ease',
            filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.8))',
          }}>⬇</div>
        </div>

        <div style={{ position: 'absolute', bottom: 36, left: 48, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 10, color: '#4a6480', letterSpacing: 2, animation: 'fadeUp .7s .8s ease both', opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ width: 1, height: 36, background: 'linear-gradient(#00d4ff,transparent)' }} /> SCROLL
        </div>
      </div>
    </section>
  );
}
