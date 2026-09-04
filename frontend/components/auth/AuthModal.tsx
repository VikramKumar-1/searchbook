'use client';

import React, { useState } from 'react';
import { X, Loader2, ShieldCheck, Building2 } from 'lucide-react';
import { useAuthStore } from '@frontend/stores/authStore';
import { useRouter } from 'next/navigation';
import { loginWithGoogleFirebase } from '@frontend/lib/firebaseAuth';

export function AuthModal() {
  const { isAuthModalOpen, redirectUrlOnSuccess, closeAuthModal, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  if (!isAuthModalOpen) return null;

  // ── GOOGLE SIGN-IN HANDLER ──
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setServerError('');
    try {
      const socialUser = await loginWithGoogleFirebase();
      const res = await fetch('/api/v1/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialUser),
      });
      const json = await res.json();
      if (!json.success) {
        setServerError(json.error?.message || 'Google login failed. Please try again.');
        return;
      }
      setUser(json.data);
      closeAuthModal();
      if (redirectUrlOnSuccess) router.push(redirectUrlOnSuccess);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Google sign-in was cancelled or failed';
      setServerError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0033CC] to-[#2563EB] px-6 py-7 text-white relative text-center">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 mb-2.5">
            <span className="bg-[#CCFF00] text-black font-black text-xs px-2.5 py-0.5 rounded shadow-xs">Search</span>
            <span className="text-white font-black text-sm">Book</span>
          </div>

          <h2 className="text-xl font-black tracking-tight">
            Welcome to SearchBook
          </h2>
          <p className="text-xs text-white/85 mt-1.5 leading-relaxed px-2">
            Sign in to book hourly stays, save favorites & manage your bookings instantly.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* ── SINGLE HIGH-CONVERTING GOOGLE SIGN-IN BUTTON ── */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3.5 py-3.5 px-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 text-sm font-black text-gray-800 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#0033CC]" />
                  <span className="text-[#0033CC]">Connecting with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Trust Tagline */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-medium pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>1-Click Instant Sign In · 100% Secure</span>
          </div>

          {/* Provider Callout Link */}
          <div className="pt-3 border-t border-gray-100 text-center">
            <a
              href="/provider/register"
              onClick={closeAuthModal}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0033CC] font-bold transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              <span>Are you a hotel owner? <strong className="text-[#0033CC] underline">List Your Business →</strong></span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
