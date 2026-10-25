<div align="center">

```
██╗  ██╗██████╗ ██████╗  █████╗ ██╗  ██╗███╗   ███╗
██║  ██║██╔══██╗██╔══██╗██╔══██╗██║  ██║████╗ ████║
███████║██║  ██║██████╔╝███████║███████║██╔████╔██║
██╔══██║██║  ██║██╔══██╗██╔══██║██╔══██║██║╚██╔╝██║
██║  ██║██████╔╝██║  ██║██║  ██║██║  ██║██║ ╚═╝ ██║
╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
```

# Houdaifa Drahm — Portfolio

**Backend & DevOps Engineer · 1337 School · UM6P · Morocco 🇲🇦**

[![Live](https://img.shields.io/badge/LIVE-houdaifa.dev-00d4ff?style=for-the-badge&logo=cloudflare&logoColor=white)](https://houdaifa.dev)
[![Cloudflare](https://img.shields.io/badge/Deployed_on-Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

## ⚡ What is this

My personal portfolio — built from scratch, no templates, no UI libraries. Just React, Vite, and raw CSS. Every component hand-written. Interactive demos for each project so you can actually play with the work, not just read about it.

**Live at → [houdaifa.dev](https://houdaifa.dev)**

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Pure CSS (CSS variables, no frameworks) |
| Background | Canvas 2D API — custom starfield & nebula renderer |
| Deployment | Cloudflare Pages (global edge, HTTP/3, Brotli) |
| CI/CD | Git push → auto deploy (zero config) |

**Bundle size:** ~73KB gzipped. Loads in under a second globally.

---

## 🎮 Interactive Project Demos

Every major project has a live interactive demo built into the page:

| Project | Demo |
|---------|------|
| **ft_transcendence** | Live gallery — real screenshots from [netpong.games](https://netpong.games) |
| **Minishell** | Functional terminal emulator — run `ls`, `pwd`, `env`, `git log` |
| **cub3D** | Playable raycasting engine — WASD/arrows, minimap, real DDA algorithm |
| **Philosophers** | Live concurrency visualizer — watch threads fight over forks |
| **Inception** | Docker container visualizer — animated service graph |
| **So_Long** | Playable 2D grid game — collect coins, find the exit |
| **Push_swap** | Algorithm visualizer — watch the sort happen live |
| **Webserv** | HTTP request simulator |
| **NetPractice** | Subnet calculator |

---

## 🚀 Run locally

```bash
git clone https://github.com/Houdaifa1/portfolio.git
cd portfolio
npm install
npm run dev
# → http://localhost:5173
```

```bash
npm run build    # production build → dist/
npm run preview  # preview the build
```

---

## 📁 Structure

```
src/
├── App.jsx                  # root — layout & scroll observer
├── index.css                # global styles & CSS variables
├── main.jsx                 # entry point
├── components/
│   ├── SpaceCanvas.jsx      # animated starfield (Canvas 2D, no WebGL)
│   ├── Cursor.jsx           # custom cursor
│   ├── Nav.jsx              # fixed navigation
│   ├── Hero.jsx             # landing section
│   ├── Skills.jsx           # tech stack
│   ├── Projects.jsx         # project cards with demos
│   ├── About.jsx            # about section
│   ├── Contact.jsx          # contact section
│   └── games/               # interactive project demos
│       ├── Cub3DGame.jsx
│       ├── MinishellGame.jsx
│       ├── PhilosophersGame.jsx
│       ├── DockerGame.jsx
│       ├── SoLongGame.jsx
│       ├── PushSwapGame.jsx
│       ├── WebservGame.jsx
│       ├── NetPracticeGame.jsx
│       ├── NetpongGallery.jsx
│       ├── Born2berootGame.jsx
│       └── ZombieLandGame.jsx
└── utils/
    └── scroll.js            # smooth scroll utility
```

---

## 🌍 Deployment

Deployed on **Cloudflare Pages** — auto-deploys on every push to `main`.

```bash
git add .
git commit -m "update"
git push
# → live in ~60 seconds
```

---

<div align="center">

**Built by [Houdaifa Drahm](https://houdaifa.dev) · 1337 School · UM6P · Morocco**

[houdaifa.dev](https://houdaifa.dev) · [LinkedIn](https://www.linkedin.com/in/houdaifa-drahm) · [GitHub](https://github.com/Houdaifa1)

</div>
