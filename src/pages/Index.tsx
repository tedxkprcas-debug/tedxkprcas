import { useState, useCallback } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import GeometricBackground from "@/components/GeometricBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SpeakersSection from "@/components/SpeakersSection";
import StatsSection from "@/components/StatsSection";
import CountdownSection from "@/components/CountdownSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CursorParticles from "@/components/CursorParticles";
import ScrollReveal from "@/components/ScrollReveal";
import GallerySection from "@/components/GallerySection";
import SponsorsSection from "@/components/SponsorsSection";

const Index = () => {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="bg-background min-h-screen relative">
      <GeometricBackground />
      <CursorParticles />
      <Navbar />
      <HeroSection />
      <ScrollReveal direction="up" delay={0.1}>
        <CountdownSection />
      </ScrollReveal>
      <ScrollReveal direction="up">
        <AboutSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.1}>
        <StatsSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.1}>
        <SpeakersSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.1}>
        <GallerySection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.1}>
        <SponsorsSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.1}>
        <ContactSection />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.05}>
        <Footer />
      </ScrollReveal>
    </div>
  );
};

export default Index;
