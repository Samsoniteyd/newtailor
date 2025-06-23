"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const { register: registerUser, isRegistering, registerError } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormInputs) => {
    registerUser(data, {
      onSuccess: () => {
        router.push('/users');
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        
        {registerError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-center">
            {(registerError as any)?.response?.data?.message || 'Registration failed'}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isRegistering}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isRegistering}
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
            disabled={isRegistering}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={isRegistering}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRegistering ? 'Creating account...' : 'Register'}
        </button>
        
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            type="button"
            onClick={() => router.push('/login')}
            className="text-blue-500 hover:underline"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;