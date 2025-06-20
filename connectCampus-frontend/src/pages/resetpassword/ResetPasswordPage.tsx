import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { resetPasswordActionAsync } from '@app/store/actions/auth/auth-async-actions';
import { authIsLoadingSelector } from '@app/store/selectors/auth-selectors';
import { ROUTE__LOGIN } from '@app/router/routes';
import SuccessState from './components/SuccessState';
import InvalidTokenState from './components/InvalidTokenState';
import ResetPasswordForm from './components/ResetPasswordForm';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [token, setToken] = useState('');
  const [mounted, setMounted] = useState(false);

  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(authIsLoadingSelector);

  useEffect(() => {
    setMounted(true);
    const urlToken = searchParams.get('token');
    if (!urlToken) {
      setError('Invalid or missing reset token. Please request a new password reset.');
    } else {
      setToken(urlToken);
    }
  }, [searchParams]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];

    if (pwd.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(pwd)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(pwd)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }

    return errors;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setValidationErrors(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError('Please fix the password requirements below');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    try {
      await dispatch(
        resetPasswordActionAsync({
          token,
          password,
          confirmPassword,
        }),
      ).unwrap();

      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(ROUTE__LOGIN);
      }, 3000);
    } catch (error: any) {
      setError('Failed to reset password. The link may have expired. Please request a new reset link.');
      console.error('Reset password error:', error);
      // Error is already shown by the action via ApiException
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 md:p-4">
      <div className={`w-full max-w-sm transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {isSuccess ? (
          <SuccessState />
        ) : !token ? (
          <InvalidTokenState />
        ) : (
          <ResetPasswordForm
            password={password}
            confirmPassword={confirmPassword}
            isLoading={isLoading}
            error={error}
            validationErrors={validationErrors}
            onPasswordChange={handlePasswordChange}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
