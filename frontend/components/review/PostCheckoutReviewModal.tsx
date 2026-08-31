'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@frontend/lib/apiClient';
import { useAuthStore } from '@frontend/stores/authStore';
import {
  Star, X, Check, Loader2, Sparkles, Building, MessageSquare, ThumbsUp, HeartHandshake
} from 'lucide-react';

interface PendingBooking {
  id: string;
  bookingCode: string;
  checkInDate: string;
  checkInTime: string;
  checkOutTime: string | null;
  guestName: string;
  listingId: string;
  listing: {
    id: string;
    title: string;
    slug: string;
    address: string;
    photos: string[];
  };
}

const QUICK_TAGS = [
  '🛏️ Super Clean Room',
  '⚡ Fast 10-Sec Check-in',
  '👫 Couple Friendly & Discreet',
  '❄️ Chilled AC & Fast WiFi',
  '🤝 Very Polite Staff',
  '📍 Prime Location',
];

const RATING_LABELS: Record<number, { label: string; emoji: string }> = {
  1: { label: 'Needs Improvement', emoji: '😞' },
  2: { label: 'Fair / Average', emoji: '😐' },
  3: { label: 'Good Stay', emoji: '🙂' },
  4: { label: 'Very Good & Comfortable', emoji: '😊' },
  5: { label: 'Superb & Exceptional!', emoji: '🌟' },
};

export function PostCheckoutReviewModal() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [activeBooking, setActiveBooking] = useState<PendingBooking | null>(null);

  // 1. Check if user or guest has a completed stay awaiting review
  const { data: pendingBooking } = useQuery<PendingBooking | null>({
    queryKey: ['pending-review', user?.id],
    queryFn: async () => {
      const localPhone = typeof window !== 'undefined' ? localStorage.getItem('sb_guest_phone') : null;
      const params = new URLSearchParams();
      if (localPhone) params.append('phone', localPhone);
      
      const res = await apiClient.get<PendingBooking | null>(
        `/api/v1/user/pending-review${params.toString() ? `?${params.toString()}` : ''}`
      );
      return res;
    },
    staleTime: 60 * 1000,
  });

  // Strict rule: Auto-popup appears ONCE per completed stay when user opens website/app
  useEffect(() => {
    if (pendingBooking && typeof window !== 'undefined') {
      const alreadyPrompted = localStorage.getItem(`sb_review_prompted_${pendingBooking.id}`);
      if (!alreadyPrompted) {
        localStorage.setItem(`sb_review_prompted_${pendingBooking.id}`, 'true');
        setActiveBooking(pendingBooking);
        setIsOpen(true);
      }
    }
  }, [pendingBooking]);

  // Listener for manual triggers from Profile History / My Bookings page
  useEffect(() => {
    const handleManualOpen = (event: Event) => {
      const customEvent = event as CustomEvent<PendingBooking>;
      if (customEvent.detail) {
        setActiveBooking(customEvent.detail);
        setRating(5);
        setComment('');
        setError('');
        setIsSuccess(false);
        setIsOpen(true);
      }
    };

    window.addEventListener('sb:open-review-modal', handleManualOpen);
    return () => window.removeEventListener('sb:open-review-modal', handleManualOpen);
  }, []);

  // 2. Submit Review Mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (payload: {
      listingId: string;
      bookingId: string;
      rating: number;
      comment: string;
      guestName?: string;
    }) => {
      return apiClient.post('/api/v1/reviews', payload);
    },
    onSuccess: () => {
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['pending-review'] });
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to submit review. Please try again.';
      setError(msg);
    },
  });

  // 3. Dismiss prompt mutation
  const handleDismiss = async () => {
    if (activeBooking) {
      sessionStorage.setItem(`sb_dismissed_${activeBooking.id}`, 'true');
      try {
        await apiClient.post('/api/v1/user/pending-review', { bookingId: activeBooking.id });
      } catch {
        // Silently catch
      }
    }
    setIsOpen(false);
  };

  const handleTagClick = (tag: string) => {
    const cleanTag = tag.replace(/^[^\s]+\s/, ''); // Remove leading emoji
    if (comment.includes(cleanTag)) return;
    setComment((prev) => (prev ? `${prev}, ${cleanTag}` : cleanTag).slice(0, 300));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) return;
    if (comment.trim().length < 5) {
      setError('Please write at least a few words (min 5 characters).');
      return;
    }
    setError('');

    submitReviewMutation.mutate({
      listingId: activeBooking.listingId,
      bookingId: activeBooking.id,
      rating,
      comment: comment.trim(),
      guestName: user?.name || activeBooking.guestName,
    });
  };

  if (!isOpen || !activeBooking) return null;

  const currentDisplayRating = hoverRating || rating;
  const ratingInfo = RATING_LABELS[currentDisplayRating] || RATING_LABELS[5];
  const hotelPhoto = activeBooking.listing.photos?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80';

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={handleDismiss}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-indigo-50/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-2xs border border-blue-100 shrink-0">
              <img
                src={hotelPhoto}
                alt={activeBooking.listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md tracking-wider">
                Completed Stay Review
              </span>
              <h2 className="text-sm font-black text-gray-900 line-clamp-1 mt-0.5">
                {activeBooking.listing.title}
              </h2>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Thank You For Your Review!</h3>
              <p className="text-xs text-gray-600 max-w-xs mx-auto">
                Your genuine feedback helps fellow travellers and couples book safe stays with complete confidence.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Question */}
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-gray-900">
                  How was your experience?
                </h3>
                <p className="text-xs text-gray-500">
                  Rate your recent stay on SearchBook
                </p>
              </div>

              {/* 5-Star Interactive Rating Bar */}
              <div className="flex flex-col items-center gap-1.5 py-1">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 text-gray-200 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          star <= currentDisplayRating
                            ? 'fill-[#FFB800] text-[#FFB800] drop-shadow-xs'
                            : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs font-bold text-gray-800 flex items-center gap-1 mt-1">
                  <span>{ratingInfo.emoji}</span>
                  <span>{ratingInfo.label}</span>
                </div>
              </div>

              {/* 1-Click Quick Feedback Tags */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-gray-500 block">
                  Tap to add quick highlights:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TAGS.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200 transition-all cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Description Box (Sensible 300 char limit) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="font-bold text-gray-700">Write Your Feedback</label>
                  <span className="text-gray-400 font-mono">
                    {comment.length}/300
                  </span>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 300))}
                  placeholder="Share a quick review about room cleanliness, AC/hot water, couple safety, or reception desk experience..."
                  rows={3}
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 transition-all resize-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-xl font-medium">
                  {error}
                </p>
              )}

              {/* Submit CTA */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-1/3 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Maybe Later
                </button>
                <button
                  type="submit"
                  disabled={submitReviewMutation.isPending}
                  className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitReviewMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
