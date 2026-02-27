import { useState } from 'react';
import ZombieLandGame from './ZombieLandGame';

function MockHome() {
  const [xp, setXp] = useState(93);
  useState(() => { const t = setInterval(() => setXp(x => x >= 199 ? 93 : x + 1), 120); return () => clearInterval(t); });
  const pct = Math.round((xp / 200) * 100);
  return (
    <div style={{ background: 'linear-gradient(135deg,#0d0618 0%,#180828 50%,#0d0618 100%)', borderRadius: 10, overflow: 'hidden', fontFamily: 'var(--sans)', fontSize: 12, border: '1px solid #2a1540', position: 'relative', minHeight: 340 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 30%,rgba(180,60,220,.18),transparent)', pointerEvents: 'none' }} />
      <div style={{ background: 'rgba(8,4,20,.85)', backdropFilter: 'blur(12px)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a1540', position: 'relative' }}>
        <span style={{ color: '#ff3b3b', fontWeight: 900, fontSize: 14, letterSpacing: 1 }}>NETPONG</span>
        <div style={{ display: 'flex', gap: 12, fontSize: 10, color: '#aaa' }}><span>Home</span><span>Exclusive</span><span>Game Modes ▾</span><span>Contact</span></div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ background: '#2a1540', border: '1px solid #4a2060', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#ccc' }}>Chat</div>
          <div style={{ background: '#ff3b3b', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#fff', fontWeight: 700 }}>Logout</div>
        </div>
      </div>
      <div style={{ margin: '14px', background: 'rgba(15,8,30,.8)', border: '1px solid #2a1540', borderRadius: 10, padding: '16px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#ff8c00,#ff3b3b)', border: '3px solid #ff8c00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>Welcome Back, <span style={{ color: '#ff8c00' }}>Houdaifa</span></div>
            <div style={{ color: '#888', fontSize: 10, marginTop: 2 }}>@hdrahm</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {[['Level: 2', '#3a1a5a'], ['Win Rate: 60%', '#1a3a1a'], ['Wins: 6', '#1a3a2a'], ['Losses: 4', '#3a1a1a']].map(([l, bg]) => (
                <span key={l} style={{ background: bg, borderRadius: 20, padding: '2px 8px', fontSize: 9, color: '#ddd' }}>{l}</span>
              ))}
            </div>
          </div>
          <div style={{ background: '#ff6600', borderRadius: 8, padding: '6px 12px', fontSize: 10, color: '#fff', fontWeight: 700, flexShrink: 0 }}>Edit Profile</div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888', marginBottom: 5 }}>
            <span>XP Progress</span><span style={{ color: '#aaa' }}>{xp} / 200 XP &nbsp;·&nbsp; {pct}%</span>
          </div>
          <div style={{ background: '#1a0a2e', borderRadius: 20, height: 8, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#ff6600,#ff3b3b)', borderRadius: 20, transition: 'width .4s ease', boxShadow: '0 0 8px #ff6600aa' }} />
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '0 14px 14px' }}>
        {[
          { icon: '🎮', title: 'Game Modes', sub: 'Zombie Land, Joker, and more', cta: 'Play Now →', color: '#ff4444', bg: 'linear-gradient(135deg,#1a0808,#2a1010)' },
          { icon: '✨', title: 'Exclusive Features', sub: 'History & leaderboard', cta: 'Explore →', color: '#a855f7', bg: 'linear-gradient(135deg,#0e0820,#1a1030)' },
        ].map(c => (
          <div key={c.title} style={{ background: c.bg, border: '1px solid #2a1540', borderRadius: 10, padding: '14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 3 }}>{c.title}</div>
            <div style={{ fontSize: 10, color: '#888', marginBottom: 10 }}>{c.sub}</div>
            <div style={{ fontSize: 10, color: c.color, fontWeight: 600 }}>{c.cta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockGameModes() {
  const [hov, setHov] = useState(null);
  const modes = [
    { id: 0, icon: '⚔️', name: 'Soul Society', desc: 'Save souls from evil and become the legendary hero.', tags: ['Epic Battles', 'Hero Journey', 'Save Souls'], genre: 'Adventure', bg: 'linear-gradient(135deg,#1a1f3a,#2a2f4a)', border: '#3a4060', glow: '#4466ff' },
    { id: 1, icon: '🧟', name: 'Zombie Land', desc: 'Survive the apocalypse — air hockey is your only weapon.', tags: ['Survival Mode', 'Undead Hordes', 'Apocalypse'], genre: 'Horror', bg: 'linear-gradient(135deg,#0a2010,#1a3020)', border: '#2a5030', glow: '#00aa44' },
    { id: 2, icon: '🩷', name: 'Kitty Cat', desc: 'A magical world of friendship and fun in dream environments.', tags: ['Dream World', 'Magic & Fun', 'Friendship'], genre: 'Lovely', bg: 'linear-gradient(135deg,#2a0a20,#4a1040)', border: '#6a2060', glow: '#ff44aa' },
    { id: 3, icon: '🃏', name: 'Joker', desc: 'Face the ultimate psychopath. Claim the crown.', tags: ['Twisted Game', 'Chaos Reigns', 'Crown Awaits'], genre: 'Psycho', bg: 'linear-gradient(135deg,#2a0808,#401010)', border: '#601818', glow: '#ff4444' },
  ];
  return (
    <div style={{ background: '#080c18', borderRadius: 10, overflow: 'hidden', border: '1px solid #1a2030', fontFamily: 'var(--sans)' }}>
      <div style={{ background: 'rgba(8,12,24,.9)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a2030' }}>
        <span style={{ color: '#ff3b3b', fontWeight: 900, fontSize: 14 }}>NETPONG</span>
        <span style={{ fontSize: 10, color: '#888' }}>netpong.games/modes</span>
        <div style={{ background: '#ff3b3b', borderRadius: 6, padding: '3px 9px', fontSize: 10, color: '#fff', fontWeight: 700 }}>Chat</div>
      </div>
      <div style={{ padding: '14px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#1a1020', border: '1px solid #3a2040', borderRadius: 20, padding: '4px 14px', fontSize: 9, color: '#ff8c00', marginBottom: 10 }}>🎮 4 UNIQUE EXPERIENCES</div>
        <div style={{ fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 2 }}>Choose Your <span style={{ color: '#ff8c00' }}>Game Mode</span></div>
        <div style={{ fontSize: 10, color: '#666', marginBottom: 14 }}>Select your adventure and start playing</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 14px 14px' }}>
        {modes.map(m => (
          <div key={m.id} data-h onMouseEnter={() => setHov(m.id)} onMouseLeave={() => setHov(null)}
            style={{ background: m.bg, border: `1px solid ${hov === m.id ? m.glow + '88' : m.border}`, borderRadius: 10, padding: '14px', cursor: 'none', transition: 'all .2s', boxShadow: hov === m.id ? `0 0 18px ${m.glow}33` : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <span style={{ fontSize: 9, background: 'rgba(255,255,255,.08)', borderRadius: 20, padding: '2px 8px', color: '#ddd' }}>{m.genre}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#fff', marginBottom: 4 }}>{m.name}</div>
            <div style={{ fontSize: 9, color: '#888', lineHeight: 1.5, marginBottom: 8 }}>{m.desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 10 }}>
              {m.tags.map(t => <span key={t} style={{ fontSize: 8, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: '1px 6px', color: '#aaa' }}>{t}</span>)}
            </div>
            <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, padding: '5px 10px', fontSize: 10, color: '#ddd', fontWeight: 600, textAlign: 'center' }}>Play Now →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockLeaderboard() {
  const players = [
    { rank: 1, name: 'momazouz', tier: 'Diamond', color: '#00bfff', xp: 257, wins: 6, rate: 86, medal: '🥇', bg: 'linear-gradient(135deg,#0a1020,#0a1830)', border: '#00bfff44', glow: '#00bfff' },
    { rank: 2, name: 'hdrahm', tier: 'Platinum', color: '#aaaacc', xp: 193, wins: 6, rate: 60, medal: '🥈', bg: 'linear-gradient(135deg,#0c0c18,#141420)', border: '#aaaacc33', glow: '#aaaacc' },
    { rank: 3, name: 'houdaifadrahm', tier: 'Gold', color: '#ffc142', xp: 84.5, wins: 4, rate: 40, medal: '🥉', bg: 'linear-gradient(135deg,#181008,#201808)', border: '#ffc14233', glow: '#ffc142' },
  ];
  const others = [{ rank: 4, name: 'aahlaqqa', xp: 62, wins: 3, rate: 33 }, { rank: 5, name: 'simo_dev', xp: 44, wins: 2, rate: 28 }];
  return (
    <div style={{ background: '#080c18', borderRadius: 10, overflow: 'hidden', border: '1px solid #1a2030', fontFamily: 'var(--sans)' }}>
      <div style={{ background: 'rgba(8,12,24,.9)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a2030' }}>
        <span style={{ color: '#ff3b3b', fontWeight: 900, fontSize: 14 }}>NETPONG</span>
        <span style={{ fontSize: 10, color: '#888' }}>netpong.games/leaderboard</span>
        <div style={{ background: '#ff3b3b', borderRadius: 6, padding: '3px 9px', fontSize: 10, color: '#fff', fontWeight: 700 }}>Chat</div>
      </div>
      <div style={{ padding: '14px' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(90deg,#ff8c00,#a855f7,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Global Leaderboard</div>
          <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>Compete with the best players 🏆</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: 6, marginBottom: 10, alignItems: 'end' }}>
          {[players[1], players[0], players[2]].map((p, i) => (
            <div key={p.rank} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center', boxShadow: i === 1 ? `0 0 20px ${p.glow}22` : 'none' }}>
              <div style={{ fontSize: i === 1 ? 20 : 16, marginBottom: 4 }}>{p.medal}</div>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `radial-gradient(circle,${p.color}44,${p.color}11)`, border: `2px solid ${p.color}66`, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>👤</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{p.name}</div>
              <div style={{ fontSize: 8, background: `${p.color}22`, border: `1px solid ${p.color}44`, borderRadius: 20, padding: '2px 6px', color: p.color, margin: '4px auto', display: 'inline-block' }}>{p.tier}</div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 4 }}>
                {[['xp', 'XP'], ['wins', 'W'], ['rate', '%']].map(([k, u]) => (
                  <div key={k} style={{ textAlign: 'center' }}><div style={{ fontSize: 10, fontWeight: 700, color: p.color }}>{p[k]}{u === '%' ? '%' : ''}</div><div style={{ fontSize: 7, color: '#555' }}>{u === '%' ? 'Rate' : u}</div></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {others.map(p => (
          <div key={p.rank} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'rgba(255,255,255,.03)', borderRadius: 6, marginBottom: 4, border: '1px solid #1a2030' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#444', width: 16 }}>#{p.rank}</span>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#1a2030', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>👤</div>
            <span style={{ flex: 1, fontSize: 10, color: '#aaa' }}>{p.name}</span>
            <span style={{ fontSize: 9, color: '#607a95' }}>{p.xp} XP</span>
            <span style={{ fontSize: 9, color: '#607a95' }}>{p.wins}W</span>
            <span style={{ fontSize: 9, color: '#607a95' }}>{p.rate}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockChat() {
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState([]);
  const send = () => { if (!input.trim()) return; setMsgs(m => [...m, { id: Date.now(), user: 'hdrahm', text: input, time: 'now', own: true, color: '#ff5533' }]); setInput(''); };
  return (
    <div style={{ background: '#080c18', borderRadius: 10, overflow: 'hidden', border: '1px solid #1a2030', fontFamily: 'var(--sans)', display: 'flex', flexDirection: 'column', maxHeight: 420 }}>
      <div style={{ background: 'rgba(8,12,24,.9)', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a2030', flexShrink: 0 }}>
        <span style={{ color: '#ff3b3b', fontWeight: 900, fontSize: 13 }}>NETPONG</span>
        <div style={{ display: 'flex', gap: 6, fontSize: 9 }}>
          <div style={{ background: '#1a2030', border: '1px solid #2a3040', borderRadius: 5, padding: '3px 8px', color: '#aaa' }}>🗑 Clear Chat</div>
          <div style={{ background: '#ff3b3b', borderRadius: 5, padding: '3px 8px', color: '#fff', fontWeight: 700 }}>Logout</div>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: 130, background: 'rgba(8,12,24,.7)', borderRight: '1px solid #1a2030', flexShrink: 0 }}>
          <div style={{ padding: '10px 10px 6px', fontSize: 11, fontWeight: 700, color: '#fff' }}>Friends</div>
          <div style={{ fontSize: 9, color: '#555', paddingLeft: 10, marginBottom: 10 }}>2 friends · 0 online</div>
          <div style={{ padding: '0 6px', marginBottom: 6 }}>
            <div style={{ background: '#141c2a', border: '2px solid #ff5533', borderRadius: 8, padding: '7px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#ff5533', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', flexShrink: 0 }}>G</div>
              <div><div style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>Global Chat</div><div style={{ fontSize: 8, color: '#555' }}>0 members online</div></div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {msgs.map(m => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.own ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: 8, color: '#666', marginBottom: 3, textAlign: m.own ? 'right' : 'left' }}>hdrahm · {m.time}</span>
                <div style={{ background: m.own ? m.color : 'transparent', border: m.own ? 'none' : '1px solid rgba(255,255,255,.06)', borderRadius: m.own ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '7px 12px', maxWidth: '80%', fontSize: 11, color: '#fff', fontWeight: m.own ? 600 : 400 }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '8px 10px', borderTop: '1px solid #1a2030', display: 'flex', gap: 8, flexShrink: 0 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Type your message..."
              style={{ flex: 1, background: '#0f1520', border: '1px solid #1e2d40', borderRadius: 8, padding: '7px 12px', color: '#fff', fontFamily: 'var(--sans)', fontSize: 11, outline: 'none' }} />
            <div data-h onClick={send} style={{ background: '#ff5533', borderRadius: 8, padding: '7px 14px', fontSize: 10, color: '#fff', fontWeight: 700, cursor: 'none', flexShrink: 0 }}>Send ➤</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SCREEN_TABS = [
  { id: 'home', label: '🏠 Home', Component: MockHome },
  { id: 'modes', label: '🎮 Modes', Component: MockGameModes },
  { id: 'zombie', label: '🧟 Zombie Land', Component: null },
  { id: 'leaderboard', label: '🏆 Leaderboard', Component: MockLeaderboard },
  { id: 'chat', label: '💬 Live Chat', Component: MockChat },
];

export default function NetpongGallery() {
  const [cur, setCur] = useState(0);
  const tab = SCREEN_TABS[cur];
  const accents = ['#c084fc', '#00d4ff', '#00ff88', '#ffc142', '#ff5533', '#a855f7'];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {SCREEN_TABS.map((s, i) => (
          <div key={s.id} data-h onClick={() => setCur(i)}
            style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '5px 11px', cursor: 'none', border: `1px solid ${cur === i ? accents[i] + '88' : 'var(--border)'}`, background: cur === i ? `${accents[i]}14` : 'transparent', color: cur === i ? accents[i] : 'var(--text3)', borderRadius: 4, transition: 'all .2s', letterSpacing: .5, whiteSpace: 'nowrap' }}
            onMouseEnter={e => { if (cur !== i) { e.currentTarget.style.borderColor = accents[i] + '44'; e.currentTarget.style.color = accents[i]; e.currentTarget.style.background = accents[i] + '08'; } }}
            onMouseLeave={e => { if (cur !== i) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.background = 'transparent'; } }}>
            {s.label}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', animation: 'pulse 1.5s infinite' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text3)', letterSpacing: 2 }}>LIVE INTERACTIVE MOCK · NETPONG.GAMES</span>
      </div>
      <div style={{ animation: 'fadeUp .3s ease' }}>
        {cur === 2 ? <ZombieLandGame active={true} /> : tab.Component ? <tab.Component active={true} /> : null}
      </div>
    </div>
  );
}
