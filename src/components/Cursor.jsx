import { useEffect } from 'react';

export default function Cursor() {
  useEffect(() => {
    const cur = document.getElementById('cur');
    const ring = document.getElementById('curR');
    if (!cur || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove);
    let animId;
    (function loop() {
      rx += (mx - rx) * .13; ry += (my - ry) * .13;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      animId = requestAnimationFrame(loop);
    })();
    const onOver = e => {
      if (e.target.matches('a,button,[data-h],input')) {
        cur.classList.add('big'); ring.classList.add('big');
      } else {
        cur.classList.remove('big'); ring.classList.remove('big');
      }
    };
    document.addEventListener('mouseover', onOver);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cur" />
      <div className="cursor-ring" id="curR" />
    </>
  );
}
