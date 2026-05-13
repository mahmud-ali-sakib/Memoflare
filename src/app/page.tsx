import React from "react";
import Navbar from "@/components/Navbar";

import FeaturesSection from "@/components/FeaturesSection";
import PreviewSection from "@/components/PreviewSection";
import TestimonialsSection from "@/components/TestimonialsSection";

import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CtaSection from "@/components/CtaSection";

const Page = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto">
        <HeroSection />
        <FeaturesSection />
      </main>
      <PreviewSection />
      <main className="container mx-auto">
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
};

export default Page;