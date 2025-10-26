import React, { useRef, useEffect } from "react";

/**
 * GalaxyBackground
 *
 * - Uses complex dynamics (z -> z^2 + c(t)) to compute a velocity field.
 * - Particles move according to that field, producing swirling, galaxy-like patterns.
 * - Additive blending and alpha trails create glow and smooth motion.
 *
 * Props:
 *  - numParticles (int) : how many particles (default 1200)
 *  - speed (float)       : global speed multiplier (default 0.6)
 *  - color (string)      : base color for particles (default "#a7f3d0")
 *  - bgFade (float)      : trailing fade (0..1) larger -> longer trails (default 0.08)
 */
export default function GalaxyBackground({
  numParticles = 1200,
  speed = 0.6,
  color = "#9be7ff",
  bgFade = 0.08,
}) {
  const ref = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // DPI scaling
    const DPR = Math.max(window.devicePixelRatio || 1, 1);
    function resize() {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles around center with small radius distribution
    const W = canvas.width / DPR;
    const H = canvas.height / DPR;
    const cx = W / 2;
    const cy = H / 2;

    particlesRef.current = new Array(numParticles).fill(0).map(() => {
      // start in a disk near center
      const r = Math.random() * Math.min(W, H) * 0.08 + Math.random() * 2;
      const a = Math.random() * Math.PI * 2;
      return {
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        vx: 0,
        vy: 0,
        life: Math.random() * 100, // for variety
        size: Math.random() * 1.8 + 0.6,
      };
    });

    // helper: complex multiply z*z
    function complexSquare(x, y) {
      return { x: x * x - y * y, y: 2 * x * y };
    }

    let last = performance.now();

    // Animation loop
    function frame(now) {
      const dt = Math.min((now - last) / 16.6667, 4); // normalize to ~60fps steps
      last = now;

      const W = canvas.width / DPR;
      const H = canvas.height / DPR;
      const cx = W / 2;
      const cy = H / 2;

      // Slowly fade canvas to create trails.
      // bgFade close to 0 -> short trails; closer to 1 -> very long trails.
      ctx.fillStyle = `rgba(4,6,15,${bgFade})`;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillRect(0, 0, W, H);

      // Use additive blending for glow
      ctx.globalCompositeOperation = "lighter";

      // rotating complex constant c(t) produces evolving patterns
      const t = now * 0.0003; // time scale
      // choose a circular path in complex plane for c
      const cRe = 0.285 * Math.cos(t * 0.7);
      const cIm = 0.285 * Math.sin(t * 0.9);

      // draw particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // map screen coordinate to small complex plane around center
        const zx = (p.x - cx) / Math.min(W, H) * 3; // scale factor controls zoom
        const zy = (p.y - cy) / Math.min(W, H) * 3;

        // complex dynamics: z_{n+1} = z_n^2 + c
        const sq = complexSquare(zx, zy);
        const fx = sq.x + cRe;
        const fy = sq.y + cIm;

        // derive a velocity from f(z): use angle of f and magnitude for speed
        const angle = Math.atan2(fy, fx);
        const mag = Math.sqrt(fx * fx + fy * fy);

        // Map to screen velocities
        const localSpeed = (0.6 + Math.sin(t * 1.3 + i) * 0.2) * speed; // small variation
        p.vx += Math.cos(angle) * (0.3 * localSpeed) * (1 / (0.2 + mag));
        p.vy += Math.sin(angle) * (0.3 * localSpeed) * (1 / (0.2 + mag));

        // damping (keeps velocities stable)
        p.vx *= 0.92;
        p.vy *= 0.92;

        // integrate
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // occasional tiny random jitter for organic feel
        p.x += (Math.random() - 0.5) * 0.12;
        p.y += (Math.random() - 0.5) * 0.12;

        // wrap around edges softly
        if (p.x < -50) p.x = W + 50;
        if (p.x > W + 50) p.x = -50;
        if (p.y < -50) p.y = H + 50;
        if (p.y > H + 50) p.y = -50;

        // color intensity based on speed and distance to center
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const intensity = Math.min(1, 0.6 + (Math.hypot(p.vx, p.vy) * 0.8) + (dist / (Math.min(W, H) * 0.8)));

        // draw glow circle (radial)
        const radius = p.size * (1 + intensity * 2);
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 6);
        // inner color: selected color with alpha scaled by intensity
        const alpha = Math.min(0.95, 0.15 + intensity * 0.45);
        // choose 2 tone gradient to add richness
        grd.addColorStop(0, hexToRgba(color, alpha));
        grd.addColorStop(0.5, hexToRgba(adjustColor(color, -30), alpha * 0.6));
        grd.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(frame);
    }

    animRef.current = requestAnimationFrame(frame);

    // cleanup
    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [numParticles, speed, color, bgFade]);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
        display: "block",
        background: "rgba(4,6,15,1)",
      }}
    />
  );
}

/* -----------------------
   Utility helpers
   ----------------------- */

// convert hex like "#89f" or "#aabbcc" to rgba string with alpha
function hexToRgba(hex, alpha = 1) {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return `rgba(${r},${g},${b},${alpha})`;
  } else if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return `rgba(255,255,255,${alpha})`;
}

// shift brightness of hex color by amount (-255..255)
function adjustColor(hex, amount) {
  const h = hex.replace("#", "");
  const r = clamp(parseInt(h.length === 3 ? h[0] + h[0] : h.slice(0, 2), 16) + amount, 0, 255);
  const g = clamp(parseInt(h.length === 3 ? h[1] + h[1] : h.slice(h.length === 3 ? 1 : 2, h.length === 3 ? 2 : 4), 16) + amount, 0, 255);
  const b = clamp(parseInt(h.length === 3 ? h[2] + h[2] : h.slice(h.length === 3 ? 2 : 4, h.length === 3 ? 3 : 6), 16) + amount, 0, 255);
  // ensure two-digit hex parts
  const toHex = (n) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
