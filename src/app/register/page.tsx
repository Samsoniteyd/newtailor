"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Phone, User, Lock, CheckCircle } from 'lucide-react';

// Fixed validation schema
const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot be longer than 50 characters'),
  contactType: z.enum(['email', 'phone']),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  // Check if email is provided when contactType is email
  if (data.contactType === 'email') {
    return data.email && data.email.length > 0 && data.email.includes('@');
  }
  return true;
}, {
  message: "Please enter a valid email address",
  path: ["email"],
}).refine((data) => {
  // Check if phone is provided when contactType is phone
  if (data.contactType === 'phone') {
    return data.phone && data.phone.length >= 10;
  }
  return true;
}, {
  message: "Please enter a valid phone number (at least 10 digits)",
  path: ["phone"],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const { register: registerUser, isRegistering, registerError, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, clearErrors, trigger } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      contactType: 'email',
      email: '',
      phone: '',
      name: '',
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

  // Watch contact type changes
  const watchedContactType = watch('contactType');
  useEffect(() => {
    setContactType(watchedContactType);
    // Clear errors and values when switching contact type
    if (watchedContactType === 'email') {
      setValue('phone', '');
      clearErrors('phone');
    } else {
      setValue('email', '');
      clearErrors('email');
    }
  }, [watchedContactType, clearErrors, setValue]);

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      console.log('Form submitted with data:', data); // Debug log
      
      const registerData = {
        name: data.name.trim(),
        email: data.contactType === 'email' ? data.email?.trim() : undefined,
        phone: data.contactType === 'phone' ? data.phone?.trim() : undefined,
        password: data.password,
      };

      console.log('Sending registration data:', registerData); // Debug log

      await registerUser(registerData, {
        onSuccess: () => {
          setSuccessMessage('Account created successfully! Redirecting...');
          setTimeout(() => {
            router.push('/users');
          }, 1500);
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const getErrorMessage = (error: any) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return 'Registration failed. Please try again.';
  };

  // Debug: Log current form state
  console.log('Form errors:', errors);
  console.log('Is submitting:', isSubmitting);
  console.log('Is registering:', isRegistering);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center  bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full h-[50%]  max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-lg border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join TailorPro and start managing your orders</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              {successMessage}
            </div>
          )}
          
          {/* Error Message */}
          {registerError && !successMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="text-sm font-medium">Registration Failed</p>
              <p className="text-sm mt-1">{getErrorMessage(registerError)}</p>
            </div>
          )}
          
          {/* Name Field */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="name"
                {...register('name')}
                className={`border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} pl-10 pr-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                placeholder="Enter your full name"
                disabled={isSubmitting || isRegistering}
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Contact Type Selection */}
          <div className="mb-4">
            <label className="block mb-3 text-sm font-medium text-gray-700">
              How would you like to sign up?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValue('contactType', 'email');
                  trigger('contactType');
                }}
                className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 transition-colors ${
                  contactType === 'email'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={isSubmitting || isRegistering}
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Email</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('contactType', 'phone');
                  trigger('contactType');
                }}
                className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 transition-colors ${
                  contactType === 'phone'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={isSubmitting || isRegistering}
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">Phone</span>
              </button>
            </div>
            <input type="hidden" {...register('contactType')} />
          </div>

          {/* Email/Phone Field */}
          {contactType === 'email' ? (
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className={`border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} pl-10 pr-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                  placeholder="Enter your email address"
                  disabled={isSubmitting || isRegistering}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
          ) : (
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className={`border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} pl-10 pr-4 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                  placeholder="Enter your phone number"
                  disabled={isSubmitting || isRegistering}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
          )}
          
          {/* Password Field */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password')}
                className={`border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} pl-10 pr-12 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                placeholder="Create a strong password"
                disabled={isSubmitting || isRegistering}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting || isRegistering}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                {...register('confirmPassword')}
                className={`border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} pl-10 pr-12 py-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                placeholder="Confirm your password"
                disabled={isSubmitting || isRegistering}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting || isRegistering}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting || isRegistering || !!successMessage}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
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
          
          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                disabled={isSubmitting || isRegistering}
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;