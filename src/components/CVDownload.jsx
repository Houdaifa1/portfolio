import { useState, useEffect, useRef } from 'react';

const SEQ = [
  { d: 0,    t: '$ ssh houdaifa@1337.ma -i ~/.ssh/portfolio_key', c: 'cmd' },
  { d: 560,  t: '✓  Connected · UM6P Cluster · 42 Network · Benguerir', c: 'ok' },
  { d: 1020, t: '$ find ~/cv -name "*.pdf" -ls', c: 'cmd' },
  { d: 1340, t: '  94K  Mar 2026  /home/houdaifa/cv/Houdaifa_Drahm_CV.pdf', c: 'file' },
  { d: 1740, t: '$ cat ~/cv/metadata.conf', c: 'cmd' },
  { d: 2020, t: '  name    : Houdaifa Drahm', c: 'data' },
  { d: 2180, t: '  role    : Backend & DevOps Engineer', c: 'data' },
  { d: 2340, t: '  stack   : Node.js · NestJS · Docker · K8s · C/C++', c: 'data' },
  { d: 2500, t: '  school  : 1337 School (42 Network) · UM6P', c: 'data' },
  { d: 2780, t: '$ git log --oneline --graph -3 ~/projects/', c: 'cmd' },
  { d: 3060, t: '  * a1f3c2e  ft_transcendence — real-time multiplayer', c: 'git' },
  { d: 3240, t: '  * b8d9e1f  webserv — HTTP/1.1 server, zero libraries', c: 'git' },
  { d: 3420, t: '  * c4a7b3d  inception — multi-container Docker infra', c: 'git' },
  { d: 3700, t: '$ cp -v ~/cv/Houdaifa_Drahm_CV.pdf /srv/export/', c: 'cmd' },
];

const CLR = {
  cmd: '#00d4ff', ok: '#00ff88', file: '#ffc142',
  data: '#8bacc8', git: '#c084fc', success: '#00ff88',
};

export default function CVDownload({ onClose }) {
  const [lines, setLines]     = useState([]);
  const [progress, setProgress] = useState(null);
  const [done, setDone]       = useState(false);
  const [visible, setVisible] = useState(false);
  const bodyRef  = useRef(null);
  const ids      = useRef([]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));

    SEQ.forEach(({ d, t, c }) => {
      const id = setTimeout(() => setLines(prev => [...prev, { t, c }]), d);
      ids.current.push(id);
    });

    const startId = setTimeout(() => {
      setProgress(0);
      let v = 0;
      const iv = setInterval(() => {
        v = Math.min(v + 1.6, 100);
        setProgress(v);
        if (v >= 100) {
          clearInterval(iv);
          setTimeout(() => {
            setLines(prev => [...prev,
              { t: '[✓] Export complete · PDF/A · 94K · 1 page', c: 'success' },
            ]);
            const a = document.createElement('a');
            a.href = '/Houdaifa_Drahm_CV.pdf';
            a.download = 'Houdaifa_Drahm_CV.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => setDone(true), 480);
          }, 160);
        }
      }, 18);
      ids.current.push(iv);
    }, 3900);
    ids.current.push(startId);

    return () => {
      cancelAnimationFrame(raf);
      ids.current.forEach(id => clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, progress, done]);

  const close = () => { setVisible(false); setTimeout(onClose, 320); };

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(3,5,12,0.93)',
        backdropFilter: 'blur(22px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.32s ease',
      }}
    >
      {/* Glow blob behind terminal */}
      <div style={{
        position: 'absolute', width: 600, height: 400,
        background: 'radial-gradient(ellipse,rgba(0,100,255,0.12) 0%,transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 660,
          background: 'rgba(4,7,16,0.99)',
          border: '1px solid rgba(0,212,255,0.18)',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: [
            '0 0 0 1px rgba(0,212,255,0.04)',
            '0 28px 90px rgba(0,0,0,0.75)',
            '0 0 70px rgba(0,80,255,0.1)',
            '0 0 140px rgba(0,212,255,0.05)',
          ].join(','),
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.38,0.64,1)',
          fontFamily: "'JetBrains Mono',monospace",
        }}
      >
        {/* Title bar */}
        <div style={{
          height: 44,
          background: 'rgba(6,10,22,0.98)',
          borderBottom: '1px solid rgba(0,212,255,0.09)',
          display: 'flex', alignItems: 'center',
          padding: '0 16px', gap: 8,
        }}>
          {[['#ff5f57','Close'],['#ffbd2e','Min'],['#28c840','Max']].map(([color, label], i) => (
            <div
              key={i}
              onClick={i === 0 ? close : undefined}
              title={label}
              style={{
                width: 12, height: 12, borderRadius: '50%',
                background: color,
                boxShadow: `0 0 8px ${color}88`,
                cursor: i === 0 ? 'pointer' : 'default',
                flexShrink: 0,
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => { if(i===0) e.currentTarget.style.transform='scale(1.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; }}
            />
          ))}
          <div style={{
            flex: 1, textAlign: 'center',
            fontSize: 11, color: 'rgba(100,145,185,0.45)', letterSpacing: 1.5,
          }}>
            houdaifa@1337:~ — cv_export.sh
          </div>
          {/* Fake traffic-light spacer on right */}
          <div style={{ width: 52 }} />
        </div>

        {/* Terminal body */}
        <div
          ref={bodyRef}
          style={{
            padding: '20px 24px',
            height: 340, overflowY: 'auto',
            scrollbarWidth: 'none',
            position: 'relative',
            background: 'linear-gradient(180deg,rgba(4,7,16,0.6) 0%,rgba(3,5,13,0.8) 100%)',
          }}
        >
          {/* CRT scanlines */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(0,0,0,0.07) 1px,rgba(0,0,0,0.07) 2px)',
          }} />
          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse 90% 90% at 50% 50%,transparent 60%,rgba(0,0,0,0.35) 100%)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {lines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 12, lineHeight: 1.85,
                  color: CLR[line.c] || '#8bacc8',
                  opacity: 0,
                  animation: 'fadeUp 0.25s ease forwards',
                  whiteSpace: 'pre',
                }}
              >
                {line.t}
              </div>
            ))}

            {/* Blinking cursor while running */}
            {!done && progress === null && lines.length > 0 && (
              <span style={{
                display: 'inline-block', width: 8, height: 13,
                background: '#00d4ff', marginTop: 4, verticalAlign: 'middle',
                animation: 'blink 1s infinite',
              }} />
            )}

            {/* Progress bar */}
            {progress !== null && (
              <div style={{ marginTop: 16, opacity: 0, animation: 'fadeUp 0.3s ease forwards' }}>
                <div style={{
                  fontSize: 11, marginBottom: 7, letterSpacing: 0.5,
                  display: 'flex', justifyContent: 'space-between',
                  color: progress >= 100 ? '#00ff88' : '#00d4ff',
                }}>
                  <span>Exporting Houdaifa_Drahm_CV.pdf</span>
                  <span>{Math.round(Math.min(progress, 100))}%</span>
                </div>
                <div style={{
                  height: 3, borderRadius: 2,
                  background: 'rgba(255,255,255,0.05)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(progress, 100)}%`,
                    background: progress >= 100
                      ? 'linear-gradient(90deg,#00cc66,#00ff88)'
                      : 'linear-gradient(90deg,#0044cc,#00d4ff)',
                    borderRadius: 2,
                    boxShadow: `0 0 12px rgba(0,212,255,${progress >= 100 ? 0.9 : 0.5})`,
                    transition: 'width 0.04s linear, background 0.4s',
                  }} />
                </div>
              </div>
            )}

            {/* Done state */}
            {done && (
              <div style={{
                marginTop: 20,
                padding: '18px 20px',
                border: '1px solid rgba(0,255,136,0.18)',
                borderRadius: 10,
                background: 'rgba(0,255,136,0.03)',
                opacity: 0,
                animation: 'fadeUp 0.4s ease 0.1s forwards',
              }}>
                <div style={{
                  fontSize: 11, color: '#00ff88', letterSpacing: 1,
                  marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'rgba(0,255,136,0.15)',
                    fontSize: 10,
                  }}>✓</span>
                  Download triggered · check your downloads folder
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a
                    href="/Houdaifa_Drahm_CV.pdf"
                    download="Houdaifa_Drahm_CV.pdf"
                    data-h
                    style={{
                      padding: '10px 24px',
                      background: 'linear-gradient(135deg,#0055ff,#00d4ff)',
                      color: '#fff',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 11, fontWeight: 700, letterSpacing: 2,
                      textDecoration: 'none', borderRadius: 6,
                      boxShadow: '0 0 24px rgba(0,212,255,0.35)',
                      transition: 'box-shadow 0.2s, transform 0.15s',
                      display: 'inline-block',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.6)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 0 24px rgba(0,212,255,0.35)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ⬇ SAVE AGAIN
                  </a>
                  <button
                    onClick={close}
                    data-h
                    style={{
                      padding: '10px 24px',
                      background: 'transparent',
                      color: '#4a6480',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 11, letterSpacing: 2,
                      border: '1px solid rgba(74,100,128,0.3)',
                      borderRadius: 6, cursor: 'pointer',
                      transition: 'color 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#8bacc8';
                      e.currentTarget.style.borderColor = 'rgba(139,172,200,0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#4a6480';
                      e.currentTarget.style.borderColor = 'rgba(74,100,128,0.3)';
                    }}
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
