import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

const NotFoundPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 md:p-4">
      <div className={`text-center max-w-lg mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* 404 Number */}
        <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary 
            to-accent bg-clip-text text-transparent mb-2"
          >
            404
          </h1>
        </div>

        {/* Emoji */}
        <div className={`text-2xl mb-3 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <span className="animate-bounce inline-block">🤔</span>
        </div>

        {/* Main Message */}
        <div className={`space-y-2 mb-4 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-lg md:text-xl font-bold text-foreground">Oops! Page Not Found</h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            The page you're looking for seems to have wandered off into the digital void. Don't worry, it happens to the best of us!
          </p>
        </div>

        {/* Suggestions */}
        <div
          className={`bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border/50 
          mb-4 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center justify-center gap-1.5">
            <HelpCircle className="h-3 w-3 text-primary" />
            What can you do?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-[10px] text-muted-foreground">
            <div className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full bg-primary mt-1 flex-shrink-0" />
              <span>Check if the URL is typed correctly</span>
            </div>
            <div className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full bg-secondary mt-1 flex-shrink-0" />
              <span>Use the search feature to find what you need</span>
            </div>
            <div className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full bg-accent mt-1 flex-shrink-0" />
              <span>Go back to the previous page</span>
            </div>
            <div className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full bg-warning mt-1 flex-shrink-0" />
              <span>Start fresh from the homepage</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-2 justify-center items-center 
          transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Link to="/">
            <Button
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 
                hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg 
                transform hover:scale-105 active:scale-95 px-4 gap-1.5 h-8 text-xs"
            >
              <Home className="h-3 w-3" />
              Back to Home
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border hover:border-primary/50 hover:bg-primary/5 transition-all 
              duration-300 transform hover:scale-105 active:scale-95 px-4 gap-1.5 h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <ArrowLeft className="h-3 w-3" />
            Go Back
          </Button>

          <Link to="/events">
            <Button
              variant="ghost"
              className="hover:bg-primary/10 transition-all duration-300 transform 
                hover:scale-105 active:scale-95 px-4 gap-1.5 h-8 text-xs"
            >
              <Search className="h-3 w-3" />
              Browse Events
            </Button>
          </Link>
        </div>

        {/* Additional Help */}
        <div className={`mt-6 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-[10px] text-muted-foreground/80">
            Still having trouble?{' '}
            <Link
              to="/support"
              className="text-primary hover:text-primary/80 transition-colors duration-200 
                hover:underline decoration-primary/50 underline-offset-2"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
