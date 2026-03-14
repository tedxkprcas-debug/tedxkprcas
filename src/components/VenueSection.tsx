import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import { useVenuePartners } from "@/hooks/use-database";

const fallbackVenue = {
  title: "The Pavilion by Quorum, Lower Parel, Mumbai.",
  partner_label: "Our Venue Partner",
  subtitle: "Lower Parel, Mumbai",
  event_date: "8th November, 2025",
  description:
    "Surrounded by natural light and modern architectural elements, The Pavilion is a space where creativity flourishes and connections are made.",
  hero_image:
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
  logo: "https://dummyimage.com/320x120/ffffff/eb0028&text=Venue+Partner",
  thumb_one:
    "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=800&q=80",
  thumb_two:
    "https://images.unsplash.com/photo-1550958240-3364c8f63f55?auto=format&fit=crop&w=800&q=80",
  cta_text: "Get Directions",
  cta_url: "https://maps.google.com",
  address: "The Pavilion by Quorum, Mumbai",
};

const VenueSection = () => {
  const { data: venuePartners = [] } = useVenuePartners();
  const partner = (venuePartners.find((p) => p.is_active !== false) as typeof fallbackVenue) || fallbackVenue;

  return (
    <section id="venue" className="relative py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-3xl bg-black/60 border border-white/10 shadow-2xl"
        >
          <div
            className="relative h-[420px] sm:h-[520px] md:h-[620px] w-full overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.85) 100%), url(${partner.hero_image || fallbackVenue.hero_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90" />

            <div className="absolute inset-x-0 bottom-0 px-6 sm:px-10 pb-10">
              <p className="text-sm sm:text-base text-white/70 uppercase tracking-[0.25em]">
                {partner.partner_label || fallbackVenue.partner_label}
              </p>
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.title}
                  className="mt-4 h-14 sm:h-16 object-contain"
                />
              ) : (
                <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white mt-3">
                  {partner.title || fallbackVenue.title}
                </h3>
              )}
              <div className="flex flex-wrap items-center gap-3 text-white/80 mt-3 text-lg sm:text-xl">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-tedx-red" />
                  {partner.address || partner.subtitle || fallbackVenue.subtitle}
                </span>
                {partner.event_date && (
                  <span className="inline-flex items-center gap-2 text-white/70">
                    {partner.event_date}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-gradient-to-b from-black to-secondary px-6 sm:px-10 py-10">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-2xl sm:text-3xl md:text-4xl font-heading text-white">
                {partner.title || fallbackVenue.title}
              </p>
              <p className="text-lg sm:text-xl text-white/80">
                {partner.event_date || fallbackVenue.event_date}
              </p>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                {partner.description || fallbackVenue.description}
              </p>
              {partner.cta_url && (
                <a
                  href={partner.cta_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-tedx-red hover:bg-tedx-dark-red text-white px-5 sm:px-6 py-3 rounded-xl font-heading uppercase tracking-wide transition-colors"
                >
                  {partner.cta_text || fallbackVenue.cta_text}
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              )}
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[partner.thumb_one || fallbackVenue.thumb_one, partner.thumb_two || fallbackVenue.thumb_two]
                .filter(Boolean)
                .map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg"
                  >
                    <img
                      src={img as string}
                      alt={`Venue view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VenueSection;
