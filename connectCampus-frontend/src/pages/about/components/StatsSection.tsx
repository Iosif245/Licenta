import React from 'react';
import { Users, Calendar, Award, Shield } from 'lucide-react';

const StatsSection = () => {
  // Stats data
  const stats = [
    {
      value: '50+',
      label: 'Universities',
      icon: <Award className="h-8 w-8 text-primary" />,
    },
    {
      value: '500+',
      label: 'Associations',
      icon: <Users className="h-8 w-8 text-secondary" />,
    },
    {
      value: '10,000+',
      label: 'Students',
      icon: <Shield className="h-8 w-8 text-accent" />,
    },
    {
      value: '2,000+',
      label: 'Events',
      icon: <Calendar className="h-8 w-8 text-warning" />,
    },
  ];

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">CampusConnect is making a difference in university communities across the country.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-background p-6 rounded-xl shadow-md text-center border border-border">
              <div className="mx-auto w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4">{stat.icon}</div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
