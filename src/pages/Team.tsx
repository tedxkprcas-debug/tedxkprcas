import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GeometricBackground from "@/components/GeometricBackground";
import { useTeamMembers } from "@/hooks/use-database";
import { ScrollTimeline } from "@/components/ui/scroll-timeline";
import type { TimelineEvent } from "@/components/ui/scroll-timeline";
import { AlertCircle, Users } from "lucide-react";

const Team = () => {
  const { data: teamMembers = [], isLoading, isError, error } = useTeamMembers();

  return (
    <div className="bg-background min-h-screen relative">
      <GeometricBackground />
      <Navbar />

      <div className="relative z-10 py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl uppercase mb-3 sm:mb-4">
              Our <span className="text-tedx-red">Team</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Meet the passionate individuals behind TED<sup>x</sup> KPRCAS
            </p>
          </motion.div>

          {/* Team Content */}
          {isError ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-tedx-red" />
                <p className="text-tedx-red text-lg">Error loading team</p>
              </div>
              <p className="text-muted-foreground text-sm">
                {error?.message || "Unable to load team members at this time."}
              </p>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-block mb-4">
                <div className="w-8 h-8 border-4 border-tedx-red/30 border-t-tedx-red rounded-full animate-spin"></div>
              </div>
              <p className="text-muted-foreground text-lg animate-pulse">Loading team...</p>
            </motion.div>
          ) : teamMembers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Team members coming soon.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ScrollTimeline
                events={teamMembers.map((member) => ({
                  id: member.id,
                  year: member.role,
                  title: member.name,
                  description: member.description || member.role,
                  image: member.photo || undefined,
                  subtitle: member.role,
                } as TimelineEvent))}
                title="Our Team"
                subtitle="Meet the passionate individuals behind TEDˣ KPRCAS"
                cardAlignment="alternating"
                cardEffect="glow"
                revealAnimation="scale"
                progressIndicator={true}
                connectorStyle="line"
                animationOrder="staggered"
              />
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Team;
