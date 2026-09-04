'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Building2, Lock, Mail, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginSchema, type LoginInput } from '@backend/modules/auth/auth.validator';
import { useAuthStore } from '@frontend/stores/authStore';

export function PartnerLoginView() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginInput) => {
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
      router.push('/provider/dashboard');
    } catch {
      setServerError('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0033CC] flex items-center justify-center mx-auto shadow-2xs border border-blue-200">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Partner Portal Login</h1>
          <p className="text-xs text-gray-500 font-medium">Access your property dashboard, bookings & inquiries.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
          {serverError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Partner Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  placeholder="contact@myhotel.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0033CC] focus:outline-none transition-all"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 font-semibold mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0033CC] focus:outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 font-semibold mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0033CC] hover:bg-[#002699] text-white font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Don't have a partner account yet?{' '}
              <a href="/provider/register" className="text-[#0033CC] font-bold hover:underline">
                Register Your Business →
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
