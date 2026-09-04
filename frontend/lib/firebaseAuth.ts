// frontend/lib/firebaseAuth.ts
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';

export interface SocialAuthUser {
  provider: 'google' | 'apple';
  email: string;
  name: string;
  avatar?: string;
  idToken?: string;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let globalConfirmationResult: ConfirmationResult | null = null;
let globalRecaptchaVerifier: RecaptchaVerifier | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

export async function loginWithGoogleFirebase(): Promise<SocialAuthUser> {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API Key missing. Please add NEXT_PUBLIC_FIREBASE_API_KEY to your .env');
  }

  const { initializeApp, getApps, getApp } = await import('firebase/app');
  const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;

  if (!user.email) {
    throw new Error('Google account must provide a verified email address');
  }

  const idToken = await user.getIdToken();

  return {
    provider: 'google',
    email: user.email,
    name: user.displayName || user.email.split('@')[0],
    avatar: user.photoURL || undefined,
    idToken,
  };
}

export async function loginWithAppleFirebase(): Promise<SocialAuthUser> {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API Key missing. Please add NEXT_PUBLIC_FIREBASE_API_KEY to your .env');
  }

  const { initializeApp, getApps, getApp } = await import('firebase/app');
  const { getAuth, OAuthProvider, signInWithPopup } = await import('firebase/auth');

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');

  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;

  if (!user.email) {
    throw new Error('Apple account must provide an email address');
  }

  const idToken = await user.getIdToken();

  return {
    provider: 'apple',
    email: user.email,
    name: user.displayName || 'Apple User',
    avatar: user.photoURL || undefined,
    idToken,
  };
}

/**
 * Sends a REAL 6-digit SMS OTP to an Indian mobile number via Google Firebase
 */
export async function sendFirebasePhoneOtp(phone: string): Promise<boolean> {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API Key missing in environment variables');
  }

  const { initializeApp, getApps, getApp } = await import('firebase/app');
  const { getAuth, RecaptchaVerifier, signInWithPhoneNumber } = await import('firebase/auth');

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);

  if (typeof document === 'undefined') return false;

  let container = document.getElementById('recaptcha-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'recaptcha-container';
    document.body.appendChild(container);
  }

  // Initialize invisible recaptcha container safely
  if (globalRecaptchaVerifier) {
    try {
      globalRecaptchaVerifier.clear();
    } catch {}
    globalRecaptchaVerifier = null;
  }

  try {
    globalRecaptchaVerifier = new RecaptchaVerifier(auth, container, {
      size: 'invisible',
      callback: () => {},
    });
  } catch (recaptchaErr) {
    console.warn('[Recaptcha Init Failed]:', recaptchaErr);
  }

  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
  globalConfirmationResult = await signInWithPhoneNumber(auth, formattedPhone, globalRecaptchaVerifier || undefined);
  return true;
}

/**
 * Confirms the REAL 6-digit SMS OTP received on the phone and returns verified ID token
 */
export async function confirmFirebasePhoneOtp(otp: string): Promise<string> {
  if (!globalConfirmationResult) {
    throw new Error('No active OTP request. Please request OTP first.');
  }

  const credential = await globalConfirmationResult.confirm(otp);
  const user = credential.user;
  return user.getIdToken();
}
