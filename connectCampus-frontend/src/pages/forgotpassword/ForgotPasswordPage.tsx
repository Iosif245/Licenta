import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { forgotPasswordActionAsync } from '@app/store/actions/auth/auth-async-actions';
import { authIsLoadingSelector } from '@app/store/selectors/auth-selectors';
import EmailSentState from './components/EmailSentState';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(authIsLoadingSelector);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await dispatch(forgotPasswordActionAsync({ email })).unwrap();
      setIsSubmitted(true);
      // Success message is handled by the action
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error: any) {
      setError('Failed to send reset email. Please try again.');
      console.error('Forgot password error:', error);
      // Error is already shown by the action via ApiException
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setEmail('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 md:p-4">
      <div className={`w-full max-w-sm transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {isSubmitted ? (
          <EmailSentState email={email} onTryAgain={handleTryAgain} />
        ) : (
          <ForgotPasswordForm email={email} isLoading={isLoading} error={error} onEmailChange={e => setEmail(e.target.value)} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
