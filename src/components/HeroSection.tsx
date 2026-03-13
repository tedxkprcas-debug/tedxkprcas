import { motion } from "framer-motion";
import { useEffect, useRef, memo } from "react";


/* ── Foreground silhouette (Layer 5) ── */
const ForegroundSilhouette = memo(() => (
  <svg
    viewBox="0 0 1440 200"
    preserveAspectRatio="none"
    className="absolute bottom-0 left-0 w-full h-[8vh] sm:h-[10vh] md:h-[12vh] lg:h-[15vh]"
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
      className="relative h-[100svh] min-h-[480px] sm:min-h-[560px] md:min-h-[600px] lg:min-h-[650px] overflow-hidden bg-black"
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
        <div className="absolute inset-0 bg-black/75" />
        {/* Subtle red glow (no blur → no paint cost) */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[260px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[130px] sm:h-[200px] md:h-[250px] lg:h-[300px] bg-tedx-red/[0.06] rounded-full opacity-60" />
      </div>

      {/* ═══ CENTER CONTENT – Title + Countdown ═══ */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6"
        style={{ willChange: "transform, opacity", transform: "translate3d(0,0,0)" }}
      >
        {/* TEDx KPRCAS Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          className="flex flex-col items-center select-none mb-2 sm:mb-3"
        >
          <img 
            src="/logo.png" 
            alt="TEDx KPRCAS" 
            className="h-24 sm:h-32 md:h-48 lg:h-64 xl:h-80 2xl:h-96 w-auto object-contain"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="border border-tedx-red/40 rounded-full px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 mb-4 sm:mb-6"
        >
          <span className="text-xs sm:text-sm md:text-lg lg:text-2xl tracking-[0.05em] uppercase leading-relaxed">
            <span className="text-tedx-red">x</span>
            <span className="text-white font-normal"> = Independently organised TED event</span>
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
