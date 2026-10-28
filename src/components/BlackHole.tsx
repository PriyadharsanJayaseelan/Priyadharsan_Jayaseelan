import { useEffect, useRef } from "react";

/**
 * Gargantua-style black hole, split in two so it stays smooth on phones:
 *
 * 1. Bake (once per resize): every pixel's light ray is bent by the Schwarzschild
 *    photon equation (a = -1.5 h² r / |r|⁵). We record where it crosses the accretion
 *    disk (up to two crossings: the direct image and the lensed arc) and the lensed
 *    starlight behind it, packed into three RGBA8 textures.
 * 2. Per frame: look up those textures and only shade the spinning disk.
 *    No ray marching at runtime.
 */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const COMMON = `
precision highp float;
uniform vec2 res;
float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash2(i), hash2(i + vec2(1, 0)), f.x), mix(hash2(i + vec2(0, 1)), hash2(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.07; a *= 0.5; } return v; }
const float R_IN = 2.6;
const float R_OUT = 13.0;
`;

const BAKE = COMMON + `
uniform int mode; // 0: first disk hit, 1: second disk hit, 2: background stars + glow

vec3 stars(vec3 d){
  vec3 col = vec3(0.0);
  for (int l = 0; l < 2; l++){
    float sc = l == 0 ? 90.0 : 220.0;
    vec3 q = d * sc;
    vec3 id = floor(q);
    float h = hash(id);
    if (h > 0.985){
      vec3 c = id + 0.5 + 0.35 * (vec3(hash(id + 1.3), hash(id + 2.7), hash(id + 4.1)) - 0.5);
      float b = smoothstep(0.35, 0.0, length(q - c)) * (h - 0.985) * 60.0;
      col += b * mix(vec3(1.0, 0.85, 0.7), vec3(0.75, 0.85, 1.0), hash(id + 9.0));
    }
  }
  float band = exp(-pow(d.y * 3.2 + d.x * 0.6, 2.0)) * fbm(d.xz * 6.0) * 0.06;
  return col + vec3(0.9, 0.8, 0.7) * band;
}
vec2 enc16(float x){ x = clamp(x, 0.0, 0.99998); float hi = floor(x * 255.0) / 255.0; return vec2(hi, fract(x * 255.0)); }
vec4 encHit(float r, float ang){
  if (r <= 0.0) return vec4(0.0);
  return vec4(enc16((r - R_IN) / (R_OUT - R_IN) * 0.98 + 0.01), enc16(ang / 6.2831853 + 0.5));
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * res) / res.y;
  float wide = clamp((res.x / res.y - 1.0) * 1.2, 0.0, 1.0);
  float tall = clamp((res.y / res.x - 1.0) * 1.5, 0.0, 1.0);
  uv -= vec2(0.5, 0.03) * wide;
  uv.y -= 0.3 * tall;

  float pitch = 0.075;
  vec3 ro = vec3(0.0, sin(pitch), -cos(pitch)) * 16.0;
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 rd = normalize(fw * mix(mix(1.55, 2.4, wide), 1.05, tall) + uv.x * rt + uv.y * up);

  vec3 p = ro, v = rd;
  vec3 hv = cross(p, v);
  float h2 = dot(hv, hv);
  float r1 = 0.0, a1 = 0.0, r2 = 0.0, a2 = 0.0;
  int hits = 0;
  float minR = 100.0;
  bool captured = false;

  for (int i = 0; i < 360; i++){
    float r = length(p);
    minR = min(minR, r);
    if (r < 1.0){ captured = true; break; }
    if (r > 30.0 && dot(p, v) > 0.0) break;
    float dt = clamp(0.05 * r, 0.025, 0.6);
    vec3 np = p + v * dt;
    if (p.y * np.y < 0.0){
      vec3 hit = mix(p, np, p.y / (p.y - np.y));
      float rr = length(hit.xz);
      if (rr > R_IN && rr < R_OUT){
        float ang = atan(hit.z, hit.x);
        if (hits == 0){ r1 = rr; a1 = ang; } else if (hits == 1){ r2 = rr; a2 = ang; }
        hits++;
      }
    }
    v += -1.5 * h2 * p / pow(r, 5.0) * dt;
    p = np;
  }

  if (mode == 0) gl_FragColor = encHit(r1, a1);
  else if (mode == 1) gl_FragColor = encHit(r2, a2);
  else {
    vec3 bg = captured ? vec3(0.0) : stars(normalize(v));
    float glow = captured ? 0.0 : clamp(0.0036 / max(pow(minR - 1.45, 2.0), 0.02), 0.0, 1.0);
    gl_FragColor = vec4(clamp(bg / 4.0, 0.0, 1.0), glow);
  }
}`;

const SHADE = COMMON + `
uniform sampler2D t0;
uniform sampler2D t1;
uniform sampler2D t2;
uniform float time;

float dec16(vec2 v){ return v.x + v.y / 255.0; }

vec4 disk(vec4 e){
  float rn = dec16(e.rg);
  if (rn < 0.005) return vec4(0.0);
  float rr = R_IN + (rn - 0.01) / 0.98 * (R_OUT - R_IN);
  float ang = (dec16(e.ba) - 0.5) * 6.2831853;
  // Keplerian spin: inner orbits faster. Sample noise in the rotating disk plane
  // (periodic in angle, so no seam), stretched along the orbit into streaks.
  float sw = ang - time * 2.2 / pow(rr / 2.6, 1.5);
  vec2 c = vec2(cos(sw), sin(sw)) * rr;
  float bands = fbm(vec2(rr * 2.4, 0.0) + c * 0.55) * 0.65 + fbm(vec2(rr * 8.0, 3.0) + c * 1.6) * 0.35;
  float fall = smoothstep(R_IN, 3.4, rr) * (1.0 - smoothstep(7.0, R_OUT, rr));
  float temp = clamp(1.0 - (rr - R_IN) / 9.0, 0.0, 1.0);
  vec3 hot = mix(vec3(1.0, 0.42, 0.12), vec3(1.0, 0.82, 0.55), temp);
  hot = mix(hot, vec3(1.0, 0.97, 0.9), pow(temp, 3.0));
  float a = clamp(fall * (0.35 + 0.9 * bands) * 0.9, 0.0, 1.0);
  return vec4(hot * (1.6 + 2.8 * temp), a);
}

void main(){
  vec2 st = gl_FragCoord.xy / res;
  vec4 d1 = disk(texture2D(t0, st));
  vec4 d2 = disk(texture2D(t1, st));
  vec4 b = texture2D(t2, st);
  vec3 col = d1.rgb * d1.a + (1.0 - d1.a) * (d2.rgb * d2.a + (1.0 - d2.a) * b.rgb * 4.0);
  col += vec3(1.0, 0.78, 0.5) * b.a;
  vec2 uv = (gl_FragCoord.xy - 0.5 * res) / res.y;
  col += vec3(1.0, 0.7, 0.4) * 0.05 * exp(-length(uv) * 2.2);
  col = 1.0 - exp(-col * 1.1);
  col = pow(col, vec3(0.92, 0.95, 1.0));
  float vig = smoothstep(1.25, 0.35, length((st - 0.5) * vec2(res.x / res.y, 1.0)));
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
    const scale = mobile ? 0.6 : 0.75;

    const program = (frag: string) => {
      const mk = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };
      const pr = gl.createProgram()!;
      gl.attachShader(pr, mk(gl.VERTEX_SHADER, VERT));
      gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(pr, 0, "p");
      gl.linkProgram(pr);
      return gl.getProgramParameter(pr, gl.LINK_STATUS) ? pr : null;
    };
    const bake = program(BAKE);
    const shade = program(SHADE);
    if (!bake || !shade) return;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const targets = [0, 1, 2].map(() => ({ tex: gl.createTexture()!, fb: gl.createFramebuffer()! }));
    let w = 0, h = 0, baked = false;

    const doBake = () => {
      w = Math.max(1, Math.round(canvas.clientWidth * scale));
      h = Math.max(1, Math.round(canvas.clientHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.useProgram(bake);
      gl.uniform2f(gl.getUniformLocation(bake, "res"), w, h);
      targets.forEach((t, mode) => {
        gl.bindTexture(gl.TEXTURE_2D, t.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        // packed data: no filtering between texels
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0);
        gl.uniform1i(gl.getUniformLocation(bake, "mode"), mode);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      });
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(shade);
      gl.uniform2f(uRes, w, h);
      targets.forEach((t, k) => {
        gl.activeTexture(gl.TEXTURE0 + k);
        gl.bindTexture(gl.TEXTURE_2D, t.tex);
        gl.uniform1i(gl.getUniformLocation(shade, `t${k}`), k);
      });
      baked = true;
    };

    const uRes = gl.getUniformLocation(shade, "res");
    const uTime = gl.getUniformLocation(shade, "time");

    // re-bake only when the size really changes (mobile URL bars resize constantly)
    let pending = 0;
    let lastW = 0, lastH = 0;
    const ro = new ResizeObserver(() => {
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      if (Math.abs(cw - lastW) < 2 && Math.abs(ch - lastH) < 120 && baked) return;
      lastW = cw; lastH = ch;
      clearTimeout(pending);
      pending = window.setTimeout(() => { doBake(); if (reduced) draw(performance.now()); }, baked ? 250 : 0);
    });
    ro.observe(canvas);

    // mouse parallax is a cheap CSS move of the finished image
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      look.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      look.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const start = performance.now();
    let raf = 0;
    const draw = (now: number) => {
      if (!baked) return;
      gl.uniform1f(uTime, reduced ? 20 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      look.x += (look.tx - look.x) * 0.05;
      look.y += (look.ty - look.y) * 0.05;
      canvas.style.transform = `translate3d(${(-look.x * 14).toFixed(2)}px, ${(-look.y * 10).toFixed(2)}px, 0) scale(1.04)`;
      draw(now);
    };
    if (!reduced) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(pending);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" style={{ width: "100%", height: "100%", display: "block", willChange: "transform" }} />;
}
