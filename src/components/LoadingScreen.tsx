import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => onComplete(), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-6">
          {/* KPRCAS text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-2xl md:text-4xl tracking-[0.3em] text-foreground uppercase"
          >
            KPRCAS
          </motion.div>

          {/* TEDx Logo */}
          <div className="flex items-baseline">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={phase >= 0 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-heading text-7xl md:text-9xl font-black text-tedx-red"
              style={{ animation: phase >= 2 ? "pulse-glow 2s ease-in-out infinite" : undefined }}
            >
              TED
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20, scale: 0.3 }}
              animate={phase >= 0 ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="font-heading text-5xl md:text-7xl font-black text-foreground"
            >
              <sup className="text-tedx-red text-4xl md:text-6xl">x</sup>
            </motion.span>
          </div>

          {/* Subtitle line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={phase >= 2 ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-[2px] w-48 md:w-72 bg-tedx-red origin-center"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-sm tracking-[0.2em] uppercase"
          >
            x = independently organized TED event
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-muted-foreground text-2xl"
          >
            ↑
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
