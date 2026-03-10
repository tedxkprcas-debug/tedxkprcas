import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import { useCurrentEvent, useContactInfo, useSiteSetting } from "@/hooks/use-database";

const DEFAULT_REGISTRATION = "https://forms.gle/example";

const ThemeSection = () => {
  const [registrationLink, setRegistrationLink] = useState(DEFAULT_REGISTRATION);
  const { data: currentEvent } = useCurrentEvent();
  const { data: contactInfo } = useContactInfo();
  const { data: themeVideoUrl } = useSiteSetting("theme_video_url");

  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}`;
    return url;
  };

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
          className="rounded-2xl bg-black border border-white/10 px-6 sm:px-10 md:px-16 py-14 sm:py-20 md:py-28 text-center mb-4 sm:mb-6 relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-yellow-500/[0.03] rounded-full blur-3xl pointer-events-none" />

          {/* Main content */}
          <div
            className="relative z-10 flex flex-col lg:flex-row items-center justify-end gap-8 lg:gap-12"
          >

            {/* Animated Golden Arrow Chevrons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="gold1" x1="0" y1="0" x2="1" y2="0.5">
                    <stop offset="0%" stopColor="#b8862a" />
                    <stop offset="50%" stopColor="#f5d782" />
                    <stop offset="100%" stopColor="#d4a830" />
                  </linearGradient>
                  <linearGradient id="gold2" x1="0" y1="0" x2="1" y2="0.3">
                    <stop offset="0%" stopColor="#c49a2a" />
                    <stop offset="50%" stopColor="#e8c252" />
                    <stop offset="100%" stopColor="#b8862a" />
                  </linearGradient>
                  <linearGradient id="gold3" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#d4a830" />
                    <stop offset="60%" stopColor="#f0d068" />
                    <stop offset="100%" stopColor="#f5d782" />
                  </linearGradient>
                  <linearGradient id="gold4" x1="0" y1="0.5" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B6914" />
                    <stop offset="50%" stopColor="#c49a2a" />
                    <stop offset="100%" stopColor="#e8c252" />
                  </linearGradient>
                </defs>

                {/* Large outer arrows - horizontal bars with chevron tips */}
                {[
                  { y: 70, h: 32, gold: "url(#gold1)", delay: "0s" },
                  { y: 112, h: 24, gold: "url(#gold2)", delay: "0.15s" },
                  { y: 146, h: 20, gold: "url(#gold4)", delay: "0.3s" },
                  { y: 176, h: 24, gold: "url(#gold3)", delay: "0.15s" },
                  { y: 210, h: 32, gold: "url(#gold1)", delay: "0s" },
                ].map((bar, i) => (
                  <g key={`bar-${i}`} opacity="0.18">
                    {/* Horizontal bar */}
                    <rect x="-400" y={bar.y} width="700" height={bar.h} fill={bar.gold}>
                      <animate attributeName="x" from="-400" to="900" dur="4s" begin={bar.delay} repeatCount="indefinite" />
                    </rect>
                  </g>
                ))}

                {/* Chevron arrows moving right */}
                {[
                  { x: -200, size: 90, gold: "url(#gold3)", opacity: 0.25, dur: "3.5s", delay: "0s" },
                  { x: -320, size: 75, gold: "url(#gold1)", opacity: 0.2, dur: "3.5s", delay: "0.4s" },
                  { x: -440, size: 60, gold: "url(#gold2)", opacity: 0.15, dur: "3.5s", delay: "0.8s" },
                  { x: -560, size: 50, gold: "url(#gold4)", opacity: 0.12, dur: "3.5s", delay: "1.2s" },
                  { x: -150, size: 80, gold: "url(#gold1)", opacity: 0.22, dur: "4s", delay: "1.8s" },
                  { x: -350, size: 65, gold: "url(#gold3)", opacity: 0.18, dur: "4s", delay: "2.2s" },
                ].map((chev, i) => {
                  const cy = 150;
                  const s = chev.size;
                  return (
                    <g key={`chev-${i}`} opacity={chev.opacity}>
                      <polygon
                        points={`${chev.x},${cy - s} ${chev.x + s},${cy} ${chev.x},${cy + s} ${chev.x + s * 0.3},${cy + s} ${chev.x + s * 1.3},${cy} ${chev.x + s * 0.3},${cy - s}`}
                        fill={chev.gold}
                        stroke="#f5d782"
                        strokeWidth="1"
                        strokeOpacity="0.3"
                      >
                        <animateTransform attributeName="transform" type="translate" from="0 0" to="1200 0" dur={chev.dur} begin={chev.delay} repeatCount="indefinite" />
                      </polygon>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Retro TV */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-shrink-0 relative hidden lg:block"
              style={{ width: 380, height: 300 }}
            >
              {/* TV Glow */}
              <div className="absolute inset-0 bg-yellow-400/5 blur-3xl rounded-3xl pointer-events-none" />

              {/* Retro TV Frame */}
              <div className="relative w-full h-full" style={{ filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.7))' }}>
                {/* TV Body */}
                <div className="absolute inset-0 rounded-2xl" style={{
                  background: 'linear-gradient(145deg, #8B6914 0%, #6B4F12 20%, #5C4410 40%, #4A3B0E 60%, #3D310C 80%, #2E250A 100%)',
                  border: '3px solid #4A3B0E',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.6)',
                }}>
                  {/* Wood grain texture */}
                  <div className="absolute inset-0 rounded-2xl opacity-20" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 9px)',
                  }} />
                </div>

                {/* Screen bezel */}
                <div className="absolute rounded-xl" style={{
                  top: 22, left: 22, right: 115, bottom: 32,
                  background: 'linear-gradient(145deg, #a8a8a8 0%, #888 30%, #777 60%, #666 100%)',
                  padding: 12,
                  borderRadius: 16,
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
                }}>
                  {/* Inner screen */}
                  <div className="w-full h-full rounded-lg overflow-hidden relative" style={{
                    background: '#111',
                    boxShadow: 'inset 0 3px 15px rgba(0,0,0,0.8)',
                  }}>
                    {/* CRT curvature */}
                    <div className="absolute inset-0 z-10 pointer-events-none" style={{
                      background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
                    }} />
                    {/* Scanlines */}
                    <div className="absolute inset-0 z-10 pointer-events-none opacity-10" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                    }} />

                    {/* Video content */}
                    {themeVideoUrl ? (
                      themeVideoUrl.includes('youtube') || themeVideoUrl.includes('youtu.be') ? (
                        <iframe
                          src={getEmbedUrl(themeVideoUrl)}
                          className="w-full h-full"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          style={{ border: 'none' }}
                          title="Theme Video"
                        />
                      ) : (
                        <video
                          src={themeVideoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-gray-600 text-3xl mb-1">📺</div>
                          <p className="text-gray-600 text-[10px]">No signal</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right panel - dials */}
                <div className="absolute rounded-r-xl flex flex-col items-center justify-between py-6" style={{
                  top: 22, right: 14, width: 90, bottom: 32,
                }}>
                  <div className="text-[9px] tracking-widest text-yellow-200/40 uppercase">TEDx</div>

                  {/* Channel dial */}
                  <div className="w-14 h-14 rounded-full" style={{
                    background: 'linear-gradient(145deg, #999 0%, #666 50%, #555 100%)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)',
                  }}>
                    <div className="w-full h-full rounded-full relative" style={{
                      background: 'linear-gradient(145deg, #777 0%, #555 100%)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                    }}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="absolute w-0.5 h-1 bg-gray-400/50" style={{
                          top: '50%', left: '50%',
                          transform: `rotate(${i * 45}deg) translateY(-12px) translateX(-50%)`,
                        }} />
                      ))}
                    </div>
                  </div>

                  {/* Volume dial */}
                  <div className="w-11 h-11 rounded-full" style={{
                    background: 'linear-gradient(145deg, #888 0%, #555 100%)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  }} />

                  {/* Speaker grille */}
                  <div className="w-16 flex flex-col gap-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="w-full h-0.5 bg-yellow-900/30 rounded-full" />
                    ))}
                  </div>
                </div>

                {/* TV Stand */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 rounded-b-lg" style={{
                  background: 'linear-gradient(180deg, #2E250A 0%, #1a1a0a 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }} />
              </div>
            </motion.div>
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
