"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ===== Types and Interfaces =====
export interface iSpeaker {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

interface iCarouselProps {
  items: React.ReactElement<{
    speaker: iSpeaker;
    index: number;
    layout?: boolean;
    onCardClose: () => void;
  }>[];
  initialScroll?: number;
}

// ===== Custom Hooks =====
const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  onOutsideClick: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      onOutsideClick();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, onOutsideClick]);
};

// ===== Components =====
const Carousel = ({ items, initialScroll = 0 }: iCarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384;
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  return (
    <div className="relative w-full mt-6 sm:mt-8 md:mt-10">
      <div
        className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth [scrollbar-width:none] [-webkit-overflow-scrolling:touch] py-3 sm:py-5"
        ref={carouselRef}
        onScroll={checkScrollability}
      >
        <div
          className={cn(
            "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l",
          )}
        />
        <div
          className={cn(
            "flex flex-row justify-start gap-3 sm:gap-4 pl-2 sm:pl-3",
            "max-w-5xl mx-auto",
          )}
        >
          {items.map((item, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 * index,
                  ease: "easeOut",
                }}
                key={`card-${index}`}
                className="last:pr-[5%] md:last:pr-[33%] rounded-3xl"
              >
                {React.cloneElement(item, {
                  onCardClose: () => {
                    return handleCardClose(index);
                  },
                })}
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3 sm:mt-4 pr-2 sm:pr-0">
        <button
          className="relative z-40 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-tedx-red/80 flex items-center justify-center disabled:opacity-50 hover:bg-tedx-red transition-colors duration-200 active:scale-95"
          onClick={handleScrollLeft}
          disabled={!canScrollLeft}
        >
          <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </button>
        <button
          className="relative z-40 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-tedx-red/80 flex items-center justify-center disabled:opacity-50 hover:bg-tedx-red transition-colors duration-200 active:scale-95"
          onClick={handleScrollRight}
          disabled={!canScrollRight}
        >
          <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </button>
      </div>
    </div>
  );
};

const SpeakerCard = ({
  speaker,
  index,
  layout = false,
  onCardClose = () => {},
}: {
  speaker: iSpeaker;
  index: number;
  layout?: boolean;
  onCardClose?: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => {
    return setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    onCardClose();
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCollapse();
      }
    };

    if (isExpanded) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo({ top: scrollY, behavior: "instant" });
    }

    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      return window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isExpanded]);

  useOutsideClick(containerRef, handleCollapse);

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 h-screen overflow-hidden z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              ref={containerRef}
              layoutId={layout ? `card-${speaker.name}` : undefined}
              className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900 to-slate-800 h-full z-[60] p-3 sm:p-5 md:p-10 lg:p-12 rounded-t-3xl sm:rounded-3xl relative mt-12 sm:mt-10 md:mt-10 border border-tedx-red/30 overflow-y-auto"
            >
              <button
                className="sticky top-4 h-8 w-8 right-0 ml-auto rounded-full flex items-center justify-center bg-tedx-red hover:bg-tedx-red/80 transition-colors z-10"
                onClick={handleCollapse}
              >
                <X className="h-6 w-6 text-white absolute" />
              </button>
              
              {/* Header Section */}
              <div className="text-center mb-8 mt-4">
                <motion.p
                  layoutId={layout ? `category-${speaker.name}` : undefined}
                  className="text-tedx-red text-base sm:text-lg md:text-xl font-semibold underline underline-offset-8 mb-3"
                >
                  {speaker.role}
                </motion.p>
                <motion.p
                  layoutId={layout ? `title-${speaker.name}` : undefined}
                  className="text-2xl sm:text-3xl md:text-5xl font-bold text-white lowercase"
                >
                  {speaker.name}
                </motion.p>
              </div>

              {/* Description/Bio Section - More Prominent */}
              <div className="bg-gradient-to-r from-tedx-red/10 to-tedx-red/5 border border-tedx-red/30 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
                <div className="flex gap-4">
                  <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-tedx-red flex-shrink-0 mt-1" />
                  <p className="text-sm sm:text-base md:text-xl leading-relaxed text-slate-100 font-light">
                    {speaker.bio || "An accomplished speaker with expertise and passion for sharing ideas worth spreading."}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-center text-slate-400 text-sm mt-8 pt-6 border-t border-slate-700">
                <p>Press ESC or click outside to close</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${speaker.name}` : undefined}
        onClick={handleExpand}
        className=""
        whileHover={{
          rotateX: 2,
          rotateY: 2,
          rotate: 2,
          scale: 1.05,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
      >
        <div
          className={cn(
            "rounded-3xl bg-transparent backdrop-blur-sm h-[320px] sm:h-[420px] md:h-[500px] lg:h-[550px] w-[75vw] sm:w-60 md:w-72 lg:w-80 xl:w-96 overflow-hidden flex flex-col items-center justify-center relative z-10 shadow-xl border border-tedx-red/30 hover:border-tedx-red/60 transition-colors",
            index % 2 === 0 ? "rotate-0" : "-rotate-0"
          )}
        >
          {/* Background with overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-tedx-red/5 via-transparent to-transparent opacity-40" />
          
          {/* Profile Image */}
          <div className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px] overflow-hidden rounded-full border-3 sm:border-4 border-tedx-red/50 aspect-square flex-none relative z-20">
            {speaker.image ? (
              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-tedx-red/30 to-tedx-red/10 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-tedx-red/40">
                  {speaker.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Speaker Name */}
          <motion.p
            layoutId={layout ? `title-${speaker.name}` : undefined}
            className="text-white text-lg sm:text-xl md:text-2xl font-bold text-center mt-3 sm:mt-5 lowercase px-2 sm:px-3 relative z-10 line-clamp-2"
          >
            {speaker.name}
          </motion.p>

          {/* Speaker Role */}
          <motion.p
            layoutId={layout ? `category-${speaker.name}` : undefined}
            className="text-tedx-red text-sm sm:text-base md:text-lg font-semibold text-center mt-1.5 sm:mt-2 md:mt-3 lowercase relative z-10 line-clamp-1 px-2"
          >
            {speaker.role}
          </motion.p>

          {/* Click to expand hint */}
          <motion.p
            className="text-slate-400 text-[10px] sm:text-xs md:text-sm text-center mt-3 sm:mt-4 relative z-10"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click to expand
          </motion.p>
        </div>
      </motion.button>
    </>
  );
};

// Export the components
export { Carousel, SpeakerCard };
