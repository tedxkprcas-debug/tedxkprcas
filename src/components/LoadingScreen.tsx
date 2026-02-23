import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(true);

  const mobile =
    typeof window !== "undefined" &&
    (window.innerWidth < 768 || "ontouchstart" in window);

  useEffect(() => {
    if (mobile) {
      const timers = [
        setTimeout(() => setPhase(1), 200),
        setTimeout(() => setPhase(2), 1000),
        setTimeout(() => setPhase(3), 1600),
        setTimeout(() => setPhase(4), 2100),
        setTimeout(() => setPhase(5), 2600),
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => onComplete(), 400);
        }, 3200),
      ];
      return () => timers.forEach(clearTimeout);
    }

    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
      setTimeout(() => setPhase(5), 4500),
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => onComplete(), 800);
      }, 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, mobile]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Animated background particles — fewer on mobile */}
          {Array.from({ length: mobile ? 6 : 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? "hsl(var(--tedx-red))" : "hsl(var(--foreground))",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0, 1.5, 0],
                y: [0, -80 - Math.random() * 120],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Pulsing rings behind text — fewer on mobile */}
          {phase >= 1 && (
            <>
              {(mobile ? [0] : [0, 1, 2]).map((i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute rounded-full border border-tedx-red/20"
                  initial={{ width: 0, height: 0, opacity: 0 }}
                  animate={{
                    width: [0, 600 + i * 200],
                    height: [0, 600 + i * 200],
                    opacity: [0.4, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}

          {/* Scanning line */}
          <motion.div
            className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-tedx-red/40 to-transparent"
            initial={{ top: "0%" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Corner decorations */}
          {phase >= 1 && (
            <>
              <motion.div
                className="absolute top-4 left-4 sm:top-8 sm:left-8 w-10 h-10 sm:w-16 sm:h-16 border-t-2 border-l-2 border-tedx-red/40"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <motion.div
                className="absolute top-4 right-4 sm:top-8 sm:right-8 w-10 h-10 sm:w-16 sm:h-16 border-t-2 border-r-2 border-tedx-red/40"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <motion.div
                className="absolute bottom-8 left-4 sm:left-8 w-10 h-10 sm:w-16 sm:h-16 border-b-2 border-l-2 border-tedx-red/40"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
              <motion.div
                className="absolute bottom-8 right-4 sm:right-8 w-10 h-10 sm:w-16 sm:h-16 border-b-2 border-r-2 border-tedx-red/40"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </>
          )}

          <div className="flex flex-col items-center justify-center relative z-10">
            {/* Phase 1: TEDx outline - single clean render */}
            {phase >= 1 && phase < 2 && (
              <motion.div className="flex items-start">
                {"TED".split("").map((char, i) => (
                  <motion.span
                    key={`outline-${i}`}
                    className="font-heading text-5xl sm:text-6xl md:text-[7rem] lg:text-[11rem] xl:text-[14rem] font-bold tracking-[0em]"
                    style={{
                      WebkitTextStroke: "2px hsl(var(--tedx-red))",
                      color: "transparent",
                    }}
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.12, ease: "backOut" }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  className="font-heading text-2xl sm:text-3xl md:text-[3.5rem] lg:text-[5.5rem] xl:text-[7rem] font-black"
                  style={{
                    WebkitTextStroke: "2px hsl(var(--tedx-red))",
                    color: "transparent",
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: "backOut" }}
                >
                  x
                </motion.span>
              </motion.div>
            )}

            {/* Phase 2+: TEDx fills red with glitch effect */}
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start relative"
              >
                <motion.div
                  className="flex items-start"
                  animate={phase === 2 ? {
                    x: [0, -3, 4, -2, 0],
                    skewX: [0, -2, 1, -1, 0],
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {"TED".split("").map((char, i) => (
                    <motion.span
                      key={`filled-${i}`}
                      className="font-heading text-5xl sm:text-6xl md:text-[7rem] lg:text-[11rem] xl:text-[14rem] font-bold tracking-[0em]"
                      style={{ WebkitTextStroke: "2px hsl(var(--tedx-red))" }}
                      initial={{ color: "transparent" }}
                      animate={{ color: "hsl(var(--tedx-red))" }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  <motion.span
                    className="font-heading text-2xl sm:text-3xl md:text-[3.5rem] lg:text-[5.5rem] xl:text-[7rem] font-bold text-tedx-red tracking-[0em]"
                    initial={{ color: "transparent" }}
                    animate={{ color: "hsl(var(--tedx-red))" }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    x
                  </motion.span>
                </motion.div>

                {/* Glitch duplicates */}
                {phase === 2 && (
                  <>
                    <motion.span
                      className="absolute font-heading text-5xl sm:text-6xl md:text-[7rem] lg:text-[11rem] xl:text-[14rem] font-bold text-tedx-red/30 tracking-[0em]"
                      initial={{ x: 0 }}
                      animate={{ x: [0, 5, -3, 0], opacity: [0, 0.5, 0.3, 0] }}
                      transition={{ duration: 0.4 }}
                      style={{ clipPath: "inset(30% 0 40% 0)" }}
                    >
                      TED
                    </motion.span>
                    <motion.span
                      className="absolute font-heading text-5xl sm:text-6xl md:text-[7rem] lg:text-[11rem] xl:text-[14rem] font-bold tracking-[0em]"
                      initial={{ x: 0 }}
                      animate={{ x: [0, -4, 6, 0], opacity: [0, 0.3, 0.2, 0] }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      style={{ clipPath: "inset(60% 0 10% 0)", color: "hsl(var(--tedx-red) / 0.4)" }}
                    >
                      TED
                    </motion.span>
                  </>
                )}
              </motion.div>
            )}

            {/* Phase 3: KPRCAS slides in with staggered letters */}
            {phase >= 3 && (
              <motion.div
                className="flex items-baseline mt-2 sm:mt-3 md:mt-4 lg:mt-5 xl:mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {"KPRCAS".split("").map((char, i) => (
                  <motion.span
                    key={`kpr-${i}`}
                    className="font-heading text-3xl sm:text-4xl md:text-[4rem] lg:text-[6rem] xl:text-[9rem] font-bold text-foreground tracking-[0em]"
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.08,
                      ease: "easeOut",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Phase 4: Tagline */}
            {phase >= 4 && (
              <motion.p
                className="text-muted-foreground font-heading text-sm sm:text-lg md:text-2xl tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-4 sm:mt-5 md:mt-6 lg:mt-8"
                initial={{ opacity: 0, letterSpacing: "0.6em" }}
                animate={{ opacity: 1, letterSpacing: "0.3em" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Ideas Worth Spreading
              </motion.p>
            )}

            {/* Phase 4: Progress bar */}
            {phase >= 4 && (
              <motion.div
                className="mt-8 w-32 sm:w-40 md:w-48 lg:w-56 h-[2px] bg-muted rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="h-full bg-tedx-red rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                />
              </motion.div>
            )}
          </div>

          {/* Phase 5: Scroll hint */}
          {phase >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 sm:bottom-12 flex flex-col items-center gap-2 sm:gap-3"
            >
              <motion.span
                className="text-muted-foreground text-xs tracking-[0.2em] uppercase"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Scroll to explore
              </motion.span>
              <motion.div
                className="w-5 h-8 rounded-full border-2 border-muted-foreground/40 flex justify-center pt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-1 h-2 rounded-full bg-tedx-red"
                  animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
