import { Link } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@app/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { ROUTE__LOGIN } from '@app/router/routes';
import React from 'react';

const SuccessState = () => {
  return (
    <Card className="backdrop-blur-lg bg-card/95 border-border/50 shadow-2xl shadow-primary/5">
      <CardHeader className="text-center space-y-4 p-4 sm:p-6">
        <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Password reset successful</CardTitle>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          Your password has been successfully reset. You will be redirected to the sign in page in a few seconds.
        </CardDescription>
      </CardHeader>

      <CardFooter className="p-4 sm:p-6 pt-2">
        <Link to={ROUTE__LOGIN} className="w-full">
          <Button
            className="w-full h-9 text-sm bg-gradient-to-r from-primary to-secondary hover:from-primary/90 
            hover:to-secondary/90 text-white font-semibold transition-all duration-300 
            hover:shadow-md hover:shadow-primary/20 hover:scale-[1.01]"
          >
            Continue to Sign In
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SuccessState;
