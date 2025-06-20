import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@app/components/ui/card';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { loginActionAsync, verifyTwoFactorActionAsync } from '@app/store/actions/auth/auth-async-actions';
import { authIsLoadingSelector, authStateSelector } from '@app/store/selectors/auth-selectors';
import { userRoleSelector } from '@app/store/selectors/user-selectors';
import { AuthState } from '@app/types/auth/IAuthState';
import { Roles } from '@app/types/user/Role';
import LoginForm from './components/LoginForm';
import TwoFactorStep from './components/TwoFactorStep';

type LoginStep = 'credentials' | 'twoFactor';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState<LoginStep>('credentials');
  const [twoFactorError, setTwoFactorError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string>('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(authIsLoadingSelector);
  const authState = useAppSelector(authStateSelector);
  const userRole = useAppSelector(userRoleSelector);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (authState === AuthState.LoggedIn && userRole) {
      if (userRole === Roles.STUDENT) {
        navigate('/events');
      } else if (userRole === Roles.ASSOCIATION) {
        navigate('/association/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [authState, userRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const result = await dispatch(loginActionAsync({ email, password })).unwrap();

      // Check if 2FA is required (this would come from the API response)
      if (result.requiresTwoFactor && result.userId) {
        setUserId(result.userId);
        setCurrentStep('twoFactor');
      }
      // If no 2FA required, navigation is handled by the action
    } catch (error: any) {
      console.error('Login failed:', error);
    }
  };

  const handleBackToLogin = () => {
    setCurrentStep('credentials');
    setTwoFactorError('');
    setUserId('');
  };

  const handleCodeSubmit = async (code: string) => {
    setTwoFactorError('');

    if (!code || code.length !== 6) {
      setTwoFactorError('Please enter a valid 6-digit code');
      return;
    }

    if (!userId) {
      setTwoFactorError('Session expired. Please try logging in again.');
      handleBackToLogin();
      return;
    }

    try {
      await dispatch(verifyTwoFactorActionAsync({ code, userId })).unwrap();
    } catch (error: any) {
      setTwoFactorError('Invalid verification code. Please try again.');
      console.error('2FA verification failed:', error);
    }
  };

  const getCardTitle = () => {
    return currentStep === 'credentials' ? 'Welcome back' : 'Verify Your Identity';
  };

  const getCardDescription = () => {
    return currentStep === 'credentials' ? 'Sign in to your account to continue' : `We've sent a verification code to ${email}`;
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 
      flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 w-full max-w-sm transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Main card */}
        <Card
          className={`backdrop-blur-lg bg-card/95 border-border/50 shadow-2xl shadow-primary/5 
          transition-all duration-700 delay-300 hover:shadow-3xl hover:shadow-primary/10 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <CardHeader className="space-y-3 pb-4">
            <CardTitle
              className="text-2xl font-bold text-center bg-gradient-to-r from-primary 
              to-secondary bg-clip-text text-transparent"
            >
              {getCardTitle()}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-xs leading-relaxed">{getCardDescription()}</CardDescription>
          </CardHeader>

          {/* Form content */}
          <div className={`transition-all duration-500`}>
            {currentStep === 'credentials' ? (
              <LoginForm
                email={email}
                password={password}
                isLoading={isLoading}
                onEmailChange={e => setEmail(e.target.value)}
                onPasswordChange={e => setPassword(e.target.value)}
                onSubmit={handleSubmit}
              />
            ) : (
              <TwoFactorStep email={email} isLoading={isLoading} error={twoFactorError} onCodeSubmit={handleCodeSubmit} onBackToLogin={handleBackToLogin} />
            )}
          </div>

          {currentStep === 'credentials' && (
            <CardFooter className="flex flex-col space-y-4 pt-4">
              <div className="text-xs text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200 
                    hover:underline decoration-primary/50 underline-offset-4"
                >
                  Create an account
                </Link>
              </div>

              <div className="text-xs text-center text-muted-foreground">
                Forgot your password?{' '}
                <Link to="/forgot-password" className="text-primary font-medium hover:text-primary/80 transition-colors duration-200">
                  Reset it here
                </Link>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
