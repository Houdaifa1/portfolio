import { useState } from 'react';
import ZombieLandGame from './ZombieLandGame';

const FIXED_HEIGHT = 420;

/* ─── HOME ─────────────────────────────────────────────────────────── */
function MockHome() {
  return (
    <div style={{ height: FIXED_HEIGHT, background: 'linear-gradient(135deg,#0d0a1e 0%,#1a1035 50%,#0d0a1e 100%)', borderRadius: 10, overflow: 'hidden', fontFamily: 'var(--sans)', border: '1px solid #2a1f50', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', pointerEvents: 'none', opacity: .4 }} />
      {/* Nav */}
      <div style={{ background: 'rgba(10,6,25,.9)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a1f50' }}>
        <span style={{ color: '#ff3b3b', fontWeight: 900, fontSize: 16, letterSpacing: 1 }}>NETPONG</span>
        <div style={{ display: 'flex', gap: 20, fontSize: 11, color: '#ccc' }}>
          <span>Home</span><span>Exclusive</span><span>Game Modes ▾</span><span>Contact</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: '#ff3b3b', borderRadius: 6, padding: '5px 14px', fontSize: 11, color: '#fff', fontWeight: 700 }}>Chat</div>
          <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 6, padding: '5px 14px', fontSize: 11, color: '#fff' }}>Logout</div>
        </div>
      </div>
      {/* Profile card */}
      <div style={{ margin: '18px 20px 14px', background: 'rgba(20,12,40,.7)', border: '1px solid #3a2560', borderRadius: 14, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 18, backdropFilter: 'blur(8px)' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#ff8c00,#ff3b3b)', border: '3px solid #ff8c00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>👤</div>
          <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#00ff88', border: '2px solid #0d0a1e' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#fff' }}>Welcome Back, <span style={{ color: '#ff8c00' }}>Houdaifa</span></div>
          <div style={{ color: '#666', fontSize: 11, marginTop: 2 }}>@hdrahm</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {[['Level: 2','#4a1a7a'],['Win Rate: 64%','#1a3a20'],['Wins: 7','#1a3a2a'],['Losses: 4','#3a1a1a']].map(([l,bg]) => (
              <span key={l} style={{ background: bg, borderRadius: 20, padding: '3px 10px', fontSize: 10, color: '#ddd', border: '1px solid rgba(255,255,255,.08)' }}>{l}</span>
            ))}
          </div>
        </div>
        <div style={{ background: '#ff6600', borderRadius: 10, padding: '8px 16px', fontSize: 11, color: '#fff', fontWeight: 700 }}>Edit Profile</div>
      </div>
      {/* XP bar */}
      <div style={{ margin: '0 20px 16px', background: 'rgba(20,12,40,.5)', border: '1px solid #2a1f40', borderRadius: 10, padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888', marginBottom: 8 }}>
          <span style={{ color: '#aaa', fontWeight: 600 }}>XP Progress</span>
          <span style={{ color: '#aaa' }}>128 / 200 XP · 64%</span>
        </div>
        <div style={{ background: '#1a0a30', borderRadius: 20, height: 10, overflow: 'hidden' }}>
          <div style={{ width: '64%', height: '100%', background: 'linear-gradient(90deg,#ff6600,#ff3b3b)', borderRadius: 20, boxShadow: '0 0 10px #ff660088' }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: 9, color: '#555', marginTop: 5 }}>64%</div>
      </div>
      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '0 20px' }}>
        {[
          { icon: '🎮', title: 'Game Modes', sub: 'Zombie Land, Joker, and more', cta: 'Play Now →', color: '#ff4444', bg: '#1a0808' },
          { icon: '✨', title: 'Exclusive Features', sub: 'History & leaderboard', cta: 'Explore →', color: '#a855f7', bg: '#100820' },
        ].map(c => (
          <div key={c.title} style={{ background: c.bg, border: '1px solid #2a1540', borderRadius: 12, padding: '16px', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 2 }}>{c.title}</div>
              <div style={{ fontSize: 10, color: '#666', marginBottom: 6 }}>{c.sub}</div>
              <div style={{ fontSize: 10, color: c.color, fontWeight: 600 }}>{c.cta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── EXCLUSIVE ─────────────────────────────────────────────────────── */
function MockExclusive() {
  return (
    <div style={{ height: FIXED_HEIGHT, background: 'linear-gradient(180deg,#0a0820 0%,#140d35 40%,#0a0820 100%)', borderRadius: 10, overflow: 'hidden', fontFamily: 'var(--sans)', border: '1px solid #2a1f50', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'rgba(10,6,25,.9)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a1f50', flexShrink: 0 }}>
        <span style={{ color: '#ff3b3b', fontWeight: 900, fontSize: 16 }}>NETPONG</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: '#ff3b3b', borderRadius: 6, padding: '5px 14px', fontSize: 11, color: '#fff', fontWeight: 700 }}>Chat</div>
          <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 6, padding: '5px 14px', fontSize: 11, color: '#fff' }}>Logout</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', textAlign: 'center', gap: 0 }}>
        <div style={{ display: 'inline-block', background: 'linear-gradient(90deg,#ff6600,#a855f7)', borderRadius: 20, padding: '4px 16px', fontSize: 10, color: '#fff', fontWeight: 700, marginBottom: 14 }}>EXCLUSIVE ACCESS</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -1, lineHeight: 1.1, marginBottom: 6 }}>COMPETE & DOMINATE</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#ff3b3b', letterSpacing: 2, marginBottom: 4 }}>NETPONG — EXCLUSIVE COMPETITIVE FEATURES</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#a855f7', letterSpacing: 1, marginBottom: 16 }}>PROVE YOUR SKILLS</div>
        <div style={{ fontSize: 11, color: '#666', maxWidth: 460, lineHeight: 1.7, marginBottom: 24 }}>Join intense tournaments, compete against the best players worldwide, and climb the leaderboards. Show everyone what you're made of!</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', maxWidth: 520, marginBottom: 18 }}>
          {[
            { icon: '🏆', title: 'Player History', sub: 'See your match history and earn your place', cta: 'Enter Now →', color: '#ff8c00', border: '#ff8c0033' },
            { icon: '👑', title: 'Top Players', sub: 'See who\'s dominating and challenge the best', cta: 'View Rankings →', color: '#a855f7', border: '#a855f733' },
          ].map(c => (
            <div key={c.title} style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${c.border}`, borderRadius: 12, padding: '16px 14px', textAlign: 'left' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 10, color: '#666', marginBottom: 10, lineHeight: 1.5 }}>{c.sub}</div>
              <div style={{ fontSize: 10, color: c.color, fontWeight: 600 }}>{c.cta}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['⚔️ Real Competition','🎯 Global Rankings','💎 Exclusive Modes','⚡ Live Updates'].map(t => (
            <div key={t} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '8px 12px', fontSize: 9, color: '#888', textAlign: 'center' }}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── GAME MODES ────────────────────────────────────────────────────── */
function MockGameModes() {
  const [hov, setHov] = useState(null);
  const modes = [
    { id: 0, icon: '⚔️', name: 'Soul Society', desc: 'Save souls from evil and become the legendary hero. Master air hockey combat to defeat darkness.', tags: ['Epic Battles','Hero Journey','Save Souls'], genre: 'Adventure', bg: 'linear-gradient(135deg,#1a2030,#0e1520)', border: '#2a3555', glow: '#4488ff', textColor: '#fff' },
    { id: 1, icon: '🧟', name: 'Zombie Land', desc: 'Survive the apocalypse where air hockey is your only weapon against the undead hordes.', tags: ['Survival Mode','Undead Hordes','Apocalypse'], genre: 'Horror', bg: 'linear-gradient(135deg,#1a2e10,#0e1e08)', border: '#2a4a18', glow: '#44bb22', textColor: '#fff' },
    { id: 2, icon: '🩷', name: 'Kitty Cat', desc: 'Enter a magical world of friendship and fun. Collect points and play in colorful dream environments.', tags: ['Dream World','Magic & Fun','Friendship'], genre: 'Lovely', bg: 'linear-gradient(135deg,#3a1040,#2a0830)', border: '#6a2060', glow: '#ff44aa', textColor: '#ff88cc' },
    { id: 3, icon: '🃏', name: 'Joker', desc: 'Face the ultimate psychopath in a twisted game. Claim the crown and become the new game maker.', tags: ['Twisted Game','Chaos Reigns','Crown Awaits'], genre: 'Psycho', bg: 'linear-gradient(135deg,#2a0808,#3a1010)', border: '#601818', glow: '#ff4444', textColor: '#fff' },
  ];
  return (
    <div style={{ height: FIXED_HEIGHT, background: '#080e18', borderRadius: 10, overflow: 'hidden', border: '1px solid #1a2030', fontFamily: 'var(--sans)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'rgba(8,12,24,.95)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a2030', flexShrink: 0 }}>
        <span style={{ color: '#ff3b3b', fontWeight: 900, fontSize: 16 }}>NETPONG</span>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#ccc' }}><span>Home</span><span>Exclusive</span><span style={{ color: '#fff', fontWeight: 600 }}>Game Modes ▾</span><span>Contact</span></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: '#ff3b3b', borderRadius: 6, padding: '5px 14px', fontSize: 11, color: '#fff', fontWeight: 700 }}>Chat</div>
          <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 6, padding: '5px 14px', fontSize: 11, color: '#fff' }}>Logout</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: '16px 18px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
          {modes.map(m => (
            <div key={m.id} data-h onMouseEnter={() => setHov(m.id)} onMouseLeave={() => setHov(null)}
              style={{ background: m.bg, border: `1px solid ${hov === m.id ? m.glow + '66' : m.border}`, borderRadius: 14, padding: '18px 16px', cursor: 'none', transition: 'all .2s', boxShadow: hov === m.id ? `0 0 24px ${m.glow}22` : 'none', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 30 }}>{m.icon}</span>
                <span style={{ fontSize: 9, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 20, padding: '3px 9px', color: '#ddd', letterSpacing: .5 }}>{m.genre}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: m.textColor, marginBottom: 6 }}>{m.name}</div>
              <div style={{ fontSize: 10, color: '#888', lineHeight: 1.6, marginBottom: 10, flex: 1 }}>{m.desc}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                {m.tags.map(t => <span key={t} style={{ fontSize: 8, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: '2px 8px', color: '#aaa' }}>{t}</span>)}
              </div>
              <div style={{ background: hov === m.id ? m.glow + '22' : 'rgba(255,255,255,.06)', border: `1px solid ${hov === m.id ? m.glow + '55' : 'rgba(255,255,255,.1)'}`, borderRadius: 8, padding: '7px 12px', fontSize: 11, color: hov === m.id ? m.glow : '#ccc', fontWeight: 600, textAlign: 'center', transition: 'all .2s' }}>Play Now →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── LEADERBOARD ───────────────────────────────────────────────────── */
function MockLeaderboard() {
  const top = [
    { rank: 2, name: 'aahlaqqa', tier: 'Platinum', color: '#aaaaee', xp: 303, wins: 8, rate: 42, medal: '🥈', avatar: 'A' },
    { rank: 1, name: 'momazouz', tier: 'Diamond', color: '#00bfff', xp: 377, wins: 8, rate: 89, medal: '🥇', avatar: 'M' },
    { rank: 3, name: 'hdrahm', tier: 'Gold', color: '#ffc142', xp: 228, wins: 7, rate: 64, medal: '🥉', avatar: 'H' },
  ];
  const rest = [
    { rank: 4, name: 'imeslaki', tier: 'Silver', xp: 123, wins: 3, rate: 60 },
    { rank: 5, name: 'simo_dev', tier: 'Bronze', xp: 80, wins: 2, rate: 40 },
  ];
  const tierColor = { Diamond: '#00bfff', Platinum: '#aaaaee', Gold: '#ffc142', Silver: '#aaaaaa', Bronze: '#cc8844' };
  return (
    <div style={{ height: FIXED_HEIGHT, background: '#080e18', borderRadius: 10, overflow: 'hidden', border: '1px solid #1a2030', fontFamily: 'var(--sans)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'rgba(8,12,24,.95)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a2030', flexShrink: 0 }}>
        <span style={{ color: '#ff3b3b', fontWeight: 900, fontSize: 16 }}>NETPONG</span>
        <span style={{ fontSize: 11, color: '#666' }}>netpong.games/leaderboard</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: '#ff3b3b', borderRadius: 6, padding: '5px 14px', fontSize: 11, color: '#fff', fontWeight: 700 }}>Chat</div>
          <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 6, padding: '5px 14px', fontSize: 11, color: '#fff' }}>Logout</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: '16px 18px', overflowY: 'auto' }}>
        {/* Stats bar */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
          {[['Total Players','11'],['Avg Level','1']].map(([l,v]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid #1a2030', borderRadius: 8, padding: '8px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#666', marginBottom: 3, letterSpacing: 1 }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>👑 Champions</div>
          <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>Compete with the best players 🏆</div>
        </div>
        {/* Podium */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 8, marginBottom: 14, alignItems: 'end' }}>
          {top.map((p, i) => (
            <div key={p.rank} style={{ background: `linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.01))`, border: `1px solid ${p.color}33`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', boxShadow: i === 1 ? `0 0 28px ${p.color}18` : 'none' }}>
              <div style={{ fontSize: i === 1 ? 24 : 18, marginBottom: 6 }}>{p.medal}</div>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${p.color}44,${p.color}11)`, border: `2px solid ${p.color}66`, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: p.color }}>{p.avatar}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 9, background: `${p.color}18`, border: `1px solid ${p.color}44`, borderRadius: 20, padding: '2px 8px', color: p.color, display: 'inline-block', marginBottom: 8 }}>{p.tier}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[['XP',p.xp],['W',p.wins],['%',p.rate+'%']].map(([k,v]) => (
                  <div key={k} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: p.color }}>{v}</div>
                    <div style={{ fontSize: 8, color: '#444' }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 50px 50px 50px', gap: 8, padding: '6px 10px', fontSize: 9, color: '#444', letterSpacing: 1, borderBottom: '1px solid #1a2030', marginBottom: 4 }}>
          <span>#</span><span>PLAYER</span><span>RANK</span><span>XP</span><span>WINS</span><span>W/L</span>
        </div>
        {rest.map(p => (
          <div key={p.rank} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 50px 50px 50px', gap: 8, padding: '8px 10px', background: 'rgba(255,255,255,.02)', borderRadius: 8, marginBottom: 4, border: '1px solid #1a2030', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#444' }}>#{p.rank}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1a2030', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#aaa' }}>{p.name[0].toUpperCase()}</div>
              <span style={{ fontSize: 11, color: '#ccc' }}>{p.name}</span>
            </div>
            <div style={{ background: tierColor[p.tier] + '22', border: `1px solid ${tierColor[p.tier]}44`, borderRadius: 20, padding: '2px 8px', fontSize: 9, color: tierColor[p.tier], textAlign: 'center' }}>{p.tier}</div>
            <span style={{ fontSize: 10, color: '#607a95', fontFamily: 'var(--mono)' }}>{p.xp}</span>
            <span style={{ fontSize: 10, color: '#607a95', fontFamily: 'var(--mono)' }}>{p.wins}W</span>
            <span style={{ fontSize: 10, color: '#607a95', fontFamily: 'var(--mono)' }}>{p.rate}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── BATTLE HISTORY ────────────────────────────────────────────────── */
function MockHistory() {
  const matches = [
    { opp:'Amr',   mode:'🧟 Zombie Land', score:'7:3', result:'VICTORY', xp:'+20', date:'Feb 24, 06:32 PM' },
    { opp:'Houdaifa', mode:'🃏 Joker',    score:'2:7', result:'DEFEAT',  xp:'+30', date:'Feb 24, 05:10 PM' },
    { opp:'AI',    mode:'⚔️ Soul Society', score:'7:5', result:'VICTORY', xp:'+80', date:'Feb 23, 09:55 PM' },
    { opp:'AI',    mode:'🧟 Zombie Land', score:'7:1', result:'VICTORY', xp:'+80', date:'Feb 22, 03:40 PM' },
    { opp:'Mohammed', mode:'🃏 Joker',    score:'7:4', result:'VICTORY', xp:'+100',date:'Feb 22, 02:20 PM' },
  ];
  return (
    <div style={{ height: FIXED_HEIGHT, background: 'linear-gradient(180deg,#1a0a10 0%,#0e0816 50%,#080612 100%)', borderRadius: 10, overflow: 'hidden', border: '1px solid #2a1520', fontFamily: 'var(--sans)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'rgba(10,6,18,.95)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a1520', flexShrink: 0 }}>
        <span style={{ color: '#ff3b3b', fontWeight: 900, fontSize: 16 }}>NETPONG</span>
        <span style={{ fontSize: 11, color: '#666' }}>netpong.games/history</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: '#ff3b3b', borderRadius: 6, padding: '5px 14px', fontSize: 11, color: '#fff', fontWeight: 700 }}>Chat</div>
          <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 6, padding: '5px 14px', fontSize: 11, color: '#fff' }}>Logout</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
        {/* Title */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, color: '#ff6600', letterSpacing: 2, marginBottom: 4 }}>NETPONG</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Battle <span style={{ color: '#ff8c00' }}>History</span></div>
        </div>
        {/* Profile row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,.04)', border: '1px solid #2a1520', borderRadius: 10, padding: '12px 16px', marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#ff6600', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff', flexShrink: 0 }}>A</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Ahmed <span style={{ fontSize: 10, color: '#ff6600', background: '#ff660022', border: '1px solid #ff660033', borderRadius: 4, padding: '1px 6px', marginLeft: 4 }}>LV3</span></div>
            <div style={{ fontSize: 9, color: '#666', marginTop: 3 }}>LEVEL 3 PLAYER</div>
          </div>
          <div style={{ flex: 2, padding: '0 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#666', marginBottom: 4 }}><span>EXPERIENCE</span><span style={{ color: '#ff8c00' }}>80 XP</span></div>
            <div style={{ background: '#1a0a20', borderRadius: 20, height: 7, overflow: 'hidden' }}>
              <div style={{ width: '80%', height: '100%', background: 'linear-gradient(90deg,#ff6600,#ff3b3b)', borderRadius: 20 }} />
            </div>
            <div style={{ fontSize: 8, color: '#444', marginTop: 3 }}>80 / 100 XP to next level</div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 900, color: '#00ff88' }}>5</div><div style={{ fontSize: 8, color: '#555' }}>WINS</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 900, color: '#ff4444' }}>2</div><div style={{ fontSize: 8, color: '#555' }}>LOSSES</div></div>
          </div>
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {['ALL (7)','WINS (5)','LOSSES (2)'].map((f,i) => (
            <div key={f} style={{ background: i === 0 ? 'rgba(255,255,255,.1)' : 'transparent', border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: '4px 12px', fontSize: 10, color: i === 0 ? '#fff' : '#666', fontWeight: i === 0 ? 600 : 400 }}>{f}</div>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: 10, color: '#ff6600' }}>+420 XP earned total</div>
        </div>
        {/* Table */}
        <div style={{ background: 'rgba(8,5,16,.6)', border: '1px solid #1a1020', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 0.6fr', gap: 8, padding: '8px 14px', fontSize: 9, color: '#444', letterSpacing: 1, borderBottom: '1px solid #1a1020' }}>
            <span>PLAYER / OPPONENT</span><span>GAME MODE</span><span>SCORE</span><span>RESULT</span><span>XP</span>
          </div>
          {matches.map((m, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 0.6fr', gap: 8, padding: '9px 14px', borderBottom: '1px solid #1a1020', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#ff6600', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}>A</div>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#3a3a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#aaa', marginLeft: -6 }}>{m.opp[0]}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#ddd' }}>Ahmed</div>
                  <div style={{ fontSize: 8, color: '#555' }}>vs {m.opp}</div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: '3px 10px', fontSize: 9, color: '#ccc', display: 'inline-flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>{m.mode}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{m.score}</div>
                <div style={{ fontSize: 8, color: '#444' }}>{m.date}</div>
              </div>
              <div style={{ background: m.result === 'VICTORY' ? '#00ff8822' : '#ff444422', border: `1px solid ${m.result === 'VICTORY' ? '#00ff8844' : '#ff444444'}`, borderRadius: 20, padding: '3px 10px', fontSize: 9, color: m.result === 'VICTORY' ? '#00ff88' : '#ff4444', fontWeight: 700, width: 'fit-content' }}>
                {m.result === 'VICTORY' ? '🏆' : '💀'} {m.result}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ff8c00' }}>{m.xp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── CHAT ──────────────────────────────────────────────────────────── */
function MockChat() {
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState([
    { id: 1, user: 'hdrahm', text: 'Simo don\'t worry had Imera dert reset ghi l database 😂😂😂', own: true, color: '#ff5533', time: '3:45 PM' },
    { id: 2, user: 'aahlaqqa', text: 'test test', own: false, time: '4:19 PM' },
    { id: 3, user: 'abdelalijabri6', text: 'Cocooo', own: false, time: '9:38 PM' },
  ]);
  const send = () => { if (!input.trim()) return; setMsgs(m => [...m, { id: Date.now(), user: 'hdrahm', text: input, own: true, color: '#ff5533', time: 'now' }]); setInput(''); };
  return (
    <div style={{ height: FIXED_HEIGHT, background: '#080e18', borderRadius: 10, overflow: 'hidden', border: '1px solid #1a2030', fontFamily: 'var(--sans)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'rgba(8,12,24,.95)', padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a2030', flexShrink: 0 }}>
        <span style={{ color: '#ff3b3b', fontWeight: 900, fontSize: 15 }}>NETPONG</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid #2a3040', borderRadius: 6, padding: '5px 12px', fontSize: 10, color: '#aaa' }}>🗑 Clear Chat</div>
          <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid #2a3040', borderRadius: 6, padding: '5px 12px', fontSize: 10, color: '#aaa' }}>🚫 Blocked (0)</div>
          <div style={{ background: '#ff3b3b', borderRadius: 6, padding: '5px 12px', fontSize: 10, color: '#fff', fontWeight: 700 }}>Logout</div>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 160, background: 'rgba(6,10,18,.8)', borderRight: '1px solid #1a2030', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 12px 4px', fontSize: 13, fontWeight: 700, color: '#fff' }}>Friends</div>
          <div style={{ fontSize: 9, color: '#444', paddingLeft: 12, marginBottom: 10 }}>2 friends · 0 online</div>
          <div style={{ padding: '0 8px', marginBottom: 8 }}>
            <div style={{ background: '#141c2a', border: '2px solid #ff5533', borderRadius: 10, padding: '9px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#ff5533', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff', flexShrink: 0 }}>G</div>
              <div><div style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>Global Chat</div><div style={{ fontSize: 8, color: '#444' }}>0 members online</div></div>
            </div>
          </div>
          {[['aahlaqqa','#3a4a5a'],['houdaifadrahm','#3a4a5a']].map(([n,bg]) => (
            <div key={n} style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#aaa', flexShrink: 0 }}>{n[0].toUpperCase()}</div>
              <div><div style={{ fontSize: 10, color: '#ccc' }}>{n}</div><div style={{ fontSize: 8, color: '#444' }}>NetPong Player</div></div>
            </div>
          ))}
          <div style={{ marginTop: 'auto', padding: '8px 10px', borderTop: '1px solid #1a2030' }}>
            <div style={{ fontSize: 8, color: '#333', lineHeight: 1.4 }}>Everything happens here: pick Global or a friend to chat without leaving this page.</div>
          </div>
        </div>
        {/* Main chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '1px solid #1a2030', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#ff5533', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff' }}>G</div>
            <div><div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Global Chat</div><div style={{ fontSize: 9, color: '#444' }}>0 members online</div></div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {msgs.map(m => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.own ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  {!m.own && <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2a3a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#aaa' }}>{m.user[0].toUpperCase()}</div>}
                  <span style={{ fontSize: 9, color: '#444' }}>{m.user} · {m.time}</span>
                </div>
                <div style={{ background: m.own ? m.color : 'rgba(255,255,255,.05)', border: m.own ? 'none' : '1px solid rgba(255,255,255,.08)', borderRadius: m.own ? '14px 14px 3px 14px' : '14px 14px 14px 3px', padding: '8px 13px', maxWidth: '75%', fontSize: 11, color: '#fff', lineHeight: 1.5 }}>{m.text}</div>
                {!m.own && <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>{['😂 1','😮 1'].map(r => <span key={r} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 20, padding: '2px 7px', fontSize: 9, color: '#888' }}>{r}</span>)}</div>}
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 12px', borderTop: '1px solid #1a2030', display: 'flex', gap: 8, flexShrink: 0 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Type your message..."
              style={{ flex: 1, background: '#0f1825', border: '1px solid #1e2d40', borderRadius: 10, padding: '8px 14px', color: '#fff', fontFamily: 'var(--sans)', fontSize: 11, outline: 'none' }} />
            <div data-h onClick={send} style={{ background: '#ff5533', borderRadius: 10, padding: '8px 16px', fontSize: 11, color: '#fff', fontWeight: 700, cursor: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>Send ➤</div>
          </div>
        </div>
        {/* Right panel */}
        <div style={{ width: 180, background: 'rgba(6,10,18,.7)', borderLeft: '1px solid #1a2030', flexShrink: 0, padding: '14px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Live Matches</div>
          <div style={{ background: '#1a2a1a', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ width: '100%', height: 70, background: 'linear-gradient(135deg,#1a1a3a,#2a1a4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎮</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Tournament Highlights</div>
          <div style={{ fontSize: 9, color: '#555', marginBottom: 12 }}>Watch the best moments from recent matches</div>
          {[['Last Match','Ahmed vs Mohammed - Zombie Land'],['Recent Match','Houdaifa wins Barbie Pink tournament'],['Top Player','Youssef - 10 wins streak']].map(([l,v]) => (
            <div key={l} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#ccc' }}>{l}</div>
              <div style={{ fontSize: 9, color: '#555', marginTop: 2, lineHeight: 1.4 }}>{v}</div>
              <div style={{ fontSize: 9, color: '#00ff88', marginTop: 2 }}>Winner Chicken Dinner !!</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── LOGIN ─────────────────────────────────────────────────────────── */
function MockLogin() {
  return (
    <div style={{ height: FIXED_HEIGHT, background: '#050508', borderRadius: 10, overflow: 'hidden', border: '1px solid #1a1a2a', fontFamily: 'var(--sans)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(120,60,255,.15),transparent 70%)' }} />
      </div>
      <div style={{ background: 'rgba(4,4,10,.9)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1a2a', position: 'relative' }}>
        <span style={{ color: '#a855f7', fontWeight: 900, fontSize: 16, letterSpacing: 1 }}>NETPONG</span>
        <div style={{ display: 'flex', gap: 20, fontSize: 11, color: '#888' }}><span>Home</span><span>Contact</span></div>
        <div style={{ background: 'rgba(168,85,247,.15)', border: '1px solid #a855f766', borderRadius: 20, padding: '5px 14px', fontSize: 10, color: '#a855f7' }}>● ALWAYS FOR YOU ●</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ background: 'rgba(8,8,20,.92)', border: '1px solid #2a2a3a', borderRadius: 16, padding: '28px 32px', width: 360, backdropFilter: 'blur(12px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: '#a855f7', letterSpacing: 2, marginBottom: 6 }}>START TO PLAY <span style={{ color: '#a855f7', fontWeight: 800 }}>NETPONG</span></div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', borderBottom: '2px solid #a855f7', display: 'inline-block', paddingBottom: 4, marginBottom: 6 }}>LOG IN</div>
            <div style={{ fontSize: 11, color: '#555' }}>Don't have an Account? <span style={{ color: '#a855f7' }}>Create Account</span></div>
          </div>
          {['Email or Username','Password'].map((pl, i) => (
            <div key={pl} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid #2a2a3a', borderRadius: 10, padding: '11px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#444' }}>{pl}</span>
              <span style={{ fontSize: 12, color: '#333' }}>{i === 0 ? '✉' : '🔒'}</span>
            </div>
          ))}
          <div style={{ background: 'linear-gradient(90deg,#a855f7,#6366f1)', borderRadius: 10, padding: '12px', textAlign: 'center', fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 10, letterSpacing: 1 }}>LOGIN →</div>
          <div style={{ textAlign: 'center', fontSize: 10, color: '#444', marginBottom: 14 }}>Forgot Password?</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: '#1a1a2a' }} />
            <span style={{ fontSize: 9, color: '#333', letterSpacing: 1 }}>OR SIGN IN WITH</span>
            <div style={{ flex: 1, height: 1, background: '#1a1a2a' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: '9px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <span style={{ fontSize: 13 }}>G</span> Google
            </div>
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '9px', textAlign: 'center', fontSize: 10, color: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <span>⚙</span> GitHub
            </div>
            <div style={{ background: '#00babc', borderRadius: 8, padding: '9px', textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              ✦ 42
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── GAME MODE SPLASH (reusable) ───────────────────────────────────── */
function ModeSplash({ title, subtitle, tagline, color1, color2, textColor, btnColor, btnText, bg, words }) {
  return (
    <div style={{ height: FIXED_HEIGHT, background: bg, borderRadius: 10, overflow: 'hidden', border: `1px solid ${color1}22`, fontFamily: 'var(--sans)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {words && words.map((w, i) => (
        <div key={i} style={{ position: 'absolute', ...w.pos, fontWeight: 900, fontSize: w.size || 14, color: w.color || color1, opacity: .35, letterSpacing: 1, userSelect: 'none', pointerEvents: 'none' }}>{w.text}</div>
      ))}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: 400, padding: '0 20px' }}>
        <div style={{ fontSize: 36, fontWeight: 900, background: `linear-gradient(90deg,${color1},${color2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: -1, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 10, color: textColor || color1, letterSpacing: 3, marginBottom: 24, opacity: .7 }}>{subtitle}</div>
        <div style={{ background: 'rgba(0,0,0,.65)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16, padding: '24px 28px', backdropFilter: 'blur(16px)' }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: color1, marginBottom: 6 }}>{tagline.title}</div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 20 }}>{tagline.sub}</div>
          <div style={{ background: btnColor, borderRadius: 10, padding: '12px', textAlign: 'center', fontWeight: 700, fontSize: 12, color: '#fff', marginBottom: 10, letterSpacing: 1, boxShadow: `0 0 20px ${btnColor}55` }}>
            {tagline.btn} FIND MATCH
          </div>
          <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 10, padding: '11px', textAlign: 'center', fontWeight: 600, fontSize: 12, color: '#ccc', marginBottom: 14 }}>
            🏒 CLASSIC MATCH
          </div>
          <div style={{ fontSize: 10, color: '#444' }}>← Back</div>
        </div>
      </div>
    </div>
  );
}

/* ─── TABS CONFIG ───────────────────────────────────────────────────── */
const SCREENS = [
  { id: 'home',        label: '🏠 Home',        accent: '#c084fc', Component: MockHome },
  { id: 'exclusive',   label: '✨ Exclusive',    accent: '#a855f7', Component: MockExclusive },
  { id: 'modes',       label: '🎮 Game Modes',   accent: '#00d4ff', Component: MockGameModes },
  { id: 'leaderboard', label: '🏆 Leaderboard',  accent: '#ffc142', Component: MockLeaderboard },
  { id: 'history',     label: '📜 History',      accent: '#ff8c00', Component: MockHistory },
  { id: 'chat',        label: '💬 Chat',         accent: '#ff5533', Component: MockChat },
  { id: 'login',       label: '🔐 Login',        accent: '#a855f7', Component: MockLogin },
  { id: 'zombie',      label: '🧟 Zombie Land',  accent: '#00ff88', isGame: true },
  { id: 'joker',       label: '🃏 Joker',        accent: '#a855f7', Component: () => <ModeSplash title="JOKER" subtitle="THE GAME MAKER" tagline={{ title: 'Why so serious?', sub: "Let's put a smile on that face.", btn: '🃏' }} color1="#a855f7" color2="#00ff88" textColor="#a855f7" btnColor="linear-gradient(90deg,#a855f7,#00ff88)" bg="radial-gradient(ellipse at center,#1a0820 0%,#050308 100%)" words={[{text:'HAHAHA',pos:{top:30,left:20},size:18},{text:'HAHAHAHA',pos:{top:40,right:20},size:22,color:'#ff44aa'},{text:'HA HA HA',pos:{bottom:80,left:40},size:14},{text:'HA!',pos:{bottom:60,right:100},size:16}]} /> },
  { id: 'kitty',       label: '🩷 Kitty Cat',    accent: '#ff44aa', Component: () => <ModeSplash title="KITTY CAT" subtitle="JUST FOR GIRLS" tagline={{ title: 'Enter the Glam Zone', sub: 'Cute but competitive. Let\'s play!', btn: '😸' }} color1="#ff44aa" color2="#ff88cc" textColor="#ff88cc" btnColor="#ff44aa" bg="linear-gradient(135deg,#2a0820 0%,#1a0515 100%)" /> },
  { id: 'soul',        label: '⚔️ Soul Society', accent: '#4488ff', Component: () => <ModeSplash title="SOUL SOCIETY" subtitle="THE SOUL SAVER" tagline={{ title: '⚔ Enter the Soul World', sub: 'Only the strongest soul prevails.', btn: '⚔️' }} color1="#80ccff" color2="#4488ff" textColor="#aaddff" btnColor="#2266cc" bg="linear-gradient(180deg,#1a2a3a 0%,#0a1520 100%)" /> },
];

/* ─── MAIN EXPORT ───────────────────────────────────────────────────── */
export default function NetpongGallery() {
  const [cur, setCur] = useState(0);
  const screen = SCREENS[cur];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {SCREENS.map((s, i) => (
          <div key={s.id} data-h onClick={() => setCur(i)}
            style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '5px 11px', cursor: 'none', border: `1px solid ${cur === i ? s.accent + '88' : 'var(--border)'}`, background: cur === i ? `${s.accent}14` : 'transparent', color: cur === i ? s.accent : 'var(--text3)', borderRadius: 4, transition: 'all .2s', letterSpacing: .5, whiteSpace: 'nowrap' }}
            onMouseEnter={e => { if (cur !== i) { e.currentTarget.style.borderColor = s.accent + '44'; e.currentTarget.style.color = s.accent; e.currentTarget.style.background = s.accent + '08'; } }}
            onMouseLeave={e => { if (cur !== i) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.background = 'transparent'; } }}>
            {s.label}
          </div>
        ))}
      </div>

      {/* Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', animation: 'pulse 1.5s infinite' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text3)', letterSpacing: 2 }}>
          {screen.isGame ? 'PLAYABLE DEMO · NETPONG.GAMES' : 'LIVE INTERACTIVE MOCK · NETPONG.GAMES'}
        </span>
      </div>

      {/* Fixed-height content area */}
      <div style={{ height: FIXED_HEIGHT }} key={screen.id}>
        <div style={{ animation: 'fadeUp .22s ease', height: '100%' }}>
          {screen.isGame
            ? <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020c06', borderRadius: 10, border: '1px solid #0d2e14' }}><ZombieLandGame active={true} /></div>
            : <screen.Component />}
        </div>
      </div>

      {/* Dot nav */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
        {SCREENS.map((s, i) => (
          <div key={s.id} data-h onClick={() => setCur(i)}
            style={{ width: cur === i ? 18 : 5, height: 5, borderRadius: 3, background: cur === i ? s.accent : 'var(--border)', transition: 'all .3s', cursor: 'none' }} />
        ))}
      </div>
    </div>
  );
}
