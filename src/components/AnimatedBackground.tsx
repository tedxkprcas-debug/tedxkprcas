import { motion } from "framer-motion";

interface FloatingParticle {
  size: number;
  x: string;
  y: string;
  duration: number;
  delay: number;
  color: "red" | "white";
}

interface AnimatedBackgroundProps {
  variant?: "hero" | "default" | "accent" | "grid";
  particleCount?: number;
}

const AnimatedBackground = ({ variant = "default", particleCount = 8 }: AnimatedBackgroundProps) => {
  const particles: FloatingParticle[] = Array.from({ length: particleCount }, (_, i) => ({
    size: 4 + Math.random() * 6,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    duration: 10 + Math.random() * 15,
    delay: Math.random() * 5,
    color: Math.random() > 0.6 ? "red" : "white",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating orbs */}
      {variant !== "grid" &&
        [...Array(3)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className={`absolute rounded-full blur-3xl ${
              i % 2 === 0 ? "bg-tedx-red/[0.04]" : "bg-foreground/[0.02]"
            }`}
            style={{
              width: 250 + i * 100,
              height: 250 + i * 100,
              left: `${15 + i * 25}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -35, 20, 0],
              scale: [1, 1.15, 0.9, 1],
              opacity: [0.5, 0.8, 0.4, 0.5],
            }}
            transition={{
              duration: 12 + i * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}

      {/* Small floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={`p-${i}`}
          className={`absolute rounded-full ${
            p.color === "red" ? "bg-tedx-red/20" : "bg-foreground/10"
          }`}
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
          }}
          animate={{
            y: [0, -30, 10, 0],
            x: [0, 15, -10, 0],
            opacity: [0, 0.8, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* Hero-specific shooting lines */}
      {variant === "hero" && (
        <>
          <motion.div
            className="absolute left-0 top-1/3 w-full h-[1px] bg-gradient-to-r from-transparent via-tedx-red/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute left-0 top-2/3 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      {/* Grid pattern for accent variant */}
      {variant === "grid" && (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--tedx-red)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--tedx-red)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      )}

      {/* Accent variant pulsing ring */}
      {variant === "accent" && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-tedx-red/10"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.15, 0, 0.15],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
};

export default AnimatedBackground;
