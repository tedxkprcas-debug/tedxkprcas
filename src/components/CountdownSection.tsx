import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";

const TARGET_DATE = new Date("2025-12-31T00:00:00");

const CountdownSection = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [registrationLink, setRegistrationLink] = useState("https://forms.gle/example");

  const mobile =
    typeof window !== "undefined" &&
    (window.innerWidth < 768 || "ontouchstart" in window);

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

  useEffect(() => {
    const savedContact = localStorage.getItem("tedx_contact");
    if (savedContact) {
      try {
        const contactData = JSON.parse(savedContact);
        setRegistrationLink(contactData.registrationLink || "https://forms.gle/example");
      } catch (e) {
        console.error("Error parsing contact data:", e);
      }
    }
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="py-24 relative overflow-hidden">
      <AnimatedBackground variant="accent" particleCount={8} />

      <div className="container mx-auto px-4 relative z-10">
        {/* ── Three Feature Cards Above Timer ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto mb-16">
          {/* Card 1: Speaker Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=500&fit=crop&crop=faces"
              alt="TEDx Speaker"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>

          {/* Card 2: Theme Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-white flex items-center justify-center"
          >
            <img
              src="https://images.unsplash.com/photo-1597873618537-64a04bae4a27?w=400&h=500&fit=crop"
              alt="TEDx Theme"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Card 3: Date + Book Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Book Tickets Button */}
            <motion.a
              href={registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-tedx-red hover:bg-tedx-dark-red text-white font-heading font-black text-xl md:text-2xl px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(0 84% 50% / 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              BOOK TICKETS <ArrowUpRight className="w-6 h-6" />
            </motion.a>

            {/* Date Card */}
            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              className="flex-1 rounded-2xl bg-black border border-white/10 flex items-center justify-center p-6 md:p-8"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-center">
                  <span className="font-heading text-4xl sm:text-6xl md:text-8xl font-black text-tedx-red leading-none block">23</span>
                  <span className="font-heading text-2xl sm:text-4xl md:text-6xl font-black text-tedx-red leading-none block -mt-1">MAR</span>
                </div>
                <div className="w-[3px] h-16 sm:h-20 md:h-28 bg-white/30 rounded-full" />
                <div className="font-heading text-3xl sm:text-5xl md:text-7xl font-black text-white leading-none" style={{ writingMode: "vertical-lr" }}>
                  2025
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Countdown Timer ── */}
        <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-tedx-red rounded-xl p-4 sm:p-8 md:p-12 inline-block bg-card/50"
        >
          <div className="flex items-center gap-1 sm:gap-4 md:gap-8 font-heading text-2xl sm:text-5xl md:text-8xl font-black">
            {[
              { val: time.days, label: "Days" },
              { val: time.hours, label: "Hours" },
              { val: time.minutes, label: "Min" },
              { val: time.seconds, label: "Sec" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-2 sm:gap-4 md:gap-8">
                {i > 0 && <span className="text-tedx-red text-base sm:text-4xl md:text-7xl">:</span>}
                <motion.div
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-foreground">
                    {pad(item.val)}
                  </span>
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
              <div className="marquee-sprocket whitespace-nowrap flex" style={{ willChange: 'transform' }}>
                {Array(mobile ? 20 : 40).fill(null).map((_, i) => (
                  <div key={`st-${i}`} className="w-4 h-3 bg-gray-800 border border-gray-700 rounded-sm mx-3 flex-shrink-0" />
                ))}
                {Array(mobile ? 20 : 40).fill(null).map((_, i) => (
                  <div key={`st2-${i}`} className="w-4 h-3 bg-gray-800 border border-gray-700 rounded-sm mx-3 flex-shrink-0" />
                ))}
              </div>
            </div>
            <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-700 z-10" />

            {/* Main film content area */}
            <div className="py-8 mt-5 mb-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-transparent to-red-950/40 pointer-events-none z-[1]" />
              <div className="marquee whitespace-nowrap relative z-[2]" style={{ willChange: 'transform' }}>
                {Array(mobile ? 4 : 8).fill(null).map((_, i) => (
                  <span key={i} className="font-heading text-4xl md:text-6xl font-black mx-8 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                    {i % 2 === 0 ? (
                      <span className="text-stroke-red">HURRY UP!</span>
                    ) : (
                      <span>HURRY <span className="text-tedx-red">UP!</span></span>
                    )}
                    <span className="mx-2 text-gray-600">|</span>
                  </span>
                ))}
                {Array(mobile ? 4 : 8).fill(null).map((_, i) => (
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
              <div className="marquee-sprocket whitespace-nowrap flex" style={{ willChange: 'transform' }}>
                {Array(mobile ? 20 : 40).fill(null).map((_, i) => (
                  <div key={`sb-${i}`} className="w-4 h-3 bg-gray-800 border border-gray-700 rounded-sm mx-3 flex-shrink-0" />
                ))}
                {Array(mobile ? 20 : 40).fill(null).map((_, i) => (
                  <div key={`sb2-${i}`} className="w-4 h-3 bg-gray-800 border border-gray-700 rounded-sm mx-3 flex-shrink-0" />
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
