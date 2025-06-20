import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@app/components/ui/card';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Lock, EyeOff, Eye, ArrowLeft } from 'lucide-react';
import { ROUTE__LOGIN } from '@app/router/routes';
import React from 'react';

interface ResetPasswordFormProps {
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string;
  validationErrors: string[];
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ResetPasswordForm = ({ password, confirmPassword, isLoading, error, validationErrors, onPasswordChange, onConfirmPasswordChange, onSubmit }: ResetPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <>
      {/* Back to Sign In Button */}
      <div className="absolute left-2 top-2 sm:left-4 sm:top-4 md:left-6 md:top-6 z-20">
        <Link to={ROUTE__LOGIN}>
          <Button variant="ghost" size="sm" className="h-9 px-3 text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Sign In</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">
        <Card className="border-border shadow-lg backdrop-blur-sm bg-card/95">
          <form onSubmit={onSubmit}>
            <CardHeader className="space-y-4">
              {/* Logo */}
              <div className="flex justify-center">
                <img src="/CampusConnect.svg" alt="CampusConnect" className="w-16 h-16" />
              </div>

              <CardTitle className="text-2xl text-center">Set new password</CardTitle>
              <CardDescription className="text-center">Choose a strong password for your account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-4 sm:p-6">
              {error && <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">{error}</div>}

              {/* New Password Field */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-foreground font-medium text-sm">
                  New password
                </Label>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}>
                  <Lock className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 z-10 ${focusedField === 'password' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => onPasswordChange(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-12 h-9 text-sm transition-all duration-300 border rounded-lg ${
                      focusedField === 'password' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                    }`}
                    placeholder="Enter your new password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0 hover:bg-muted/50"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium text-sm">
                  Confirm new password
                </Label>
                <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'scale-[1.01]' : ''}`}>
                  <Lock
                    className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 z-10 ${focusedField === 'confirmPassword' ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => onConfirmPasswordChange(e.target.value)}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-12 h-9 text-sm transition-all duration-300 border rounded-lg ${
                      focusedField === 'confirmPassword' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                    }`}
                    placeholder="Confirm your new password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0 hover:bg-muted/50"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span className="sr-only">{showConfirmPassword ? 'Hide password' : 'Show password'}</span>
                  </Button>
                </div>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                  <Label className="text-sm font-medium text-muted-foreground">Password requirements:</Label>
                  <ul className="space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-xs text-destructive flex items-start gap-2">
                        <span className="w-1 h-1 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                        <span className="flex-1">{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Password Mismatch Error */}
              {password && confirmPassword && password !== confirmPassword && (
                <div className="text-xs text-destructive flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
                  <span className="w-1 h-1 bg-destructive rounded-full flex-shrink-0"></span>
                  <span>Passwords do not match</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-9 text-sm bg-gradient-to-r from-primary to-secondary hover:from-primary/90 
                  hover:to-secondary/90 text-white font-semibold transition-all duration-300 
                  hover:shadow-md hover:shadow-primary/20 hover:scale-[1.01] mt-6"
                disabled={isLoading || !password || !confirmPassword || password !== confirmPassword || validationErrors.length > 0}
              >
                {isLoading ? 'Resetting password...' : 'Reset password'}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <div className="text-sm text-center text-muted-foreground">
                Remember your password?{' '}
                <Link to={ROUTE__LOGIN} className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ResetPasswordForm;
