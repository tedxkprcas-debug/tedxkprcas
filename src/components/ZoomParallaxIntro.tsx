import { useEffect } from "react";
import Lenis from "lenis";
import { ZoomParallax } from "@/components/ui/zoom-parallax";

const images = [
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1280&h=720&fit=crop&auto=format&q=80",
    alt: "Conference stage with spotlight",
  },
  {
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1280&h=720&fit=crop&auto=format&q=80",
    alt: "Speaker presenting on stage",
  },
  {
    src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=800&fit=crop&auto=format&q=80",
    alt: "Audience at a conference",
  },
  {
    src: "https://images.unsplash.com/photo-1591115765373-5e2a6820c5ed?w=1280&h=720&fit=crop&auto=format&q=80",
    alt: "Microphone on stage",
  },
  {
    src: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&h=800&fit=crop&auto=format&q=80",
    alt: "People networking at event",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1280&h=720&fit=crop&auto=format&q=80",
    alt: "Event lights and celebration",
  },
  {
    src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1280&h=720&fit=crop&auto=format&q=80",
    alt: "Creative event moments",
  },
];

const ZoomParallaxIntro = () => {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <section className="relative z-10">
      <ZoomParallax images={images} />
    </section>
  );
};

export default ZoomParallaxIntro;
