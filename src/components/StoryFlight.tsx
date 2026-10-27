import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { openEmailPicker } from "./EmailPicker";

/* ── Places ─────────────────────────────────────────────────── */
type LL = [number, number]; // [lat, lon]
const TAMIL_NADU: LL = [11.1, 78.6];
const CHENNAI: LL = [12.99, 80.17];
const CLEVELAND: LL = [41.41, -81.85];
const KENT: LL = [41.15, -81.36];
const PITTSBURGH: LL = [40.44, -79.99];
const RALEIGH: LL = [35.78, -78.64];

/* ── Script ─────────────────────────────────────────────────── */
type Kind = "home" | "flight" | "ping" | "link" | "outro";
interface Chapter {
  kind: Kind;
  date: string;
  title: string;
  line: string;
  at: LL;
  dist: number;
  dur: number;
  to?: LL;
  place: string;
}

const CHAPTERS: Chapter[] = [
  { kind: "home", date: "Tamil Nadu, India", title: "Where it starts.", line: "Grew up curious about how things work, and how they break.", at: TAMIL_NADU, dist: 2.1, dur: 6000, place: "Tamil Nadu, IN" },
  { kind: "flight", date: "August 2023", title: "Chennai to Cleveland.", line: "Eighteen, one suitcase, and a Global Scholarship to Kent State.", at: CHENNAI, to: CLEVELAND, dist: 2.3, dur: 12000, place: "In flight" },
  { kind: "ping", date: "January 2024", title: "Alpha Lambda Delta.", line: "National honor society, for a 3.5+ GPA in my first year.", at: KENT, dist: 1.55, dur: 6000, place: "Kent, OH" },
  { kind: "ping", date: "August 2024", title: "First paycheck.", line: "Kent State dining. Where I learned how real operations run.", at: KENT, dist: 1.5, dur: 6000, place: "Kent, OH" },
  { kind: "ping", date: "Spring 2025", title: "Into the research lab.", line: "Ran VR and haptic IV-needle studies: 50+ students, 5,000+ responses.", at: KENT, dist: 1.45, dur: 6500, place: "Kent, OH" },
  { kind: "ping", date: "2025", title: "Leading 200+ people.", line: "Lead student operations coordinator. No-shows down 30%.", at: KENT, dist: 1.5, dur: 6000, place: "Kent, OH" },
  { kind: "ping", date: "Fall 2025", title: "Shipped RollCall.", line: "Built the event system for an ROTC attendance app, from a blank file.", at: KENT, dist: 1.45, dur: 6000, place: "Kent, OH" },
  { kind: "link", date: "January 2026", title: "First dev internship.", line: "StreetStashed, remote to Pittsburgh. Fixed their broken marketplace search.", at: KENT, to: PITTSBURGH, dist: 1.4, dur: 7000, place: "Uplink: Pittsburgh, PA" },
  { kind: "link", date: "May 2026", title: "Federal software QA.", line: "Pivotal ITS, remote to North Carolina. Caught a privilege-escalation bug before it shipped.", at: KENT, to: RALEIGH, dist: 1.55, dur: 8000, place: "Uplink: Raleigh, NC" },
  { kind: "outro", date: "Next destination", title: "Your team.", line: "Graduating May 2027. Open to new-grad and internship roles.", at: KENT, dist: 3.3, dur: 999999, place: "Kent, OH" },
];

/* ── Geo math (matches three.js SphereGeometry UVs) ─────────── */
const DEG = Math.PI / 180;
function ll2v([lat, lon]: LL, r = 1) {
  const u = (lon + 180) / 360;
  const v = (90 - lat) / 180;
  return new THREE.Vector3(
    -Math.cos(u * 2 * Math.PI) * Math.sin(v * Math.PI) * r,
    Math.cos(v * Math.PI) * r,
    Math.sin(u * 2 * Math.PI) * Math.sin(v * Math.PI) * r
  );
}
function v2ll(p: THREE.Vector3): LL {
  const n = p.clone().normalize();
  const lat = Math.asin(n.y) / DEG;
  let lon = Math.atan2(n.z, -n.x) / DEG - 180;
  if (lon < -180) lon += 360;
  return [lat, lon];
}
function slerp(a: THREE.Vector3, b: THREE.Vector3, t: number) {
  const om = a.angleTo(b);
  const s = Math.sin(om);
  return a.clone().multiplyScalar(Math.sin((1 - t) * om) / s).add(b.clone().multiplyScalar(Math.sin(t * om) / s));
}
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerpLon = (a: number, b: number, t: number) => {
  let d = b - a;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return a + d * t;
};
function fmtLL([lat, lon]: LL) {
  return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}  ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`;
}
function arcPoints(a: LL, b: LL, lift: number, n = 220) {
  const va = ll2v(a), vb = ll2v(b);
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return slerp(va, vb, t).multiplyScalar(1 + lift * Math.sin(Math.PI * t));
  });
}

/* ── Shaders ────────────────────────────────────────────────── */
const earthVert = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vPos;
  void main() {
    vUv = uv;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`;
const earthFrag = /* glsl */ `
  uniform sampler2D dayMap; uniform sampler2D nightMap; uniform sampler2D waterMap;
  uniform vec3 sunDir;
  varying vec2 vUv; varying vec3 vN; varying vec3 vPos;
  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vPos);
    float d = dot(N, sunDir);
    vec3 day = texture2D(dayMap, vUv).rgb;
    vec3 night = texture2D(nightMap, vUv).rgb;
    float water = texture2D(waterMap, vUv).r;
    float lit = smoothstep(-0.08, 0.35, d);
    vec3 col = day * (0.015 + 1.35 * max(d, 0.0)) * lit;
    // city lights only where it's dark
    col += night * vec3(1.0, 0.78, 0.5) * 2.4 * (1.0 - smoothstep(-0.2, 0.08, d));
    // sun glint on oceans
    vec3 H = normalize(sunDir + V);
    col += vec3(1.0, 0.92, 0.8) * pow(max(dot(N, H), 0.0), 900.0) * water * 0.22 * lit;
    // warm terminator + blue limb
    col += vec3(1.0, 0.5, 0.25) * 0.025 * (1.0 - smoothstep(0.0, 0.08, abs(d))) * (1.0 - water * 0.7);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    col += vec3(0.35, 0.6, 1.0) * fres * 0.75 * smoothstep(-0.25, 0.5, d);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;
const atmoVert = /* glsl */ `
  varying vec3 vN; varying vec3 vPos;
  void main() {
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`;
const atmoFrag = /* glsl */ `
  uniform vec3 sunDir;
  varying vec3 vN; varying vec3 vPos;
  void main() {
    vec3 V = normalize(cameraPosition - vPos);
    float edge = 1.0 - abs(dot(normalize(vN), V));
    float glow = pow(edge, 4.5);
    float sun = smoothstep(-0.35, 0.45, dot(normalize(vN), sunDir));
    gl_FragColor = vec4(vec3(0.3, 0.58, 1.0) * glow * (0.25 + 1.4 * sun), 1.0);
  }`;

/* ── Component ──────────────────────────────────────────────── */
export default function StoryFlight({ onClose }: { onClose: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(0); // 0..1
  const [ready, setReady] = useState(false);
  const [titleCard, setTitleCard] = useState(true);
  const [chapter, setChapter] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [bars, setBars] = useState(false);

  // refs shared with the render loop
  const chapterRef = useRef(0);
  const elapsedRef = useRef(0);
  const playingRef = useRef(true);
  const startedRef = useRef(false);
  const jumpRef = useRef<number | null>(null);
  const hud = {
    coords: useRef<HTMLSpanElement>(null),
    alt: useRef<HTMLSpanElement>(null),
    spd: useRef<HTMLSpanElement>(null),
    dist: useRef<HTMLSpanElement>(null),
    fill: useRef<HTMLDivElement>(null),
  };

  const go = useCallback((i: number) => {
    const n = Math.max(0, Math.min(CHAPTERS.length - 1, i));
    jumpRef.current = n;
  }, []);
  const togglePlay = useCallback(() => {
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  }, []);

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(chapterRef.current + 1);
      else if (e.key === "ArrowLeft") go(chapterRef.current - 1);
      else if (e.key === " ") { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, go, togglePlay]);

  /* three.js scene */
  useEffect(() => {
    const mount = mountRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, mount.clientWidth / mount.clientHeight, 0.01, 200);

    /* textures */
    const base = import.meta.env.BASE_URL + "earth/";
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_u, l, t) => setLoaded(l / t);
    manager.onLoad = () => setReady(true);
    const loader = new THREE.TextureLoader(manager);
    const tex = (f: string, srgb: boolean) => {
      const t = loader.load(base + f);
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return t;
    };
    const dayMap = tex("earth-blue-marble.jpg", true);
    const nightMap = tex("earth-night.jpg", true);
    const waterMap = tex("earth-water.png", false);

    const sunDir = new THREE.Vector3(1, 0.3, 0.5).normalize();
    const earthMat = new THREE.ShaderMaterial({
      uniforms: { dayMap: { value: dayMap }, nightMap: { value: nightMap }, waterMap: { value: waterMap }, sunDir: { value: sunDir } },
      vertexShader: earthVert,
      fragmentShader: earthFrag,
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 160, 160), earthMat);
    scene.add(earth);

    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.06, 96, 96),
      new THREE.ShaderMaterial({
        uniforms: { sunDir: { value: sunDir } },
        vertexShader: atmoVert,
        fragmentShader: atmoFrag,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
    );
    scene.add(atmo);

    /* stars */
    {
      const n = 2600, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const v = new THREE.Vector3().randomDirection().multiplyScalar(60 + Math.random() * 20);
        pos.set([v.x, v.y, v.z], i * 3);
        const b = 0.25 + Math.pow(Math.random(), 3) * 0.75;
        col.set([b, b, b * (0.9 + Math.random() * 0.2)], i * 3);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      g.setAttribute("color", new THREE.BufferAttribute(col, 3));
      scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 1.3, sizeAttenuation: false, vertexColors: true })));
    }

    /* markers */
    const AMBER = new THREE.Color("#FFB547");
    const CYAN = new THREE.Color("#5CE1E6");
    const group = new THREE.Group();
    scene.add(group);

    function marker(ll: LL, color: THREE.Color) {
      const g = new THREE.Group();
      const p = ll2v(ll, 1.0015);
      g.position.copy(p);
      g.lookAt(p.clone().multiplyScalar(2));
      const dot = new THREE.Mesh(new THREE.CircleGeometry(0.0035, 24), new THREE.MeshBasicMaterial({ color, transparent: true }));
      const rings = [0, 1, 2].map(() => {
        const r = new THREE.Mesh(
          new THREE.RingGeometry(0.9, 1, 64),
          new THREE.MeshBasicMaterial({ color, transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        g.add(r);
        return r;
      });
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0006, 0.0018, 0.05, 12, 1, true),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      beam.rotation.x = Math.PI / 2;
      beam.position.z = 0.025;
      g.add(dot, beam);
      g.visible = false;
      group.add(g);
      return {
        g,
        tick(t: number, strength = 1) {
          g.scale.setScalar(Math.max(0.5, camera.position.length() - 1) / 0.6);
          rings.forEach((r, i) => {
            const k = (t * 0.55 + i / 3) % 1;
            r.scale.setScalar(0.004 + k * 0.022);
            (r.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.9 * strength;
          });
          (beam.material as THREE.MeshBasicMaterial).opacity = 0.35 + 0.25 * Math.sin(t * 3);
        },
      };
    }
    const mHome = marker(CHENNAI, AMBER);
    const mKent = marker(KENT, AMBER);
    const mPit = marker(PITTSBURGH, CYAN);
    const mRal = marker(RALEIGH, CYAN);

    function arc(a: LL, b: LL, lift: number, color: THREE.Color, opacity: number) {
      const pts = arcPoints(a, b, lift);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      geo.setDrawRange(0, 0);
      const glow = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
      group.add(glow);
      return { pts, geo, line: glow };
    }
    const flightArc = arc(CHENNAI, CLEVELAND, 0.09, AMBER, 0.95);
    const pitArc = arc(KENT, PITTSBURGH, 0.004, CYAN, 0.95);
    const ralArc = arc(KENT, RALEIGH, 0.012, CYAN, 0.95);

    /* aircraft */
    const shape = new THREE.Shape();
    [[0, 1], [0.12, 0.35], [0.95, -0.05], [0.95, -0.2], [0.12, 0.05], [0.1, -0.55], [0.38, -0.8], [0.38, -0.92], [0, -0.82], [-0.38, -0.92], [-0.38, -0.8], [-0.1, -0.55], [-0.12, 0.05], [-0.95, -0.2], [-0.95, -0.05], [-0.12, 0.35]].forEach(
      ([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y))
    );
    const plane = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: AMBER, side: THREE.DoubleSide }));
    plane.scale.setScalar(0.022);
    plane.visible = false;
    scene.add(plane);
    const basis = new THREE.Matrix4();

    /* camera state */
    const cam = { lat: CHAPTERS[0].at[0] - 20, lon: CHAPTERS[0].at[1] - 30, dist: 4.2 };
    let from = { ...cam };
    let tweenT = 0;

    function placeCamera(lat: number, lon: number, rawDist: number) {
      // portrait screens need more distance to fit the same view
      const a = camera.aspect;
      const dist = a < 1 ? 1 + (rawDist - 1) * (1 + (1 - a) * 1.1) : rawDist;
      const tilt = 14 * THREE.MathUtils.clamp((3.2 - dist) / 1.8, 0, 1);
      const pos = ll2v([lat - tilt, lon], dist);
      const target = ll2v([lat, lon], THREE.MathUtils.clamp((3.4 - dist) / 1.2, 0, 1));
      camera.position.copy(pos);
      camera.up.set(0, 1, 0);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      // sun stays behind-left of the camera so the frame always holds day, dusk and city lights
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      const back = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 2);
      sunDir.copy(right.multiplyScalar(-0.95).add(up.multiplyScalar(0.35)).add(back.multiplyScalar(0.55))).normalize();
    }

    function enterChapter(i: number) {
      chapterRef.current = i;
      elapsedRef.current = 0;
      setChapter(i);
      from = { ...cam };
      tweenT = reduced ? 1 : 0;
      const c = CHAPTERS[i];
      mHome.g.visible = i <= 1;
      mKent.g.visible = i >= 1;
      mPit.g.visible = i >= 7;
      mRal.g.visible = i >= 8;
      flightArc.geo.setDrawRange(0, i > 1 ? flightArc.pts.length : 0);
      pitArc.geo.setDrawRange(0, i > 7 ? pitArc.pts.length : 0);
      ralArc.geo.setDrawRange(0, i > 8 ? ralArc.pts.length : 0);
      plane.visible = c.kind === "flight";
    }

    /* resize */
    const onResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let last = performance.now();
    const clockStart = last;
    enterChapter(0);

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.25);
      last = now;
      const t = (now - clockStart) / 1000;

      if (jumpRef.current !== null) {
        enterChapter(jumpRef.current);
        jumpRef.current = null;
      }

      const i = chapterRef.current;
      const c = CHAPTERS[i];
      if (startedRef.current && playingRef.current) {
        elapsedRef.current += dt * 1000;
        if (elapsedRef.current >= c.dur && i < CHAPTERS.length - 1) enterChapter(i + 1);
      }
      const p = Math.min(elapsedRef.current / c.dur, 1);
      if (hud.fill.current) hud.fill.current.style.width = `${(c.kind === "outro" ? 1 : p) * 100}%`;

      // camera target for this chapter
      let target = { lat: c.at[0], lon: c.at[1], dist: c.dist };
      let readLL: LL = c.at;
      let alt = 0, spd = 0, remain = 0;

      if (c.kind === "flight") {
        const fp = ease(THREE.MathUtils.clamp((p - 0.06) / 0.88, 0, 1));
        const idx = Math.min(Math.floor(fp * (flightArc.pts.length - 1)), flightArc.pts.length - 2);
        flightArc.geo.setDrawRange(0, idx + 2);
        const a = flightArc.pts[idx], b = flightArc.pts[idx + 1];
        plane.position.copy(a);
        const upv = a.clone().normalize();
        const fwd = b.clone().sub(a).normalize();
        const rightv = fwd.clone().cross(upv).normalize();
        basis.makeBasis(rightv, fwd, upv);
        plane.quaternion.setFromRotationMatrix(basis);
        readLL = v2ll(a);
        const climb = THREE.MathUtils.smoothstep(fp, 0, 0.12) * (1 - THREE.MathUtils.smoothstep(fp, 0.86, 1));
        alt = Math.round(38000 * climb / 100) * 100;
        spd = Math.round(160 + 326 * climb);
        remain = Math.round(13870 * (1 - fp));
        target = { lat: readLL[0], lon: readLL[1], dist: 2.05 + 1.1 * Math.sin(Math.PI * fp) };
      } else if (c.kind === "link" && c.to) {
        const arcObj = c.to === PITTSBURGH ? pitArc : ralArc;
        const lp = ease(THREE.MathUtils.clamp((p - 0.15) / 0.5, 0, 1));
        arcObj.geo.setDrawRange(0, Math.max(2, Math.floor(lp * arcObj.pts.length)));
        const mid = v2ll(slerp(ll2v(c.at), ll2v(c.to), 0.62));
        mid[0] -= 2.5;
        target = { lat: mid[0], lon: mid[1], dist: c.dist };
        readLL = c.to;
      }

      // ease camera from previous framing toward the target
      if (tweenT < 1) tweenT = Math.min(1, tweenT + dt / (c.kind === "flight" ? 1.6 : 2.6));
      const k = c.kind === "flight" && tweenT >= 1 ? 1 : ease(tweenT);
      const drift = reduced ? 0 : Math.sin(t * 0.15) * 0.6;
      cam.lat = THREE.MathUtils.lerp(from.lat, target.lat, k);
      cam.lon = lerpLon(from.lon, target.lon, k);
      cam.dist = THREE.MathUtils.lerp(from.dist, target.dist, k);
      if (c.kind !== "flight" && tweenT >= 1) {
        // slow handheld drift once settled
        placeCamera(cam.lat + drift * 0.6, cam.lon + drift, cam.dist - (reduced ? 0 : p * 0.08));
      } else {
        placeCamera(cam.lat, cam.lon, cam.dist);
      }

      // markers
      mHome.tick(t, i <= 1 ? 1 : 0.4);
      mKent.tick(t + 0.3, i === 1 ? p : 1);
      mPit.tick(t + 0.6);
      mRal.tick(t + 0.9);

      // HUD
      if (hud.coords.current) hud.coords.current.textContent = fmtLL(readLL);
      if (hud.alt.current) hud.alt.current.textContent = c.kind === "flight" ? `${alt.toLocaleString()} ft` : "On ground";
      if (hud.spd.current) hud.spd.current.textContent = c.kind === "flight" ? `${spd} kt` : "–";
      if (hud.dist.current) hud.dist.current.textContent = c.kind === "flight" ? `${remain.toLocaleString()} km to go` : c.place;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      [dayMap, nightMap, waterMap].forEach((x) => x.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* title card → start */
  useEffect(() => {
    if (!ready) return;
    setBars(true);
    const a = setTimeout(() => setTitleCard(false), 3200);
    const b = setTimeout(() => (startedRef.current = true), 3600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [ready]);

  const c = CHAPTERS[chapter];
  const last = chapter === CHAPTERS.length - 1;

  return (
    <div className="flight-root">
      {/* WebGL stage; tap left/right thirds to step */}
      <div ref={mountRef} className="absolute inset-0" />
      <div
        className="absolute inset-0 z-[1]"
        onClick={(e) => {
          if (!startedRef.current || last) return;
          const x = e.clientX / window.innerWidth;
          if (x < 0.3) go(chapter - 1);
          else if (x > 0.7) go(chapter + 1);
        }}
      />
      <div className="flight-vignette" aria-hidden />
      <div className="flight-grain" aria-hidden />

      {/* letterbox */}
      <div className={`flight-bar top-0 ${bars ? "on" : ""}`} />
      <div className={`flight-bar bottom-0 ${bars ? "on" : ""}`} />

      {/* radar HUD */}
      <div className={`flight-hud ${titleCard ? "" : "on"}`}>
        <div className="flight-hud-row"><span className="k">Flight</span><span>PJ 2023</span></div>
        <div className="flight-hud-row"><span className="k">Position</span><span ref={hud.coords}>–</span></div>
        <div className="flight-hud-row"><span className="k">Altitude</span><span ref={hud.alt}>–</span></div>
        <div className="flight-hud-row"><span className="k">Speed</span><span ref={hud.spd}>–</span></div>
        <div className="flight-hud-row"><span className="k">Status</span><span ref={hud.dist}>–</span></div>
      </div>
      <div className={`flight-radar ${titleCard ? "" : "on"}`} aria-hidden>
        <div className="sweep" />
        <span className="blip" />
      </div>

      {/* subtitles */}
      {!titleCard && (
        <div key={chapter} className="flight-sub">
          <div className="date">{c.date}</div>
          <h2>{c.title}</h2>
          <p>{c.line}</p>
          {last && (
            <div className="flex flex-wrap justify-center gap-3 mt-7 pointer-events-auto">
              <button className="btn-primary" onClick={() => { onClose(); setTimeout(openEmailPicker, 350); }}>Email me</button>
              <button className="btn-ghost" onClick={() => go(0)}>Watch again</button>
              <button className="btn-ghost" onClick={onClose}>Back to site</button>
            </div>
          )}
        </div>
      )}

      {/* title card */}
      <div className={`flight-title ${titleCard ? "" : "off"}`}>
        {ready ? (
          <>
            <div className="eyebrow">Priyadharsan Jayaseelan</div>
            <h1>The flight log</h1>
          </>
        ) : (
          <>
            <div className="eyebrow">Acquiring satellite imagery</div>
            <div className="flight-load"><span style={{ width: `${Math.round(loaded * 100)}%` }} /></div>
          </>
        )}
      </div>

      {/* transport controls in the bottom bar */}
      <div className={`flight-controls ${titleCard ? "" : "on"}`}>
        <div className="flight-timeline">
          {CHAPTERS.map((ch, i) => (
            <button
              key={i}
              aria-label={`Chapter ${i + 1}: ${ch.title}`}
              onClick={() => go(i)}
              className={`seg ${i < chapter ? "done" : ""} ${i === chapter ? "now" : ""}`}
              style={{ flex: ch.kind === "flight" ? 2 : 1 }}
            >
              <span>{i === chapter && <i ref={hud.fill} />}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button className="flight-btn" aria-label="Previous chapter" onClick={() => go(chapter - 1)}>
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="flight-btn" aria-label={playing ? "Pause" : "Play"} onClick={togglePlay}>
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M5 3l8 5-8 5z" fill="currentColor" /></svg>
            )}
          </button>
          <button className="flight-btn" aria-label="Next chapter" onClick={() => go(chapter + 1)}>
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="flight-btn" aria-label="Close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 12 12"><path d="M1 1l10 10M11 1 1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
