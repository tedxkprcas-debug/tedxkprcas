import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import { useSpeakers } from "@/hooks/use-database";
import { Carousel, SpeakerCard } from "./ui/speakers-carousel";
import type { iSpeaker } from "./ui/speakers-carousel";

const SpeakersSection = () => {
  const { data: speakers = [], isLoading, isError, error } = useSpeakers();

  return (
    <section id="speakers" className="py-12 sm:py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      <AnimatedBackground variant="grid" particleCount={5} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase mb-3 sm:mb-4"
        >
          Our <span className="text-tedx-red">Speakers</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm sm:text-base md:text-lg mb-8 sm:mb-12 md:mb-16"
        >
          Stay tuned for our incredible lineup of speakers.
        </motion.p>

        {isError ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-tedx-red" />
              <p className="text-tedx-red text-lg font-medium">Error loading speakers</p>
            </div>
            <p className="text-muted-foreground text-sm">
              {error?.message || "Unable to load speaker information at this time."}
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Please check back later or contact us for more information.
            </p>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-tedx-red/30 border-t-tedx-red rounded-full animate-spin"></div>
            </div>
            <p className="text-muted-foreground text-xl mt-4 animate-pulse">Loading speakers...</p>
          </motion.div>
        ) : speakers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-6"
            >
              <div className="text-6xl mb-4">🎤</div>
            </motion.div>
            <p className="text-muted-foreground text-xl font-medium">
              Speaker details coming soon!
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Check back later for our confirmed speakers
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <Carousel
              items={speakers.map((speaker, index) => (
                <SpeakerCard
                  key={speaker.id}
                  speaker={{
                    id: speaker.id,
                    name: speaker.name,
                    role: speaker.role,
                    image: speaker.image || "",
                    bio: speaker.bio || "",
                  } as iSpeaker}
                  index={index}
                />
              ))}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SpeakersSection;
