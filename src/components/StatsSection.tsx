import { motion } from "framer-motion";
import { Mic2, Users, Lightbulb, HeartHandshake } from "lucide-react";

const stats = [
  {
    number: "3+",
    label: "Events",
    description: "Curated sessions exploring bold ideas",
    icon: Lightbulb,
    color: "from-tedx-red/20 to-tedx-red/5",
  },
  {
    number: "25+",
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
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-tedx-red font-heading text-sm tracking-[0.3em] uppercase block mb-3">
            Quick Snapshot
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            By The Numbers
          </h2>
          <div className="w-16 h-1 bg-tedx-red mx-auto rounded-full" />
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-card/50 backdrop-blur-sm
                         p-5 sm:p-6 md:p-8 overflow-hidden cursor-default transition-colors
                         hover:border-tedx-red/30"
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
                className="relative z-10 font-heading text-3xl sm:text-4xl md:text-5xl font-black text-tedx-red block mb-1"
                whileHover={{ scale: 1.05 }}
              >
                {stat.number}
              </motion.span>

              {/* Label */}
              <span className="relative z-10 font-heading text-base sm:text-lg font-bold text-foreground block mb-2">
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
