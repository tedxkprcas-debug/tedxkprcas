import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import { useAboutInfo } from "@/hooks/use-database";

/* ── Animation: Orbiting Rings (About section right side) ── */
const OrbitingRingsAnimation = () => (
  <div className="relative w-full h-[350px] md:h-[420px] flex items-center justify-center">
    {/* Central pulsing core */}
    <motion.div
      className="absolute w-16 h-16 rounded-full bg-tedx-red/20 border-2 border-tedx-red/60"
      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-6 h-6 rounded-full bg-tedx-red/80"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Ring 1 */}
    <motion.div
      className="absolute w-40 h-40 md:w-52 md:h-52 rounded-full border border-tedx-red/30"
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-tedx-red shadow-[0_0_15px_rgba(239,68,68,0.8)]"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>

    {/* Ring 2 */}
    <motion.div
      className="absolute w-60 h-60 md:w-80 md:h-80 rounded-full border border-red-500/20"
      style={{ rotateX: "60deg" }}
      animate={{ rotate: -360 }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.7)]"
      />
      <motion.div
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.7)]"
      />
    </motion.div>

    {/* Ring 3 */}
    <motion.div
      className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-red-800/15"
      style={{ rotateY: "60deg" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-300/60 shadow-[0_0_8px_rgba(252,165,165,0.5)]"
      />
    </motion.div>

    {/* Floating particles */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5 rounded-full bg-tedx-red/40"
        style={{
          left: `${20 + Math.random() * 60}%`,
          top: `${20 + Math.random() * 60}%`,
        }}
        animate={{
          y: [0, -20, 0, 20, 0],
          x: [0, 10, 0, -10, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 3 + i * 0.5,
          repeat: Infinity,
          delay: i * 0.4,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

const AboutSection = () => {
  const { data: aboutData, isLoading, isError, error } = useAboutInfo();

  const content = aboutData?.content || "TEDx KPRCAS is a locally organised independently run event. Rooted in the spirit of TED's mission, it brings together thought leaders, innovators, and changemakers to share ideas worth spreading. At KPR College of Arts Science and Research, we celebrate the power of storytelling, innovation, and community building through extraordinary talks and experiences.";

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <AnimatedBackground variant="default" particleCount={6} />

      <div className="container mx-auto px-4 relative z-10">
        {/* ── About Row: Text left, Orbiting Rings right ── */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="font-heading text-5xl md:text-7xl font-black text-foreground uppercase mb-8"
              whileInView={{ opacity: [0, 1], y: [30, 0] }}
              viewport={{ once: true }}
            >
              About
            </motion.h2>
            {isError ? (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-500 font-medium text-sm">Error loading about information</p>
                  <p className="text-muted-foreground text-xs mt-1">{error?.message || "Unable to load content at this time."}</p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
              </div>
            ) : (
              <p className="text-muted-foreground leading-relaxed text-lg">
                {content}
              </p>
            )}
          </motion.div>

          {/* Right side: Orbiting Rings Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <OrbitingRingsAnimation />
          </motion.div>
        </div>
      </div>

      {/* Train Marquee */}
      <div className="mt-20 relative overflow-hidden pb-4">
        {/* Rail tracks */}
        <div className="absolute bottom-3 left-0 right-0 z-0">
          <div className="h-[3px] bg-gray-500 mb-[6px]" />
          <div className="h-[3px] bg-gray-500" />
          <div className="absolute top-0 left-0 right-0 h-full flex">
            {Array(160).fill(null).map((_, i) => (
              <div key={i} className="w-[3px] h-full bg-gray-600 flex-shrink-0" style={{ marginLeft: '20px' }} />
            ))}
          </div>
        </div>

        {/* Train carriages */}
        <div className="marquee whitespace-nowrap flex items-end relative z-10">
          {Array(16).fill(null).map((_, i) => (
            <div key={i} className="inline-flex flex-shrink-0 items-end mx-1">
              <div className="relative">
                <div className="relative rounded-t-xl border-2 px-6 md:px-10 py-4 md:py-6 bg-gradient-to-b from-gray-800 to-gray-950 border-gray-600">
                  <span className="font-heading text-2xl md:text-3xl font-black">
                    <span className="text-tedx-red">TED</span><sup className="text-tedx-red text-xs">x</sup>{" "}
                    <span className="text-white">KPRCAS</span>
                  </span>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-3 bg-gray-600 rounded-sm z-20" />
                </div>
                <div className="h-3 bg-gray-800 border-x-2 border-gray-600" />
                <div className="flex justify-between px-3 -mb-1 relative">
                  <div className="flex gap-1">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-yellow-600" /></div>
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-yellow-600" /></div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-yellow-600" /></div>
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-900 border-[3px] border-gray-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-yellow-600" /></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
