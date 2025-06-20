import React from 'react';
import { Users, Shield, Heart } from 'lucide-react';

const ValuesSection = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">The principles that guide everything we do at CampusConnect.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community First</h3>
            <p className="text-muted-foreground">We believe in the power of community and strive to create meaningful connections between students and organizations.</p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Inclusivity</h3>
            <p className="text-muted-foreground">We're committed to creating a platform where all students feel welcome and represented, regardless of background.</p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Passion</h3>
            <p className="text-muted-foreground">
              We're passionate about enhancing the university experience and helping students discover opportunities that ignite their own passions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
