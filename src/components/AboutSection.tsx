import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useRef, useEffect, useCallback } from "react";
import AnimatedBackground from "./AnimatedBackground";
import { useAboutInfo } from "@/hooks/use-database";


/* ── Cinematic 3D DNA Helix (Canvas) ── */
const DNAAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const time = performance.now() * 0.001;
    ctx.clearRect(0, 0, w, h);

    // Diagonal helix from bottom-left toward top-right
    const seg = 400;
    const turns = 3.5;
    const tubeR = 10;

    // Start/end points define the diagonal axis
    const x0 = w * 0.12, y0 = h * 0.92;
    const x1 = w * 0.88, y1 = h * 0.08;
    const amp = w * 0.13; // amplitude perpendicular to axis

    // Axis direction and perpendicular
    const dx = x1 - x0, dy = y1 - y0;
    const axisLen = Math.sqrt(dx * dx + dy * dy);
    const ax = dx / axisLen, ay = dy / axisLen;
    // perpendicular (rotated 90°)
    const px = -ay, py = ax;

    interface Pt { x: number; y: number; z: number; t: number }
    const L: Pt[] = [];
    const R: Pt[] = [];

    for (let i = 0; i <= seg; i++) {
      const t = i / seg;
      const baseX = x0 + dx * t;
      const baseY = y0 + dy * t;
      const angle = t * Math.PI * 2 * turns + time * 0.6;
      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);

      L.push({
        x: baseX + amp * sinA * px,
        y: baseY + amp * sinA * py,
        z: cosA,
        t
      });
      R.push({
        x: baseX - amp * sinA * px,
        y: baseY - amp * sinA * py,
        z: -cosA,
        t
      });
    }

    // Depth-of-field: fade edges (near t=0 and t=1)
    const dofAlpha = (t: number) => {
      const fadeIn = Math.min(1, t / 0.15);
      const fadeOut = Math.min(1, (1 - t) / 0.15);
      return fadeIn * fadeOut;
    };

    // Draw strand with volumetric shading
    const drawStrand = (pts: Pt[], front: boolean) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const p = pts[i], n = pts[i + 1];
        if (front !== (p.z > 0)) continue;
        const d = (p.z + 1) / 2; // depth 0=back, 1=front
        const dof = dofAlpha(p.t);
        const r = tubeR * (0.4 + 0.6 * d);

        // Base color: dark crimson (back) → bright red (front)
        const cr = Math.round(40 + 200 * d);
        const cg = Math.round(5 + 20 * d);
        const cb = Math.round(8 + 15 * d);

        // Outer glow (subsurface-like)
        if (d > 0.3) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n.x, n.y);
          ctx.strokeStyle = `rgba(255,40,20,${0.08 * d * dof})`;
          ctx.lineWidth = r * 4.5;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Main tube body
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${dof})`;
        ctx.lineWidth = r * 2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Darker edge (bottom of tube for volume)
        ctx.beginPath();
        ctx.moveTo(p.x + px * r * 0.4, p.y + py * r * 0.4);
        ctx.lineTo(n.x + px * r * 0.4, n.y + py * r * 0.4);
        ctx.strokeStyle = `rgba(${Math.round(cr * 0.4)},${Math.round(cg * 0.3)},${Math.round(cb * 0.3)},${0.5 * dof})`;
        ctx.lineWidth = r * 0.9;
        ctx.lineCap = "round";
        ctx.stroke();

        // Specular highlight (top of tube)
        if (d > 0.55) {
          const hl = (d - 0.55) / 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x - px * r * 0.35, p.y - py * r * 0.35);
          ctx.lineTo(n.x - px * r * 0.35, n.y - py * r * 0.35);
          ctx.strokeStyle = `rgba(255,${Math.round(100 + 120 * hl)},${Math.round(60 + 80 * hl)},${hl * 0.45 * dof})`;
          ctx.lineWidth = r * 0.6;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Hot glow emission spots
        if (d > 0.8 && i % 12 === 0) {
          const glowR = r * 2.5;
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          grd.addColorStop(0, `rgba(255,100,50,${0.35 * dof})`);
          grd.addColorStop(0.4, `rgba(255,40,20,${0.12 * dof})`);
          grd.addColorStop(1, "rgba(255,20,10,0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      }
    };

    // Draw rungs (base pairs) with 3D shading
    const drawRungs = (behind: boolean) => {
      const spacing = Math.floor(seg / (turns * 5));
      for (let i = spacing; i < L.length - spacing; i += spacing) {
        const lp = L[i], rp = R[i];
        const avgZ = (lp.z + rp.z) / 2;
        if (behind && avgZ > 0) continue;
        if (!behind && avgZ <= 0) continue;

        const d = (avgZ + 1) / 2;
        const dof = dofAlpha(lp.t);
        const rw = 2 + 4 * d;

        // Rung color: dark → medium red
        const cr = Math.round(50 + 120 * d);
        const cg = Math.round(3 + 12 * d);
        const cb = Math.round(5 + 10 * d);

        // Rung glow
        if (d > 0.4) {
          ctx.beginPath();
          ctx.moveTo(lp.x, lp.y);
          ctx.lineTo(rp.x, rp.y);
          ctx.strokeStyle = `rgba(255,30,20,${0.06 * d * dof})`;
          ctx.lineWidth = rw * 3;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        const mx = (lp.x + rp.x) / 2;
        const my = (lp.y + rp.y) / 2;
        const gapX = (rp.x - lp.x) * 0.03;
        const gapY = (rp.y - lp.y) * 0.03;

        ctx.lineCap = "round";
        // left half
        ctx.beginPath();
        ctx.moveTo(lp.x, lp.y);
        ctx.lineTo(mx - gapX, my - gapY);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${dof})`;
        ctx.lineWidth = rw;
        ctx.stroke();
        // right half (slightly different shade)
        ctx.beginPath();
        ctx.moveTo(mx + gapX, my + gapY);
        ctx.lineTo(rp.x, rp.y);
        ctx.strokeStyle = `rgba(${Math.min(255, cr + 20)},${cg + 3},${cb},${dof})`;
        ctx.lineWidth = rw;
        ctx.stroke();

        // Rung highlight
        if (d > 0.6) {
          const hl = (d - 0.6) / 0.4;
          ctx.beginPath();
          ctx.moveTo(lp.x, lp.y);
          ctx.lineTo(rp.x, rp.y);
          ctx.strokeStyle = `rgba(255,120,80,${hl * 0.15 * dof})`;
          ctx.lineWidth = rw * 0.5;
          ctx.stroke();
        }
      }
    };

    // Render layers: back → back rungs → front → front rungs
    drawStrand(L, false);
    drawStrand(R, false);
    drawRungs(true);
    drawStrand(L, true);
    drawStrand(R, true);
    drawRungs(false);

    // Atmospheric glow around the helix center
    const cx = w / 2, cy = h / 2;
    const glowSize = Math.max(w, h) * 0.45;
    const ambientGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
    ambientGlow.addColorStop(0, "rgba(180,20,20,0.07)");
    ambientGlow.addColorStop(0.5, "rgba(120,10,10,0.03)");
    ambientGlow.addColorStop(1, "rgba(80,5,5,0)");
    ctx.fillStyle = ambientGlow;
    ctx.fillRect(0, 0, w, h);

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div className="relative w-full h-[350px] md:h-[420px] flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

const AboutSection = () => {
  const { data: aboutData, isLoading, isError, error } = useAboutInfo();

  const mobile =
    typeof window !== "undefined" &&
    (window.innerWidth < 768 || "ontouchstart" in window);

  const content = aboutData?.content || "TEDx KPRCAS is a locally organised independently run event. Rooted in the spirit of TED's mission, it brings together thought leaders, innovators, and changemakers to share ideas worth spreading. At KPR College of Arts Science and Research, we celebrate the power of storytelling, innovation, and community building through extraordinary talks and experiences.";

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <AnimatedBackground variant="default" particleCount={6} />

      <div className="container mx-auto px-4 relative z-10">
        {/* ── About Row: Text left, Orbiting Rings right ── */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="font-heading text-4xl sm:text-5xl md:text-7xl font-black text-foreground uppercase mb-8"
              whileInView={{ opacity: [0, 1], y: [30, 0] }}
              viewport={{ once: true }}
            >
              About
            </motion.h2>
            {isError ? (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-500 font-medium text-sm">Error loading about information</p>
                  <p className="text-muted-foreground text-xs mt-1">{error?.message || "Unable to load content at this time."}</p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
              </div>
            ) : (
              <p className="text-muted-foreground leading-relaxed text-lg">
                {content}
              </p>
            )}
          </motion.div>

          {/* Right side: DNA Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DNAAnimation />
          </motion.div>
        </div>
      </div>

      {/* Train Marquee */}
      <div className="mt-20 relative overflow-hidden pb-4">
        {/* Rail tracks */}
        <div className="absolute bottom-3 left-0 right-0 z-0">
          <div className="h-[3px] bg-gray-500 mb-[6px]" />
          <div className="h-[3px] bg-gray-500" />
          <div className="absolute top-0 left-0 right-0 h-full flex">
            {Array(mobile ? 60 : 160).fill(null).map((_, i) => (
              <div key={i} className="w-[3px] h-full bg-gray-600 flex-shrink-0" style={{ marginLeft: '20px' }} />
            ))}
          </div>
        </div>

        {/* Train carriages */}
        <div className="marquee whitespace-nowrap flex items-end relative z-10" style={{ willChange: 'transform' }}>
          {Array(mobile ? 8 : 16).fill(null).map((_, i) => (
            <div key={i} className="inline-flex flex-shrink-0 items-end mx-1">
              <div className="relative">
                <div className="relative rounded-t-xl border-2 px-6 md:px-10 py-4 md:py-6 bg-gradient-to-b from-gray-800 to-gray-950 border-gray-600">
                  <span className="font-heading text-2xl md:text-3xl font-black">
                    <span className="text-tedx-red">TED</span><sup className="text-tedx-red text-xs">x</sup>{" "}
                    <span className="text-white">KPRCAS</span>
                  </span>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-3 bg-gray-600 rounded-sm z-20" />
                </div>
                <div className="h-3 bg-gray-800 border-x-2 border-gray-600" />
                <div className="flex justify-between px-3 -mb-1 relative">
                  <div className="flex gap-1">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-yellow-600" /></div>
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-yellow-600" /></div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-yellow-600" /></div>
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-yellow-600" /></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
