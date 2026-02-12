import { motion } from "framer-motion";

const speakers = [
  { name: "Speaker 1", role: "To Be Announced", initial: "S1" },
  { name: "Speaker 2", role: "To Be Announced", initial: "S2" },
  { name: "Speaker 3", role: "To Be Announced", initial: "S3" },
];

const SpeakersSection = () => {
  return (
    <section id="speakers" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-5xl md:text-7xl font-black uppercase mb-4"
        >
          Our <span className="text-tedx-red">Speakers</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg mb-16"
        >
          Stay tuned for our incredible lineup of speakers.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, i) => (
            <motion.div
              key={speaker.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="border border-tedx-red/30 rounded-lg p-6 hover:border-tedx-red/60 transition-colors group"
            >
              <div className="w-full aspect-square bg-muted rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <span className="font-heading text-6xl text-tedx-red/30 group-hover:text-tedx-red/60 transition-colors">
                  {speaker.initial}
                </span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground uppercase">{speaker.name}</h3>
              <p className="text-tedx-red font-heading text-sm uppercase tracking-wider mt-1">{speaker.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
