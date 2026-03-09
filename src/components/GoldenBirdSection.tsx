import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const GoldenBirdSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate random geometric shapes
  const shapes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 60 + Math.random() * 200,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 2,
    type: ["cube", "hex"][Math.floor(Math.random() * 2)],
    opacity: 0.1 + Math.random() * 0.2,
  }));

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-slate-950 via-red-950 to-black overflow-hidden flex items-center justify-center"
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              width: shape.size,
              height: shape.size,
            }}
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 360],
              rotateZ: [0, 180],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {shape.type === "cube" ? (
              <div
                className="w-full h-full"
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="w-full h-full bg-red-700 opacity-40 border-2 border-red-600"
                  style={{
                    transform: "rotateX(45deg) rotateY(45deg)",
                  }}
                />
              </div>
            ) : (
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                opacity={shape.opacity}
              >
                <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="none" stroke="#dc2626" strokeWidth="2" />
              </svg>
            )}
          </motion.div>
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="border border-red-900/40 rounded-2xl bg-gradient-to-br from-black/60 via-red-950/30 to-black/80 backdrop-blur-sm p-8 md:p-12 lg:p-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left side - Text content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Theme label */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <p className="text-red-500 text-sm md:text-base tracking-widest uppercase">
                  THEME
                </p>
              </motion.div>

              {/* Main title */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6"
              >
                <h2 className="text-5xl md:text-7xl lg:text-8xl tracking-tighter">
                  <span className="text-white">THE</span>{" "}
                  <span className="text-yellow-400 drop-shadow-lg">GOLDEN</span>
                  <br />
                  <span className="text-white">BIRD</span>
                </h2>
              </motion.div>

              {/* Decorative dots */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center justify-center lg:justify-start gap-2 mb-8"
              >
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <div className="w-3 h-3 rounded-full bg-red-500" />
              </motion.div>

              {/* Subtitle/Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-lg"
              >
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                  Discover the elegance and brilliance of our most luxurious theme experience
                </p>
              </motion.div>
            </div>

            {/* Right side - Golden Bird Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex-shrink-0 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10 flex items-center justify-center">
                <img
                  src="/theme.jpg"
                  alt="The Golden Bird"
                  className="w-4/5 h-4/5 object-contain drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]"
                />
              </div>
              {/* Glow effect behind the bird */}
              <div className="absolute inset-0 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
};

export default GoldenBirdSection;
