import { motion } from "framer-motion";
import { Instagram, Mail, Linkedin, AlertCircle } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import { useContactInfo } from "@/hooks/use-database";

const ContactSection = () => {
  const { data: contactData, isLoading, isError, error } = useContactInfo();

  // Use database email if available, otherwise show default
  const email = contactData?.email || "tedxkprcas@gmail.com";
  const phone = contactData?.phone || "+91-XXXX-XXXX-XX";

  return (
    <section id="contact" className="py-10 sm:py-14 md:py-20 lg:py-24 bg-secondary/30 relative overflow-hidden">
      <AnimatedBackground variant="default" particleCount={5} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ borderColor: "hsl(0 84% 50% / 0.5)" }}
            className="border border-border rounded-xl p-5 sm:p-6 md:p-8 text-center bg-card/50 backdrop-blur-sm transition-colors"
          >
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-tedx-red uppercase mb-2">Connect</h3>
            <p className="font-heading text-lg sm:text-xl font-bold text-foreground uppercase mb-4 sm:mb-6 md:mb-8">With Us On</p>
            <div className="flex justify-center gap-4 sm:gap-6">
              {[Instagram, Mail, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="border border-border rounded-lg p-3 sm:p-4 hover:border-tedx-red transition-colors"
                  whileHover={{ scale: 1.15, rotate: 5, boxShadow: "0 0 20px hsl(0 84% 50% / 0.3)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ borderColor: "hsl(0 84% 50% / 0.5)" }}
            className="bg-card/50 border border-border rounded-xl p-5 sm:p-6 md:p-8 text-center backdrop-blur-sm transition-colors"
          >
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-tedx-red uppercase mb-2">Questions?</h3>
            <p className="font-heading text-base sm:text-lg font-bold text-foreground uppercase mb-4 sm:mb-6">We're Here To Help!</p>
            <div className="space-y-4 text-muted-foreground">
              <p className="font-heading text-base sm:text-lg uppercase">Contact Us</p>
              {isError ? (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-left">
                    <p className="text-red-500 font-medium text-xs">Error loading contact info</p>
                    <p className="text-muted-foreground text-xs mt-1">{error?.message || "Unable to load contact information."}</p>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4 mx-auto"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3 mx-auto"></div>
                </div>
              ) : (
                <>
                  <motion.a
                    href={`mailto:${email}`}
                    className="text-tedx-red font-heading text-sm sm:text-base md:text-lg lg:text-xl hover:underline block break-words"
                    whileHover={{ scale: 1.05 }}
                  >
                    {email}
                  </motion.a>
                  <motion.a
                    href={`tel:${phone}`}
                    className="text-tedx-red font-heading text-sm sm:text-base md:text-lg hover:underline block"
                    whileHover={{ scale: 1.05 }}
                  >
                    {phone}
                  </motion.a>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
