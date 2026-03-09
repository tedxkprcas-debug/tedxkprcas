import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import { useCurrentEvent, useContactInfo } from "@/hooks/use-database";

const DEFAULT_REGISTRATION = "https://forms.gle/example";

const ThemeSection = () => {
  const [registrationLink, setRegistrationLink] = useState(DEFAULT_REGISTRATION);
  const { data: currentEvent } = useCurrentEvent();
  const { data: contactInfo } = useContactInfo();

  useEffect(() => {
    if (contactInfo?.registrationLink) {
      setRegistrationLink(contactInfo.registrationLink);
      return;
    }
    const savedContact = localStorage.getItem("tedx_contact");
    if (savedContact) {
      try {
        const contactData = JSON.parse(savedContact);
        setRegistrationLink(contactData.registrationLink || DEFAULT_REGISTRATION);
      } catch { /* ignore */ }
    }
  }, [contactInfo]);

  // Get event date
  let eventDay = "10";
  let eventMonth = "APR";
  let eventYear = "2026";
  if (currentEvent?.date) {
    const d = new Date(currentEvent.date);
    if (!isNaN(d.getTime())) {
      eventDay = String(d.getDate()).padStart(2, "0");
      eventMonth = d.toLocaleString("en", { month: "short" }).toUpperCase();
      eventYear = String(d.getFullYear());
    }
  }

  return (
    <section className="relative py-0 overflow-hidden bg-black">
      <AnimatedBackground variant="accent" particleCount={8} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* ── Theme Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-black border border-white/10 px-6 sm:px-10 md:px-16 py-14 sm:py-20 md:py-28 text-center mb-4 sm:mb-6 overflow-hidden relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-yellow-500/[0.03] rounded-full blur-3xl pointer-events-none" />

          {/* Main content */}
          <div
            className="relative z-10 flex items-center justify-center"
          >

            {/* Golden Metallic Title */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative whitespace-nowrap leading-none tracking-[0.08em]"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontVariant: "small-caps",
              }}
            >
              <span className="inline-flex items-baseline gap-[0.15em] sm:gap-[0.2em]">
                {["The", "Golden", "Bird"].map((word) => (
                  <span key={word} className="inline-flex">
                    {word.split("").map((letter, li) => {
                      const isFirst = li === 0;
                      return (
                        <span
                          key={`${word}-${li}`}
                          className={`inline-block ${isFirst ? "text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl" : "text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"}`}
                          style={{
                            background: "linear-gradient(180deg, #f5d782 0%, #e8c252 18%, #d4a830 35%, #c49a2a 50%, #b8862a 65%, #d4a830 80%, #f0d068 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6)) drop-shadow(0 0 8px rgba(212,168,48,0.3))",
                          }}
                        >
                          {letter}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </span>
            </motion.h2>
          </div>
        </motion.div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Card 1: Speaker Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/5] bg-gradient-to-b from-gray-800/50 to-gray-900/50"
          >
            <img
              src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=500&fit=crop&crop=faces"
              alt="TEDx Speaker"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />

          </motion.div>

          {/* Card 2: Theme Bird Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/5] bg-black flex items-center justify-center"
          >
            <img
              src="/theme.jpg"
              alt="The Golden Bird"
              className="w-full h-full object-contain p-4"
            />
          </motion.div>

          {/* Card 3: Book Tickets + Date */}
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
              className="bg-tedx-red hover:bg-red-700 text-white font-heading text-lg sm:text-xl md:text-2xl px-6 sm:px-8 py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-3 transition-colors"
              whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(0 84% 50% / 0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              BOOK TICKETS <ArrowUpRight className="w-6 h-6" />
            </motion.a>

            {/* Date Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -3 }}
              className="flex-1 min-h-[160px] sm:min-h-[180px] rounded-2xl bg-black border border-white/10 flex items-center justify-center p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-center">
                  <span className="font-heading text-5xl sm:text-6xl md:text-7xl text-tedx-red leading-none block">{eventDay}</span>
                  <span className="font-heading text-3xl sm:text-4xl md:text-5xl text-tedx-red leading-none block -mt-1">{eventMonth}</span>
                </div>
                <div className="w-[3px] h-16 sm:h-20 md:h-24 bg-white/30 rounded-full" />
                <div className="font-heading text-4xl sm:text-5xl md:text-6xl text-white leading-none" style={{ writingMode: "vertical-lr" }}>
                  {eventYear}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ThemeSection;
