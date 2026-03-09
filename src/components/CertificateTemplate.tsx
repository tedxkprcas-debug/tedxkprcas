import { motion } from "framer-motion";

interface CertificateTemplateProps {
  participantName: string;
  eventName?: string;
  eventDate?: string;
  signerName?: string;
  signerTitle?: string;
  certificateId?: string;
}

const CertificateTemplate = ({
  participantName = "John Doe",
  eventName = "TEDx KPRCAS 2026",
  eventDate = "February 15, 2026",
  signerName = "Dr. Event Organizer",
  signerTitle = "Event Organizer",
  certificateId = "CERT-2026-001",
}: CertificateTemplateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Certificate Paper */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-12 rounded-lg shadow-2xl border-8 border-double border-amber-900/30 relative overflow-hidden">

        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-transparent blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-gradient-to-tl from-primary to-transparent blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            {/* Logo/Badge */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">TED</span>
              </div>
            </div>

            {/* Certificate Title */}
            <h1 className="text-4xl text-amber-900 mb-2">
              Certificate of Participation
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-transparent mx-auto mb-4" />
          </div>

          {/* Main Content */}
          <div className="text-center mb-12">
            <p className="text-amber-900/80 text-lg mb-6 font-light">
              This certificate is proudly presented to
            </p>

            {/* Participant Name */}
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl text-primary mb-8 underline decoration-amber-900/30 underline-offset-4"
            >
              {participantName}
            </motion.h2>

            {/* Achievement Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-amber-900/90 text-sm leading-relaxed max-w-xl mx-auto"
            >
              <p className="mb-4">
                For actively participating in
              </p>
              <p className="text-2xl text-primary mb-4">
                {eventName}
              </p>
              <p className="text-sm text-amber-900/70 mb-4">
                Held on {eventDate}
              </p>
              <p className="text-sm leading-relaxed">
                In recognition of your enthusiasm, engagement, and commitment to spreading ideas worth sharing.
              </p>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-amber-900/20">
            {/* Signer */}
            <div className="text-center">
              <div className="h-12 mb-2 flex items-end justify-center">
                <div className="w-24 h-0.5 bg-amber-900/40" />
              </div>
              <p className="text-amber-900">{signerName}</p>
              <p className="text-xs text-amber-900/60">{signerTitle}</p>
            </div>

            {/* Seal/Badge */}
            <div className="flex justify-center items-end">
              <div className="w-20 h-20 rounded-full border-4 border-primary/30 flex items-center justify-center bg-gradient-to-br from-primary/5 to-transparent">
                <span className="text-xs text-primary text-center px-2">
                  Official<br />Seal
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="text-center">
              <div className="h-12 mb-2 flex items-end justify-center">
                <div className="w-24 h-0.5 bg-amber-900/40" />
              </div>
              <p className="text-amber-900">{eventDate}</p>
              <p className="text-xs text-amber-900/60">Date of Issue</p>
            </div>
          </div>

          {/* Certificate ID */}
          <div className="text-center mt-8 pt-6 border-t border-amber-900/10">
            <p className="text-xs text-amber-900/50">
              Certificate ID: {certificateId}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateTemplate;

