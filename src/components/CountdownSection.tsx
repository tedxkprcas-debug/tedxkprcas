import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";

const TARGET_DATE = new Date("2025-12-31T00:00:00");

const CountdownSection = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, TARGET_DATE.getTime() - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="py-24 relative overflow-hidden">
      <AnimatedBackground variant="accent" particleCount={8} />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ boxShadow: "0 0 40px hsl(0 84% 50% / 0.2)" }}
          className="border border-tedx-red rounded-xl p-8 md:p-12 inline-block bg-card/30 backdrop-blur-sm transition-shadow"
        >
          <div className="flex items-center gap-4 md:gap-8 font-heading text-5xl md:text-8xl font-black">
            {[
              { val: time.days, label: "Days" },
              { val: time.hours, label: "Hours" },
              { val: time.minutes, label: "Minutes" },
              { val: time.seconds, label: "Seconds" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-4 md:gap-8">
                {i > 0 && <span className="text-tedx-red">:</span>}
                <motion.div
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.span
                    key={item.val}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-foreground"
                  >
                    {pad(item.val)}
                  </motion.span>
                  <span className="text-sm md:text-base font-body font-normal text-muted-foreground mt-2">
                    {item.label}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Film Roll Marquee */}
        <div className="mt-12 relative">
          <div className="relative bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 py-0 overflow-hidden">
            {/* Top sprocket holes */}
            <div className="absolute top-0 left-0 right-0 h-5 bg-black z-10 flex items-center">
              <div className="marquee-sprocket whitespace-nowrap flex">
                {Array(40).fill(null).map((_, i) => (
                  <div key={`st-${i}`} className="w-4 h-3 bg-gray-800 border border-gray-700 rounded-sm mx-3 flex-shrink-0" />
                ))}
                {Array(40).fill(null).map((_, i) => (
                  <div key={`st2-${i}`} className="w-4 h-3 bg-gray-800 border border-gray-700 rounded-sm mx-3 flex-shrink-0" />
                ))}
              </div>
            </div>
            <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-700 z-10" />

            {/* Main film content area */}
            <div className="py-8 mt-5 mb-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-transparent to-red-950/40 pointer-events-none z-[1]" />
              <div className="marquee whitespace-nowrap relative z-[2]">
                {Array(8).fill(null).map((_, i) => (
                  <span key={i} className="font-heading text-4xl md:text-6xl font-black mx-8 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                    {i % 2 === 0 ? (
                      <span className="text-stroke-red">HURRY UP!</span>
                    ) : (
                      <span>HURRY <span className="text-tedx-red">UP!</span></span>
                    )}
                    <span className="mx-2 text-gray-600">|</span>
                  </span>
                ))}
                {Array(8).fill(null).map((_, i) => (
                  <span key={`d-${i}`} className="font-heading text-4xl md:text-6xl font-black mx-8 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                    {i % 2 === 0 ? (
                      <span className="text-stroke-red">HURRY UP!</span>
                    ) : (
                      <span>HURRY <span className="text-tedx-red">UP!</span></span>
                    )}
                    <span className="mx-2 text-gray-600">|</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute bottom-5 left-0 right-0 h-[2px] bg-gray-700 z-10" />
            {/* Bottom sprocket holes */}
            <div className="absolute bottom-0 left-0 right-0 h-5 bg-black z-10 flex items-center">
              <div className="marquee-sprocket whitespace-nowrap flex">
                {Array(40).fill(null).map((_, i) => (
                  <div key={`sb-${i}`} className="w-4 h-3 bg-gray-800 border border-gray-700 rounded-sm mx-3 flex-shrink-0" />
                ))}
                {Array(40).fill(null).map((_, i) => (
                  <div key={`sb2-${i}`} className="w-4 h-3 bg-gray-800 border border-gray-700 rounded-sm mx-3 flex-shrink-0" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
