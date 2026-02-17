import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import { useAboutInfo } from "@/hooks/use-database";

const stats = [
  { number: "3+", label: "Events" },
  { number: "25+", label: "Speakers" },
  { number: "50+", label: "Community Members" },
  { number: "20+", label: "Active Members" },
];

const AboutSection = () => {
  const { data: aboutData, isLoading, isError, error } = useAboutInfo();

  // Use database content if available, otherwise show default
  const content = aboutData?.content || "TEDx KPRCAS is a locally organised independently run event. Rooted in the spirit of TED's mission, it brings together thought leaders, innovators, and changemakers to share ideas worth spreading. At KPR College of Arts Science and Research, we celebrate the power of storytelling, innovation, and community building through extraordinary talks and experiences.";

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <AnimatedBackground variant="default" particleCount={6} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 10, borderColor: "hsl(0 84% 50%)" }}
                className="border-b border-border pb-6 cursor-default transition-colors"
              >
                <motion.span
                  className="font-heading text-5xl font-black text-tedx-red inline-block"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.number}
                </motion.span>
                <span className="font-heading text-2xl text-foreground ml-2">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Film Roll Marquee */}
      <div className="mt-20 relative">
        {/* Film strip container */}
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
          {/* Top film border */}
          <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-700 z-10" />

          {/* Main film content area */}
          <div className="py-8 mt-5 mb-5 relative overflow-hidden">
            {/* Red gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-transparent to-red-950/40 pointer-events-none z-[1]" />
            {/* Scrolling text */}
            <div className="marquee whitespace-nowrap relative z-[2]">
              {Array(10).fill("TEDx KPRCAS").map((text, i) => (
                <span key={i} className="font-heading text-2xl md:text-3xl font-bold text-white/90 mx-8 tracking-wider drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  {text} <span className="text-tedx-red">●</span>
                </span>
              ))}
              {Array(10).fill("TEDx KPRCAS").map((text, i) => (
                <span key={`d-${i}`} className="font-heading text-2xl md:text-3xl font-bold text-white/90 mx-8 tracking-wider drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  {text} <span className="text-tedx-red">●</span>
                </span>
              ))}
            </div>
          </div>

          {/* Bottom film border */}
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
    </section>
  );
};

export default AboutSection;
