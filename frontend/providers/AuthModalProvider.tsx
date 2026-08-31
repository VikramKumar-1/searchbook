'use client';

import React, { useEffect } from 'react';
import { AuthModal } from '@frontend/components/auth/AuthModal';
import { useAuthStore } from '@frontend/stores/authStore';

export function AuthModalProvider() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <AuthModal />;
}
