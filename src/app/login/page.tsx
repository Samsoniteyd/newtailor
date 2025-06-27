"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertTriangle, Wifi, Clock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data: LoginFormInputs) => {
    // Clear any previous login errors
    setLoginError('');
    
    login(data, {
      onSuccess: () => {
        // Clear form only on successful login
        setValue('email', '');
        setValue('password', '');
        setLoginError('');
        router.push('/users');
      },
      onError: (error: any) => {
        console.error('Login failed in component:', error);
        
        // Extract error message properly
        let errorMessage = 'Login failed. Please try again.';
        
        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.response?.status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        }
        
        console.log('Setting error message:', errorMessage);
        setLoginError(errorMessage);
        
        // Only clear password for credential errors
        if (errorMessage.includes('Invalid email or password') || errorMessage.includes('credentials')) {
          setValue('password', '');
        }
      }
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getErrorIcon = (errorMessage: string) => {
    if (errorMessage.includes('timeout') || errorMessage.includes('slow')) {
      return <Clock className="h-4 w-4" />;
    }
    if (errorMessage.includes('connect') || errorMessage.includes('network')) {
      return <Wifi className="h-4 w-4" />;
    }
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getErrorType = (errorMessage: string) => {
    if (errorMessage.includes('timeout')) return 'timeout';
    if (errorMessage.includes('connect') || errorMessage.includes('network')) return 'network';
    if (errorMessage.includes('Invalid email or password') || errorMessage.includes('credentials')) return 'credentials';
    return 'general';
  };

  const errorType = loginError ? getErrorType(loginError) : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {/* Enhanced Error Display */}
        {loginError && (
          <div className={`mb-4 p-4 rounded-lg border flex items-start space-x-3 ${
            errorType === 'credentials' 
              ? 'bg-red-50 border-red-200 text-red-800'
              : errorType === 'network'
              ? 'bg-orange-50 border-orange-200 text-orange-800'
              : errorType === 'timeout'
              ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex-shrink-0 mt-0.5">
              {getErrorIcon(loginError)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {errorType === 'credentials' && 'Invalid Credentials'}
                {errorType === 'network' && 'Connection Problem'}
                {errorType === 'timeout' && 'Request Timeout'}
                {errorType === 'general' && 'Login Failed'}
              </p>
              <p className="text-sm mt-1">{loginError}</p>
              
              {/* Additional help text based on error type */}
              {errorType === 'network' && (
                <p className="text-xs mt-2 opacity-75">
                  Make sure your backend server is running on port 5000
                </p>
              )}
              {errorType === 'timeout' && (
                <p className="text-xs mt-2 opacity-75">
                  This usually means your backend is not responding quickly enough
                </p>
              )}
              {errorType === 'credentials' && (
                <p className="text-xs mt-2 opacity-75">
                  Please check your email and password and try again
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium cursor-pointer" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-colors`}
            disabled={isLoggingIn}
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium cursor-pointer" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register('password')}
              className={`border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } p-3 w-full pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-colors`}
              disabled={isLoggingIn}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800 focus:outline-none cursor-pointer transition-colors"
              disabled={isLoggingIn}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={isLoggingIn}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center space-x-2"
        >
          {isLoggingIn ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Logging in...</span>
            </>
          ) : (
            <span>Login</span>
          )}
        </button>
        
        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={() => router.push('/register')}
            className="text-blue-500 hover:underline cursor-pointer transition-colors"
            disabled={isLoggingIn}
          >
            Register here
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;