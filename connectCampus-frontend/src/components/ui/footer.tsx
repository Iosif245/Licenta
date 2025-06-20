import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1f2a] border-t border-border py-5">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Left Column - Logo & Social */}
          <div className="flex flex-col max-w-xs">
            <img src="/CampusConnect.svg" alt="CampusConnect" className="w-[100px] h-auto mb-2" />

            <p className="text-xs text-muted-foreground mb-2">Empowering university communities through connection and collaboration.</p>

            <div className="flex space-x-3">
              <a href="#" aria-label="Facebook">
                <Facebook className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Center Column - Empty */}
          <div className="hidden md:block"></div>

          {/* Right Column - Newsletter with Resources Grid Below */}
          <div className="flex flex-col max-w-xs">
            <h3 className="font-medium text-xs mb-2">Stay Connected</h3>
            <div className="flex mb-4">
              <Input type="email" placeholder="Enter your email" className="bg-[#262c38] border-0 rounded-r-none h-8 text-xs focus-visible:ring-1 focus-visible:ring-primary" />
              <Button className="bg-primary hover:bg-primary/90 rounded-l-none h-8 text-xs px-3">Subscribe</Button>
            </div>

            {/* Resources Grid below email input */}
            <h3 className="font-medium text-xs mb-2">Resources</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <Link to="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright - Center Aligned */}
        <div className="flex justify-center items-center mt-8 border-t border-border/30 pt-4">
          <p className="text-xs text-muted-foreground flex items-center">
            &copy; {year} CampusConnect &nbsp;•&nbsp; Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> for students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
