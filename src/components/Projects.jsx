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

  const projects = [
    {
      id: 'trans', num: '01', name: 'ft_transcendence', type: 'Full-Stack · Real-Time · DevOps',
      tags: ['NestJS', 'TypeScript', 'Socket.io', 'JWT', 'Docker', 'GitHub Actions', 'DigitalOcean', 'PostgreSQL', 'React'],
      desc: 'NETPONG — deployed at netpong.games. Real-time multiplayer air hockey with 4 themed arenas. NestJS microservices, Socket.io game rooms, JWT auth, global leaderboard, live chat. Zero-downtime CI/CD via GitHub Actions.',
      Demo: Empty, badge: '🎮 LIVE GALLERY', Gallery: NetpongGallery, accent: '#c084fc',
    },
    {
      id: 'mini', num: '02', name: 'Minishell', type: 'Systems · C · Unix',
      tags: ['C', 'POSIX', 'Unix Signals', 'Bash', 'Process Management'],
      desc: 'Fully functional Unix shell in C — Bash-compliant tokenization, parsing, execution engine. Multi-pipe chaining, heredocs, I/O redirections, env variable expansion, signal handling (SIGINT/SIGQUIT). 100% memory-safe.',
      Demo: MinishellGame, badge: '⌨ LIVE SHELL', accent: '#00d4ff',
    },
    {
      id: 'incep', num: '03', name: 'Inception', type: 'DevOps · Docker · Infrastructure',
      tags: ['Docker Compose', 'Nginx', 'TLS/SSL', 'MariaDB', 'WordPress'],
      desc: 'Multi-container infrastructure using Docker Compose — Nginx with TLS termination, MariaDB with persistent volumes, WordPress in isolated containers with custom bridge networking.',
      Demo: DockerGame, badge: '🐳 LIVE CONTAINERS', accent: '#00d4ff',
    },
    {
      id: 'philo', num: '04', name: 'Philosophers', type: 'Concurrency · C · Systems',
      tags: ['C', 'pthreads', 'Mutexes', 'Semaphores', 'Deadlock Prevention'],
      desc: 'Concurrent dining philosophers simulation using pthreads and mutexes. Guarantees deadlock-free and starvation-free execution. Zero data races under extended stress testing.',
      Demo: PhilosophersGame, badge: '🍝 VISUALIZE', accent: '#5ab4d6',
    },
    {
      id: 'web', num: '05', name: 'Webserv', type: 'Systems · C++ · Networking',
      tags: ['C++', 'HTTP/1.1', 'poll()/select()', 'CGI', 'TCP Sockets'],
      desc: 'Production-grade HTTP/1.1 server from scratch in C++, zero external libraries. Non-blocking I/O via poll()/select() for concurrent connections. Supports GET, POST, DELETE, chunked encoding, CGI.',
      Demo: WebservGame, badge: '🌐 HTTP REQUESTS', accent: '#00d4ff',
    },
    {
      id: 'push', num: '06', name: 'Push_swap', type: 'Algorithms · C · Sorting',
      tags: ['C', 'Radix Sort', 'Stack Operations', 'Algorithm Optimization'],
      desc: 'Sorts integers using two stacks with a limited instruction set — push, swap, rotate. Implements radix sort achieving O(n log n). Watch every operation step by step in real time.',
      Demo: PushSwapGame, badge: '📊 SORT VISUALIZER', accent: '#7ec8e3',
    },
    {
      id: 'solong', num: '07', name: 'so_long', type: 'Graphics · C · MinilibX · Game Dev',
      tags: ['C', 'MinilibX', '2D Graphics', 'Game Loop', 'Map Parsing'],
      desc: '2D tile-based game in C using MinilibX. Collect all coins then reach the exit. Custom map parsing, sprite rendering, keyboard event loop. Playable right here.',
      Demo: SoLongGame, badge: '🕹 PLAY NOW', accent: '#00d4ff',
    },
    {
      id: 'cub3d', num: '08', name: 'cub3D', type: 'Graphics · C · Raycasting',
      tags: ['C', 'Raycasting', 'MinilibX', '3D Math', 'OpenGL concepts'],
      desc: '3D raycasting engine from scratch in C — Wolfenstein 3D style. Pseudo-3D first-person view from a 2D map. Camera-plane DDA, minimap, smooth movement. Playable right here.',
      Demo: Cub3DGame, badge: '🎲 3D RAYCASTER', accent: '#5ab4d6',
    },
    {
      id: 'net', num: '09', name: 'NetPractice', type: 'Networking · TCP/IP · Subnetting',
      tags: ['TCP/IP', 'Subnetting', 'CIDR', 'Routing', 'IPv4'],
      desc: 'Mastered TCP/IP through 10 levels of progressively complex network configuration. Covers subnetting, CIDR notation, routing tables, troubleshooting. Interactive calculator below.',
      Demo: NetPracticeGame, badge: '🌐 SUBNET CALC', accent: '#00d4ff',
    },
    {
      id: 'core', num: '10', name: 'Core 42 Projects', type: 'C · C++ · Systems',
      tags: ['C', 'C++', 'Libft', 'ft_printf', 'Get_Next_Line', 'Born2beroot', 'OOP', 'STL'],
      desc: 'Libft (custom libc), ft_printf (variadic output engine), Get_Next_Line (buffered fd reader), Born2beroot (Linux VM hardening), CPP Modules 00–09 — OOP, templates, STL, polymorphism, exceptions.',
      Demo: null, badge: null, accent: '#4a6480',
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
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {proj.tags.map(t => (
                      <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '5px 12px', background: `${proj.accent}12`, border: `1px solid ${proj.accent}35`, color: proj.accent + 'cc', letterSpacing: .3 }}>{t}</span>
                    ))}
                  </div>
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