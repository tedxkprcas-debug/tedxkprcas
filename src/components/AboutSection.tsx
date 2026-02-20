import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useRef, useEffect, useCallback } from "react";
import AnimatedBackground from "./AnimatedBackground";
import { useAboutInfo } from "@/hooks/use-database";


/* ── Cinematic 3D Rotating Globe (Canvas) ── */
const GlobeAnimation = () => {
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

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.35;

    // Ambient glow behind globe
    const ambientGlow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.6);
    ambientGlow.addColorStop(0, "rgba(220,30,30,0.08)");
    ambientGlow.addColorStop(0.5, "rgba(150,15,15,0.03)");
    ambientGlow.addColorStop(1, "rgba(80,5,5,0)");
    ctx.fillStyle = ambientGlow;
    ctx.fillRect(0, 0, w, h);

    // Globe outline glow
    const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.15);
    glowGrad.addColorStop(0, "rgba(239,68,68,0.15)");
    glowGrad.addColorStop(0.5, "rgba(239,68,68,0.05)");
    glowGrad.addColorStop(1, "rgba(239,68,68,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Globe sphere fill
    const sphereGrad = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.25, 0, cx, cy, radius);
    sphereGrad.addColorStop(0, "rgba(40,5,5,0.6)");
    sphereGrad.addColorStop(0.7, "rgba(20,2,2,0.8)");
    sphereGrad.addColorStop(1, "rgba(10,1,1,0.9)");
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = sphereGrad;
    ctx.fill();

    // Clip to globe for grid lines
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const rotY = time * 0.3; // Rotation speed
    const tilt = 0.4; // Axial tilt

    // Longitude lines (meridians)
    const lonCount = 18;
    for (let i = 0; i < lonCount; i++) {
      const angle = (i / lonCount) * Math.PI * 2 + rotY;
      ctx.beginPath();
      for (let j = 0; j <= 60; j++) {
        const lat = (j / 60) * Math.PI - Math.PI / 2;
        const x3d = Math.cos(lat) * Math.sin(angle);
        const y3d = Math.sin(lat) * Math.cos(tilt) - Math.cos(lat) * Math.cos(angle) * Math.sin(tilt);
        const z3d = Math.sin(lat) * Math.sin(tilt) + Math.cos(lat) * Math.cos(angle) * Math.cos(tilt);

        const px = cx + x3d * radius;
        const py = cy - y3d * radius;
        const depth = (z3d + 1) / 2;

        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(239,68,68,${0.08 + Math.sin(time + i) * 0.03})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Latitude lines (parallels)
    const latCount = 12;
    for (let i = 1; i < latCount; i++) {
      const lat = (i / latCount) * Math.PI - Math.PI / 2;
      ctx.beginPath();
      for (let j = 0; j <= 80; j++) {
        const angle = (j / 80) * Math.PI * 2;
        const x3d = Math.cos(lat) * Math.sin(angle + rotY);
        const y3d = Math.sin(lat) * Math.cos(tilt) - Math.cos(lat) * Math.cos(angle + rotY) * Math.sin(tilt);

        const px = cx + x3d * radius;
        const py = cy - y3d * radius;

        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(239,68,68,${0.06 + 0.02 * Math.abs(Math.sin(lat))})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Glowing dots at intersections (cities/nodes)
    const dotCount = 30;
    for (let i = 0; i < dotCount; i++) {
      const lat = ((i * 7.3 + 2) % 170 - 85) * (Math.PI / 180);
      const lon = ((i * 13.7 + 5) % 360) * (Math.PI / 180) + rotY;

      const x3d = Math.cos(lat) * Math.sin(lon);
      const y3d = Math.sin(lat) * Math.cos(tilt) - Math.cos(lat) * Math.cos(lon) * Math.sin(tilt);
      const z3d = Math.sin(lat) * Math.sin(tilt) + Math.cos(lat) * Math.cos(lon) * Math.cos(tilt);

      if (z3d < -0.1) continue; // Behind the globe

      const px = cx + x3d * radius;
      const py = cy - y3d * radius;
      const depth = (z3d + 1) / 2;
      const dotR = 1.5 + 2.5 * depth;

      // Dot glow
      const dotGlow = ctx.createRadialGradient(px, py, 0, px, py, dotR * 4);
      dotGlow.addColorStop(0, `rgba(255,80,60,${0.5 * depth})`);
      dotGlow.addColorStop(0.5, `rgba(255,40,30,${0.15 * depth})`);
      dotGlow.addColorStop(1, "rgba(255,20,10,0)");
      ctx.beginPath();
      ctx.arc(px, py, dotR * 4, 0, Math.PI * 2);
      ctx.fillStyle = dotGlow;
      ctx.fill();

      // Dot core
      ctx.beginPath();
      ctx.arc(px, py, dotR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,${Math.round(120 + 100 * depth)},${Math.round(80 + 80 * depth)},${0.7 + 0.3 * depth})`;
      ctx.fill();
    }

    // Connection arcs between some dots
    for (let i = 0; i < 8; i++) {
      const idx1 = (i * 3) % dotCount;
      const idx2 = (i * 3 + 7) % dotCount;

      const lat1 = ((idx1 * 7.3 + 2) % 170 - 85) * (Math.PI / 180);
      const lon1 = ((idx1 * 13.7 + 5) % 360) * (Math.PI / 180) + rotY;
      const lat2 = ((idx2 * 7.3 + 2) % 170 - 85) * (Math.PI / 180);
      const lon2 = ((idx2 * 13.7 + 5) % 360) * (Math.PI / 180) + rotY;

      const z1 = Math.sin(lat1) * Math.sin(tilt) + Math.cos(lat1) * Math.cos(lon1) * Math.cos(tilt);
      const z2 = Math.sin(lat2) * Math.sin(tilt) + Math.cos(lat2) * Math.cos(lon2) * Math.cos(tilt);

      if (z1 < 0 || z2 < 0) continue;

      const x1 = cx + Math.cos(lat1) * Math.sin(lon1) * radius;
      const y1 = cy - (Math.sin(lat1) * Math.cos(tilt) - Math.cos(lat1) * Math.cos(lon1) * Math.sin(tilt)) * radius;
      const x2 = cx + Math.cos(lat2) * Math.sin(lon2) * radius;
      const y2 = cy - (Math.sin(lat2) * Math.cos(tilt) - Math.cos(lat2) * Math.cos(lon2) * Math.sin(tilt)) * radius;

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const arcHeight = dist * 0.3;
      const ctrlX = midX;
      const ctrlY = midY - arcHeight;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
      ctx.strokeStyle = `rgba(239,68,68,${0.12 + Math.sin(time * 2 + i) * 0.06})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Traveling pulse along arc
      const t = ((time * 0.5 + i * 0.3) % 1);
      const pulseX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * ctrlX + t * t * x2;
      const pulseY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * ctrlY + t * t * y2;
      const pulseGlow = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 6);
      pulseGlow.addColorStop(0, "rgba(255,120,80,0.8)");
      pulseGlow.addColorStop(0.5, "rgba(255,60,40,0.3)");
      pulseGlow.addColorStop(1, "rgba(255,30,20,0)");
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 6, 0, Math.PI * 2);
      ctx.fillStyle = pulseGlow;
      ctx.fill();
    }

    ctx.restore();

    // Globe rim highlight
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(239,68,68,0.2)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Top specular shine
    const shineGrad = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.3, 0, cx, cy, radius);
    shineGrad.addColorStop(0, "rgba(255,255,255,0.06)");
    shineGrad.addColorStop(0.3, "rgba(255,255,255,0.02)");
    shineGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = shineGrad;
    ctx.fill();

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div className="relative w-full h-[450px] md:h-[550px] lg:h-[620px] flex items-center justify-center">
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
            <GlobeAnimation />
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
