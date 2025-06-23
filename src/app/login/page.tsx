"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const { login, isLoggingIn, loginError } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    login(data, {
      onSuccess: () => {
        router.push('/users');
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {loginError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-center">
            {(loginError as any)?.response?.data?.message || 'Login failed'}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isLoggingIn}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isLoggingIn}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={isLoggingIn}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>
        
        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={() => router.push('/register')}
            className="text-blue-500 hover:underline"
          >
            Register here
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;