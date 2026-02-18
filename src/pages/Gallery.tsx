import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GeometricBackground from "@/components/GeometricBackground";
import { useGalleryImages } from "@/hooks/use-database";
import { AlertCircle, X, Play } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Infinite‑marquee row                                               */
/* ------------------------------------------------------------------ */
const MarqueeRow = ({
  images,
  direction,
  speed = 30,
  onSelect,
}: {
  images: { id: string; image: string; title: string }[];
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
        animate={{ x: direction === "left" ? ["0%", "-33.333%"] : ["-33.333%", "0%"] }}
        transition={{ repeat: Infinity, duration: totalDuration, ease: "linear" }}
      >
        {Array.from({ length: copies }).flatMap((_, copyIdx) =>
          images.map((img) => (
            <button
              key={`${copyIdx}-${img.id}`}
              onClick={() => onSelect(img)}
              className="relative flex-shrink-0 h-44 sm:h-52 md:h-60 lg:h-64 aspect-[4/3] rounded-xl overflow-hidden group focus:outline-none"
            >
              <img
                src={img.image}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-sm font-medium truncate">{img.title}</p>
              </div>
            </button>
          ))
        )}
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Gallery page                                                       */
/* ------------------------------------------------------------------ */
const Gallery = () => {
  const { data: galleryImages = [], isLoading, isError, error } = useGalleryImages();
  const [selectedImage, setSelectedImage] = useState<{ image: string; title: string } | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  // Load video URL from localStorage (set by admin)
  useEffect(() => {
    const saved = localStorage.getItem("tedx_gallery_video");
    if (saved) setVideoUrl(saved);
  }, []);

  // Convert YouTube URL to embed format
  const embedUrl = useMemo(() => {
    if (!videoUrl) return "";
    // YouTube watch URL
    const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0&showinfo=0&rel=0`;
    // Already an embed or direct video URL
    return videoUrl;
  }, [videoUrl]);

  // Split images into 3 rows
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
      arr.length > 0 ? arr : galleryImages.slice(0, Math.ceil(galleryImages.length / 3));
    return [fill(r1), fill(r2), fill(r3)];
  }, [galleryImages]);

  const isVideoEmbed = embedUrl.includes("youtube.com") || embedUrl.includes("vimeo.com");

  return (
    <div className="bg-background min-h-screen relative">
      <GeometricBackground />
      <Navbar />

      <div className="relative z-10 py-24">
        {/* Header */}
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-heading text-5xl md:text-7xl font-black uppercase mb-4">
              <span className="text-tedx-red">Gallery</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore memorable moments from TEDx KPRCAS events
            </p>
          </motion.div>
        </div>

        {/* Marquee rows with centered video */}
        {isError ? (
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-tedx-red" />
                <p className="text-tedx-red text-lg font-medium">Error loading gallery</p>
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
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-block mb-4">
                <div className="w-8 h-8 border-4 border-tedx-red/30 border-t-tedx-red rounded-full animate-spin" />
              </div>
              <p className="text-muted-foreground text-lg animate-pulse">Loading gallery...</p>
            </motion.div>
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">No gallery images yet.</p>
            </motion.div>
          </div>
        ) : (
          <div className="relative">
            {/* Three marquee rows */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {/* Row 1 → left to right */}
              <MarqueeRow images={rows[0]} direction="right" speed={25} onSelect={setSelectedImage} />
              {/* Row 2 → right to left */}
              <MarqueeRow images={rows[1]} direction="left" speed={30} onSelect={setSelectedImage} />
              {/* Row 3 → left to right */}
              <MarqueeRow images={rows[2]} direction="right" speed={28} onSelect={setSelectedImage} />
            </motion.div>

            {/* Fixed centered video overlay */}
            {embedUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring", damping: 20 }}
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
              >
                <div className="relative w-[55%] sm:w-[50%] md:w-[45%] lg:w-[40%] aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-white/15 pointer-events-auto bg-black">
                  {/* Glow effect behind video */}
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

                  {/* Subtle inner border */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <p className="text-white text-xl font-bold">{selectedImage.title}</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Gallery;

