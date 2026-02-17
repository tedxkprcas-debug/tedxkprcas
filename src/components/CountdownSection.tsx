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

        {/* Train Marquee */}
        <div className="mt-12 relative overflow-hidden pb-4">
          {/* Rail tracks */}
          <div className="absolute bottom-3 left-0 right-0 z-0">
            <div className="h-[3px] bg-gray-500 mb-[6px]" />
            <div className="h-[3px] bg-gray-500" />
            {/* Rail ties */}
            <div className="absolute top-0 left-0 right-0 h-full flex">
              {Array(80).fill(null).map((_, i) => (
                <div key={i} className="w-[3px] h-full bg-gray-600 flex-shrink-0" style={{ marginLeft: '20px' }} />
              ))}
            </div>
          </div>

          {/* Train carriages */}
          <div className="marquee whitespace-nowrap flex items-end relative z-10">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="inline-flex flex-shrink-0 items-end mx-1">
                <div className="relative">
                  {/* Carriage body */}
                  <div className={`relative rounded-t-xl border-2 px-6 md:px-10 py-4 md:py-6 ${
                    i === 0
                      ? "bg-gradient-to-b from-red-700 to-red-900 border-red-600 rounded-tl-2xl"
                      : "bg-gradient-to-b from-gray-800 to-gray-950 border-gray-600"
                  }`}>
                    {/* Chimney for engine */}
                    {i === 0 && (
                      <div className="absolute -top-5 left-6 w-4 h-5 bg-gray-800 border-2 border-gray-600 rounded-t-md" />
                    )}
                    {/* Carriage window/text */}
                    <span className="font-heading text-3xl md:text-5xl font-black">
                      {i % 2 === 0 ? (
                        <span className="text-stroke-red">HURRY UP!</span>
                      ) : (
                        <span>HURRY <span className="text-tedx-red">UP!</span></span>
                      )}
                    </span>
                    {/* Connector */}
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-3 bg-gray-600 rounded-sm z-20" />
                  </div>
                  {/* Undercarriage */}
                  <div className="h-3 bg-gray-800 border-x-2 border-gray-600" />
                  {/* Wheels */}
                  <div className="flex justify-between px-3 -mb-1 relative">
                    <div className="flex gap-1">
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-600" />
                      </div>
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-600" />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-600" />
                      </div>
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
