import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@app/components/ui/button';

interface HeroSectionProps {
  coverImage: string;
  name: string;
}

const HeroSection = ({ coverImage, name }: HeroSectionProps) => {
  return (
    <div className="relative h-[300px] md:h-[400px]">
      <img src={coverImage || '/placeholder.svg'} alt={`${name} cover`} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

      {/* Back Button */}
      <div className="absolute left-4 top-4 z-10">
        <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm" asChild>
          <Link to="/associations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
