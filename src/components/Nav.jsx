import { useState, useEffect } from 'react';
import { rafScrollTo } from '../utils/scroll';

export default function Nav() {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const f = () => setSc(window.scrollY > 50);
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      backdropFilter: 'blur(28px)',
      background: sc ? 'rgba(4,7,18,.78)' : 'rgba(4,7,18,.18)',
      borderBottom: `1px solid ${sc ? 'rgba(0,180,255,0.15)' : 'transparent'}`,
      transition: 'all .4s',
      boxShadow: sc ? '0 4px 40px rgba(0,100,255,0.08)' : 'none'
    }}>
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#00d4ff', letterSpacing: 2 }}>
          <span style={{ color: 'var(--text2)' }}>~/</span>houdaifa
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['skills','01'],['projects','02'],['about','03'],['contact','04'],['resume','05']].map(([id, n]) => (
            <button key={id} data-h onClick={() => rafScrollTo(id)}
              style={{
                fontFamily: 'var(--mono)', fontSize: 11,
                color: id === 'resume' ? '#00d4ff' : '#8bacc8',
                background: id === 'resume' ? 'rgba(0,212,255,0.08)' : 'none',
                border: id === 'resume' ? '1px solid rgba(0,212,255,0.25)' : 'none',
                cursor: 'pointer', letterSpacing: 2, textTransform: 'uppercase',
                transition: 'color .2s, background .2s, border-color .2s',
                padding: '4px 8px', borderRadius: 4,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#00d4ff';
                if (id === 'resume') e.currentTarget.style.background = 'rgba(0,212,255,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = id === 'resume' ? '#00d4ff' : '#8bacc8';
                if (id === 'resume') e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
              }}>
              {n} {id}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
