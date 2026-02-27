import { useEffect, useRef } from 'react';

export default function SpaceCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Load Three.js from CDN ───────────────────────────────────────────
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => initScene();
    document.head.appendChild(script);

    let renderer, scene, camera, animId;
    let skyMesh, starPoints, starPoints2, starPoints3;

    function initScene() {
      const THREE = window.THREE;

      // ── Renderer ────────────────────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 1);
      mount.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      // ── Camera — inside the sphere, looking outward ──────────────────
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      camera.position.set(0, 0, 0);

      // ── Sky Sphere with GLSL nebula shader ───────────────────────────
      // This is the Milky Way + nebula painted directly on a giant sphere
      // using procedural noise — you're INSIDE it looking out
      const skyGeo = new THREE.SphereGeometry(800, 64, 64);

      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide, // render inside of sphere
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec3 vPos;
          varying vec2 vUv;
          void main() {
            vPos = position;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vPos;
          varying vec2 vUv;

          float hash(vec2 p) {
            p = fract(p * vec2(234.34, 435.345));
            p += dot(p, p + 34.23);
            return fract(p.x * p.y);
          }
          float noise(vec2 p) {
            vec2 i = floor(p), f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i), hash(i + vec2(1,0)), f.x),
              mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
              f.y
            );
          }
          float fbm(vec2 p) {
            float v = 0.0, a = 0.5;
            for (int i = 0; i < 6; i++) {
              v += a * noise(p);
              p = p * 2.0 + vec2(1.7, 9.2);
              a *= 0.5;
            }
            return v;
          }
          float fbmR(vec2 p) {
            float v = 0.0, a = 0.5;
            mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
            for (int i = 0; i < 7; i++) {
              v += a * noise(p);
              p = rot * p * 2.1 + vec2(3.1, 7.4);
              a *= 0.48;
            }
            return v;
          }
          vec2 sphereUV(vec3 dir) {
            dir = normalize(dir);
            float lon = atan(dir.z, dir.x);
            float lat = asin(dir.y);
            return vec2(lon / (2.0 * 3.14159) + 0.5, lat / 3.14159 + 0.5);
          }

          void main() {
            vec3 dir = normalize(vPos);
            vec2 uv = sphereUV(dir);
            float t = uTime * 0.0008; // very slow drift

            // ── Pure black — space is dark ────────────────────────────
            vec3 col = vec3(0.0, 0.0, 0.003);

            // ── Galactic band ─────────────────────────────────────────
            // Tilted plane — diagonal like in the photos
            float band = dir.y * 0.55 - dir.x * 0.25 + dir.z * 0.18;
            float mwCore = exp(-band * band * 22.0);  // very tight bright core
            float mwWide = exp(-band * band * 3.5);   // wide faint halo

            float n1 = fbm(uv * vec2(5.0, 10.0) + vec2(t, 0.0));
            float n2 = fbmR(uv * vec2(3.5, 7.0) + vec2(0.3, t * 0.7));
            float n3 = fbm(uv * vec2(8.0, 16.0) + vec2(t * 1.2, 0.5));

            // ── CORE: warm yellow-white bulge (image 1 center bright spot)
            // Keep it DIM — a glow, not a sun
            col += vec3(0.28, 0.22, 0.14) * mwCore * n1 * 0.9;
            col += vec3(0.18, 0.16, 0.12) * mwCore * 0.5;

            // ── HALO: blue-white arm glow (image 2 — the blue pillar)
            // Subtle, not neon
            col += vec3(0.06, 0.10, 0.22) * mwWide * n2 * 0.7;
            col += vec3(0.04, 0.07, 0.18) * mwWide * 0.4;

            // ── RED/CRIMSON dust clouds (image 1 — Spitzer infrared)
            // The reddish blobs scattered through the band
            float redN = fbmR(uv * 2.8 + vec2(1.5, t * 0.5));
            float redN2 = fbm(uv * 1.8 + vec2(t * 0.3, 2.1));
            float redMask = mwWide * redN * redN2;
            col += vec3(0.22, 0.03, 0.01) * redMask * 0.8;   // deep crimson
            col += vec3(0.16, 0.02, 0.04) * mwWide * fbm(uv * 4.0 + vec2(2.0, t * 0.4)) * n1 * 0.5;
            // Pink blobs at edges
            col += vec3(0.12, 0.02, 0.06) * mwWide * fbmR(uv * 5.5 + vec2(t * 0.6, 3.0)) * 0.35;

            // ── DARK ABSORPTION LANES — the black rifts (image 1)
            // These SUBTRACT light — the dark streaks cutting through
            float lane1 = exp(-(band + 0.022) * (band + 0.022) * 900.0);
            float lane2 = exp(-(band - 0.015) * (band - 0.015) * 1200.0);
            float lane3 = exp(-(band + 0.005) * (band + 0.005) * 2000.0);
            float laneNoise = fbm(uv * vec2(6.0, 18.0) + vec2(t * 0.8, 0.0));
            float laneNoise2 = fbm(uv * vec2(10.0, 25.0) + vec2(0.0, t * 0.6));
            col *= 1.0 - lane1 * laneNoise * 1.6;
            col *= 1.0 - lane2 * laneNoise2 * 1.2;
            col *= 1.0 - lane3 * (1.0 - laneNoise) * 0.8;

            // ── Faint blue deep-space field (image 2 background sky color)
            float deepBlue = fbmR(uv * 1.2 + vec2(t * 0.2, t * 0.15));
            col += vec3(0.01, 0.02, 0.06) * deepBlue * (1.0 - mwCore) * 0.6;

            // ── Faint purple/violet patches
            col += vec3(0.05, 0.01, 0.08) * fbm(uv * 2.5 + vec2(5.0, t * 0.3)) * fbmR(uv * 1.8) * 0.25;

            // ── Micro stars — packed haze (the dense star fields in both images)
            // Very sharp, tiny, like real stars. NOT glowing balls.
            float s1 = pow(hash(floor(uv * 2200.0)), 16.0);
            float s2 = pow(hash(floor(uv * 3400.0 + vec2(41.0, 83.0))), 20.0);
            float s3 = pow(hash(floor(uv * 900.0 + vec2(19.0, 61.0))), 12.0);
            float s4 = pow(hash(floor(uv * 5000.0 + vec2(7.0, 29.0))), 24.0);
            // Stars denser in the milky way band
            float mwDensity = 0.4 + mwWide * 0.6;
            col += vec3(0.75, 0.80, 0.95) * s1 * mwDensity;
            col += vec3(0.85, 0.88, 1.00) * s2 * mwDensity * 0.8;
            col += vec3(1.00, 0.92, 0.78) * s3 * 0.5; // warm stars scattered
            col += vec3(0.90, 0.92, 1.00) * s4 * mwDensity * 0.6;

            // ── Filmic tone mapping — dark exposure like real astrophoto
            // Low exposure: blacks stay black, only brightest things show
            col = col * 1.8; // exposure
            col = col / (col + vec3(0.35)); // reinhard — prevents blowout
            col = pow(col, vec3(1.1)); // slight contrast lift

            // Clamp hard — no blown highlights
            col = clamp(col, vec3(0.0), vec3(0.85));

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });

      skyMesh = new THREE.Mesh(skyGeo, skyMat);
      scene.add(skyMesh);

      // ── Three layers of point stars in actual 3D space ────────────────
      // These are the BRIGHT stars you can clearly see
      // They move with parallax as camera rotates — true 3D depth

      function makeStars(count, spread, sizeMin, sizeMax, colorFn) {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
          // Random point on sphere shell at varying distances
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = spread * (0.5 + Math.random() * 0.5);
          positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);

          const c = colorFn();
          colors[i * 3]     = c[0];
          colors[i * 3 + 1] = c[1];
          colors[i * 3 + 2] = c[2];

          sizes[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        return geo;
      }

      // Star color functions — realistic spectral types
      const blueWhite = () => {
        const t = Math.random();
        if (t < 0.5) return [0.85 + Math.random()*0.15, 0.88 + Math.random()*0.12, 1.0];
        if (t < 0.75) return [1.0, 1.0, 1.0];
        if (t < 0.88) return [1.0, 0.95, 0.80];
        return [1.0, 0.72 + Math.random()*0.15, 0.45 + Math.random()*0.2];
      };

      const starShader = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vSize;
          void main() {
            vColor = color;
            vSize = size;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (400.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vSize;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.0, 0.42, d);
            alpha = pow(alpha, 2.2);
            gl_FragColor = vec4(vColor * 0.85, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
      });

      // Layer 1: Far mid-field stars (400 units away)
      const geo1 = makeStars(2500, 400, 0.8, 2.2, blueWhite);
      starPoints = new THREE.Points(geo1, starShader.clone());
      scene.add(starPoints);

      // Layer 2: Mid stars (200 units)
      const geo2 = makeStars(600, 200, 1.2, 3.2, blueWhite);
      starPoints2 = new THREE.Points(geo2, starShader.clone());
      scene.add(starPoints2);

      // Layer 3: Close bright stars (80 units) — most parallax
      const geo3 = makeStars(80, 80, 2.0, 5.5, blueWhite);
      starPoints3 = new THREE.Points(geo3, starShader.clone());
      scene.add(starPoints3);

      // ── Camera drift — cinematic spaceship movement ──────────────────
      // Camera stays at origin but ROTATES very slowly
      // This is how you get the 3D effect — the parallax between
      // the background sphere and the 3D point stars
      let t = 0;

      function animate() {
        animId = requestAnimationFrame(animate);
        t += 0.0003; // very slow

        // Update sky shader time
        skyMesh.material.uniforms.uTime.value = t * 1000;
        starPoints.material.uniforms.uTime.value = t * 1000;
        starPoints2.material.uniforms.uTime.value = t * 1000;
        starPoints3.material.uniforms.uTime.value = t * 1000;

        // Camera slowly rotates — like drifting through space on a ship
        // Compound multi-axis rotation = cinematic 3D floating feel
        camera.rotation.y = t * 0.8 + Math.sin(t * 0.3) * 0.15;
        camera.rotation.x = Math.sin(t * 0.22) * 0.06;
        camera.rotation.z = Math.sin(t * 0.17) * 0.025;

        renderer.render(scene, camera);
      }

      animate();
    }

    // ── Resize ───────────────────────────────────────────────────────────
    function onResize() {
      if (!renderer || !camera) return;
      const THREE = window.THREE;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (renderer && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
        renderer.dispose();
      }
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: '#000005',
      }}
    />
  );
}
