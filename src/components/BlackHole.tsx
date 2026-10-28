import { useEffect, useRef } from "react";

/**
 * Real-time Gargantua-style black hole. Each pixel fires a light ray that is bent
 * by the Schwarzschild photon equation (a = -1.5 h² r / |r|⁵), so the accretion disk
 * wraps over the top and under the bottom of the shadow, and the starfield lenses.
 */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 res;
uniform float time;
uniform vec2 look;
uniform float steps;

float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash2(i), hash2(i + vec2(1, 0)), f.x), mix(hash2(i + vec2(0, 1)), hash2(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.07; a *= 0.5; } return v; }

vec3 stars(vec3 d){
  vec3 col = vec3(0.0);
  for (int l = 0; l < 2; l++){
    float sc = l == 0 ? 90.0 : 220.0;
    vec3 q = d * sc;
    vec3 id = floor(q);
    float h = hash(id);
    if (h > 0.985){
      vec3 c = id + 0.5 + 0.35 * (vec3(hash(id + 1.3), hash(id + 2.7), hash(id + 4.1)) - 0.5);
      float dist = length(q - c);
      float b = smoothstep(0.35, 0.0, dist) * (h - 0.985) * 60.0;
      col += b * mix(vec3(1.0, 0.85, 0.7), vec3(0.75, 0.85, 1.0), hash(id + 9.0));
    }
  }
  // faint galactic band
  float band = exp(-pow(d.y * 3.2 + d.x * 0.6, 2.0)) * fbm(d.xz * 6.0) * 0.06;
  return col + vec3(0.9, 0.8, 0.7) * band;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * res) / res.y;
  // frame the hole up and to the right of the copy on wide screens
  float wide = clamp((res.x / res.y - 1.0) * 1.2, 0.0, 1.0);
  uv -= vec2(0.5, 0.03) * wide;
  // portrait: lift the hole into the top of the frame, above the copy
  float tall = clamp((res.y / res.x - 1.0) * 1.5, 0.0, 1.0);
  uv.y -= 0.3 * tall;

  float yaw = look.x * 0.25 + time * 0.012;
  float pitch = 0.075 + look.y * 0.05;
  vec3 ro = vec3(sin(yaw) * cos(pitch), sin(pitch), -cos(yaw) * cos(pitch)) * 16.0;
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 rd = normalize(fw * mix(mix(1.55, 2.4, wide), 1.05, tall) + uv.x * rt + uv.y * up);

  vec3 p = ro, v = rd;
  vec3 hv = cross(p, v);
  float h2 = dot(hv, hv);
  vec3 col = vec3(0.0);
  float alpha = 0.0;
  float minR = 100.0;
  bool captured = false;

  for (int i = 0; i < 400; i++){
    if (float(i) >= steps) break;
    float r = length(p);
    minR = min(minR, r);
    if (r < 1.0){ captured = true; break; }
    if (r > 30.0 && dot(p, v) > 0.0) break;
    float dt = clamp(0.06 * r, 0.03, 0.6);
    vec3 a = -1.5 * h2 * p / pow(r, 5.0);
    vec3 np = p + v * dt;
    // disk crossing (y = 0 plane)
    if (p.y * np.y < 0.0){
      vec3 hit = mix(p, np, p.y / (p.y - np.y));
      float rr = length(hit.xz);
      if (rr > 2.6 && rr < 13.0){
        float ang = atan(hit.z, hit.x);
        float swirl = ang + time * 0.35 / sqrt(rr) * 3.0;
        float bands = fbm(vec2(rr * 2.2, swirl * 2.0)) * 0.7 + fbm(vec2(rr * 7.0, swirl * 6.0)) * 0.3;
        float fall = smoothstep(2.6, 3.4, rr) * (1.0 - smoothstep(7.0, 13.0, rr));
        float temp = clamp(1.0 - (rr - 2.6) / 9.0, 0.0, 1.0);
        vec3 hot = mix(vec3(1.0, 0.42, 0.12), vec3(1.0, 0.82, 0.55), temp);
        hot = mix(hot, vec3(1.0, 0.97, 0.9), pow(temp, 3.0));
        // gentle beaming: approaching side a little brighter
        vec3 vel = normalize(vec3(-hit.z, 0.0, hit.x));
        float beam = 1.0 + 0.35 * dot(vel, -normalize(v));
        float dens = fall * (0.35 + 0.9 * bands);
        float a0 = clamp(dens * 0.9, 0.0, 1.0);
        col += (1.0 - alpha) * a0 * hot * (1.6 + 2.8 * temp) * beam;
        alpha += (1.0 - alpha) * a0;
        if (alpha > 0.98) break;
      }
    }
    v += a * dt;
    p = np;
  }

  if (!captured) col += (1.0 - alpha) * stars(normalize(v));
  // photon ring and soft glow
  col += vec3(1.0, 0.78, 0.5) * 0.045 / max(pow(minR - 1.45, 2.0), 0.02) * (captured ? 0.0 : 1.0) * 0.08;
  col += vec3(1.0, 0.7, 0.4) * 0.05 * exp(-length(uv) * 2.2);

  col = 1.0 - exp(-col * 1.1);           // filmic roll-off
  col = pow(col, vec3(0.92, 0.95, 1.0)); // warm grade
  float vig = smoothstep(1.25, 0.35, length((gl_FragCoord.xy / res - 0.5) * vec2(res.x / res.y, 1.0)));
  gl_FragColor = vec4(col * vig, 1.0);
}`;

export default function BlackHole({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "high-performance" });
    if (!gl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "res");
    const uTime = gl.getUniformLocation(prog, "time");
    const uLook = gl.getUniformLocation(prog, "look");
    const uSteps = gl.getUniformLocation(prog, "steps");

    // render below native resolution; the image is soft by nature and this keeps it smooth
    let scale = mobile ? 0.5 : 0.5;
    let steps = mobile ? 150 : 200;
    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      look.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      look.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    const start = performance.now();
    let last = start, slow = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      // adaptive quality: drop resolution if frames run long
      const ft = now - last;
      last = now;
      if (ft > 40 && ++slow > 20 && scale > 0.3) { scale -= 0.1; steps = Math.max(120, steps - 40); slow = 0; resize(); }
      look.x += (look.tx - look.x) * 0.03;
      look.y += (look.ty - look.y) * 0.03;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 20 : (now - start) / 1000);
      gl.uniform2f(uLook, look.x, look.y);
      gl.uniform1f(uSteps, steps);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (reduced) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" style={{ width: "100%", height: "100%", display: "block" }} />;
}
