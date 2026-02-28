import { useRef, useEffect } from 'react';

export default function TouchControls({ onMove }) {
  const activeRef = useRef({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    const handleTouchEnd = (e) => {
      e.preventDefault();
      const touches = e.touches;
      const stillActive = { up: false, down: false, left: false, right: false };
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const dir = touch.target?.getAttribute('data-dir');
        if (dir) stillActive[dir] = true;
      }
      activeRef.current = stillActive;
      onMove(stillActive);
    };

    const handleTouchCancel = (e) => {
      e.preventDefault();
      activeRef.current = { up: false, down: false, left: false, right: false };
      onMove(activeRef.current);
    };

    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleTouchCancel, { passive: false });
    return () => {
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [onMove]);

  const handleTouchStart = (dir) => (e) => {
    e.preventDefault();
    activeRef.current[dir] = true;
    onMove(activeRef.current);
  };

  const buttonStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(0,212,255,0.2)',
    border: '2px solid #00d4ff',
    color: '#00d4ff',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    touchAction: 'manipulation',
    cursor: 'pointer',
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: 20,
      pointerEvents: 'auto',
      zIndex: 10,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <div></div>
        <button data-dir="up" style={buttonStyle} onTouchStart={handleTouchStart('up')}>↑</button>
        <div></div>
        <button data-dir="left" style={buttonStyle} onTouchStart={handleTouchStart('left')}>←</button>
        <button data-dir="down" style={buttonStyle} onTouchStart={handleTouchStart('down')}>↓</button>
        <button data-dir="right" style={buttonStyle} onTouchStart={handleTouchStart('right')}>→</button>
      </div>
    </div>
  );
}