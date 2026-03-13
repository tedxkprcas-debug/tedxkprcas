import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";
import FlipCountdown from "./ui/flip-countdown";
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
  const [registrationLink, setRegistrationLink] = useState(DEFAULT_REGISTRATION);
  const [targetDate, setTargetDate] = useState<Date>(DEFAULT_TARGET);
  const bp = useBreakpoint();
  const mobile = bp === "sm";

  // Fetch event date and contact info from database
  const { data: currentEvent } = useCurrentEvent();
  const { data: contactInfo } = useContactInfo();

  // Update target date when event data is fetched from database
  useEffect(() => {
    if (currentEvent?.date) {
      console.log("📅 Event date from database:", currentEvent.date);
      const dbDate = new Date(currentEvent.date);
      console.log("📅 Parsed date:", dbDate.toString());
      if (!isNaN(dbDate.getTime())) {
        setTargetDate(dbDate);
        return;
      }
    }
    
    console.log("📅 Using default date:", DEFAULT_TARGET.toString());
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

  return (
    <section className="py-10 sm:py-14 md:py-20 lg:py-24 relative overflow-hidden">
      <AnimatedBackground variant="accent" particleCount={8} />

      <div className="container mx-auto px-4 relative z-10">
        {/* ── Countdown Timer ── */}
        <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-tedx-red/30 rounded-xl p-4 sm:p-6 md:p-8 lg:p-10 inline-block bg-black/60 backdrop-blur-sm max-w-full"
        >
          {/* FlipDown Style Countdown */}
          <FlipCountdown targetDate={targetDate} />
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
                    <span key={i} className="font-body text-3xl sm:text-4xl md:text-6xl mx-4 sm:mx-8 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                    {i % 2 === 0 ? (
                      <span className="text-stroke-red">HURRY UP!</span>
                    ) : (
                      <span>HURRY <span className="text-tedx-red">UP!</span></span>
                    )}
                    <span className="mx-1 sm:mx-2 text-gray-600">|</span>
                  </span>
                ))}
                {Array(mobile ? 4 : 8).fill(null).map((_, i) => (
                  <span key={`d-${i}`} className="font-body text-3xl sm:text-4xl md:text-6xl mx-4 sm:mx-8 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
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
