"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Phone, User, Lock, CheckCircle } from 'lucide-react';

// Simplified validation schema
const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot be longer than 50 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .optional()
    .or(z.literal('')),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const { register: registerUser, isRegistering, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [registerError, setRegisterError] = useState<string>('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/users');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      // Clear previous errors
      setRegisterError('');
      
      const registerData = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || undefined,
        password: data.password,
      };

      await new Promise<void>((resolve, reject) => {
        registerUser(registerData, {
          onSuccess: () => {
            console.log('Registration successful');
            setSuccessMessage('Account created successfully! Redirecting...');
            // Clear form only on success
            setValue('name', '');
            setValue('email', '');
            setValue('phone', '');
            setValue('password', '');
            setValue('confirmPassword', '');
            resolve();
            setTimeout(() => {
              router.push('/users');
            }, 1500);
          },
          onError: (error) => {
            console.error('Registration failed:', error);
            // Set error but DON'T clear form
            setRegisterError(error.message || 'Registration failed. Please try again.');
            // Optionally clear only passwords on registration failure
            setValue('password', '');
            setValue('confirmPassword', '');
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Registration submission error:', error);
    }
  };

  const getErrorMessage = (error: any) => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Registration failed. Please try again.';
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile-optimized container */}
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md sm:max-w-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg border overflow-hidden">
            
            {/* Header - Mobile optimized */}
            <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
                  Join TailorPro and start managing your orders
                </p>
              </div>
            </div>

            {/* Form content */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              
              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start text-green-700">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{successMessage}</span>
                </div>
              )}
              
              {/* Error Message */}
              {registerError && !successMessage && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <p className="text-xs sm:text-sm font-medium">Registration Failed</p>
                  <p className="text-xs sm:text-sm mt-1">{getErrorMessage(registerError)}</p>
                </div>
              )}
              
              {/* Name Field */}
              <div className="mb-4 sm:mb-6">
                <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer" htmlFor="name">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`border ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base cursor-text`}
                    placeholder="Enter your full name"
                    disabled={isSubmitting || isRegistering}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Email Field */}
              <div className="mb-4 sm:mb-6">
                <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer" htmlFor="email">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`border ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base cursor-text`}
                    placeholder="Enter your email address"
                    disabled={isSubmitting || isRegistering}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone Field */}
              <div className="mb-4 sm:mb-6">
                <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer" htmlFor="phone">
                  Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className={`border ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base cursor-text`}
                    placeholder="Enter your phone number"
                    disabled={isSubmitting || isRegistering}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone.message}</p>}
              </div>
              
              {/* Password Field */}
              <div className="mb-4 sm:mb-6">
                <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer" htmlFor="password">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    {...register('password')}
                    className={`border ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base cursor-text`}
                    placeholder="Create a strong password"
                    disabled={isSubmitting || isRegistering}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors p-1 cursor-pointer"
                    disabled={isSubmitting || isRegistering}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="mb-6 sm:mb-8">
                <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer" htmlFor="confirmPassword">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    className={`border ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base cursor-text`}
                    placeholder="Confirm your password"
                    disabled={isSubmitting || isRegistering}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors p-1 cursor-pointer"
                    disabled={isSubmitting || isRegistering}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>
              
              {/* Submit Button - Mobile optimized */}
              <button 
                type="submit" 
                disabled={isSubmitting || isRegistering || !!successMessage}
                className="w-full bg-blue-600 text-white py-3 sm:py-3.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base flex items-center justify-center space-x-2 min-h-[44px] sm:min-h-[48px] cursor-pointer"
              >
                {(isSubmitting || isRegistering) ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
              
              {/* Login Link - Mobile optimized */}
              <div className="text-center mt-4 sm:mt-6">
                <p className="text-xs sm:text-sm text-gray-600">
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => router.push('/login')}
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors cursor-pointer"
                    disabled={isSubmitting || isRegistering}
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;