import { Link } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@app/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { ROUTE__LOGIN } from '@app/router/routes';
import React from 'react';

const InvalidTokenState = () => {
  return (
    <div className="w-full max-w-md space-y-8">
      <Card className="border-border shadow-lg">
        <CardHeader className="text-center space-y-4 p-4 sm:p-6">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Invalid Reset Link</CardTitle>
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">This password reset link is invalid or has expired. Please request a new one.</CardDescription>
        </CardHeader>

        <CardFooter className="p-4 sm:p-6 pt-2">
          <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link to="/forgot-password" className="w-full sm:w-auto flex-1">
              <Button
                className="w-full h-9 text-sm bg-gradient-to-r from-primary to-secondary hover:from-primary/90 
                  hover:to-secondary/90 text-white font-semibold transition-all duration-300 
                  hover:shadow-md hover:shadow-primary/20 hover:scale-[1.01]"
              >
                Request New Reset Link
              </Button>
            </Link>
            <Link to={ROUTE__LOGIN} className="w-full sm:w-auto flex-1">
              <Button
                variant="outline"
                className="w-full h-9 text-sm border-border hover:border-border/80 
                  transition-all duration-300 hover:bg-muted/50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvalidTokenState;
