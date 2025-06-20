import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Globe, Calendar, Users, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import React from 'react';
import hero from '../assets/HeroImage.jpg';

const HeroSection = () => {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 circle-grid opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-secondary/20 blur-[100px]"></div>
        <div className="absolute -bottom-[10%] left-[30%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px]"></div>
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <Badge className="inline-flex px-4 py-1.5 text-base font-semibold bg-highlight/20 text-foreground border-highlight/30">
                <Sparkles className="mr-1 h-4 w-4" /> Campus Life Reimagined
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl gradient-text">Connect. Engage. Thrive.</h1>
              <p className="max-w-[600px] text-xl text-foreground/80 leading-relaxed">
                Discover a vibrant ecosystem where students and associations unite to create unforgettable campus experiences.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground glow-orange">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-primary/40 text-primary hover:bg-primary/10">
                  Explore
                  <Globe className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                <span className="font-medium">100+ Associations</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-secondary" />
                <span className="font-medium">500+ Events Monthly</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-accent" />
                <span className="font-medium">10,000+ Students</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 h-20 w-20 rounded-full bg-primary/30 animate-pulse-slow"></div>
            <div className="absolute -bottom-5 -right-5 h-16 w-16 rounded-full bg-secondary/30 animate-pulse-slow"></div>
            <div className="absolute top-1/2 -right-8 h-12 w-12 rounded-full bg-accent/30 animate-pulse-slow"></div>

            {/* Main image blob */}
            <div className="relative w-[90%] max-w-[500px]">
              <div className="absolute inset-0 blob bg-gradient-to-br from-primary/40 via-secondary/40 to-accent/40 blur-xl animate-spin-slow"></div>
              <div className="relative blob overflow-hidden border-4 border-highlight/30 aspect-square">
                <img src={hero} alt="Student Association Platform" className="w-full h-full object-cover" />
              </div>

              {/* Floating cards */}
              <div className="absolute -top-10 -left-10 bg-card p-4 rounded-lg shadow-lg border border-highlight/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Tech Workshop</p>
                    <p className="text-xs text-foreground/70">Tomorrow, 2PM</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 bg-card p-4 rounded-lg shadow-lg border border-highlight/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Film Society</p>
                    <p className="text-xs text-foreground/70">15 new members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
