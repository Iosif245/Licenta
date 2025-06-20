import { Heart } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import React from 'react';
import student from '../assets/studenta.jpg';
import director from '../assets/Director.jpg';
import president from '../assets/President.jpg';

const Star = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="#FFD700"
      stroke="#FFD700"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-1"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-white dark:bg-gray-800">
      <div className="absolute inset-0 wavy-lines opacity-10"></div>
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <Badge className="px-4 py-1.5 text-base font-semibold bg-accent/20 text-foreground border-accent/30">
            <Heart className="mr-1 h-4 w-4" /> Success Stories
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text p-2">What Our Users Say</h2>
          <p className="max-w-[800px] text-xl text-foreground/80">Hear from students and associations who have transformed their campus experience with our platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative h-full bg-card rounded-xl p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <img src={student} alt="Student" className="h-10 w-10 rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-sm text-foreground/70">Computer Science Student</p>
                </div>
              </div>
              <p className="text-foreground/80 italic flex-grow">
                "This platform completely transformed my university experience. I found my perfect study group and made connections that will last a lifetime. The events are always
                relevant to my interests!"
              </p>
              <div className="flex mt-4">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-accent rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative h-full bg-card rounded-xl p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
                  <img src={president} alt="Association Leader" className="h-10 w-10 rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-sm text-foreground/70">Film Society President</p>
                </div>
              </div>
              <p className="text-foreground/80 italic flex-grow">
                "As a society leader, I've seen our membership grow by 200% since joining this platform. The analytics help us plan better events, and the messaging system keeps
                everyone engaged."
              </p>
              <div className="flex mt-4">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-highlight rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative h-full bg-card rounded-xl p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mr-4">
                  <img src={director} alt="Faculty Member" className="h-10 w-10 rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold">Dr. Emily Rodriguez</h4>
                  <p className="text-sm text-foreground/70">Faculty Advisor</p>
                </div>
              </div>
              <p className="text-foreground/80 italic flex-grow">
                "I've seen a remarkable improvement in student engagement since our department started using this platform. It bridges the gap between academic and social aspects
                of university life."
              </p>
              <div className="flex mt-4">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
