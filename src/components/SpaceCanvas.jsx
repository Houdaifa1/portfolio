import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ══════════════════════════════════════════════════════════════════
//  MILKY WAY SPACE  — exact background from portfolio
//  warm amber/orange dust lanes, teal-blue star pools,
//  dark molecular clouds, diagonal galactic band,
//  deep black base. NO mouse interaction. Slow organic drift.
//  Spectral stars + galaxy spiral + occasional shooting stars.
// ══════════════════════════════════════════════════════════════════

export default function SpaceCanvas() {
  const canvasRef    = useRef(null);
  const spiralMatRef = useRef(null); // set inside effect, read by RAF loop

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0, 0);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.01, 2000);
    cam.position.set(0, 0, 10);

    // ── MILKY WAY NEBULA SHADER ──────────────────────────────────
    // Palette from photo:
    //   - deep black base
    //   - warm amber/orange (dust lanes)
    //   - teal-blue pools (star-forming regions)
    //   - cold blue-grey wisps
    //   - subtle warm-white galactic core
    //   - dark molecular cloud patches (subtract light)
    // Time drives ONLY slow drift. No mouse interaction.
    const nebMat = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: { uT: { value: 0 } },
      vertexShader: `varying vec2 v;void main(){v=uv;gl_Position=vec4(position,1.);}`,
      fragmentShader: `
precision mediump float;
uniform float uT;
varying vec2 v;

float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
float n(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.08+vec2(1.7,9.2);a*=.48;}return v;}
float fbmS(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*n(p);p=p*2.1+vec2(4.1,2.3);a*=.5;}return v;}

void main(){
  float t=uT*.004; /* very slow */
  vec2 uv=v;

  /* diagonal galactic band (lower-left to upper-right) */
  float band=uv.x*.55-uv.y*.75+.42;
  float bandW=exp(-band*band*22.);   /* wide diffuse band */
  float bandC=exp(-band*band*90.);   /* narrow bright core */

  /* domain warp for organic cloud shapes */
  vec2 q=vec2(fbm(uv*1.2+t),fbm(uv*1.2+vec2(3.8,2.1)+t*.7));
  float f =fbm(uv*1.0+1.5*q+t*.06);
  float f2=fbm(uv*1.6+vec2(2.1,.8)+q*.8+t*.04);
  float f3=fbmS(uv*.7+vec2(.5,1.4)-t*.03);

  /* BASE: near-black */
  vec3 col=vec3(.005,.006,.012);

  /* GALACTIC BAND glow — warm white-gold core */
  col+=vec3(.08,.065,.035)*bandW;
  col+=vec3(.12,.095,.045)*bandC;

  /* DUST LANES: warm amber / orange-brown */
  float dust=smoothstep(.30,.72,f)*bandW*1.4+smoothstep(.35,.68,f)*bandC*.8;
  col+=vec3(.22,.10,.018)*dust*dust*1.8;
  col+=vec3(.18,.07,.010)*smoothstep(.50,.78,f)*bandW*1.2;

  /* TEAL-BLUE star-forming regions */
  float teal=smoothstep(.32,.70,f2)*(.4+.6*bandW);
  col+=vec3(.010,.090,.120)*teal*teal*1.5;
  col+=vec3(.005,.055,.095)*smoothstep(.48,.75,f2)*.9;

  /* COLD BLUE-GREY wisps — edges and upper sky */
  float cold=smoothstep(.28,.62,f3)*(1.-bandW*.5);
  col+=vec3(.018,.028,.060)*cold*cold*1.2;
  col+=vec3(.010,.018,.038)*cold*.6;

  /* MOLECULAR CLOUDS: dark patches that absorb light */
  float dark1=smoothstep(.38,.60,fbm(uv*2.2+vec2(1.1,.3)+t*.02));
  float dark2=smoothstep(.40,.62,fbm(uv*1.8+vec2(3.2,1.8)-t*.015));
  float darkMask=(dark1*.5+dark2*.4)*bandW*1.6;
  col*=clamp(1.-darkMask*.85,.15,1.);

  /* FINE STAR TEXTURE — grainy milky texture */
  float grain=fbmS(uv*18.+t*.2)*.5+fbmS(uv*28.+vec2(2.,1.)+t*.15)*.3;
  col+=vec3(.05,.06,.08)*grain*grain*(bandW*.8+.3)*.6;

  /* VIGNETTE */
  float vig=length((uv-.5)*vec2(1.,.9))*1.4;
  col*=clamp(1.1-vig*vig*.65,.05,1.);

  /* slight warm colour grade */
  col.r*=1.05;col.b*=.92;

  gl_FragColor=vec4(clamp(col,0.,1.),1.);
}`,
    });

    const nq = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), nebMat);
    nq.renderOrder = -999;
    nq.frustumCulled = false;
    scene.add(nq);

    // ── STARS — spectral colours (warm whites, cool blues, hints of orange) ──
    const sVert = `
      attribute float aS;attribute float aB;attribute vec3 aC;
      varying vec3 vC;varying float vB;uniform float uT;
      void main(){
        vC=aC;
        vB=aB*(0.93+0.07*sin(uT*.4+position.x*11.3+position.y*7.1));
        vec4 mv=modelViewMatrix*vec4(position,1.);
        gl_PointSize=aS*(240./-mv.z);gl_Position=projectionMatrix*mv;
      }`;
    const sFrag = `
      varying vec3 vC;varying float vB;
      void main(){
        vec2 c=gl_PointCoord*2.-1.;float r=dot(c,c);if(r>1.)discard;
        float a=(exp(-r*8.)+exp(-r*1.8)*.12)*vB;
        gl_FragColor=vec4(vC,a);
      }`;

    function mkStars(N, sp, szR, cols, zR) {
      const p = new Float32Array(N * 3);
      const s = new Float32Array(N);
      const b = new Float32Array(N);
      const c = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        p[i*3]   = (Math.random() - 0.5) * sp;
        p[i*3+1] = (Math.random() - 0.5) * sp * 0.45;
        p[i*3+2] = zR[0] + Math.random() * (zR[1] - zR[0]);
        s[i] = szR[0] + Math.random() * (szR[1] - szR[0]);
        b[i] = 0.10 + Math.random() * 0.60;
        const cl = cols[Math.floor(Math.random() * cols.length)];
        c[i*3] = cl[0]; c[i*3+1] = cl[1]; c[i*3+2] = cl[2];
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      g.setAttribute('aS',       new THREE.BufferAttribute(s, 1));
      g.setAttribute('aB',       new THREE.BufferAttribute(b, 1));
      g.setAttribute('aC',       new THREE.BufferAttribute(c, 3));
      return new THREE.Points(g, new THREE.ShaderMaterial({
        vertexShader: sVert,
        fragmentShader: sFrag,
        uniforms: { uT: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }));
    }

    // Star colour palettes
    const WW = [0.88, 0.90, 0.95]; // warm white
    const BW = [0.72, 0.82, 1.00]; // blue-white
    const CW = [0.95, 0.95, 0.88]; // cream white
    const TB = [0.55, 0.78, 0.92]; // teal-blue
    const AM = [1.00, 0.72, 0.38]; // amber
    const OR = [1.00, 0.55, 0.22]; // orange
    const SB = [0.42, 0.58, 1.00]; // steel blue

    const sfs = [
      mkStars(2200, 280, [0.25, 0.80], [WW, BW, CW, [0.80, 0.84, 0.90]], [-230, -20]),
      mkStars(700,  190, [0.65, 1.80], [BW, WW, TB, AM],                  [-100,  -7]),
      mkStars(200,  110, [1.50, 3.50], [SB, TB, AM, OR, BW, WW],          [ -50,  -2]),
      mkStars(50,    65, [3.00, 6.00], [SB, AM, OR, BW],                   [ -25,   0]),
      mkStars(12,    40, [5.50, 9.50], [SB, AM],                           [ -14,   2]),
    ];
    sfs.forEach(s => scene.add(s));

    // ── GALAXY SPIRAL (deep bg, very dim) ───────────────────────
    (() => {
      const N  = 2400;
      const p  = new Float32Array(N * 3);
      const an = new Float32Array(N);
      const ra = new Float32Array(N);
      const ar = new Float32Array(N);
      const al = new Float32Array(N);
      const co = new Float32Array(N * 3);
      // Arm colours: warm amber arms, cold blue outer
      const AC = [
        [0.30, 0.15, 0.04],
        [0.50, 0.18, 0.02],
        [0.04, 0.14, 0.22],
        [0.10, 0.22, 0.35],
      ];
      for (let i = 0; i < N; i++) {
        const t = i / N;
        const a = Math.floor(Math.random() * 4);
        an[i] = t * Math.PI * 16 + (Math.random() - 0.5) * 0.3;
        ra[i] = 2 + t * 20 + Math.random() * 1.2;
        ar[i] = a;
        p[i*3] = 0; p[i*3+1] = (Math.random() - 0.5) * 1.2 * t; p[i*3+2] = 0;
        al[i] = (0.04 + Math.random() * 0.14) * (1 - t * 0.5);
        const clr = AC[a];
        const m = Math.random() * 0.25;
        co[i*3]   = clr[0] + m * (1 - clr[0]);
        co[i*3+1] = clr[1] + m * (1 - clr[1]);
        co[i*3+2] = clr[2] + m * (1 - clr[2]);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(p,  3));
      g.setAttribute('an',       new THREE.BufferAttribute(an, 1));
      g.setAttribute('ra',       new THREE.BufferAttribute(ra, 1));
      g.setAttribute('ar',       new THREE.BufferAttribute(ar, 1));
      g.setAttribute('al',       new THREE.BufferAttribute(al, 1));
      g.setAttribute('co',       new THREE.BufferAttribute(co, 3));
      const gMat = new THREE.ShaderMaterial({
        uniforms: { uT: { value: 0 } },
        vertexShader: `
          attribute float an,ra,ar,al;attribute vec3 co;
          varying float vA;varying vec3 vC;uniform float uT;
          void main(){
            float a=an+ra*.08+uT*.018+ar*3.14159;
            vec4 mv=modelViewMatrix*vec4(cos(a)*ra,position.y,sin(a)*ra-50.,1.);
            vA=al;vC=co;gl_PointSize=1.4*(140./-mv.z);gl_Position=projectionMatrix*mv;
          }`,
        fragmentShader: `
          varying float vA;varying vec3 vC;
          void main(){
            vec2 c=gl_PointCoord*2.-1.;if(dot(c,c)>1.)discard;
            gl_FragColor=vec4(vC,exp(-dot(c,c)*3.)*vA);
          }`,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      scene.add(new THREE.Points(g, gMat));
      // Store on ref so the loop can update uT
      spiralMatRef.current = gMat;
    })();

    // ── SHOOTING STARS ───────────────────────────────────────────
    const streaks = [];
    function spawnStreak() {
      const N  = 16;
      const sx = (Math.random() - 0.5) * 45;
      const sy = (Math.random() - 0.5) * 22;
      const sz = -2 + Math.random() * 4;
      const len = 2 + Math.random() * 7;
      const ang = Math.PI * 0.7 + Math.random() * 0.9;
      const dx  = Math.cos(ang) * len;
      const dy  = Math.sin(ang) * len * 0.25;
      const p   = new Float32Array(N * 3);
      const pr  = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        p[i*3] = sx + dx * t; p[i*3+1] = sy + dy * t; p[i*3+2] = sz;
        pr[i] = t;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(p,  3));
      g.setAttribute('pr',       new THREE.BufferAttribute(pr, 1));
      const C = Math.random() < 0.6 ? [0.9, 0.85, 0.7] : [0.6, 0.75, 1.0];
      const mat = new THREE.ShaderMaterial({
        vertexShader:   `attribute float pr;varying float vP;void main(){vP=pr;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying float vP;uniform vec3 uC;uniform float uL;void main(){gl_FragColor=vec4(uC,(1.-vP)*vP*2.5*uL);}`,
        uniforms: {
          uC: { value: new THREE.Vector3(...C) },
          uL: { value: 1.0 },
        },
        transparent: true,
        depthWrite:  false,
        blending:    THREE.AdditiveBlending,
      });
      const ln = new THREE.Line(g, mat);
      ln.userData = {
        dec: 0.020 + Math.random() * 0.025,
        vx:  (Math.random() - 0.5) * 0.15,
        vy:  -(Math.random() * 0.08 + 0.03),
      };
      scene.add(ln);
      streaks.push(ln);
    }

    // ── ANIMATION LOOP — no mouse, slow organic drift only ───────
    let ticker = 0;
    let rafId;
    function loop() {
      rafId = requestAnimationFrame(loop);
      ticker += 0.009;

      nebMat.uniforms.uT.value = ticker;
      sfs.forEach((s, i) => {
        s.material.uniforms.uT.value = ticker;
        s.rotation.y = ticker * 0.0005 * (i + 1);
      });
      if (spiralMatRef.current) {
        spiralMatRef.current.uniforms.uT.value = ticker;
      }

      // Rare shooting stars
      if (Math.random() < 0.003) spawnStreak();
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.material.uniforms.uL.value -= s.userData.dec;
        s.position.x += s.userData.vx;
        s.position.y += s.userData.vy;
        if (s.material.uniforms.uL.value <= 0) {
          scene.remove(s);
          s.geometry.dispose();
          s.material.dispose();
          streaks.splice(i, 1);
        }
      }

      renderer.render(scene, cam);
    }
    loop();

    // ── Resize ───────────────────────────────────────────────────
    function onResize() {
      cam.aspect = innerWidth / innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    }
    window.addEventListener('resize', onResize);

    // ── Cleanup ──────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="space-canvas"
      style={{
        position:      'fixed',
        inset:          0,
        zIndex:         0,
        pointerEvents: 'none',
        display:       'block',
        width:         '100vw',
        height:        '100vh',
      }}
    />
  );
}
