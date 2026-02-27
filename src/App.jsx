import { useEffect } from 'react';
import SpaceCanvas from './components/SpaceCanvas';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';

export default function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el));
    }, 100);
    return () => { obs.disconnect(); clearTimeout(timer); };
  }, []);

  return (
    <>
      <SpaceCanvas />
      <Cursor />
      <Nav />
      <Hero />
      <Skills />
      <Projects />
      <About />
      <Contact />
      <footer style={{ borderTop: '1px solid rgba(0,180,255,0.12)', position: 'relative', zIndex: 1, background: 'rgba(4,7,14,0.5)', backdropFilter: 'blur(12px)' }}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: 1 }}>© 2026 Houdaifa Drahm</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: 1 }}>Backend & DevOps · 1337 School · UM6P</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: 1 }}>Morocco 🇲🇦</span>
        </div>
      </footer>
    </>
  );
}
