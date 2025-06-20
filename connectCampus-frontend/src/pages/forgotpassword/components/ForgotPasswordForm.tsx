import { Link } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@app/components/ui/card';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Mail } from 'lucide-react';
import { ROUTE__LOGIN } from '@app/router/routes';
import React from 'react';

interface ForgotPasswordFormProps {
  email: string;
  isLoading: boolean;
  error: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ForgotPasswordForm = ({ email, isLoading, error, onEmailChange, onSubmit }: ForgotPasswordFormProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <Card className="border-border shadow-lg">
          <form onSubmit={onSubmit}>
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl text-center">Reset password</CardTitle>
              <CardDescription className="text-center">Enter the email address associated with your account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={onEmailChange} className="pl-10" required disabled={isLoading} />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !email.trim()}>
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Remember your password?{' '}
                <Link to={ROUTE__LOGIN} className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
