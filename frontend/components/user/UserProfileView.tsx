'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, ShieldCheck, CheckCircle2, Loader2, Save, Calendar, Building2, LogOut } from 'lucide-react';
import { useAuthStore } from '@frontend/stores/authStore';
import { useRouter } from 'next/navigation';

export function UserProfileView() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 max-w-sm w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0033CC] flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Please Sign In</h2>
          <p className="text-xs text-gray-500">Sign in to view and manage your profile and bookings.</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-[#0033CC] text-white font-bold text-xs py-3 rounded-xl hover:bg-[#002699] transition-all cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    const cleanPhone = phone.replace(/\D/g, '').trim();
    if (cleanPhone && cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          phone: cleanPhone || undefined,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setErrorMessage(json.error?.message || 'Failed to update profile');
        return;
      }

      setUser(json.data);
      setSuccessMessage('Profile updated successfully! Next time you book, this information will auto-fill.');
    } catch {
      setErrorMessage('Network error while updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* ── PROFILE HEADER CARD ── */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          
          {/* Avatar */}
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0033CC] to-[#2563EB] text-white flex items-center justify-center font-black text-2xl shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{user.name}</h1>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                {user.role === 'PROVIDER' ? 'Business Host' : 'Verified Account'}
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{user.email}</span>
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <ShieldCheck className="w-4 h-4" /> Google Verified
              </span>
              <span>·</span>
              <span>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── EDIT PROFILE FORM ── */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-base font-black text-gray-900">Personal & Contact Details</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            This information automatically pre-fills during hotel bookings for 1-second check-in.
          </p>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0033CC] focus:outline-none transition-all"
            />
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Email (Google account - locked) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Email Address
            </label>
            <span className="text-[10px] text-gray-400 font-bold">Linked to Google Account</span>
          </div>
          <div className="relative">
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-gray-500 cursor-not-allowed select-none"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Mobile Number (For Hotel Reception & Check-In)
            </label>
            {phone && (
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                Ready for auto-fill ✓
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit mobile number"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0033CC] focus:outline-none transition-all"
            />
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <p className="text-[11px] text-gray-500 font-medium mt-1.5">
            Save your mobile number here so you never have to type it again when booking hotels!
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#0033CC] hover:bg-[#002699] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* ── QUICK SHORTCUTS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bookings Card */}
        <a
          href="/my-bookings"
          className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-xs transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0033CC] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black text-gray-900 block">My Hotel Bookings</span>
            <span className="text-[11px] text-gray-500 font-medium">View active & past stays</span>
          </div>
        </a>

        {/* List Business */}
        <a
          href="/provider/onboarding"
          className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-xs transition-all flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black text-gray-900 block">List a Business / Hotel</span>
            <span className="text-[11px] text-gray-500 font-medium">Register as host & earn</span>
          </div>
        </a>
      </div>

      {/* Logout */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Account</span>
        </button>
      </div>

    </div>
  );
}
