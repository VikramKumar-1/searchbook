import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  role: z.enum(['USER', 'PROVIDER']).default('PROVIDER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const sendOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
});

export const verifyPhoneAuthSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  otp: z.string().min(4).max(6).optional(),
  idToken: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
});

export const oauthAuthSchema = z.object({
  provider: z.enum(['google', 'apple']),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  idToken: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number').optional().or(z.literal('')),
});

export const providerRegisterSchema = z.object({
  businessName: z.string().min(3, 'Business name must be at least 3 characters').max(150),
  businessType: z.enum(['HOURLY_HOTEL', 'PG_HOSTEL', 'FLAT', 'SERVICE'], {
    message: 'Please select a business category',
  }),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  whatsapp: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit WhatsApp number is mandatory (व्हाट्सएप नंबर अनिवार्य है)'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),

  // Government KYC & Legal Verification
  govtIdType: z.enum(['AADHAAR', 'PAN', 'TRADE_LICENSE', 'GSTIN', 'SARAI_ACT', 'DRIVING_LICENSE'], {
    message: 'Please select a government ID type',
  }),
  govtIdNumber: z.string().min(4, 'Valid document number is required').max(50),
  govtIdPhoto: z.string().min(1, 'Document proof photo is required'),
  govtIdPhotoBack: z.string().optional().or(z.literal('')),

  // Driver on Call Specific KYC (Motor Vehicles Act, 1988)
  drivingLicenseNumber: z.string().max(50).optional().or(z.literal('')),
  drivingLicensePhoto: z.string().optional().or(z.literal('')),

  // Professional Credentials & Trust Verification (Doctor, Nurse, Tutor, Services)
  qualification: z.string().max(100).optional().or(z.literal('')),
  medicalRegNumber: z.string().max(100).optional().or(z.literal('')),
  certificatePhoto: z.string().optional().or(z.literal('')),
  clinicAddress: z.string().max(300).optional().or(z.literal('')),
  doesHomeVisit: z.boolean().optional(),
  bio: z.string().max(1000).optional().or(z.literal('')),
  subjectsOrSpeciality: z.string().max(200).optional().or(z.literal('')),

  legalAgreed: z.literal(true, {
    message: 'You must accept the legal declaration and intermediary terms',
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyPhoneAuthInput = z.infer<typeof verifyPhoneAuthSchema>;
export type OAuthAuthInput = z.infer<typeof oauthAuthSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ProviderRegisterInput = z.infer<typeof providerRegisterSchema>;
