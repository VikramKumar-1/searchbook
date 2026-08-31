'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@frontend/stores/authStore';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(10, 'Enter 10-digit phone number').max(15).optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type RegisterForm = z.infer<typeof registerSchema>;
type LoginForm = z.infer<typeof loginSchema>;

export function AuthModal() {
  const { isAuthModalOpen, authModalMode, redirectUrlOnSuccess, closeAuthModal, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLogin, setIsLogin] = useState(authModalMode === 'login');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Sync mode whenever modal is opened with a specific mode
  useEffect(() => {
    setIsLogin(authModalMode === 'login');
    setServerError('');
  }, [authModalMode, isAuthModalOpen]);

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  });

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (!isAuthModalOpen) return null;

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setServerError('');
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: 'PROVIDER' }),
      });
      const json = await res.json();
      if (!json.success) {
        setServerError(json.error?.message || 'Registration failed');
        return;
      }
      setUser(json.data);
      closeAuthModal();
      registerForm.reset();
      if (redirectUrlOnSuccess) {
        router.push(redirectUrlOnSuccess);
      }
    } catch {
      setServerError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setServerError('');
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) {
        setServerError(json.error?.message || 'Invalid email or password');
        return;
      }
      setUser(json.data);
      closeAuthModal();
      loginForm.reset();
      if (redirectUrlOnSuccess) {
        router.push(redirectUrlOnSuccess);
      }
    } catch {
      setServerError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setServerError('');
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-lg bg-white text-sm border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-base font-bold text-gray-900 tracking-tight">
                Search<span className="text-blue-600">Book</span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create an account'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isLogin
                ? 'Welcome back! Please enter your details.'
                : 'Join SearchBook to list and manage your services.'}
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {serverError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-2.5 rounded-lg">
              {serverError}
            </div>
          )}

          {isLogin ? (
            /* LOGIN FORM */
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
                <input
                  {...loginForm.register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={inputCls}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    {...loginForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`${inputCls} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm mt-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input
                  {...registerForm.register('name')}
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className={inputCls}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
                <input
                  {...registerForm.register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={inputCls}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone (Optional)</label>
                <input
                  {...registerForm.register('phone')}
                  type="tel"
                  placeholder="9876543210"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    {...registerForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    className={`${inputCls} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm mt-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}

          {/* Toggle */}
          <div className="mt-5 text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={switchMode}
                className="text-blue-600 font-semibold ml-1 hover:underline cursor-pointer"
              >
                {isLogin ? 'Create an account' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
