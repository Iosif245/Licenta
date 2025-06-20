import { Users, Calendar, MessageSquare, Lightbulb, Zap } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="relative w-full py-20 md:py-32 diagonal-lines bg-white dark:bg-gray-800">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f7fa]/95 via-white/95 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-800"></div>
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <Badge className="px-4 py-1.5 text-base font-semibold bg-secondary/20 text-foreground border-secondary/30">
            <Zap className="mr-1 h-4 w-4" /> Platform Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text p-2">Redefining Campus Engagement</h2>
          <p className="max-w-[800px] text-xl text-foreground/80">
            Our innovative platform brings together cutting-edge features to transform how students and associations interact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative h-full bg-card rounded-xl p-6 flex flex-col">
              <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">Smart Connections</h3>
              <p className="text-foreground/70 flex-grow">
                Our AI-powered system matches students with associations and events that align perfectly with their interests and goals.
              </p>
              <div className="h-1.5 w-12 bg-primary/50 rounded-full mt-6 group-hover:w-full transition-all duration-300"></div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-accent rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative h-full bg-card rounded-xl p-6 flex flex-col">
              <div className="h-14 w-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-secondary transition-colors duration-300">Dynamic Events</h3>
              <p className="text-foreground/70 flex-grow">Discover, join, and manage events with our intuitive interface. Get personalized recommendations and never miss out.</p>
              <div className="h-1.5 w-12 bg-secondary/50 rounded-full mt-6 group-hover:w-full transition-all duration-300"></div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-highlight rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative h-full bg-card rounded-xl p-6 flex flex-col">
              <div className="h-14 w-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">Seamless Communication</h3>
              <p className="text-foreground/70 flex-grow">Connect directly with associations and fellow students through our integrated messaging system with AI assistance.</p>
              <div className="h-1.5 w-12 bg-accent/50 rounded-full mt-6 group-hover:w-full transition-all duration-300"></div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-highlight to-primary rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative h-full bg-card rounded-xl p-6 flex flex-col">
              <div className="h-14 w-14 rounded-xl bg-highlight/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="h-7 w-7 text-highlight-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-highlight-foreground transition-colors duration-300">Insightful Analytics</h3>
              <p className="text-foreground/70 flex-grow">Associations gain valuable insights into engagement, attendance, and member preferences to optimize their activities.</p>
              <div className="h-1.5 w-12 bg-highlight/50 rounded-full mt-6 group-hover:w-full transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
