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

          // ── Hash & noise ──────────────────────────────────────────────
          float hash(vec2 p) {
            p = fract(p * vec2(234.34, 435.345));
            p += dot(p, p + 34.23);
            return fract(p.x * p.y);
          }
          float hash3(vec3 p) {
            p = fract(p * vec3(443.8975, 397.2973, 491.1871));
            p += dot(p, p.yxz + 19.19);
            return fract(p.x * p.z);
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
          float fbm3(vec2 p) {
            float v = 0.0, a = 0.5;
            mat2 rot = mat2(cos(0.5), -sin(0.5), sin(0.5), cos(0.5));
            for (int i = 0; i < 8; i++) {
              v += a * noise(p);
              p = rot * p * 2.1 + vec2(3.1, 7.4);
              a *= 0.48;
            }
            return v;
          }

          // ── Spherical coords ──────────────────────────────────────────
          vec2 sphereUV(vec3 dir) {
            dir = normalize(dir);
            float lon = atan(dir.z, dir.x);
            float lat = asin(dir.y);
            return vec2(lon / (2.0 * 3.14159) + 0.5, lat / 3.14159 + 0.5);
          }

          void main() {
            vec3 dir = normalize(vPos);
            vec2 uv = sphereUV(dir);

            // ── Slow time drift ───────────────────────────────────────
            float t = uTime * 0.012;
            vec2 uvd = uv + vec2(t * 0.08, t * 0.03);

            // ── Base deep space black ─────────────────────────────────
            vec3 col = vec3(0.0, 0.0, 0.008);

            // ── Milky Way band ────────────────────────────────────────
            // Diagonal galactic plane band
            float band = dir.y * 0.6 - dir.x * 0.3 + dir.z * 0.2;
            float mwCore = exp(-band * band * 18.0); // tight core
            float mwHalo = exp(-band * band * 4.0);  // wide halo

            // Noise to break it up — dense star clouds
            float mwNoise = fbm(uv * vec2(6.0, 12.0) + vec2(t * 0.4, 0.0));
            float mwNoise2 = fbm3(uv * vec2(4.0, 8.0) + vec2(0.5, t * 0.3));

            // Milky Way colors:
            // Core: warm white/yellow-white (galactic bulge)
            // Halo: blue-white
            // Outer: faint blue
            vec3 mwCoreColor = vec3(0.92, 0.82, 0.65) * mwCore * mwNoise * 1.8;
            vec3 mwHaloColor = vec3(0.38, 0.52, 0.88) * mwHalo * mwNoise2 * 0.55;
            vec3 mwFaint = vec3(0.12, 0.18, 0.42) * mwHalo * 0.35;

            col += mwCoreColor + mwHaloColor + mwFaint;

            // ── Dark dust lanes cutting through the band ───────────────
            // (the black rifts you see in image 1)
            float dustLane1 = exp(-(band + 0.025) * (band + 0.025) * 600.0);
            float dustLane2 = exp(-(band - 0.018) * (band - 0.018) * 800.0);
            float dustNoise = fbm(uv * vec2(8.0, 20.0));
            col *= 1.0 - dustLane1 * dustNoise * 1.4;
            col *= 1.0 - dustLane2 * (1.0 - dustNoise) * 0.9;

            // ── Infrared dust clouds — reds/pinks (image 1 Spitzer) ────
            float rNoise = fbm3(uv * 3.5 + vec2(1.2, t * 0.15));
            float rNoise2 = fbm(uv * 2.0 + vec2(t * 0.1, 2.3));
            // Red/crimson dust blobs near galactic plane
            float redDust = mwHalo * rNoise * rNoise2;
            col += vec3(0.45, 0.04, 0.02) * redDust * 0.6;
            col += vec3(0.35, 0.08, 0.12) * mwHalo * fbm(uv * 5.0 + vec2(3.0, t * 0.2)) * 0.3;

            // ── Blue nebula regions ────────────────────────────────────
            float bNoise = fbm3(uv * 2.8 + vec2(t * 0.06, 1.7));
            float bNoise2 = fbm(uv * 1.5 + vec2(5.0, t * 0.08));
            col += vec3(0.02, 0.08, 0.35) * bNoise * bNoise2 * 0.5;
            // Cyan-teal wisps
            col += vec3(0.0, 0.18, 0.22) * fbm(uv * 4.0 + vec2(t * 0.05, 4.0)) * fbm3(uv * 3.0) * 0.4;

            // ── Faint purple/violet regions ────────────────────────────
            col += vec3(0.12, 0.02, 0.22) * fbm3(uv * 2.2 + vec2(6.0, t * 0.07)) * 0.3;

            // ── Green airglow near galactic horizon (image 2) ──────────
            float horizon = exp(-abs(dir.y + 0.15) * 8.0);
            col += vec3(0.02, 0.18, 0.08) * horizon * fbm(uv * 6.0 + vec2(t * 0.2, 0.0)) * 0.35;

            // ── Micro star field embedded in shader ────────────────────
            // These are the extremely faint background stars — billions of them
            // packed so dense they look like a haze
            float microStars = pow(hash(floor(uv * 1800.0)), 14.0);
            float microStars2 = pow(hash(floor(uv * 2600.0 + vec2(33.0, 71.0))), 18.0);
            float microStars3 = pow(hash(floor(uv * 800.0 + vec2(17.0, 53.0))), 10.0);
            col += vec3(0.8, 0.85, 1.0) * microStars * 1.8;
            col += vec3(0.9, 0.9, 1.0) * microStars2 * 1.2;
            col += vec3(1.0, 0.95, 0.85) * microStars3 * 0.6 * (0.5 + mwHalo * 0.5);

            // ── Tone mapping — make it feel like a real photo exposure ──
            // Filmic: lifts blacks slightly, compresses bright areas
            col = col / (col + vec3(0.18));
            col = pow(col, vec3(0.92)); // slight gamma lift

            // Keep it dark — space is BLACK
            col = clamp(col, vec3(0.0), vec3(1.0));

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
            // Soft circle — bright center fading out
            float alpha = 1.0 - smoothstep(0.0, 0.5, d);
            alpha = pow(alpha, 1.4);
            // Glow halo
            float glow = exp(-d * 6.0) * 0.35;
            gl_FragColor = vec4(vColor, alpha + glow);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
      });

      // Layer 1: Far mid-field stars (400 units away)
      const geo1 = makeStars(3000, 400, 1.2, 3.5, blueWhite);
      starPoints = new THREE.Points(geo1, starShader.clone());
      scene.add(starPoints);

      // Layer 2: Mid stars (200 units)
      const geo2 = makeStars(800, 200, 2.0, 5.5, blueWhite);
      starPoints2 = new THREE.Points(geo2, starShader.clone());
      scene.add(starPoints2);

      // Layer 3: Close bright stars (80 units) — most parallax
      const geo3 = makeStars(120, 80, 3.5, 9.0, blueWhite);
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
