import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import CountdownCounter from "./ui/counter-loader";
import { useCurrentEvent, useContactInfo } from "@/hooks/use-database";

const DEFAULT_TARGET = new Date("2026-04-10T09:00:00");
const DEFAULT_REGISTRATION = "https://forms.gle/example";

/** Reactive mobile / tablet detection */
const useBreakpoint = () => {
  const getSize = () => {
    if (typeof window === "undefined") return "sm";
    const w = window.innerWidth;
    if (w < 640) return "sm";
    if (w < 768) return "md";
    if (w < 1024) return "lg";
    return "xl";
  };
  const [bp, setBp] = useState(getSize);
  useEffect(() => {
    const onResize = () => setBp(getSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return bp;
};

const CountdownSection = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [registrationLink, setRegistrationLink] = useState(DEFAULT_REGISTRATION);
  const [targetDate, setTargetDate] = useState<Date>(DEFAULT_TARGET);
  const bp = useBreakpoint();
  const mobile = bp === "sm";
  const counterSize = bp === "sm" ? 7 : bp === "md" ? 12 : bp === "lg" ? 16 : 18;

  // Fetch event date and contact info from database
  const { data: currentEvent } = useCurrentEvent();
  const { data: contactInfo } = useContactInfo();

  // Update target date when event data is fetched from database
  useEffect(() => {
    if (currentEvent?.date) {
      const dbDate = new Date(currentEvent.date);
      if (!isNaN(dbDate.getTime())) {
        setTargetDate(dbDate);
        return;
      }
    }
    
    // Fallback to localStorage if no database event
    const saved = localStorage.getItem("tedx_event_countdown");
    if (saved) {
      const parsed = new Date(saved);
      if (!isNaN(parsed.getTime())) setTargetDate(parsed);
    }

    // Listen for changes from admin (same tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "tedx_event_countdown" && e.newValue) {
        const d = new Date(e.newValue);
        if (!isNaN(d.getTime())) setTargetDate(d);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [currentEvent]);

  // Update registration link from database or localStorage
  useEffect(() => {
    if (contactInfo?.registrationLink) {
      setRegistrationLink(contactInfo.registrationLink);
      return;
    }

    // Fallback to localStorage
    const savedContact = localStorage.getItem("tedx_contact");
    if (savedContact) {
      try {
        const contactData = JSON.parse(savedContact);
        setRegistrationLink(contactData.registrationLink || DEFAULT_REGISTRATION);
      } catch (e) {
        console.error("Error parsing contact data:", e);
      }
    }
  }, [contactInfo]);

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
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
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="py-10 sm:py-14 md:py-20 lg:py-24 relative overflow-hidden">
      <AnimatedBackground variant="accent" particleCount={8} />

      <div className="container mx-auto px-4 relative z-10">
        {/* ── Three Feature Cards Above Timer ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto mb-6 sm:mb-10 md:mb-16">
          {/* Card 1: Speaker Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/5] bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm"
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
            className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/5] bg-white flex items-center justify-center"
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
            className="flex flex-col gap-4 sm:col-span-2 md:col-span-1"
          >
            {/* Book Tickets Button */}
            <motion.a
              href={registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-tedx-red hover:bg-tedx-dark-red text-white font-heading font-black text-base sm:text-lg md:text-2xl px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-2xl flex items-center justify-center gap-2 sm:gap-3 transition-colors"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(0 84% 50% / 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              BOOK TICKETS <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.a>

            {/* Date Card */}
            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              className="flex-1 min-h-[120px] sm:min-h-[140px] rounded-2xl bg-black border border-white/10 flex items-center justify-center p-3 sm:p-5 md:p-8"
            >
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="text-center">
                  <span className="font-heading text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-tedx-red leading-none block">10</span>
                  <span className="font-heading text-2xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-tedx-red leading-none block -mt-1">APR</span>
                </div>
                <div className="w-[2px] sm:w-[3px] h-12 sm:h-16 md:h-20 lg:h-28 bg-white/30 rounded-full" />
                <div className="font-heading text-3xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white leading-none" style={{ writingMode: "vertical-lr" }}>
                  2026
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
          className="border border-tedx-red rounded-xl p-2 sm:p-3 md:p-6 lg:p-8 inline-block bg-card/50 backdrop-blur-sm max-w-full"
        >
          {/* Single CountdownCounter - sized reactively */}
          <CountdownCounter
            days={time.days}
            hours={time.hours}
            minutes={time.minutes}
            seconds={time.seconds}
            color="#ffffff"
            size={counterSize}
          />
        </motion.div>

        {/* Film Roll Marquee */}
        <div className="mt-8 sm:mt-10 md:mt-12 relative">
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
                    <span key={i} className="font-heading text-3xl sm:text-4xl md:text-6xl font-black mx-4 sm:mx-8 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                    {i % 2 === 0 ? (
                      <span className="text-stroke-red">HURRY UP!</span>
                    ) : (
                      <span>HURRY <span className="text-tedx-red">UP!</span></span>
                    )}
                    <span className="mx-1 sm:mx-2 text-gray-600">|</span>
                  </span>
                ))}
                {Array(mobile ? 4 : 8).fill(null).map((_, i) => (
                  <span key={`d-${i}`} className="font-heading text-3xl sm:text-4xl md:text-6xl font-black mx-4 sm:mx-8 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
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
