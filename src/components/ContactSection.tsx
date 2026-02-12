import { motion } from "framer-motion";
import { Instagram, Mail, Linkedin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-border rounded-xl p-8 text-center"
          >
            <h3 className="font-heading text-3xl font-black text-tedx-red uppercase mb-2">Connect</h3>
            <p className="font-heading text-xl font-bold text-foreground uppercase mb-8">With Us On</p>
            <div className="flex justify-center gap-6">
              <a href="#" className="border border-border rounded-lg p-4 hover:border-tedx-red transition-colors">
                <Instagram size={28} className="text-foreground" />
              </a>
              <a href="#" className="border border-border rounded-lg p-4 hover:border-tedx-red transition-colors">
                <Mail size={28} className="text-foreground" />
              </a>
              <a href="#" className="border border-border rounded-lg p-4 hover:border-tedx-red transition-colors">
                <Linkedin size={28} className="text-foreground" />
              </a>
            </div>
          </motion.div>

          {/* Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-8 text-center"
          >
            <h3 className="font-heading text-3xl font-black text-tedx-red uppercase mb-2">Questions?</h3>
            <p className="font-heading text-lg font-bold text-foreground uppercase mb-6">We're Here To Help!</p>
            <div className="space-y-4 text-muted-foreground">
              <p className="font-heading text-lg uppercase">
                Contact Us
              </p>
              <p className="text-tedx-red font-heading text-xl">tedxkprcas@gmail.com</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
