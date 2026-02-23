import { motion } from "framer-motion";
import { useSponsors } from "@/hooks/use-database";

/* ── Fallback sponsor logos (used when no DB data) ── */
const fallbackSponsors = [
  { name: "Sponsor 1", logo: "https://via.placeholder.com/200x80/1a1a1a/ef4444?text=Sponsor+1" },
  { name: "Sponsor 2", logo: "https://via.placeholder.com/200x80/1a1a1a/ffffff?text=Sponsor+2" },
  { name: "Sponsor 3", logo: "https://via.placeholder.com/200x80/1a1a1a/ef4444?text=Sponsor+3" },
  { name: "Sponsor 4", logo: "https://via.placeholder.com/200x80/1a1a1a/ffffff?text=Sponsor+4" },
  { name: "Sponsor 5", logo: "https://via.placeholder.com/200x80/1a1a1a/ef4444?text=Sponsor+5" },
  { name: "Sponsor 6", logo: "https://via.placeholder.com/200x80/1a1a1a/ffffff?text=Sponsor+6" },
  { name: "Sponsor 7", logo: "https://via.placeholder.com/200x80/1a1a1a/ef4444?text=Sponsor+7" },
  { name: "Sponsor 8", logo: "https://via.placeholder.com/200x80/1a1a1a/ffffff?text=Sponsor+8" },
];

const SponsorCard = ({ sponsor }: { sponsor: { name: string; logo: string } }) => (
  <div
    className="flex-shrink-0 flex items-center justify-center w-[120px] h-[50px] sm:w-[160px] sm:h-[65px] md:w-[200px] md:h-[80px]
               mx-2 sm:mx-4 md:mx-5 rounded-lg sm:rounded-xl border border-white/5 bg-white/[0.03]
               hover:border-tedx-red/30 hover:bg-white/[0.06] transition-all duration-300
               sm:grayscale sm:hover:grayscale-0"
  >
    <img
      src={sponsor.logo}
      alt={sponsor.name}
      className="max-h-[32px] sm:max-h-[45px] md:max-h-[50px] max-w-[100px] sm:max-w-[130px] md:max-w-[150px] object-contain sm:opacity-60 sm:hover:opacity-100 transition-opacity"
      loading="lazy"
    />
  </div>
);

const MarqueeRow = ({ reverse = false, sponsors }: { reverse?: boolean; sponsors: { name: string; logo: string }[] }) => {
  // Triple the items for a seamless loop
  const items = [...sponsors, ...sponsors, ...sponsors];

  return (
    <div className="relative overflow-hidden py-4 group">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className={`flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ ["--marquee-speed" as string]: "25s" }}
      >
        {items.map((sponsor, i) => (
          <SponsorCard key={`${sponsor.name}-${i}`} sponsor={sponsor} />
        ))}
      </div>
    </div>
  );
};

const SponsorsSection = () => {
  const { data: dbSponsors = [] } = useSponsors();

  // Use DB sponsors if available, otherwise use fallback
  const sponsors = dbSponsors.length > 0
    ? dbSponsors.map((s: any) => ({ name: s.name, logo: s.logo }))
    : fallbackSponsors;

  return (
    <section id="sponsors" className="py-10 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 mb-6 sm:mb-8 md:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-tedx-red font-heading text-sm tracking-[0.3em] uppercase block mb-3">
            Our Partners
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 sm:mb-4">
            Sponsors
          </h2>
          <div className="w-16 h-1 bg-tedx-red mx-auto rounded-full" />
        </motion.div>
      </div>

      {/* Single row scrolling */}
      <MarqueeRow sponsors={sponsors} />
    </section>
  );
};

export default SponsorsSection;
