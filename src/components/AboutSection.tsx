import { motion } from "framer-motion";

const stats = [
  { number: "3+", label: "Events" },
  { number: "25+", label: "Speakers" },
  { number: "50+", label: "Community Members" },
  { number: "20+", label: "Active Members" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* About text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-5xl md:text-7xl font-black text-foreground uppercase mb-8">About</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              TEDx KPRCAS is a locally organised independently run event. Rooted in the spirit of TED's mission,
              it brings together thought leaders, innovators, and changemakers to share ideas worth spreading.
              At KPR College of Arts Science and Research, we celebrate the power of storytelling, innovation,
              and community building through extraordinary talks and experiences.
            </p>
          </motion.div>

          {/* Stats */}
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
                className="border-b border-border pb-6"
              >
                <span className="font-heading text-5xl font-black text-tedx-red">{stat.number}</span>
                <span className="font-heading text-2xl text-foreground ml-2">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <div className="mt-20 overflow-hidden border-y border-border py-4">
        <div className="marquee whitespace-nowrap">
          {Array(10).fill("TEDx KPRCAS").map((text, i) => (
            <span key={i} className="font-heading text-lg text-muted-foreground mx-8">{text} -</span>
          ))}
          {Array(10).fill("TEDx KPRCAS").map((text, i) => (
            <span key={`d-${i}`} className="font-heading text-lg text-muted-foreground mx-8">{text} -</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
