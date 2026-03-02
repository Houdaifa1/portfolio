import { useState, useEffect } from 'react';
import { rafScrollTo } from '../utils/scroll';

export default function Nav() {
  const [sc, setSc] = useState(false);

  useEffect(() => {
    const f = () => setSc(window.scrollY > 50);
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);

  const openCV = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('open-cv-download'));
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      backdropFilter: 'blur(28px)',
      background: sc ? 'rgba(4,7,18,.78)' : 'rgba(4,7,18,.18)',
      borderBottom: `1px solid ${sc ? 'rgba(0,180,255,0.15)' : 'transparent'}`,
      transition: 'all .4s',
      boxShadow: sc ? '0 4px 40px rgba(0,100,255,0.08)' : 'none',
    }}>
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#00d4ff', letterSpacing: 2 }}>
          <span style={{ color: 'var(--text2)' }}>~/</span>houdaifa
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[['skills','01'],['projects','02'],['about','03'],['contact','04']].map(([id, n]) => (
            <button key={id} data-h onClick={() => rafScrollTo(id)}
              style={{
                fontFamily: 'var(--mono)', fontSize: 11,
                color: '#8bacc8',
                background: 'none', border: 'none',
                cursor: 'pointer', letterSpacing: 2, textTransform: 'uppercase',
                transition: 'color .2s',
                padding: '4px 8px', borderRadius: 4,
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
              onMouseLeave={e => e.currentTarget.style.color = '#8bacc8'}>
              {n} {id}
            </button>
          ))}

          {/* CV download button — special */}
          <button
            data-h
            onClick={openCV}
            style={{
              fontFamily: 'var(--mono)', fontSize: 11,
              color: '#00d4ff',
              background: 'rgba(0,212,255,0.07)',
              border: '1px solid rgba(0,212,255,0.22)',
              cursor: 'pointer', letterSpacing: 2, textTransform: 'uppercase',
              transition: 'all 0.22s',
              padding: '5px 12px', borderRadius: 5,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,212,255,0.15)';
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';
              e.currentTarget.style.boxShadow = '0 0 18px rgba(0,212,255,0.2)';
              e.currentTarget.querySelector('.nav-arrow').style.transform = 'translateY(2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0,212,255,0.07)';
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.22)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.querySelector('.nav-arrow').style.transform = 'translateY(0)';
            }}
          >
            05 resume
            <span className="nav-arrow" style={{ fontSize: 10, transition: 'transform 0.2s ease' }}>⬇</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
