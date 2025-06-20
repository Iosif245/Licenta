import React from 'react';
import { Button } from '@app/components/ui/button';
import { Link } from 'react-router-dom';
import banner from '../assets/banner.png';

const OurStory = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img src={banner} alt="Our Story" className="rounded-xl shadow-lg" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              CampusConnect was born out of a simple observation: despite the abundance of student organizations and events on campus, many students struggled to discover
              opportunities that matched their interests.
            </p>
            <p className="text-muted-foreground mb-4">
              Founded in 2020 by a group of university students, our platform started as a small project at a hackathon. What began as a simple event board quickly evolved into a
              comprehensive platform connecting students with associations across multiple universities.
            </p>
            <p className="text-muted-foreground mb-4">
              Today, CampusConnect serves thousands of students and hundreds of student organizations, making campus life more accessible and engaging for everyone.
            </p>
            <div className="mt-6">
              <Link to="/contact">
                <Button>Get in Touch</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
