import { useEffect, useRef } from "react";

/* ── Geometry ───────────────────────────────────────────────── */
type V3 = [number, number, number];

interface Crystal {
  verts: V3[];
  edges: [number, number][];
  faces: number[][];
  offset: V3;
  scale: number;
  tilt: V3; // fixed local rotation (x, y, z)
  spin: number; // local spin speed
}

/** Elongated hexagonal bipyramid: apex, upper ring, lower ring, apex. */
function makeCrystal(offset: V3, scale: number, tilt: V3, spin: number, height = 1.6): Crystal {
  const verts: V3[] = [[0, height, 0]];
  for (const y of [height * 0.38, -height * 0.38]) {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      verts.push([Math.cos(a) * 0.55, y, Math.sin(a) * 0.55]);
    }
  }
  verts.push([0, -height, 0]);
  const top = 0, bottom = 13;
  const ringA = (i: number) => 1 + (i % 6);
  const ringB = (i: number) => 7 + (i % 6);

  const edges: [number, number][] = [];
  const faces: number[][] = [];
  for (let i = 0; i < 6; i++) {
    edges.push([top, ringA(i)], [ringA(i), ringA(i + 1)], [ringA(i), ringB(i)], [ringB(i), ringB(i + 1)], [ringB(i), bottom]);
    faces.push([top, ringA(i + 1), ringA(i)]);
    faces.push([ringA(i), ringA(i + 1), ringB(i + 1), ringB(i)]);
    faces.push([bottom, ringB(i), ringB(i + 1)]);
  }
  return { verts, edges, faces, offset, scale, tilt, spin };
}

const CRYSTALS: Crystal[] = [
  makeCrystal([0, 0, 0], 1, [0.18, 0, -0.12], 0.25),
  makeCrystal([-1.05, -0.35, 0.35], 0.55, [0.5, 0.4, 0.55], -0.4, 1.4),
  makeCrystal([0.95, -0.55, -0.25], 0.62, [-0.35, 0.2, -0.6], 0.35, 1.5),
  makeCrystal([0.55, 0.85, 0.6], 0.32, [0.9, 0.1, 0.4], 0.6, 1.3),
];

/** Vertices the HUD leader lines attach to: [crystal index, vertex index]. */
export const ANCHOR_VERTS: [number, number][] = [
  [0, 0],   // main apex
  [3, 13],  // small floating crystal
  [1, 13],  // left crystal base
  [2, 4],   // right crystal ring
];

/* ── Math ───────────────────────────────────────────────────── */
function rotate([x, y, z]: V3, rx: number, ry: number, rz: number): V3 {
  let c = Math.cos(rx), s = Math.sin(rx);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(ry); s = Math.sin(ry);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(rz); s = Math.sin(rz);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x, y, z];
}

const CYAN = [92, 225, 230];
const VIOLET = [139, 124, 246];
const mix = (t: number) =>
  CYAN.map((c, i) => Math.round(c + (VIOLET[i] - c) * t)).join(",");

/* ── Component ──────────────────────────────────────────────── */
interface Props {
  /** Elements the leader lines should reach, in ANCHOR_VERTS order. */
  targets?: React.RefObject<HTMLElement>[];
  className?: string;
}

export default function HoloCrystal({ targets = [], className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1;
    let anchors: { x: number; y: number; side: number }[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let running = true;
    const start = performance.now();

    const measure = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width; h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      anchors = targets.map((t) => {
        const el = t.current;
        if (!el || el.offsetParent === null) return { x: NaN, y: NaN, side: 0 };
        const er = el.getBoundingClientRect();
        const cx = er.left + er.width / 2 - r.left;
        const side = cx < w / 2 ? 1 : -1; // panel on left → line leaves its right edge
        return {
          x: side === 1 ? er.right - r.left : er.left - r.left,
          y: er.top + Math.min(26, er.height / 2) - r.top,
          side,
        };
      });
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };

    // ambient particles
    const particles = Array.from({ length: 46 }, () => ({
      x: Math.random(), y: Math.random(), z: Math.random(),
      v: 0.02 + Math.random() * 0.05,
    }));

    const draw = (now: number) => {
      const t = reduced ? 1.2 : (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const size = Math.min(w, h);
      const S = size * 0.27;
      const D = 5.5;
      const cx = w / 2, cy = h / 2;
      const yaw = t * 0.18 + mouse.x * 0.7;
      const pitch = -0.18 + mouse.y * 0.35;

      // floor glow
      const g = ctx.createRadialGradient(cx, cy + S * 1.55, 0, cx, cy + S * 1.55, S * 1.8);
      g.addColorStop(0, "rgba(92,225,230,0.16)");
      g.addColorStop(1, "rgba(92,225,230,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, cy + S * 1.55, S * 1.8, S * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();

      // particles
      for (const p of particles) {
        if (!reduced) p.y -= p.v * 0.004;
        if (p.y < 0) { p.y = 1; p.x = Math.random(); }
        ctx.fillStyle = `rgba(${mix(p.z)},${0.15 + p.z * 0.35})`;
        ctx.fillRect(p.x * w, p.y * h, 1 + p.z, 1 + p.z);
      }

      // project every crystal
      const projected = CRYSTALS.map((c, ci) => {
        const local = t * c.spin;
        const bob = reduced ? 0 : Math.sin(t * 0.9 + ci * 1.7) * 0.06;
        return c.verts.map((v) => {
          let p = rotate([v[0] * c.scale, v[1] * c.scale, v[2] * c.scale], c.tilt[0], c.tilt[1] + local, c.tilt[2]);
          p = [p[0] + c.offset[0], p[1] + c.offset[1] + bob, p[2] + c.offset[2]];
          p = rotate(p, pitch, yaw, 0);
          const k = D / (D + p[2]);
          return { x: cx + p[0] * S * k, y: cy - p[1] * S * k, z: p[2], k };
        });
      });

      // depth-sort crystals back to front
      const order = CRYSTALS.map((_, i) => i).sort((a, b) => {
        const za = projected[a].reduce((s, p) => s + p.z, 0) / projected[a].length;
        const zb = projected[b].reduce((s, p) => s + p.z, 0) / projected[b].length;
        return zb - za;
      });

      ctx.globalCompositeOperation = "lighter";
      for (const ci of order) {
        const c = CRYSTALS[ci];
        const P = projected[ci];

        // glassy faces
        for (const f of c.faces) {
          const a = P[f[0]], b = P[f[1]], d = P[f[2]];
          const cross = (b.x - a.x) * (d.y - a.y) - (b.y - a.y) * (d.x - a.x);
          if (cross <= 0) continue;
          const depth = Math.min(Math.max((f.reduce((s, i) => s + P[i].z, 0) / f.length + 1.5) / 3, 0), 1);
          ctx.fillStyle = `rgba(${mix(depth)},${0.035 + (1 - depth) * 0.06})`;
          ctx.beginPath();
          f.forEach((i, n) => (n ? ctx.lineTo(P[i].x, P[i].y) : ctx.moveTo(P[i].x, P[i].y)));
          ctx.closePath();
          ctx.fill();
        }

        // edges: soft glow pass + crisp pass
        for (const pass of [0, 1]) {
          for (const [i, j] of c.edges) {
            const a = P[i], b = P[j];
            const depth = Math.min(Math.max(((a.z + b.z) / 2 + 1.5) / 3, 0), 1);
            ctx.strokeStyle = `rgba(${mix(depth)},${pass ? 0.55 + (1 - depth) * 0.45 : 0.1})`;
            ctx.lineWidth = pass ? 1.1 * a.k : 5 * a.k;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // vertices
        for (const p of P) {
          ctx.fillStyle = "rgba(230,241,255,0.85)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.4 * p.k, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // leader lines to HUD panels
      ctx.globalCompositeOperation = "source-over";
      ctx.setLineDash([3, 4]);
      ctx.lineDashOffset = reduced ? 0 : -t * 12;
      ANCHOR_VERTS.forEach(([ci, vi], n) => {
        const a = anchors[n];
        if (!a || Number.isNaN(a.x)) return;
        const v = projected[ci][vi];
        const elbowX = a.x + a.side * Math.min(36, Math.abs(v.x - a.x) * 0.3);
        ctx.strokeStyle = "rgba(92,225,230,0.55)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(elbowX, a.y);
        ctx.lineTo(v.x, v.y);
        ctx.stroke();
        ctx.setLineDash([]);
        for (const [x, y, r] of [[a.x, a.y, 2.5], [v.x, v.y, 3.5]] as const) {
          ctx.fillStyle = "#5CE1E6";
          ctx.shadowColor = "#5CE1E6";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.setLineDash([3, 4]);
      });
      ctx.setLineDash([]);

      if (running && !reduced) raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => { measure(); if (reduced || !running) draw(performance.now()); });
    ro.observe(wrap);
    targets.forEach((t) => t.current && ro.observe(t.current));

    const io = new IntersectionObserver(([e]) => {
      const was = running;
      running = e.isIntersecting;
      if (running && !was && !reduced) raf = requestAnimationFrame(draw);
    });
    io.observe(wrap);

    window.addEventListener("pointermove", onMove, { passive: true });
    measure();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [targets]);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
    </div>
  );
}
