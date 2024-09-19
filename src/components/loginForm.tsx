'use client';
import React, { useContext, useEffect, useState } from 'react';
import { UserRepository } from '@repo/domain/UserRepository';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { EyeOff, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AdminContext } from './Context/AdminContext';
import { useRouter } from 'next/navigation';
import { AuthButton } from './Buttons/AuthButton';
import Link from 'next/link';
const UserActions = new UserRepository();

export const LoginComponent = () => {
  const [authState, setAuthState] = useState('login'); // 'login', 'forgotPassword'
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const toast = useToast();
  const [userRole, setUserRole] = useState({} as any);
  const onSubmit = async (data: any) => {
    if (authState === 'login') {
      try {
        const getRole = await UserActions.adminSignIn(data.email, data.password);
        setUserRole(getRole[0]);
      } catch (error) {
        console.error('Error:', error);
      }
    } else if (authState === 'forgotPassword') {
      try {
        await UserActions.updatePassword(data.email);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('Invalid Auth State');
    }

  };

  const [viewPassword, setViewPassword] = useState(false);
  const { user } = useContext(AdminContext);

  useEffect(() => {
    if (userRole?.roles === 'Admin') {
      router.push('/dashboard');
    }
  }, [router, userRole]);

  return (
    <motion.div
      className="max-w-md p-10 mx-auto rounded-lg shadow-lg bg-card min-w-72 "
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-6 text-2xl font-bold text-center text-card-foreground">
        {authState === 'login' ? 'Login' : 'Reset Password'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="z-0 space-y-4">
        <div>
          <Label className="block text-sm font-medium ">Email</Label>
          <Input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm "
          />
          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message?.toString()}
            </p>
          )}
        </div>
        {authState !== 'forgotPassword' && (
          <div className="relative">
            <Label className="block text-sm font-medium ">Password</Label>
            <Input
              type={viewPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm "
            />
            {viewPassword ? (
              <button
                type="button"
                onClick={() => setViewPassword(!viewPassword)}
                className="absolute right-0 inline-flex items-center justify-center h-10 px-4 py-2 pr-2 text-sm font-medium transition-colors rounded-md bg-none inset-y-6 whitespace-nowrap ring-offset-background"
              >
                <EyeOff className="text-muted-foreground" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setViewPassword(!viewPassword)}
                className="absolute right-0 inline-flex items-center justify-center h-10 px-4 py-2 pr-2 text-sm font-medium transition-colors rounded-md bg-none inset-y-6 whitespace-nowrap ring-offset-background"
              >
                <Eye className="text-muted-foreground" />
              </button>
            )}

            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message?.toString()}
              </p>
            )}
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
        >
          {authState === 'login' ? 'Login' : 'Send Reset Link'}
        </button>
      </form>
      <div className="mt-4 text-center">
        {authState === 'login' && (
          <>
            <button
              onClick={() => setAuthState('forgotPassword')}
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </>
        )}
        {authState === 'forgotPassword' && (
          <button
            onClick={() => setAuthState('login')}
            className="text-blue-500 hover:underline"
          >
            Back to Login
          </button>
        )}
      </div>
    </motion.div>
  );
};
