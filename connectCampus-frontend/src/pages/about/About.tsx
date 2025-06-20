import React from 'react';
import HeroSection from './components/HeroSection';
import OurStory from './components/OurStory';
import StatsSection from './components/StatsSection';
import ValuesSection from './components/ValuesSection';
import CallToAction from './components/CallToAction';

const About = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <HeroSection />
      <OurStory />
      <StatsSection />
      <ValuesSection />
      <CallToAction />
    </div>
  );
};

export default About;
