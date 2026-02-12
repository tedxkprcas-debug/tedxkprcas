import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";

const GOOGLE_FORM_LINK = "#";

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
      <AnimatedBackground variant="hero" particleCount={12} />
      <div className="absolute inset-0 bg-gradient-to-b from-tedx-red/5 via-transparent to-background/50 pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block border border-tedx-red/30 rounded-full px-6 py-2 mb-8"
          whileHover={{ scale: 1.05, borderColor: "hsl(0 84% 50%)" }}
        >
          <span className="text-tedx-red text-sm tracking-wide">x = Independently organised TED event</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-4"
        >
          <motion.span
            className="font-heading text-7xl md:text-9xl font-black text-tedx-red inline-block"
            animate={{ textShadow: ["0 0 20px hsl(0 84% 50% / 0.3)", "0 0 60px hsl(0 84% 50% / 0.6)", "0 0 20px hsl(0 84% 50% / 0.3)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            TED
          </motion.span>
          <span className="font-heading text-5xl md:text-7xl font-black text-foreground relative -left-1">
            <sup className="text-tedx-red">x</sup>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="font-heading text-4xl md:text-6xl font-bold text-foreground tracking-wider mb-4"
        >
          KPRCAS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-muted-foreground text-lg max-w-xl mx-auto mb-4"
        >
          KPR College of Arts Science and Research
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Join us for an extraordinary experience of ideas, innovation, and inspiration. Where thoughts transform into movements.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.a
            href={GOOGLE_FORM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-tedx-red hover:bg-tedx-dark-red text-foreground font-heading font-bold text-lg px-8 py-3 rounded flex items-center gap-2 transition-colors relative overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(0 84% 50% / 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <span className="relative z-10 flex items-center gap-2">Register Now <ArrowRight size={20} /></span>
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex flex-wrap justify-center gap-8 text-muted-foreground text-sm"
        >
          {[
            { icon: Calendar, text: "Coming Soon 2025" },
            { icon: MapPin, text: "KPRCAS Campus" },
            { icon: Users, text: "500+ Attendees" },
          ].map((item, i) => (
            <motion.div
              key={item.text}
              className="flex items-center gap-2"
              whileHover={{ scale: 1.1, color: "hsl(0 0% 100%)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <item.icon size={16} className="text-tedx-red" />
              {item.text}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
