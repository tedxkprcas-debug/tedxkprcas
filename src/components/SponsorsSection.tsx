import { motion } from "framer-motion";
import { useSponsors } from "@/hooks/use-database";

/* ── Fallback sponsor logos (used when no DB data) ── */
const createPlaceholderSvg = (text: string, isRed: boolean) => {
  const color = isRed ? "%23ef4444" : "%23ffffff";
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='80' viewBox='0 0 200 80'%3E%3Crect fill='%231a1a1a' width='200' height='80'/%3E%3Ctext x='100' y='45' fill='${color}' font-family='sans-serif' font-size='14' text-anchor='middle'%3E${text}%3C/text%3E%3C/svg%3E`;
};

const fallbackSponsors = [
  { name: "Sponsor 1", logo: createPlaceholderSvg("Sponsor 1", true) },
  { name: "Sponsor 2", logo: createPlaceholderSvg("Sponsor 2", false) },
  { name: "Sponsor 3", logo: createPlaceholderSvg("Sponsor 3", true) },
  { name: "Sponsor 4", logo: createPlaceholderSvg("Sponsor 4", false) },
  { name: "Sponsor 5", logo: createPlaceholderSvg("Sponsor 5", true) },
  { name: "Sponsor 6", logo: createPlaceholderSvg("Sponsor 6", false) },
  { name: "Sponsor 7", logo: createPlaceholderSvg("Sponsor 7", true) },
  { name: "Sponsor 8", logo: createPlaceholderSvg("Sponsor 8", false) },
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

/* ── Train car with TEDxKPRCAS logo ── */
const TrainCar = () => (
  <div className="flex-shrink-0 relative mx-1 sm:mx-2">
    {/* Train car body */}
    <div className="bg-gradient-to-b from-[#1a2a4a] to-[#0f1829] border border-white/10 rounded-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 shadow-lg">
      <img 
        src="/logo.png" 
        alt="TEDx KPRCAS" 
        className="h-6 sm:h-8 md:h-10 w-auto object-contain"
      />
    </div>
    {/* Wheels */}
    <div className="absolute -bottom-3 left-3 flex gap-1">
      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500/80 border-2 border-yellow-600" />
      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500/80 border-2 border-yellow-600" />
    </div>
    <div className="absolute -bottom-3 right-3 flex gap-1">
      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500/80 border-2 border-yellow-600" />
      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500/80 border-2 border-yellow-600" />
    </div>
  </div>
);

/* ── Train track ── */
const TrainTrack = () => (
  <div className="relative w-full h-4 mt-4">
    {/* Rail */}
    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-600" />
    {/* Sleepers */}
    <div className="flex justify-between px-4">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="w-1 h-3 bg-gray-700 rounded-sm" />
      ))}
    </div>
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

/* ── Train Marquee (TEDxKPRCAS train) ── */
const TrainMarquee = () => {
  const cars = Array.from({ length: 10 });
  const items = [...cars, ...cars, ...cars];

  return (
    <div className="relative overflow-hidden py-6">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Train cars */}
      <div
        className="flex w-max animate-marquee"
        style={{ ["--marquee-speed" as string]: "30s" }}
      >
        {items.map((_, i) => (
          <TrainCar key={i} />
        ))}
      </div>

      {/* Track */}
      <TrainTrack />
    </div>
  );
};

const SponsorsSection = () => {
  const { data: dbSponsors = [] } = useSponsors();

  // Use DB sponsors if available, otherwise show train
  const hasSponsors = dbSponsors.length > 0;
  const sponsors = hasSponsors
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
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl text-foreground mb-3 sm:mb-4">
            Sponsors
          </h2>
          <div className="w-16 h-1 bg-tedx-red mx-auto rounded-full" />
        </motion.div>
      </div>

      {/* Show train animation when no sponsors, otherwise show sponsor marquee */}
      {!hasSponsors ? (
        <TrainMarquee />
      ) : (
        <MarqueeRow sponsors={sponsors} />
      )}
    </section>
  );
};

export default SponsorsSection;
