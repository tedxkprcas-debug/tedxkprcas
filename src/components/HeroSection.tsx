import { motion } from "framer-motion";
import { useEffect, useRef, memo } from "react";

/* ── Inline SVG city-scape silhouette (Layer 3) ── */
const CitySilhouette = memo(() => (
  <svg
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
    className="absolute bottom-0 left-0 w-full h-[35vh] sm:h-[40vh]"
  >
    <path
      d="M0,320 L0,220 L40,220 L40,180 L60,180 L60,140 L80,140 L80,180 L100,180 L100,160 L120,160 L120,120 L140,120 L140,100 L160,100 L160,120 L180,120 L180,80 L200,80 L200,60 L210,60 L210,50 L220,50 L220,60 L230,60 L230,80 L240,80 L240,140 L260,140 L260,120 L280,120 L280,90 L300,90 L300,70 L310,50 L320,70 L320,90 L340,90 L340,130 L360,130 L360,110 L380,110 L380,80 L400,80 L400,60 L420,60 L420,40 L430,40 L430,30 L440,30 L440,40 L450,40 L450,60 L460,60 L460,100 L480,100 L480,130 L500,130 L500,150 L520,150 L520,120 L540,120 L540,90 L560,90 L560,110 L580,110 L580,70 L600,70 L600,50 L620,50 L620,30 L630,20 L640,30 L640,50 L660,50 L660,80 L680,80 L680,110 L700,110 L700,140 L720,140 L720,100 L740,100 L740,80 L760,80 L760,60 L780,60 L780,90 L800,90 L800,120 L820,120 L820,80 L840,80 L840,50 L850,50 L850,35 L860,35 L860,50 L880,50 L880,80 L900,80 L900,110 L920,110 L920,70 L940,70 L940,50 L960,50 L960,90 L980,90 L980,130 L1000,130 L1000,110 L1020,110 L1020,80 L1040,80 L1040,60 L1060,60 L1060,40 L1070,30 L1080,40 L1080,60 L1100,60 L1100,90 L1120,90 L1120,120 L1140,120 L1140,140 L1160,140 L1160,100 L1180,100 L1180,130 L1200,130 L1200,160 L1220,160 L1220,120 L1240,120 L1240,100 L1260,100 L1260,140 L1280,140 L1280,170 L1300,170 L1300,150 L1320,150 L1320,180 L1340,180 L1340,200 L1360,200 L1360,180 L1380,180 L1380,210 L1400,210 L1400,230 L1420,230 L1420,240 L1440,240 L1440,320 Z"
      fill="rgba(0,0,0,0.9)"
    />
    {[
      [155, 110], [165, 115], [205, 65], [215, 70], [425, 45], [435, 50],
      [625, 40], [635, 35], [855, 40], [845, 45], [1065, 45], [1075, 50],
    ].map(([x, y], i) => (
      <rect
        key={i}
        x={x}
        y={y}
        width={4}
        height={5}
        fill={i % 3 === 0 ? "rgba(239,68,68,0.6)" : "rgba(255,255,200,0.4)"}
      />
    ))}
  </svg>
));

/* ── Foreground silhouette (Layer 5) ── */
const ForegroundSilhouette = memo(() => (
  <svg
    viewBox="0 0 1440 200"
    preserveAspectRatio="none"
    className="absolute bottom-0 left-0 w-full h-[12vh] sm:h-[15vh]"
  >
    <path
      d="M0,200 L0,160 L80,155 L160,145 L240,150 L320,140 L400,135 L480,140 L560,130 L640,125 L720,130 L800,120 L880,125 L960,115 L1040,120 L1120,110 L1200,115 L1280,120 L1360,125 L1440,130 L1440,200 Z"
      fill="hsl(var(--background))"
    />
  </svg>
));


function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);

  /* ── Single rAF scroll handler ── */
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) { ticking = false; return; }

        const rect = section.getBoundingClientRect();
        // Skip entirely when hero is off-screen
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          ticking = false;
          return;
        }
        const h = section.offsetHeight;
        const p = Math.min(1, Math.max(0, -rect.top / h));

        // Background: zoom in 1→1.3 + parallax shift
        if (bgRef.current) {
          const s = 1 + p * 0.3;
          bgRef.current.style.transform =
            `translate3d(0, ${p * 40}%, 0) scale3d(${s}, ${s}, 1)`;
        }

        // City silhouette: slower parallax
        if (cityRef.current) {
          cityRef.current.style.transform = `translate3d(0, ${p * 20}%, 0)`;
        }

        // Content: moves up + fades
        if (contentRef.current) {
          contentRef.current.style.transform = `translate3d(0, ${p * 60}%, 0)`;
          contentRef.current.style.opacity = `${Math.max(0, 1 - p * 2)}`;
        }

        // Foreground: very slight shift
        if (fgRef.current) {
          fgRef.current.style.transform = `translate3d(0, ${p * 5}%, 0)`;
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial position
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-screen min-h-[650px] overflow-hidden bg-black"
    >
      {/* ═══ LAYER 1 – Background image ═══ */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[10%] h-[130%]"
        style={{ willChange: "transform", transform: "translate3d(0,0,0) scale3d(1,1,1)" }}
      >
        <img
          src="/bg/kprcas.jpg"
          alt="KPRCAS Campus"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        {/* Subtle red glow (no blur → no paint cost) */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-tedx-red/[0.06] rounded-full opacity-60" />
      </div>

      // ...existing code...

      {/* ═══ CENTER CONTENT – Title + Countdown ═══ */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4"
        style={{ willChange: "transform, opacity", transform: "translate3d(0,0,0)" }}
      >
        {/* TEDx KPRCAS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          className="mb-2 select-none"
        >
          <span className="font-heading text-6xl sm:text-8xl md:text-[10rem] font-black text-tedx-red leading-none">
            TED
          </span>
          <sup className="font-heading text-2xl sm:text-4xl md:text-5xl font-black text-tedx-red relative -top-6 sm:-top-10 md:-top-16">
            x
          </sup>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="font-heading text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-[0.15em] mb-2"
        >
          KPRCAS
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="border border-tedx-red/30 rounded-full px-5 py-1.5 mb-6"
        >
          <span className="text-tedx-red text-xs sm:text-sm tracking-widest uppercase">
            x = Independently organised TED event
          </span>
        </motion.div>
      </div>

      {/* ═══ LAYER 5 – Foreground / ground plane ═══ */}
      <div
        ref={fgRef}
        className="absolute inset-0 pointer-events-none z-20"
        style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
      >
        <ForegroundSilhouette />
      </div>

      {/* Vignette overlay (simple linear, cheaper than radial) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-[15]" />
    </section>
  );
}

export default HeroSection;
