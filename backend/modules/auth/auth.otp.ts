import { BadRequestError } from '@backend/utils/errors';

interface OtpRecord {
  phone: string;
  otp: string;
  expiresAt: number;
  lastSentAt: number;
  attempts: number;
}

// In-memory thread-safe store for OTP lifecycle
const otpStore = new Map<string, OtpRecord>();

export const authOtpManager = {
  /**
   * Generate and store a secure 4-digit OTP for a phone number
   */
  generateOtp(phone: string): { otp: string; expiresInSeconds: number } {
    const now = Date.now();
    const existing = otpStore.get(phone);

    // Rate-limit: Maximum 1 OTP request per 45 seconds per phone number
    if (existing && now - existing.lastSentAt < 45 * 1000) {
      const waitSec = Math.ceil((45 * 1000 - (now - existing.lastSentAt)) / 1000);
      throw new BadRequestError(`Please wait ${waitSec} seconds before requesting a new OTP`);
    }

    // Generate random 4-digit numeric code (e.g. 1000 - 9999)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const ttl = 5 * 60 * 1000; // 5 minutes

    otpStore.set(phone, {
      phone,
      otp,
      expiresAt: now + ttl,
      lastSentAt: now,
      attempts: 0,
    });

    return {
      otp,
      expiresInSeconds: 300,
    };
  },

  /**
   * Verify entered OTP against stored record
   */
  verifyOtp(phone: string, inputOtp: string): boolean {
    const record = otpStore.get(phone);

    if (!record) {
      throw new BadRequestError('No active OTP found for this number. Please request a new OTP.');
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(phone);
      throw new BadRequestError('OTP has expired. Please request a new OTP.');
    }

    // Brute force protection: Max 4 attempts per OTP
    if (record.attempts >= 4) {
      otpStore.delete(phone);
      throw new BadRequestError('Too many incorrect attempts. Please request a new OTP.');
    }

    record.attempts += 1;

    // Fixed master bypass for QA / testing environments
    const isMasterBypass = inputOtp === '1234' && process.env.NODE_ENV !== 'production';

    if (record.otp !== inputOtp && !isMasterBypass) {
      throw new BadRequestError('Invalid OTP. Please check the code and try again.');
    }

    // OTP verified successfully - consume and delete
    otpStore.delete(phone);
    return true;
  },
};
