import { motion } from "framer-motion";

const ThemeSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-36 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-tedx-red/5 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Golden particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-yellow-400/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Theme label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4 sm:mb-6"
          >
            <span className="text-tedx-red font-heading text-sm sm:text-base md:text-lg tracking-[0.3em] uppercase font-medium">
              Theme
            </span>
          </motion.div>

          {/* Main theme title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            className="relative"
          >
            {/* Decorative line left */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 1 }}
              className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent -z-10"
            />

            <h2 className="font-body text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-9xl uppercase leading-tight">
              <span className="text-white">The </span>
              <motion.span
                className="relative inline-block"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(234, 179, 8, 0.3)",
                    "0 0 40px rgba(234, 179, 8, 0.5)",
                    "0 0 20px rgba(234, 179, 8, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                  Golden
                </span>
              </motion.span>
              <span className="text-white"> Bird</span>
            </h2>
          </motion.div>

          {/* Decorative dots */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex justify-center gap-2 mt-8"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                className={`w-2 h-2 rounded-full ${i === 2 ? "bg-yellow-500" : "bg-tedx-red/60"}`}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ThemeSection;
