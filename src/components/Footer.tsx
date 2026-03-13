import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="border-t border-border py-6 sm:py-8 relative overflow-hidden safe-area-bottom bg-black">
      <motion.div
        className="absolute inset-0 pointer-events-none"
      />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          className="flex items-center justify-center gap-2 mb-3 sm:mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <img src="/logo.png" alt="TEDx KPRCAS" className="h-8 sm:h-10 md:h-12 w-auto" />
        </motion.div>
        <p className="text-white text-xs sm:text-sm">
          This independent TED<sup>x</sup> event is operated under license from TED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
