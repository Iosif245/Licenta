import React from 'react';

const HeroSection = () => {
  return (
    <section className="py-4">
      <div className="container mx-auto px-3 md:px-4 max-w-7xl text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Discover Student Associations</h1>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">Connect with organizations that match your interests</p>
      </div>
    </section>
  );
};

export default HeroSection;
