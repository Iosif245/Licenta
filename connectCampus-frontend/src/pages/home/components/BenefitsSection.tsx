import { Link } from 'react-router-dom';
import { CheckCircle2, GraduationCap, Users, ArrowRight, Award } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import React from 'react';
import image from '../assets/Network.jpg';

const BenefitsSection = () => {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#f5f7fa] dark:bg-gray-900">
      <div className="absolute inset-0 dot-pattern opacity-10"></div>
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <Badge className="px-4 py-1.5 text-base font-semibold bg-primary/20 text-foreground border-primary/30">
            <Award className="mr-1 h-4 w-4" /> Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text p-4">Benefits for Everyone</h2>
          <p className="max-w-[800px] text-xl text-foreground/80">
            Our platform offers unique advantages for both students and associations, creating a thriving campus ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="h-12 w-12 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">For Students</h3>
                  <ul className="space-y-3 text-foreground/70">
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Discover events and associations aligned with your interests</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Build your campus network and make lasting connections</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Enhance your university experience through meaningful engagement</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Develop new skills and expand your knowledge base</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 shrink-0 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">For Associations</h3>
                  <ul className="space-y-3 text-foreground/70">
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span>Increase visibility and attract engaged members</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span>Streamline event management and communication</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span>Gain insights through detailed analytics and feedback</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span>Build a stronger community around your mission</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-3xl blur-xl opacity-70 animate-pulse-slow"></div>
            <div className="relative bg-card rounded-2xl overflow-hidden border border-highlight/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
              <img src={image} alt="Campus community" className="w-full h-auto relative z-10 mix-blend-overlay opacity-70" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">Join Our Thriving Community</h3>
                <p className="text-lg text-foreground/90 mb-6 max-w-md">Experience the perfect balance of academic growth and social connection.</p>
                <Link to="/register">
                  <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
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

export default BenefitsSection;
