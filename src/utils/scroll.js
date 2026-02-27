export function rafScrollTo(targetId) {
  const NAV = 72;
  const go = () => {
    const dest = targetId === 'top' ? 0 : (() => {
      const el = document.getElementById(targetId);
      if (!el) return null;
      return el.getBoundingClientRect().top + window.scrollY - NAV;
    })();
    if (dest === null) return;
    const from = window.scrollY, delta = dest - from;
    if (Math.abs(delta) < 2) { window.scrollTo(0, dest); return; }
    const dur = Math.min(1000, Math.max(400, Math.abs(delta) * 0.38));
    const ease = p => p < .5 ? 4 * p * p * p : (p - 1) * (2 * p - 2) * (2 * p - 2) + 1;
    let t0 = null;
    (function tick(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      window.scrollTo(0, from + delta * ease(p));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  };
  requestAnimationFrame(() => requestAnimationFrame(go));
}
