import { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Shield, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import React from 'react';

interface TwoFactorStepProps {
  email: string;
  isLoading?: boolean;
  error?: string;
  onCodeSubmit: (code: string) => void;
  onBackToLogin?: () => void;
  onResendCode?: () => void;
}

const TwoFactorStep = ({ email, isLoading = false, error, onCodeSubmit, onBackToLogin }: TwoFactorStepProps) => {
  const [code, setCode] = useState('');

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and limit to 6 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
    setCode(digitsOnly);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      onCodeSubmit(code);
    }
  };

  const isValidCode = code.length === 6;
  const hasInput = code.length > 0;

  return (
    <div className="px-6 pb-6 space-y-4">
      <div className="text-center space-y-3">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-sm">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">We've sent a verification code to</p>
          <p className="text-xs font-medium text-foreground bg-muted/50 rounded-md py-1 px-2 mx-auto inline-block">{email}</p>
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md shadow-sm">
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium text-foreground block text-center">
            Enter Verification Code
          </Label>
          <div className="relative">
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              value={code}
              onChange={handleCodeChange}
              className={`text-center text-lg tracking-[0.3em] font-mono h-11 pr-10 rounded-md border-2 transition-all duration-200 ${
                hasInput
                  ? isValidCode
                    ? 'border-green-500 focus:border-green-500 bg-green-50/50'
                    : 'border-yellow-500 focus:border-yellow-500 bg-yellow-50/50'
                  : 'border-border focus:border-primary'
              }`}
              maxLength={6}
              required
              disabled={isLoading}
              autoComplete="one-time-code"
            />
            {hasInput && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isValidCode ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-yellow-500" />}
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <span>{code.length}/6 digits</span>
              {hasInput && (
                <div className="flex space-x-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i < code.length ? (isValidCode ? 'bg-green-500' : 'bg-yellow-500') : 'bg-muted'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            {hasInput && !isValidCode && <span className="text-yellow-600 text-xs">Please enter all 6 digits</span>}
            {isValidCode && <span className="text-green-600 text-xs">✓ Ready to verify</span>}
          </div>
        </div>

        <Button type="submit" className="w-full h-10 text-sm font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200" disabled={isLoading || !isValidCode}>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            'Verify Code'
          )}
        </Button>
      </form>

      <div className="flex flex-col space-y-2 pt-1">
        {onBackToLogin && (
          <Button
            type="button"
            variant="outline"
            className="w-full h-9 rounded-md border hover:bg-muted/50 transition-all duration-200"
            onClick={onBackToLogin}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default TwoFactorStep;
