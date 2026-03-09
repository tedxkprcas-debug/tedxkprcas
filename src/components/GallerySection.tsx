import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGalleryImages } from "@/hooks/use-database";
import { AlertCircle, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Infinite-marquee row                                               */
/* ------------------------------------------------------------------ */
const MarqueeRow = ({
  images,
  direction,
  speed = 30,
  onSelect,
}: {
  images: { id?: string; image: string; title: string }[];
  direction: "left" | "right";
  speed?: number;
  onSelect: (img: { image: string; title: string }) => void;
}) => {
  const copies = 3;
  const totalDuration = images.length * speed;

  return (
    <div className="relative overflow-hidden py-1.5">
      <motion.div
        className="flex gap-3 w-max will-change-transform"
        animate={{
          x: direction === "left" ? ["0%", "-33.333%"] : ["-33.333%", "0%"],
        }}
        transition={{ repeat: Infinity, duration: totalDuration, ease: "linear" }}
      >
        {Array.from({ length: copies }).flatMap((_, copyIdx) =>
          images.map((img, imgIdx) => (
            <button
              key={`${copyIdx}-${img.id ?? imgIdx}`}
              onClick={() => onSelect(img)}
              className="relative flex-shrink-0 h-36 sm:h-44 md:h-56 lg:h-64 aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden group focus:outline-none"
            >
              <img
                src={img.image}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-500 sm:grayscale sm:group-hover:grayscale-0 group-hover:scale-110 group-active:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-3">
                <p className="text-white text-xs sm:text-sm truncate">
                  {img.title}
                </p>
              </div>
            </button>
          ))
        )}
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Gallery section (embeddable in home page)                          */
/* ------------------------------------------------------------------ */
const GallerySection = () => {
  const {
    data: galleryImages = [],
    isLoading,
    isError,
    error,
  } = useGalleryImages();
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    title: string;
  } | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("tedx_gallery_video");
    if (saved) setVideoUrl(saved);
  }, []);

  const embedUrl = useMemo(() => {
    if (!videoUrl) return "";
    const ytMatch = videoUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch)
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0&showinfo=0&rel=0`;
    return videoUrl;
  }, [videoUrl]);

  const rows = useMemo(() => {
    if (galleryImages.length === 0) return [[], [], []];
    const r1: typeof galleryImages = [];
    const r2: typeof galleryImages = [];
    const r3: typeof galleryImages = [];
    galleryImages.forEach((img, i) => {
      if (i % 3 === 0) r1.push(img);
      else if (i % 3 === 1) r2.push(img);
      else r3.push(img);
    });
    const fill = (arr: typeof galleryImages) =>
      arr.length > 0
        ? arr
        : galleryImages.slice(0, Math.ceil(galleryImages.length / 3));
    return [fill(r1), fill(r2), fill(r3)];
  }, [galleryImages]);

  const isVideoEmbed =
    embedUrl.includes("youtube.com") || embedUrl.includes("vimeo.com");

  return (
    <section id="gallery" className="relative z-10 py-10 sm:py-14 md:py-20">
      {/* Header */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl uppercase mb-2 sm:mb-4">
            <span className="text-tedx-red">Gallery</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            To be revealed soon.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      {isError ? (
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-tedx-red" />
              <p className="text-tedx-red text-lg">
                Error loading gallery
              </p>
            </div>
            <p className="text-muted-foreground text-sm">
              {error?.message || "Unable to load gallery images at this time."}
            </p>
          </motion.div>
        </div>
      ) : isLoading ? (
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="inline-block mb-4">
              <div className="w-8 h-8 border-4 border-tedx-red/30 border-t-tedx-red rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground text-lg animate-pulse">
              Loading gallery...
            </p>
          </motion.div>
        </div>
      ) : galleryImages.length === 0 ? (
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16 sm:py-20"
          >
            {/* Animated card container */}
            <motion.div 
              className="relative inline-block bg-gradient-to-br from-secondary/80 to-background border border-tedx-red/20 rounded-2xl px-8 sm:px-16 py-10 sm:py-14 shadow-2xl shadow-tedx-red/5"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glowing corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-tedx-red rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-tedx-red rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-tedx-red rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-tedx-red rounded-br-2xl" />
              
              {/* Animated camera icons */}
              <div className="flex justify-center gap-4 mb-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -15, 0],
                      rotateZ: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.4
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-tedx-red/10 rounded-full flex items-center justify-center border border-tedx-red/30"
                  >
                    <span className="text-3xl sm:text-4xl">📸</span>
                  </motion.div>
                ))}
              </div>

              {/* Main text */}
              <motion.h3
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl sm:text-3xl md:text-4xl text-white mb-3"
              >
                To Be <span className="text-tedx-red">Revealed</span>
              </motion.h3>
              
              <p className="text-muted-foreground text-base sm:text-lg">
                Exciting moments will be captured soon
              </p>

              {/* Decorative dots */}
              <div className="flex justify-center gap-2 mt-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-tedx-red/60"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="relative">
          {/* Three marquee rows */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <MarqueeRow
              images={rows[0]}
              direction="right"
              speed={25}
              onSelect={setSelectedImage}
            />
            <MarqueeRow
              images={rows[1]}
              direction="left"
              speed={30}
              onSelect={setSelectedImage}
            />
            <MarqueeRow
              images={rows[2]}
              direction="right"
              speed={28}
              onSelect={setSelectedImage}
            />
          </motion.div>

          {/* Centered video overlay */}
          {embedUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                type: "spring",
                damping: 20,
              }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="relative w-[90%] sm:w-[70%] md:w-[55%] lg:w-[42%] xl:w-[38%] aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 border-white/15 pointer-events-auto bg-black">
                <div className="absolute -inset-4 bg-tedx-red/10 blur-3xl rounded-3xl -z-10" />

                {isVideoEmbed ? (
                  <iframe
                    src={embedUrl}
                    title="TEDx KPRCAS Event Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ border: 0 }}
                  />
                ) : (
                  <video
                    src={embedUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 md:p-6">
                <p className="text-white text-base sm:text-lg md:text-xl">
                  {selectedImage.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 sm:p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
