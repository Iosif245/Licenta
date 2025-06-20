import { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { CardContent } from '@app/components/ui/card';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Mail, EyeOff, Eye, Lock, Loader2 } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE__FORGOT_PASSWORD } from '@app/router/routes';

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm = ({ email, password, isLoading, onEmailChange, onPasswordChange, onSubmit }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <form onSubmit={onSubmit}>
      <CardContent className="space-y-6 px-6 pb-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">
            Email Address
          </Label>
          <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
            <Mail className={`absolute left-3 top-3 h-5 w-5 transition-colors duration-200 ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'}`} />
            <Input
              id="email"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={onEmailChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className={`pl-10 h-12 transition-all duration-300 border-2 ${
                focusedField === 'email' ? 'border-primary/50 shadow-md shadow-primary/10' : 'border-border hover:border-border/80'
              } focus:scale-[1.01]`}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground font-medium">
              Password
            </Label>
            <Link
              to={ROUTE__FORGOT_PASSWORD}
              className="text-xs text-primary hover:text-primary/80 transition-colors duration-200 
                hover:underline decoration-primary/50 underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>
          <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
            <Lock className={`absolute left-3 top-3 h-5 w-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-primary' : 'text-muted-foreground'}`} />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={onPasswordChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className={`pl-10 pr-12 h-12 transition-all duration-300 border-2 ${
                focusedField === 'password' ? 'border-primary/50 shadow-md shadow-primary/10' : 'border-border hover:border-border/80'
              } focus:scale-[1.01]`}
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-10 w-10 hover:bg-primary/10 transition-all duration-200"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-primary to-secondary 
            hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 
            shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]
            font-semibold text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in to your account'
          )}
        </Button>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground/70 leading-relaxed">🔒 Your login is secured with industry-standard encryption</p>
        </div>
      </CardContent>
    </form>
  );
};

export default LoginForm;
