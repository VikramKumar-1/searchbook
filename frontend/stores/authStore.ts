import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  avatar: string | null;
  isPremium: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  redirectUrlOnSuccess: string | null;
  setUser: (user: AuthUser | null) => void;
  openAuthModal: (mode?: 'login' | 'register', redirectUrl?: string | null) => void;
  closeAuthModal: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthModalOpen: false,
      authModalMode: 'register',
      redirectUrlOnSuccess: null,

      setUser: (user) => set({ user }),

      openAuthModal: (mode = 'register', redirectUrl = null) =>
        set({ isAuthModalOpen: true, authModalMode: mode, redirectUrlOnSuccess: redirectUrl }),

      closeAuthModal: () => set({ isAuthModalOpen: false, redirectUrlOnSuccess: null }),

      logout: async () => {
        try {
          await fetch('/api/v1/auth/logout', { method: 'POST' });
        } catch {}
        set({ user: null, isAuthModalOpen: false });
      },

      checkAuth: async () => {
        try {
          const res = await fetch('/api/v1/auth/me');
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              set({ user: json.data });
              return;
            }
          }
          set({ user: null });
        } catch {
          // Keep cached user if offline, or reset on auth error
        }
      },
    }),
    {
      name: 'searchbook-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
