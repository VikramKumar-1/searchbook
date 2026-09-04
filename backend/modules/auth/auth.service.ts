import { authRepository } from './auth.repository';
import { authOtpManager } from './auth.otp';
import { hashPassword, verifyPassword, signJwt } from '@backend/utils/jwt';
import { ConflictError, UnauthorizedError, BadRequestError } from '@backend/utils/errors';
import type { RegisterInput, LoginInput, SendOtpInput, VerifyPhoneAuthInput, ProviderRegisterInput } from './auth.validator';

async function verifyFirebaseToken(idToken: string): Promise<string | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) return null;

    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = (await res.json()) as { users?: Array<{ phoneNumber?: string }> };
    if (data.users && data.users[0]?.phoneNumber) {
      // Normalize '+919876543210' -> '9876543210'
      return data.users[0].phoneNumber.replace('+91', '').replace('+', '');
    }
    return null;
  } catch (err) {
    console.error('[Firebase Token Verification Error]:', err);
    return null;
  }
}

export const authService = {
  async register(input: RegisterInput) {
    // Check if email already exists
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    // Hash password and create user
    const hashedPassword = hashPassword(input.password);
    const user = await authRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      password: hashedPassword,
      role: input.role || 'PROVIDER',
    });

    // Generate JWT
    const token = signJwt({ userId: user.id, role: user.role });
    return { user, token };
  },

  async login(input: LoginInput) {
    // Find user
    const user = await authRepository.findByEmail(input.email);
    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValid = verifyPassword(input.password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate JWT
    const token = signJwt({ userId: user.id, role: user.role });

    // Remove password from response
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
  },

  /**
   * Request 4-digit SMS OTP for a phone number
   */
  async sendOtp(input: SendOtpInput) {
    const cleanPhone = input.phone.trim();
    const result = authOtpManager.generateOtp(cleanPhone);

    return {
      message: 'OTP sent successfully to your mobile number',
      phone: cleanPhone,
      expiresInSeconds: result.expiresInSeconds,
    };
  },

  /**
   * Verify Phone via Firebase ID Token or Direct SMS OTP, and login/register
   */
  async verifyPhoneAuth(input: VerifyPhoneAuthInput) {
    const cleanPhone = input.phone.trim();

    // 1. Verify credentials
    if (input.idToken) {
      // Production Firebase Phone Auth Verification
      const verifiedPhone = await verifyFirebaseToken(input.idToken);
      if (!verifiedPhone || verifiedPhone !== cleanPhone) {
        throw new UnauthorizedError('Firebase phone verification failed or phone number mismatch');
      }
    } else if (input.otp) {
      // Direct SMS / Dev OTP Verification
      authOtpManager.verifyOtp(cleanPhone, input.otp);
    } else {
      throw new BadRequestError('Either idToken or otp must be provided');
    }

    // 2. Check if user already exists
    let user = await authRepository.findByPhone(cleanPhone);

    // 3. If new user, create account automatically
    if (!user) {
      const generatedEmail = `${cleanPhone}@user.searchbook.in`;
      const displayName = input.name?.trim() || 'Verified Guest';

      user = await authRepository.createWithPhone({
        name: displayName,
        email: generatedEmail,
        phone: cleanPhone,
        role: 'USER',
      });
    }

    // 4. Issue JWT token
    const token = signJwt({ userId: user.id, role: user.role });
    return { user, token };
  },

  /**
   * Google & Apple OAuth Social Login
   */
  async oauthLogin(input: import('./auth.validator').OAuthAuthInput) {
    const cleanEmail = input.email.trim().toLowerCase();

    // 1. Check if user exists
    let user = await authRepository.findByEmail(cleanEmail);

    // 2. If new user, create account
    if (!user) {
      const defaultName = input.provider === 'apple' ? 'Apple User' : 'Google User';
      user = await authRepository.createWithOAuth({
        name: input.name?.trim() || defaultName,
        email: cleanEmail,
        avatar: input.avatar || undefined,
      });
    }

    if (!user) {
      throw new UnauthorizedError('Failed to authenticate with provider');
    }

    // 3. Issue JWT session token
    const token = signJwt({ userId: user.id, role: user.role });
    return { user, token };
  },

  async getMe(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return user;
  },

  async updateProfile(userId: string, input: import('./auth.validator').UpdateProfileInput) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return authRepository.updateProfile(userId, {
      name: input.name?.trim() || undefined,
      phone: input.phone?.replace(/\D/g, '') || undefined,
    });
  },

  async registerProvider(input: ProviderRegisterInput) {
    // 1. Check if email already exists
    const existingEmail = await authRepository.findByEmail(input.email);
    if (existingEmail) {
      throw new ConflictError('An account with this email already exists. Please sign in.');
    }

    // 2. Check if phone already exists
    const cleanPhone = input.phone.replace(/\D/g, '');
    const existingPhone = await authRepository.findByPhone(cleanPhone);
    if (existingPhone) {
      throw new ConflictError('An account with this mobile number already exists. Please sign in.');
    }

    // 3. Hash password
    const hashedPassword = hashPassword(input.password);

    // 4. Create partner user with KYC & legal verification
    const user = await authRepository.createProvider({
      name: input.ownerName.trim(),
      email: input.email.toLowerCase().trim(),
      phone: cleanPhone,
      whatsapp: input.whatsapp ? input.whatsapp.replace(/\D/g, '') : cleanPhone,
      password: hashedPassword,
      businessName: input.businessName.trim(),
      businessType: input.businessType,
      govtIdType: input.govtIdType,
      govtIdNumber: input.govtIdNumber.trim(),
      govtIdPhoto: input.govtIdPhoto,
      drivingLicenseNumber: input.drivingLicenseNumber?.trim() || undefined,
      drivingLicensePhoto: input.drivingLicensePhoto || undefined,
      qualification: input.qualification?.trim() || undefined,
      medicalRegNumber: input.medicalRegNumber?.trim() || undefined,
      certificatePhoto: input.certificatePhoto || undefined,
      clinicAddress: input.clinicAddress?.trim() || undefined,
      doesHomeVisit: input.doesHomeVisit !== undefined ? input.doesHomeVisit : true,
      bio: input.bio?.trim() || undefined,
      subjectsOrSpeciality: input.subjectsOrSpeciality?.trim() || undefined,
      kycStatus: 'PENDING',
      legalAgreed: true,
      legalAgreedAt: new Date(),
    });

    // 5. Issue JWT token
    const token = signJwt({ userId: user.id, role: 'PROVIDER' });
    return { user, token };
  },
};
