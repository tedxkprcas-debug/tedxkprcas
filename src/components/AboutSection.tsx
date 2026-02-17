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

      {/* Train Marquee */}
      <div className="mt-20 relative overflow-hidden pb-4">
        {/* Rail tracks */}
        <div className="absolute bottom-3 left-0 right-0 z-0">
          <div className="h-[3px] bg-gray-500 mb-[6px]" />
          <div className="h-[3px] bg-gray-500" />
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
                <div className={`relative rounded-t-xl border-2 px-6 md:px-10 py-4 md:py-6 ${
                  i === 0
                    ? "bg-gradient-to-b from-red-700 to-red-900 border-red-600 rounded-tl-2xl"
                    : "bg-gradient-to-b from-gray-800 to-gray-950 border-gray-600"
                }`}>
                  {i === 0 && (
                    <div className="absolute -top-5 left-6 w-4 h-5 bg-gray-800 border-2 border-gray-600 rounded-t-md" />
                  )}
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
