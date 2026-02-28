import { useState, useEffect, useRef } from 'react';
import MinishellGame from './games/MinishellGame';
import DockerGame from './games/DockerGame';
import PhilosophersGame from './games/PhilosophersGame';
import WebservGame from './games/WebservGame';
import PushSwapGame from './games/PushSwapGame';
import SoLongGame from './games/SoLongGame';
import Cub3DGame from './games/Cub3DGame';
import NetPracticeGame from './games/NetPracticeGame';
import NetpongGallery from './games/NetpongGallery';

const Empty = () => null;

/* ─── Inject keyframes once into the document ────────────── */
const CSS = `
@keyframes _repo_pulse {
  0%,100% { box-shadow: 0 0 6px 1px var(--ra), 0 0 0 0 var(--ra2); }
  50%      { box-shadow: 0 0 16px 4px var(--ra), 0 0 0 3px var(--ra2); }
}
@keyframes _repo_march {
  from { background-position: 0 0; }
  to   { background-position: 48px 0; }
}
@keyframes _repo_slidein {
  from { opacity:0; transform:translateY(8px) scale(.96); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
@keyframes _repo_shimmer {
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
}
@keyframes _pill_float {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-3px); }
}
@keyframes _arr_go {
  0%,100% { transform: translateX(0) translateY(0); }
  50%     { transform: translateX(3px) translateY(-3px); }
}
`;

function InjectCSS() {
  useEffect(() => {
    const id = '__repo_styles__';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);
  return null;
}

/* ─── hex → "r,g,b" ─────────────────────────────────────── */
function toRGB(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : '0,212,255';
}

/* ─── Main repo button (single project) ─────────────────── */
function RepoLink({ href, accent, label = 'SOURCE CODE', delay = 0 }) {
  const [hov, setHov] = useState(false);
  const rgb = toRGB(accent);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        '--ra':  `rgba(${rgb},.5)`,
        '--ra2': `rgba(${rgb},.18)`,

        display:        'inline-flex',
        alignItems:     'center',
        gap:            9,
        fontFamily:     'var(--mono)',
        fontSize:       11,
        fontWeight:     700,
        letterSpacing:  2.5,
        textTransform:  'uppercase',
        textDecoration: 'none',
        color:          accent,
        padding:        '10px 20px',
        border:         `1px solid rgba(${rgb},${hov ? .85 : .55})`,
        borderRadius:   2,
        background:     hov
          ? `linear-gradient(135deg, rgba(${rgb},.18) 0%, rgba(${rgb},.06) 100%)`
          : `rgba(${rgb},.07)`,
        cursor:         'none',
        position:       'relative',
        overflow:       'hidden',
        outline:        hov ? `2px solid rgba(${rgb},.25)` : '2px solid transparent',
        outlineOffset:  '3px',

        animation: `_repo_slidein .45s ${delay}ms both,
                    _repo_pulse   2.6s ${delay}ms ease-in-out infinite`,

        transition: 'background .2s, border-color .2s, outline-color .2s',
      }}
    >
      {/* marching-ants top edge on hover */}
      {hov && (
        <span style={{
          position:         'absolute',
          top:              0, left: 0, right: 0,
          height:           1,
          background:       `repeating-linear-gradient(90deg,
                              ${accent} 0px, ${accent} 10px,
                              transparent 10px, transparent 20px)`,
          backgroundSize:   '48px 1px',
          animation:        '_repo_march .45s linear infinite',
          pointerEvents:    'none',
        }}/>
      )}
      {hov && (
        <span style={{
          position:         'absolute',
          bottom:           0, left: 0, right: 0,
          height:           1,
          background:       `repeating-linear-gradient(90deg,
                              ${accent} 0px, ${accent} 10px,
                              transparent 10px, transparent 20px)`,
          backgroundSize:   '48px 1px',
          animation:        '_repo_march .45s linear infinite reverse',
          pointerEvents:    'none',
        }}/>
      )}

      {/* GitHub mark */}
      <svg width="14" height="14" viewBox="0 0 16 16"
        style={{
          fill:       accent,
          flexShrink: 0,
          filter:     hov ? `drop-shadow(0 0 4px ${accent})` : 'none',
          transition: 'filter .2s',
        }}
      >
        <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53
          5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49
          -2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
          1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07
          -1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02
          .08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09
          2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82
          1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0
          1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8
          c0-4.42-3.58-8-8-8z"/>
      </svg>

      {/* shimmer text */}
      <span style={{
        background:           hov
          ? `linear-gradient(90deg, ${accent} 20%, #fff 50%, ${accent} 80%)`
          : accent,
        backgroundSize:       '300% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip:       'text',
        WebkitTextFillColor:  hov ? 'transparent' : 'unset',
        color:                hov ? 'transparent' : accent,
        animation:            hov ? '_repo_shimmer 1.4s linear infinite' : 'none',
      }}>
        {label}
      </span>

      {/* arrow */}
      <span style={{
        fontSize:  13,
        lineHeight: 1,
        display:   'inline-block',
        color:     accent,
        filter:    hov ? `drop-shadow(0 0 4px ${accent})` : 'none',
        animation: hov ? '_arr_go .55s ease-in-out infinite' : 'none',
        transition:'filter .2s',
      }}>
        ↗
      </span>
    </a>
  );
}

/* ─── Core-42 pill grid ──────────────────────────────────── */
function CoreRepoGrid({ repos, accent }) {
  return (
    <>
      <div style={{
        marginTop:    20,
        paddingTop:   16,
        borderTop:    '1px solid rgba(40,70,110,0.3)',
        fontFamily:   'var(--mono)',
        fontSize:     9,
        letterSpacing:2,
        color:        '#3a5470',
        marginBottom: 10,
        textTransform:'uppercase',
      }}>
        ── repositories
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {repos.map(({ label, href }, i) => (
          <CorePill key={label} href={href} label={label} delay={i * 50} />
        ))}
      </div>
    </>
  );
}

function CorePill({ href, label, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        gap:            5,
        fontFamily:     'var(--mono)',
        fontSize:       9,
        fontWeight:     700,
        letterSpacing:  1.8,
        textTransform:  'uppercase',
        textDecoration: 'none',
        padding:        '6px 12px',
        borderRadius:   2,
        color:          hov ? '#00d4ff'               : '#4a7a9b',
        background:     hov ? 'rgba(0,212,255,0.1)'   : 'rgba(20,40,70,0.5)',
        border:         hov ? '1px solid rgba(0,212,255,.55)' : '1px solid rgba(40,80,120,.4)',
        boxShadow:      hov ? '0 0 12px rgba(0,212,255,.3)' : 'none',
        cursor:         'none',
        animation:      `_pill_float ${2.2 + (delay * 0.004)}s ${delay}ms ease-in-out infinite`,
        transition:     'color .15s, background .15s, border-color .15s, box-shadow .15s',
      }}
    >
      <svg width="9" height="9" viewBox="0 0 16 16"
        style={{ fill: hov ? '#00d4ff' : '#4a7a9b', transition: 'fill .15s', flexShrink: 0 }}>
        <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53
          5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49
          -2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
          1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07
          -1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02
          .08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09
          2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82
          1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0
          1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8
          c0-4.42-3.58-8-8-8z"/>
      </svg>
      {label}
    </a>
  );
}

/* ─── Projects section ───────────────────────────────────── */
export default function Projects() {
  const [visibleId, setVisibleId] = useState(null);
  const cardRefs   = useRef({});

  useEffect(() => {
    const observers = {};
    const threshold = window.innerWidth < 768 ? 0.2 : 0.45;
    Object.keys(cardRefs.current).forEach(id => {
      const el = cardRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setVisibleId(id);
      }, { threshold });
      obs.observe(el);
      observers[id] = obs;
    });
    return () => Object.values(observers).forEach(o => o.disconnect());
  }, []);

  const GH = 'https://github.com/Houdaifa1';

  const projects = [
    {
      id: 'trans', num: '01', name: 'ft_transcendence', type: 'Full-Stack · Real-Time · DevOps',
      tags:    ['NestJS','TypeScript','Socket.io','JWT','Docker','GitHub Actions','DigitalOcean','PostgreSQL','React'],
      desc:    'NETPONG — deployed at netpong.games. Real-time multiplayer air hockey with 4 themed arenas. NestJS microservices, Socket.io game rooms, JWT auth, global leaderboard, live chat. Zero-downtime CI/CD via GitHub Actions.',
      Demo: Empty, badge: '🎮 LIVE GALLERY', Gallery: NetpongGallery, accent: '#c084fc',
      repo: 'https://github.com/fttranscendenceorganization/ft_transcendence',
    },
    {
      id: 'mini', num: '02', name: 'Minishell', type: 'Systems · C · Unix',
      tags:    ['C','POSIX','Unix Signals','Bash','Process Management'],
      desc:    'Fully functional Unix shell in C — Bash-compliant tokenization, parsing, execution engine. Multi-pipe chaining, heredocs, I/O redirections, env variable expansion, signal handling (SIGINT/SIGQUIT). 100% memory-safe.',
      Demo: MinishellGame, badge: '⌨ LIVE SHELL', accent: '#00d4ff',
      repo: `${GH}/minishell`,
    },
    {
      id: 'incep', num: '03', name: 'Inception', type: 'DevOps · Docker · Infrastructure',
      tags:    ['Docker Compose','Nginx','TLS/SSL','MariaDB','WordPress'],
      desc:    'Multi-container infrastructure using Docker Compose — Nginx with TLS termination, MariaDB with persistent volumes, WordPress in isolated containers with custom bridge networking.',
      Demo: DockerGame, badge: '🐳 LIVE CONTAINERS', accent: '#00d4ff',
      repo: `${GH}/inception`,
    },
    {
      id: 'philo', num: '04', name: 'Philosophers', type: 'Concurrency · C · Systems',
      tags:    ['C','pthreads','Mutexes','Semaphores','Deadlock Prevention'],
      desc:    'Concurrent dining philosophers simulation using pthreads and mutexes. Guarantees deadlock-free and starvation-free execution. Zero data races under extended stress testing.',
      Demo: PhilosophersGame, badge: '🍝 VISUALIZE', accent: '#5ab4d6',
      repo: `${GH}/philosophers`,
    },
    {
      id: 'web', num: '05', name: 'Webserv', type: 'Systems · C++ · Networking',
      tags:    ['C++','HTTP/1.1','poll()/select()','CGI','TCP Sockets'],
      desc:    'Production-grade HTTP/1.1 server from scratch in C++, zero external libraries. Non-blocking I/O via poll()/select() for concurrent connections. Supports GET, POST, DELETE, chunked encoding, CGI.',
      Demo: WebservGame, badge: '🌐 HTTP REQUESTS', accent: '#00d4ff',
      repo: `${GH}/webserv`,
    },
    {
      id: 'push', num: '06', name: 'Push_swap', type: 'Algorithms · C · Sorting',
      tags:    ['C','Radix Sort','Stack Operations','Algorithm Optimization'],
      desc:    'Sorts integers using two stacks with a limited instruction set — push, swap, rotate. Implements radix sort achieving O(n log n). Watch every operation step by step in real time.',
      Demo: PushSwapGame, badge: '📊 SORT VISUALIZER', accent: '#7ec8e3',
      repo: `${GH}/push_swap`,
    },
    {
      id: 'solong', num: '07', name: 'so_long', type: 'Graphics · C · MinilibX · Game Dev',
      tags:    ['C','MinilibX','2D Graphics','Game Loop','Map Parsing'],
      desc:    '2D tile-based game in C using MinilibX. Collect all coins then reach the exit. Custom map parsing, sprite rendering, keyboard event loop. Playable right here.',
      Demo: SoLongGame, badge: '🕹 PLAY NOW', accent: '#00d4ff',
      repo: `${GH}/so_long`,
    },
    {
      id: 'cub3d', num: '08', name: 'cub3D', type: 'Graphics · C · Raycasting',
      tags:    ['C','Raycasting','MinilibX','3D Math','OpenGL concepts'],
      desc:    '3D raycasting engine from scratch in C — Wolfenstein 3D style. Pseudo-3D first-person view from a 2D map. Camera-plane DDA, minimap, smooth movement. Playable right here.',
      Demo: Cub3DGame, badge: '🎲 3D RAYCASTER', accent: '#5ab4d6',
      repo: `${GH}/cub3d`,
    },
    {
      id: 'net', num: '09', name: 'NetPractice', type: 'Networking · TCP/IP · Subnetting',
      tags:    ['TCP/IP','Subnetting','CIDR','Routing','IPv4'],
      desc:    'Mastered TCP/IP through 10 levels of progressively complex network configuration. Covers subnetting, CIDR notation, routing tables, troubleshooting. Interactive calculator below.',
      Demo: NetPracticeGame, badge: '🌐 SUBNET CALC', accent: '#00d4ff',
      repo: null,
    },
    {
      id: 'core', num: '10', name: 'Core 42 Projects', type: 'C · C++ · Systems',
      tags:    ['C','C++','Libft','ft_printf','Get_Next_Line','Born2beroot','OOP','STL'],
      desc:    'Libft (custom libc), ft_printf (variadic output engine), Get_Next_Line (buffered fd reader), Born2beroot (Linux VM hardening), CPP Modules 00–09 — OOP, templates, STL, polymorphism, exceptions.',
      Demo: null, badge: null, accent: '#4a6480',
      repo: null,
      coreRepos: [
        { label: 'LIBFT',         href: `${GH}/libft` },
        { label: 'FT_PRINTF',     href: `${GH}/ft_printf` },
        { label: 'GET_NEXT_LINE', href: `${GH}/get_next_line` },
        { label: 'MINITALK',      href: `${GH}/minitalk` },
        { label: 'CPP·00',        href: `${GH}/cpp00` },
        { label: 'CPP·01',        href: `${GH}/cpp01` },
        { label: 'CPP·02',        href: `${GH}/cpp02` },
        { label: 'CPP·03',        href: `${GH}/cpp03` },
        { label: 'CPP·04',        href: `${GH}/cpp04` },
        { label: 'CPP·05',        href: `${GH}/cpp05` },
        { label: 'CPP·06',        href: `${GH}/cpp06` },
        { label: 'CPP·07',        href: `${GH}/cpp07` },
        { label: 'CPP·08',        href: `${GH}/cpp08` },
        { label: 'CPP·09',        href: `${GH}/cpp09` },
      ],
    },
  ];

  return (
    <section id="projects" style={{ padding: '120px 0', background: 'transparent', zIndex: 2 }}>
      <InjectCSS />

      <div style={{ padding: '0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 80 }} className="reveal">
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#00d4ff', letterSpacing: 2 }}>02</span>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, letterSpacing: -2, color: '#f0f6ff' }}>Projects</h2>
          <div style={{ flex: 1, maxWidth: 200, height: 1, background: 'var(--border)' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#4a6480', letterSpacing: 2 }}>{projects.length} PROJECTS</span>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {projects.map((proj, idx) => {
            const hasDemo    = proj.Demo && proj.Demo !== Empty;
            const hasGallery = !!proj.Gallery;
            const isEven     = idx % 2 === 0;
            const isActive   = visibleId === proj.id;

            return (
              <div
                key={proj.id}
                ref={el => cardRefs.current[proj.id] = el}
                className="reveal"
                style={{
                  transitionDelay:   `${idx * 80}ms`,
                  display:           'grid',
                  gridTemplateColumns: hasDemo || hasGallery
                    ? (isEven ? '1fr 1.5fr' : '1.5fr 1fr')
                    : '1fr',
                  gap:           0,
                  borderRadius:  14,
                  backdropFilter:'blur(12px)',
                  border:        `1px solid ${isActive && (hasDemo || hasGallery) ? proj.accent + '30' : 'var(--border)'}`,
                  overflow:      'hidden',
                  position:      'relative',
                  transition:    'border-color .4s ease',
                }}
              >
                {/* ── Left demo (odd rows) ── */}
                {!isEven && (hasDemo || hasGallery) && (
                  <div style={{ background:'rgba(6,10,20,0.72)', padding:'48px 40px', display:'flex', alignItems:'center', justifyContent:'center', minHeight:320, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at center,${proj.accent}06 0%,transparent 70%)`, pointerEvents:'none' }}/>
                    <div style={{ width:'100%', maxWidth:560 }}>
                      {hasGallery && <proj.Gallery />}
                      {hasDemo    && <proj.Demo active={isActive} />}
                    </div>
                  </div>
                )}

                {/* ── Info column ── */}
                <div style={{ padding:'48px 40px', background:'rgba(8,14,26,0.72)', display:'flex', flexDirection:'column', justifyContent:'center' }}>

                  {/* num + badge */}
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                    <span style={{ fontFamily:'var(--mono)', fontSize:11, color:proj.accent, opacity:.6, letterSpacing:2 }}>{proj.num}</span>
                    {proj.badge && (
                      <span style={{ fontFamily:'var(--mono)', fontSize:8, color:proj.accent, letterSpacing:1.5, background:`${proj.accent}10`, border:`1px solid ${proj.accent}30`, padding:'3px 10px' }}>
                        {proj.badge}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontFamily:'var(--display)', fontSize:'clamp(22px,3vw,34px)', fontWeight:800, letterSpacing:-1, color:'#f0f6ff', marginBottom:8, lineHeight:1.1 }}>
                    {proj.name}
                  </h3>
                  <div style={{ fontFamily:'var(--mono)', fontSize:11, color:'#6a90b0', letterSpacing:1, marginBottom:18, textTransform:'uppercase' }}>
                    {proj.type}
                  </div>
                  <p style={{ fontSize:17, lineHeight:1.88, color:'#a8c4dc', marginBottom:24, maxWidth:480 }}>
                    {proj.desc}
                  </p>

                  {/* tech tags */}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                    {proj.tags.map(t => (
                      <span key={t} style={{ fontFamily:'var(--mono)', fontSize:10, padding:'5px 12px', background:`${proj.accent}12`, border:`1px solid ${proj.accent}35`, color:proj.accent+'cc', letterSpacing:.3 }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* ── single repo link ── */}
                  {proj.repo && (
                    <div style={{ marginTop: 22 }}>
                      <RepoLink
                        href={proj.repo}
                        accent={proj.accent}
                        label="SOURCE CODE"
                        delay={idx * 60}
                      />
                    </div>
                  )}

                  {/* ── core-42 pill grid ── */}
                  {proj.coreRepos && (
                    <CoreRepoGrid repos={proj.coreRepos} accent={proj.accent} />
                  )}
                </div>

                {/* ── Right demo (even rows) ── */}
                {isEven && (hasDemo || hasGallery) && (
                  <div style={{ background:'rgba(6,10,20,0.72)', padding:'48px 40px', display:'flex', alignItems:'center', justifyContent:'center', minHeight:320, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at center,${proj.accent}06 0%,transparent 70%)`, pointerEvents:'none' }}/>
                    <div style={{ width:'100%', maxWidth:560 }}>
                      {hasGallery && <proj.Gallery />}
                      {hasDemo    && <proj.Demo active={isActive} />}
                    </div>
                  </div>
                )}

                {!hasDemo && !hasGallery && <div />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
