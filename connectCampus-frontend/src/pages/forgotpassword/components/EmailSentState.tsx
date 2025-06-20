import { Link } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@app/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { ROUTE__LOGIN } from '@app/router/routes';
import React from 'react';

interface EmailSentStateProps {
  email: string;
  onTryAgain: () => void;
}

const EmailSentState = ({ email, onTryAgain }: EmailSentStateProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link to={ROUTE__LOGIN} className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
      </Link>

      <div className="w-full max-w-md space-y-8">
        <Card className="border-border shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription className="text-center">
              We've sent a password reset link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground text-center space-y-2">
              <p>Didn't receive the email? Check your spam folder or</p>
              <Button variant="link" className="p-0 h-auto text-primary" onClick={onTryAgain}>
                try a different email address
              </Button>
            </div>
          </CardContent>

          <CardFooter>
            <Link to={ROUTE__LOGIN} className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmailSentState;
