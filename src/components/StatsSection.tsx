import { motion } from "framer-motion";
import { Mic2, Users, Lightbulb, HeartHandshake, Sparkles, Star, Flame, Zap } from "lucide-react";
import { useThemeStats } from "@/hooks/use-database";

const iconMap: Record<string, any> = {
  sparkles: Sparkles,
  star: Star,
  flame: Flame,
  zap: Zap,
  lightbulb: Lightbulb,
  mic2: Mic2,
  users: Users,
  hearth: HeartHandshake,
};

const stats = [
  {
    number: "3+",
    label: "Events",
    description: "Curated sessions exploring bold ideas",
    icon: Lightbulb,
    color: "from-tedx-red/20 to-tedx-red/5",
  },
  {
    number: "7+",
    label: "Speakers",
    description: "Thought leaders sharing transformative stories",
    icon: Mic2,
    color: "from-red-500/15 to-red-400/5",
  },
  {
    number: "50+",
    label: "Community Members",
    description: "Growing community of changemakers",
    icon: Users,
    color: "from-tedx-red/15 to-rose-500/5",
  },
  {
    number: "20+",
    label: "Active Members",
    description: "Dedicated organisers behind the scenes",
    icon: HeartHandshake,
    color: "from-red-600/15 to-tedx-red/5",
  },
];

const StatsSection = () => {
  const { data: themeStats } = useThemeStats();

  return (
    <section className="py-10 sm:py-14 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* ── Theme Stats Section (Centered) ── */}
        {themeStats && themeStats.length > 0 && (
          <div className="mb-16 sm:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex justify-center mb-6 sm:mb-8"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-tedx-red/10 flex items-center justify-center border border-tedx-red/20">
                  {(() => {
                    const IconComponent = iconMap[themeStats[0]?.icon] || Sparkles;
                    return <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-tedx-red" />;
                  })()}
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 sm:mb-8 uppercase tracking-wider"
              >
                {themeStats[0]?.title || "Our Theme"}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light"
              >
                {themeStats[0]?.description || ""}
              </motion.p>
            </motion.div>
          </div>
        )}

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <span className="text-tedx-red font-heading text-sm tracking-[0.3em] uppercase block mb-3">
            Quick Snapshot
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-foreground mb-3 sm:mb-4">
            By The Numbers
          </h2>
          <div className="w-16 h-1 bg-tedx-red mx-auto rounded-full" />
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-card/50
                         p-4 sm:p-5 md:p-6 lg:p-8 overflow-hidden cursor-default transition-colors
                         hover:border-tedx-red/30 active:border-tedx-red/30"
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Icon */}
              <div className="relative z-10 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-tedx-red/10 flex items-center justify-center
                              group-hover:bg-tedx-red/20 transition-colors">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-tedx-red" />
                </div>
              </div>

              {/* Number */}
              <motion.span
                className="relative z-10 font-heading text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl text-tedx-red block mb-1"
                whileHover={{ scale: 1.05 }}
              >
                {stat.number}
              </motion.span>

              {/* Label */}
              <span className="relative z-10 font-heading text-xs sm:text-sm md:text-base text-foreground block mb-1 sm:mb-2">
                {stat.label}
              </span>

              {/* Description */}
              <p className="relative z-10 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {stat.description}
              </p>

              {/* Corner accent */}
              <div className="absolute -bottom-1 -right-1 w-16 h-16 border-r-2 border-b-2 border-tedx-red/10
                            group-hover:border-tedx-red/30 rounded-br-2xl transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
