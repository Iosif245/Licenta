import React from 'react';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import BenefitsSection from './components/BenefitsSection';
import TestimonialsSection from './components/TestimonialsSection';
import StatsSection from './components/StatsSection';
import CallToActionSection from './components/CallToActionSection';

const Home = () => {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <StatsSection />
      <CallToActionSection />
    </main>
  );
};

export default Home;
