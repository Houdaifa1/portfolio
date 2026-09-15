import { useRef, useEffect } from 'react';

export default function TouchControls({ onMove }) {
  const activeRef = useRef({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    const releaseAll = () => {
      activeRef.current = { up: false, down: false, left: false, right: false };
      onMove(activeRef.current);
    };
    window.addEventListener('pointerup', releaseAll);
    window.addEventListener('pointercancel', releaseAll);
    window.addEventListener('blur', releaseAll);
    return () => {
      window.removeEventListener('pointerup', releaseAll);
      window.removeEventListener('pointercancel', releaseAll);
      window.removeEventListener('blur', releaseAll);
    };
  }, [onMove]);

  const press = (dir) => (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    activeRef.current = { ...activeRef.current, [dir]: true };
    onMove(activeRef.current);
  };

  const release = (dir) => (e) => {
    e.preventDefault();
    activeRef.current = { ...activeRef.current, [dir]: false };
    onMove(activeRef.current);
  };

  const buttonStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(0,212,255,0.2)',
    border: '2px solid #00d4ff',
    color: '#00d4ff',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    touchAction: 'manipulation',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <div className="touch-controls" aria-label="Game movement controls" style={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: 12,
      pointerEvents: 'auto',
      zIndex: 10,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 48px)', gap: 7 }}>
        <div></div>
        <button type="button" aria-label="Move forward" data-dir="up" style={buttonStyle} onPointerDown={press('up')} onPointerUp={release('up')} onPointerCancel={release('up')}>↑</button>
        <div></div>
        <button type="button" aria-label="Turn left" data-dir="left" style={buttonStyle} onPointerDown={press('left')} onPointerUp={release('left')} onPointerCancel={release('left')}>←</button>
        <button type="button" aria-label="Move backward" data-dir="down" style={buttonStyle} onPointerDown={press('down')} onPointerUp={release('down')} onPointerCancel={release('down')}>↓</button>
        <button type="button" aria-label="Turn right" data-dir="right" style={buttonStyle} onPointerDown={press('right')} onPointerUp={release('right')} onPointerCancel={release('right')}>→</button>
      </div>
    </div>
  );
}
