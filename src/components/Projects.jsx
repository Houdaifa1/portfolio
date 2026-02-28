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

/* ── Animated GitHub link component ─────────────────────── */
function RepoLink({ href, accent, label = 'VIEW SOURCE' }) {
  const [hovered, setHovered] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    setHovered(true);
    // random glitch burst
    timerRef.current = setTimeout(() => setGlitching(true), 80);
    setTimeout(() => setGlitching(false), 380);
  };
  const handleMouseLeave = () => {
    setHovered(false);
    clearTimeout(timerRef.current);
    setGlitching(false);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        fontFamily: 'var(--mono)',
        fontSize: 10,
        letterSpacing: 2,
        textDecoration: 'none',
        color: hovered ? accent : '#4a6480',
        background: hovered ? `${accent}14` : 'rgba(10,16,28,0.6)',
        border: `1px solid ${hovered ? accent + '60' : 'rgba(40,70,110,0.4)'}`,
        padding: '7px 14px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'color .22s, background .22s, border-color .22s',
        cursor: 'none',
      }}
    >
      {/* scan-line sweep on hover */}
      <span style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(90deg, transparent 0%, ${accent}18 50%, transparent 100%)`,
        transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
        transition: hovered ? 'transform .45s ease' : 'none',
        pointerEvents: 'none',
      }} />

      {/* GitHub octicon SVG (inline, no external dep) */}
      <svg
        width="13" height="13" viewBox="0 0 16 16" fill="none"
        style={{
          fill: hovered ? accent : '#4a6480',
          transition: 'fill .22s',
          transform: hovered ? 'rotate(-8deg) scale(1.15)' : 'rotate(0deg) scale(1)',
          transition: 'fill .22s, transform .22s',
        }}
      >
        <path fillRule="evenodd" clipRule="evenodd"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
             0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
             -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
             .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
             -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
             .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
             .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
             0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
        />
      </svg>

      {/* Glitch duplicate text layer */}
      <span style={{ position: 'relative' }}>
        {glitching && (
          <span style={{
            position: 'absolute', top: 0, left: 0,
            color: accent,
            clipPath: 'inset(40% 0 30% 0)',
            transform: 'translateX(-3px)',
            opacity: 0.7,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>{label}</span>
        )}
        <span style={{ opacity: glitching ? 0.6 : 1, transition: 'opacity .05s' }}>{label}</span>
      </span>

      {/* Arrow that slides in */}
      <span style={{
        display: 'inline-block',
        transform: hovered ? 'translateX(0px)' : 'translateX(-6px)',
        opacity: hovered ? 1 : 0,
        transition: 'transform .22s, opacity .22s',
        fontSize: 11,
      }}>↗</span>
    </a>
  );
}

/* ── Mini row of repo links for the Core 42 card ────────── */
function CoreRepoLinks({ repos, accent }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
      {repos.map(({ label, href }) => (
        <RepoLink key={label} href={href} accent={accent} label={label} />
      ))}
    </div>
  );
}

export default function Projects() {
  const [visibleId, setVisibleId] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    const observers = {};
    const threshold = window.innerWidth < 768 ? 0.2 : 0.45;

    Object.keys(cardRefs.current).forEach(id => {
      const el = cardRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setVisibleId(id);
      }, { threshold });
      obs.observe(el);
      observers[id] = obs;
    });

    return () => Object.values(observers).forEach(o => o.disconnect());
  }, []);

  const GITHUB = 'https://github.com/Houdaifa1';

  const projects = [
    {
      id: 'trans', num: '01', name: 'ft_transcendence', type: 'Full-Stack · Real-Time · DevOps',
      tags: ['NestJS', 'TypeScript', 'Socket.io', 'JWT', 'Docker', 'GitHub Actions', 'DigitalOcean', 'PostgreSQL', 'React'],
      desc: 'NETPONG — deployed at netpong.games. Real-time multiplayer air hockey with 4 themed arenas. NestJS microservices, Socket.io game rooms, JWT auth, global leaderboard, live chat. Zero-downtime CI/CD via GitHub Actions.',
      Demo: Empty, badge: '🎮 LIVE GALLERY', Gallery: NetpongGallery, accent: '#c084fc',
      repo: 'https://github.com/fttranscendenceorganization/ft_transcendence',
    },
    {
      id: 'mini', num: '02', name: 'Minishell', type: 'Systems · C · Unix',
      tags: ['C', 'POSIX', 'Unix Signals', 'Bash', 'Process Management'],
      desc: 'Fully functional Unix shell in C — Bash-compliant tokenization, parsing, execution engine. Multi-pipe chaining, heredocs, I/O redirections, env variable expansion, signal handling (SIGINT/SIGQUIT). 100% memory-safe.',
      Demo: MinishellGame, badge: '⌨ LIVE SHELL', accent: '#00d4ff',
      repo: `${GITHUB}/minishell`,
    },
    {
      id: 'incep', num: '03', name: 'Inception', type: 'DevOps · Docker · Infrastructure',
      tags: ['Docker Compose', 'Nginx', 'TLS/SSL', 'MariaDB', 'WordPress'],
      desc: 'Multi-container infrastructure using Docker Compose — Nginx with TLS termination, MariaDB with persistent volumes, WordPress in isolated containers with custom bridge networking.',
      Demo: DockerGame, badge: '🐳 LIVE CONTAINERS', accent: '#00d4ff',
      repo: `${GITHUB}/inception`,
    },
    {
      id: 'philo', num: '04', name: 'Philosophers', type: 'Concurrency · C · Systems',
      tags: ['C', 'pthreads', 'Mutexes', 'Semaphores', 'Deadlock Prevention'],
      desc: 'Concurrent dining philosophers simulation using pthreads and mutexes. Guarantees deadlock-free and starvation-free execution. Zero data races under extended stress testing.',
      Demo: PhilosophersGame, badge: '🍝 VISUALIZE', accent: '#5ab4d6',
      repo: `${GITHUB}/philosophers`,
    },
    {
      id: 'web', num: '05', name: 'Webserv', type: 'Systems · C++ · Networking',
      tags: ['C++', 'HTTP/1.1', 'poll()/select()', 'CGI', 'TCP Sockets'],
      desc: 'Production-grade HTTP/1.1 server from scratch in C++, zero external libraries. Non-blocking I/O via poll()/select() for concurrent connections. Supports GET, POST, DELETE, chunked encoding, CGI.',
      Demo: WebservGame, badge: '🌐 HTTP REQUESTS', accent: '#00d4ff',
      repo: `${GITHUB}/webserv`,
    },
    {
      id: 'push', num: '06', name: 'Push_swap', type: 'Algorithms · C · Sorting',
      tags: ['C', 'Radix Sort', 'Stack Operations', 'Algorithm Optimization'],
      desc: 'Sorts integers using two stacks with a limited instruction set — push, swap, rotate. Implements radix sort achieving O(n log n). Watch every operation step by step in real time.',
      Demo: PushSwapGame, badge: '📊 SORT VISUALIZER', accent: '#7ec8e3',
      repo: `${GITHUB}/push_swap`,
    },
    {
      id: 'solong', num: '07', name: 'so_long', type: 'Graphics · C · MinilibX · Game Dev',
      tags: ['C', 'MinilibX', '2D Graphics', 'Game Loop', 'Map Parsing'],
      desc: '2D tile-based game in C using MinilibX. Collect all coins then reach the exit. Custom map parsing, sprite rendering, keyboard event loop. Playable right here.',
      Demo: SoLongGame, badge: '🕹 PLAY NOW', accent: '#00d4ff',
      repo: `${GITHUB}/so_long`,
    },
    {
      id: 'cub3d', num: '08', name: 'cub3D', type: 'Graphics · C · Raycasting',
      tags: ['C', 'Raycasting', 'MinilibX', '3D Math', 'OpenGL concepts'],
      desc: '3D raycasting engine from scratch in C — Wolfenstein 3D style. Pseudo-3D first-person view from a 2D map. Camera-plane DDA, minimap, smooth movement. Playable right here.',
      Demo: Cub3DGame, badge: '🎲 3D RAYCASTER', accent: '#5ab4d6',
      repo: `${GITHUB}/cub3d`,
    },
    {
      id: 'net', num: '09', name: 'NetPractice', type: 'Networking · TCP/IP · Subnetting',
      tags: ['TCP/IP', 'Subnetting', 'CIDR', 'Routing', 'IPv4'],
      desc: 'Mastered TCP/IP through 10 levels of progressively complex network configuration. Covers subnetting, CIDR notation, routing tables, troubleshooting. Interactive calculator below.',
      Demo: NetPracticeGame, badge: '🌐 SUBNET CALC', accent: '#00d4ff',
      repo: null, // no dedicated repo for NetPractice
    },
    {
      id: 'core', num: '10', name: 'Core 42 Projects', type: 'C · C++ · Systems',
      tags: ['C', 'C++', 'Libft', 'ft_printf', 'Get_Next_Line', 'Born2beroot', 'OOP', 'STL'],
      desc: 'Libft (custom libc), ft_printf (variadic output engine), Get_Next_Line (buffered fd reader), Born2beroot (Linux VM hardening), CPP Modules 00–09 — OOP, templates, STL, polymorphism, exceptions.',
      Demo: null, badge: null, accent: '#4a6480',
      coreRepos: [
        { label: 'LIBFT',          href: `${GITHUB}/libft` },
        { label: 'FT_PRINTF',      href: `${GITHUB}/ft_printf` },
        { label: 'GET_NEXT_LINE',  href: `${GITHUB}/get_next_line` },
        { label: 'MINITALK',       href: `${GITHUB}/minitalk` },
        { label: 'CPP 00',         href: `${GITHUB}/cpp00` },
        { label: 'CPP 01',         href: `${GITHUB}/cpp01` },
        { label: 'CPP 02',         href: `${GITHUB}/cpp02` },
        { label: 'CPP 03',         href: `${GITHUB}/cpp03` },
        { label: 'CPP 04',         href: `${GITHUB}/cpp04` },
        { label: 'CPP 05',         href: `${GITHUB}/cpp05` },
        { label: 'CPP 06',         href: `${GITHUB}/cpp06` },
        { label: 'CPP 07',         href: `${GITHUB}/cpp07` },
        { label: 'CPP 08',         href: `${GITHUB}/cpp08` },
        { label: 'CPP 09',         href: `${GITHUB}/cpp09` },
      ],
    },
  ];

  return (
    <section id="projects" style={{ padding: '120px 0', background: 'transparent', zIndex: 2 }}>
      <div style={{ padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 80 }} className="reveal">
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#00d4ff', letterSpacing: 2 }}>02</span>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, letterSpacing: -2, color: '#f0f6ff' }}>Projects</h2>
          <div style={{ flex: 1, maxWidth: 200, height: 1, background: 'var(--border)' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#4a6480', letterSpacing: 2 }}>{projects.length} PROJECTS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {projects.map((proj, idx) => {
            const hasDemo = proj.Demo && proj.Demo !== Empty;
            const hasGallery = !!proj.Gallery;
            const isEven = idx % 2 === 0;
            const isActive = visibleId === proj.id;

            return (
              <div key={proj.id} ref={el => cardRefs.current[proj.id] = el} className="reveal"
                style={{
                  transitionDelay: `${idx * 80}ms`,
                  display: 'grid',
                  gridTemplateColumns: hasDemo || hasGallery ? (isEven ? '1fr 1.5fr' : '1.5fr 1fr') : '1fr',
                  gap: 0,
                  borderRadius: 14, backdropFilter: 'blur(12px)',
                  border: `1px solid ${isActive && (hasDemo || hasGallery) ? proj.accent + '30' : 'var(--border)'}`,
                  overflow: 'hidden', position: 'relative',
                  transition: 'border-color .4s ease',
                }}>

                {/* Left column (odd rows) */}
                {(!isEven && (hasDemo || hasGallery)) && (
                  <div style={{ background: 'rgba(6,10,20,0.72)', padding: '48px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center,${proj.accent}06 0%,transparent 70%)`, pointerEvents: 'none' }} />
                    <div style={{ width: '100%', maxWidth: 560 }}>
                      {hasGallery && <proj.Gallery />}
                      {hasDemo && <proj.Demo active={isActive} />}
                    </div>
                  </div>
                )}

                {/* Info column */}
                <div style={{ padding: '48px 40px', background: 'rgba(8,14,26,0.72)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: proj.accent, opacity: .6, letterSpacing: 2 }}>{proj.num}</span>
                    {proj.badge && <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: proj.accent, letterSpacing: 1.5, background: `${proj.accent}10`, border: `1px solid ${proj.accent}30`, padding: '3px 10px' }}>{proj.badge}</span>}
                  </div>
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, letterSpacing: -1, color: '#f0f6ff', marginBottom: 8, lineHeight: 1.1 }}>{proj.name}</h3>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#6a90b0', letterSpacing: 1, marginBottom: 18, textTransform: 'uppercase' }}>{proj.type}</div>
                  <p style={{ fontSize: 17, lineHeight: 1.88, color: '#a8c4dc', marginBottom: 24, maxWidth: 480 }}>{proj.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: proj.repo || proj.coreRepos ? 20 : 0 }}>
                    {proj.tags.map(t => (
                      <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '5px 12px', background: `${proj.accent}12`, border: `1px solid ${proj.accent}35`, color: proj.accent + 'cc', letterSpacing: .3 }}>{t}</span>
                    ))}
                  </div>

                  {/* Single-repo link */}
                  {proj.repo && (
                    <div style={{ marginTop: 4 }}>
                      <RepoLink href={proj.repo} accent={proj.accent} label="VIEW SOURCE" />
                    </div>
                  )}

                  {/* Multi-repo links for Core 42 */}
                  {proj.coreRepos && (
                    <CoreRepoLinks repos={proj.coreRepos} accent={proj.accent} />
                  )}
                </div>

                {/* Right column (even rows) */}
                {(isEven && (hasDemo || hasGallery)) && (
                  <div style={{ background: 'rgba(6,10,20,0.72)', padding: '48px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center,${proj.accent}06 0%,transparent 70%)`, pointerEvents: 'none' }} />
                    <div style={{ width: '100%', maxWidth: 560 }}>
                      {hasGallery && <proj.Gallery />}
                      {hasDemo && <proj.Demo active={isActive} />}
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
