import { Link } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import React from 'react';

const CallToActionSection = () => {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-white dark:bg-gray-800">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 animate-gradient-shift"></div>
      <div className="absolute inset-0 wavy-bg opacity-30"></div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-70"></div>
            <div className="relative bg-card/80 backdrop-blur-md rounded-xl p-10 md:p-16 border border-highlight/20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">Ready to Transform Your Campus Experience?</h2>
              <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
                Join thousands of students and associations already using CampusConnect to create unforgettable university memories.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground glow-orange">
                    Get Started Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-foreground/20 hover:bg-foreground/5">
                    Learn More
                    <Globe className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
