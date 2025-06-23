"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserFormProps } from '../types';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const UserForm: React.FC<UserFormProps> = ({ isLogin, initialData, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block">Email</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="input"
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
      </div>
      <div>
        <label htmlFor="password" className="block">Password</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className="input"
        />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
      </div>
      {!isLogin && (
        <div>
          <label htmlFor="phone" className="block">Phone (optional)</label>
          <input
            type="text"
            id="phone"
            {...register('phone')}
            className="input"
          />
        </div>
      )}
      <button type="submit" className="btn">
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default UserForm;