import { Users, Calendar, MessageSquare, TrendingUp, Award } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import React from 'react';

const StatsSection = () => {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#f5f7fa] dark:bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f7fa] to-white/30 dark:from-gray-900 dark:to-gray-800/30"></div>
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <Badge className="px-4 py-1.5 text-base font-semibold bg-highlight/20 text-foreground border-highlight/30">
            <TrendingUp className="mr-1 h-4 w-4" /> Platform Impact
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text p-2">Our Growing Community</h2>
          <p className="max-w-[800px] text-xl text-foreground/80">Join thousands of students and hundreds of associations already transforming campus life.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card rounded-xl p-6 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-4xl font-bold mb-2 gradient-text-primary">10,000+</h3>
              <p className="text-foreground/70">Active Students</p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-4xl font-bold mb-2 gradient-text-secondary">100+</h3>
              <p className="text-foreground/70">Student Associations</p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-4xl font-bold mb-2 gradient-text-accent">500+</h3>
              <p className="text-foreground/70">Monthly Events</p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-highlight/10 to-highlight/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-full bg-highlight/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-highlight-foreground" />
              </div>
              <h3 className="text-4xl font-bold mb-2 gradient-text-highlight">50,000+</h3>
              <p className="text-foreground/70">Messages Exchanged</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
