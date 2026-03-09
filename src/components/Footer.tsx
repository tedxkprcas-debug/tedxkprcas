import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="border-t border-border py-6 sm:py-8 relative overflow-hidden safe-area-bottom bg-black">
      <motion.div
        className="absolute inset-0 pointer-events-none"
      />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          className="flex items-center justify-center gap-1 mb-1.5 sm:mb-2"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-muted-foreground text-sm sm:text-base">©</span>
          <span className="font-heading text-tedx-red text-sm sm:text-base tracking-[0em]">TED</span>
          <sup className="font-heading text-tedx-red text-[10px] sm:text-xs tracking-[0em]">x</sup>
          <span className="font-heading text-foreground ml-1 text-sm sm:text-base tracking-[0em]">KPRCAS</span>
        </motion.div>
        <p className="text-white text-xs sm:text-sm">
          This independent TED<sup>x</sup> event is operated under license from TED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
