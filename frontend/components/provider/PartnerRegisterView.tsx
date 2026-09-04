'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Building2,
  CheckCircle2,
  Upload,
  Phone,
  ArrowRight,
  AlertCircle,
  Loader2,
  Search,
  Check,
  Camera,
  Briefcase,
} from 'lucide-react';
import { useAuthStore } from '@frontend/stores/authStore';
import { providerRegisterSchema, type ProviderRegisterInput } from '@backend/modules/auth/auth.validator';
import { compressImageToWebP } from '@frontend/utils/imageCompressor';

type PartnerTrack = 'SERVICE' | 'PROPERTY';

interface ServiceItem {
  id: string;
  name: string;
  tag: string;
  keywords: string[];
  renderIcon: (isSelected: boolean) => React.ReactNode;
}

// ── 12 MASTER CONSISTENT SERVICES (FROM HIGH LEVEL TO EVERYDAY GROUND LEVEL) ──
const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'puncture',
    name: 'Tyre Puncture & Mechanic',
    tag: 'Bike, Car Puncture, Hawa',
    keywords: ['puncture', 'panchar', 'pancher', 'tyre', 'tube', 'hawa', 'bike puncture', 'car puncture', 'stepney', 'mechanic'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
        <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
        <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
        <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
      </svg>
    ),
  },
  {
    id: 'plumber',
    name: 'Plumbing & Pipe Repair',
    tag: 'Nal, Pipe, Geyser, Tanki',
    keywords: ['plumber', 'nal', 'pipe', 'leak', 'tank', 'geyser', 'mistri', 'sanitary'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: 'electrician',
    name: 'Electrical & Wiring',
    tag: 'Bijli, Fan, Switch, MCB',
    keywords: ['electrician', 'bijli', 'fan', 'light', 'wiring', 'mcb', 'inverter', 'short circuit'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'ac-repair',
    name: 'AC & Fridge Repair',
    tag: 'AC, Gas Refill, Cooling',
    keywords: ['ac', 'fridge', 'refrigerator', 'cooling', 'gas', 'service', 'deep clean'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6h20v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" />
        <path d="M6 14h12" />
        <path d="M10 10h4" />
      </svg>
    ),
  },
  {
    id: 'ro-purifier',
    name: 'RO Water Purifier',
    tag: 'RO Filter, Candle, Service',
    keywords: ['ro', 'purifier', 'filter', 'water filter', 'candle', 'membrane', 'kent', 'aquaguard'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  {
    id: 'key-maker',
    name: 'Key Maker & Locksmith',
    tag: 'Taala, Chaabi, Lock Repair',
    keywords: ['key', 'chaabi', 'chabi', 'lock', 'taala', 'locksmith', 'duplicate key', 'door lock'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="5.5" />
        <path d="m21 2-9.6 9.6" />
        <path d="m15.5 7.5 3 3L22 7l-3-3" />
      </svg>
    ),
  },
  {
    id: 'home-cook',
    name: 'Home Cook & Chef',
    tag: 'Ghar Ka Khana, Party Cook',
    keywords: ['cook', 'chef', 'khana', 'food', 'rasoiya', 'roti', 'meals'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
        <line x1="6" y1="17" x2="18" y2="17" />
      </svg>
    ),
  },
  {
    id: 'maid',
    name: 'Housemaid & Cleaning',
    tag: 'Jhadu, Pocha, Bartan, Bai',
    keywords: ['maid', 'safai', 'cleaning', 'bartan', 'jhadu', 'pocha', 'bai'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </svg>
    ),
  },
  {
    id: 'carpenter',
    name: 'Carpentry & Furniture',
    tag: 'Bed, Door, Wood Fitting',
    keywords: ['carpenter', 'badhai', 'wood', 'furniture', 'door', 'lock', 'sofa'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
        <path d="m14 6 4 4" />
      </svg>
    ),
  },
  {
    id: 'painter',
    name: 'Painting & POP Work',
    tag: 'Wall Paint, Putty, Rangai',
    keywords: ['painter', 'paint', 'rangai', 'putty', 'color', 'waterproofing'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2" />
        <path d="M6 10v4a2 2 0 0 0 2 2h3v6" />
      </svg>
    ),
  },
  {
    id: 'driver',
    name: 'Driver on Call',
    tag: 'Car, Outstation, Night',
    keywords: ['driver', 'car', 'driving', 'chauffeur', 'cab'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.8 2 12.3V16c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
  },
  {
    id: 'packers-movers',
    name: 'Packers & Movers',
    tag: 'House Shifting, Tempo',
    keywords: ['packers', 'movers', 'shifting', 'transport', 'tempo', 'luggage'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="13" x="1" y="5" rx="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'water-delivery',
    name: '20L Water Can Delivery',
    tag: 'Water Jar, Can, Tanker',
    keywords: ['water', 'paani', '20l', 'can', 'jar', 'tanker', 'mineral water', 'delivery'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <rect width="14" height="16" x="5" y="6" rx="3" />
        <line x1="9" y1="11" x2="15" y2="11" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    id: 'gas-service',
    name: 'LPG Gas & Chulha Repair',
    tag: 'Gas Delivery, Chulha Repair',
    keywords: ['gas', 'cylinder', 'lpg', 'chulha', 'stove', 'pipe', 'regulator', 'booking', 'leakage'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
  {
    id: 'home-tutor',
    name: 'Home Tutor & Teacher',
    tag: 'Class 1-10, Maths, Science',
    keywords: ['tutor', 'teacher', 'tuition', 'padhai', 'maths', 'science', 'english', 'home tuition', 'coaching'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    ),
  },
  {
    id: 'doctor-nurse',
    name: 'Doctor & Nurse on Call',
    tag: 'Home Visit, Injection, BP',
    keywords: ['doctor', 'nurse', 'injection', 'drip', 'dressing', 'bp', 'sugar', 'compounder', 'home visit', 'physician'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 9v6" />
        <path d="M9 12h6" />
      </svg>
    ),
  },
  {
    id: 'other-service',
    name: 'Other Work (अन्य काम)',
    tag: 'Not in list? Click here',
    keywords: ['other', 'mistri', 'repair', 'chota kaam', 'service'],
    renderIcon: (sel) => (
      <svg className={`w-5 h-5 transition-colors ${sel ? 'text-white' : 'text-zinc-800'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    ),
  },
];

// ── 1-TAP QUICK SUB-CHIPS FOR "OTHER WORK" (ILLITERATE & FAST FRIENDLY) ──
const OTHER_QUICK_CHIPS = [
  { label: '🛞 Puncture / Hawa', value: 'Puncture Repair', tags: ['puncture', 'tyre', 'tube', 'hawa'] },
  { label: '📺 TV & Appliance', value: 'TV Repair', tags: ['tv', 'led', 'washing machine'] },
  { label: '🔑 Chaabi / Lock', value: 'Key Maker', tags: ['chaabi', 'lock', 'taala'] },
  { label: '🧵 Tailor / Darzi', value: 'Tailor Service', tags: ['tailor', 'darzi', 'kapde', 'stitching'] },
  { label: '💧 Water Can Supply', value: '20L Water Can Delivery', tags: ['water', 'can', 'jar', 'tanker'] },
  { label: '🛋️ Sofa / Carpet Wash', value: 'Sofa Dry Cleaning', tags: ['sofa', 'carpet', 'dry cleaning'] },
  { label: '🪟 Aluminium & Glass', value: 'Glass & Aluminium Work', tags: ['glass', 'aluminium', 'window'] },
  { label: '🔥 Gas Chulha Repair', value: 'Gas Stove Repair', tags: ['gas', 'chulha', 'stove', 'cylinder'] },
  { label: '🐛 Pest Control', value: 'Pest Control Spray', tags: ['pest', 'deemak', 'cockroach'] },
];

// ── STANDARD INDIAN HIGHER EDUCATION QUALIFICATIONS ──
const INDIAN_TUTOR_QUALIFICATIONS = [
  'M.Sc (Master of Science)',
  'M.Tech / M.E (Master of Engineering)',
  'M.A (Master of Arts)',
  'M.Com (Master of Commerce)',
  'B.Ed / M.Ed (Education & Teaching)',
  'B.Tech / B.E (Engineering)',
  'B.Sc (Bachelor of Science)',
  'B.A (Bachelor of Arts)',
  'B.Com (Bachelor of Commerce)',
  'BCA / MCA (Computer Applications)',
  'PhD / Research Scholar',
  '12th Pass / Intermediate',
  'Other Degree / Diploma',
];

// ── STANDARD INDIAN CLASSES & SUBJECTS COMBINATIONS ──
const INDIAN_CLASSES_SUBJECTS = [
  'Class 1 - 5: All Subjects (Foundation)',
  'Class 6 - 8: Mathematics & Science',
  'Class 6 - 8: All Subjects (CBSE / ICSE)',
  'Class 9 & 10: Mathematics & Science (CBSE / ICSE Board)',
  'Class 9 & 10: Mathematics Only (Board Specialist)',
  'Class 9 & 10: Science (Physics, Chemistry, Biology)',
  'Class 11 & 12: Physics & Chemistry (CBSE / State Board)',
  'Class 11 & 12: Mathematics (JEE Foundation & Board)',
  'Class 11 & 12: Biology (NEET Foundation & Board)',
  'Class 11 & 12: Commerce (Accounts, Economics & Business)',
  'Class 11 & 12: Arts / Humanities (History, Pol Science)',
  'Competitive Foundation: JEE / NEET / NTSE / Olympiad',
  'Spoken English & Personality Development',
  'Computer Programming & Coding (Python / Java / C++)',
  'Hindi / Sanskrit Language Grammar',
  'Other / Custom Subject',
];

// ── STANDARD INDIAN MEDICAL QUALIFICATIONS ──
const INDIAN_DOCTOR_QUALIFICATIONS = [
  'MBBS (General Physician / Allopathy)',
  'MBBS, MD / MS (Specialist Consultant)',
  'BAMS (Ayurvedic Medicine & Surgery)',
  'BHMS (Homeopathic Medicine & Surgery)',
  'BDS / MDS (Dental Surgeon)',
  'B.Sc Nursing (Registered Staff Nurse)',
  'GNM (General Nursing & Midwifery)',
  'BPT / MPT (Physiotherapist)',
  'B.Pharm / D.Pharm (Pharmacist)',
  'Certified Compounder / Dressing Nurse',
  'Other Medical Qualification',
];

// ── PROPERTY VERIFICATION DOCUMENTS (CRYSTAL CLEAR FOR HOTELS, PGS & FLATS) ──
const PROPERTY_DOC_OPTIONS = [
  {
    id: 'ELECTRICITY_BILL',
    govtType: 'TRADE_LICENSE',
    name: 'Electricity Bill (बिजली का बिल)',
    tag: 'Best for PG, Hostels & Flats',
    numberLabel: 'Electricity Consumer Number (उपभोक्ता संख्या)',
    numberPlaceholder: 'e.g. 1004829143 (as printed on your bill)',
    photoLabel: 'Electricity Bill Photo (बिजली बिल की फोटो)',
    hint: 'Upload latest electricity bill of the property showing address and consumer number.',
  },
  {
    id: 'HOTEL_LICENSE',
    govtType: 'TRADE_LICENSE',
    name: 'Hotel Trade License / Sarai Act (होटल लाइसेंस)',
    tag: 'For Hotels, Motels & Lodges',
    numberLabel: 'Trade License / Sarai Registration Number',
    numberPlaceholder: 'e.g. TR-RAN-2024-9182 or SARAI-JH-48219',
    photoLabel: 'License Certificate Photo (लाइसेंस सर्टिफिकेट)',
    hint: 'Municipal corporation trade license, Sarai Act certificate, or tourism permit.',
  },
  {
    id: 'GSTIN',
    govtType: 'GSTIN',
    name: 'GSTIN Certificate (जीएसटी प्रमाण पत्र)',
    tag: 'For Registered Commercial Properties',
    numberLabel: '15-Digit GSTIN Number',
    numberPlaceholder: 'e.g. 20AAAAA0000A1Z5',
    photoLabel: 'GST Registration Certificate (जीएसटी सर्टिफिकेट)',
    hint: 'GST certificate showing business legal name and state code.',
  },
  {
    id: 'RENT_AGREEMENT',
    govtType: 'TRADE_LICENSE',
    name: 'Rent / Lease Agreement (किराया अनुबंध)',
    tag: 'For Rented PGs & Hostels',
    numberLabel: 'Agreement Registration / Stamp No.',
    numberPlaceholder: 'e.g. AGR-2024-88 or Stamp Paper No.',
    photoLabel: 'Agreement Photo (अनुबंध का मुख्य पेज)',
    hint: 'Registered lease or rent agreement between property owner and operator.',
  },
  {
    id: 'OWNER_AADHAAR',
    govtType: 'AADHAAR',
    name: 'Owner Aadhaar Card (मकान मालिक का आधार)',
    tag: 'For Individual Home / Flat Rentals',
    numberLabel: '12-Digit Owner Aadhaar Number',
    numberPlaceholder: 'XXXX-XXXX-XXXX',
    photoLabel: 'Owner Aadhaar Photo (आधार कार्ड फोटो)',
    hint: 'For individual house or flat owners renting directly without commercial license.',
  },
];

// ── REUSABLE DOCUMENT PHOTO UPLOADER (CAMERA DIRECT + MOBILE/DESKTOP GALLERY) ──
function DocumentPhotoInput({
  label,
  sublabel,
  photoUrl,
  isUploading,
  onCameraClick,
  onGalleryClick,
  errorMessage,
}: {
  label: string;
  sublabel?: string;
  photoUrl?: string;
  isUploading?: boolean;
  onCameraClick: () => void;
  onGalleryClick: () => void;
  errorMessage?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1">
          <span>{label}</span>
          <span className="text-red-500 font-bold">*</span>
        </label>
        {sublabel && <span className="text-[10px] text-zinc-400 font-normal">{sublabel}</span>}
      </div>

      {photoUrl ? (
        <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={photoUrl} alt="Document" className="w-11 h-11 object-cover rounded-lg border border-zinc-200 shrink-0" />
            <div className="truncate">
              <span className="text-xs font-bold text-zinc-900 block truncate">Photo Uploaded ✓</span>
              <span className="text-[10px] text-emerald-600 font-medium">Ready for verification</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onCameraClick}
              title="Click photo with Camera"
              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>
            <button
              type="button"
              onClick={onGalleryClick}
              title="Choose from Gallery"
              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Gallery</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 rounded-xl p-3 text-center space-y-2 transition-colors">
          <span className="text-xs font-medium text-zinc-600 block">
            {isUploading ? 'Compressing & Uploading...' : 'Take live photo or upload from device'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={onCameraClick}
              className="flex-1 py-2 px-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera (कैमरा)</span>
            </button>
            <button
              type="button"
              disabled={isUploading}
              onClick={onGalleryClick}
              className="flex-1 py-2 px-2.5 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-500" />
              <span>Gallery (गैलरी)</span>
            </button>
          </div>
        </div>
      )}
      {errorMessage && <p className="text-[11px] text-red-600 mt-1">{errorMessage}</p>}
    </div>
  );
}

// ── SMART 1-CLICK BIO GENERATOR (CRISP, NO-SCROLL, MAX 250 CHARS) ──
function generateSmartBio(params: {
  serviceId: string;
  serviceName: string;
  customOtherText?: string;
  ownerName?: string;
  qualification?: string;
  subjectsOrSpeciality?: string;
  doesHomeVisit?: boolean;
}): string {
  const service = params.customOtherText?.trim() || params.serviceName;

  if (params.serviceId === 'tyre-puncture') {
    return `Professional mechanic for tyre puncture repair, tube vulcanizing, tubeless fixing, and air checks. Fast doorstep roadside service.`;
  }

  if (params.serviceId === 'doctor-nurse') {
    const qual = params.qualification?.trim() && !params.qualification.includes('--')
      ? params.qualification
      : 'Doctor / Nurse';
    return `Certified ${qual} providing consultations, BP & vitals check, injections, and doorstep patient care with compassionate support.`;
  }

  if (params.serviceId === 'home-tutor') {
    const qual = params.qualification?.trim() && !params.qualification.includes('--')
      ? params.qualification
      : 'Tutor';
    const sub = params.subjectsOrSpeciality?.trim() && !params.subjectsOrSpeciality.includes('--')
      ? params.subjectsOrSpeciality
      : 'school academics';
    return `Qualified ${qual} teaching ${sub}. Focused on concept clarity, regular test practice, and top examination scores.`;
  }

  if (params.serviceId === 'driver') {
    return `Licensed driver with 7+ years experience. Safe driving, punctual, and well-versed with city routes and outstation trips.`;
  }

  if (params.serviceId === 'plumber') {
    return `Experienced plumber for pipeline repairs, geyser fitting, tap replacement, and bathroom leakage. Fast doorstep service.`;
  }

  if (params.serviceId === 'electrician') {
    return `Licensed electrician for domestic wiring, short-circuit faults, inverter setup, and appliance repairs. Safe & reliable.`;
  }

  if (params.serviceId === 'ac-repair') {
    return `HVAC technician for split & window AC repair, jet pump cleaning, gas refill, and PCB diagnostics. Guaranteed cooling.`;
  }

  if (params.serviceId === 'water-can') {
    return `Supplying clean 20L RO drinking water jars and cans. Prompt doorstep delivery for homes and offices on regular basis.`;
  }

  if (params.serviceId === 'gas-chulha') {
    return `Specialist in LPG gas stove repair, burner servicing, regulator changes, and pipe leakage safety checks at honest rates.`;
  }

  return `Verified provider for ${service}. Offering prompt doorstep assistance, dependable workmanship, and fair transparent pricing.`;
}

// ── LIVE DIRECT CAMERA MODAL (WEBCAM ON DESKTOP & LIVE CAMERA ON MOBILE) ──
function LiveCameraModal({
  isOpen,
  title,
  onClose,
  onCapture,
}: {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onCapture: (file: File) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      return;
    }

    let isMounted = true;
    setIsInitializing(true);
    setCameraError(null);

    const startCamera = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
            audio: false,
          });
        } catch {
          // Fallback to any default video device (webcam on desktop)
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsInitializing(false);
      } catch (err) {
        console.error('Camera stream error:', err);
        if (isMounted) {
          setCameraError(
            'Camera access was denied or not available. Please allow camera permissions in your browser or use "Gallery" to upload.'
          );
          setIsInitializing(false);
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, facingMode]);

  const handleSnap = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `document-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
          onClose();
        }
      },
      'image/jpeg',
      0.95
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-zinc-950 text-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>{title}</span>
            </h3>
            <p className="text-[11px] text-zinc-400">Align document within the frame and tap snap</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Viewfinder */}
        <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-400 flex items-center justify-center mx-auto text-lg">
                ⚠️
              </div>
              <p className="text-xs text-zinc-300 max-w-xs mx-auto leading-relaxed">{cameraError}</p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close & Use Gallery
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Document Alignment Frame Overlay */}
              <div className="absolute inset-5 border-2 border-dashed border-white/60 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-semibold bg-black/60 text-white/90 px-3 py-1 rounded-full backdrop-blur-xs">
                    Hold Document Flat & In Focus
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>

              {isInitializing && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-2 text-xs font-medium text-zinc-300">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Starting Camera...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Controls */}
        {!cameraError && (
          <div className="p-4 bg-zinc-900 flex items-center justify-between">
            {/* Flip Camera Button */}
            <button
              type="button"
              onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>🔄 Flip</span>
            </button>

            {/* Snap Shutter Button */}
            <button
              type="button"
              disabled={isInitializing}
              onClick={handleSnap}
              className="w-16 h-16 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-all disabled:opacity-50 ring-4 ring-white/20"
              title="Click to take photo"
            >
              <div className="w-12 h-12 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-zinc-950" />
              </div>
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function PartnerRegisterView() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  // Dual Track: 'SERVICE' or 'PROPERTY'
  const [track, setTrack] = useState<PartnerTrack>('SERVICE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem>(SERVICES_CATALOG[0]);
  const [customOtherText, setCustomOtherText] = useState('');

  // Selected Property Verification Document
  const [selectedPropDoc, setSelectedPropDoc] = useState(PROPERTY_DOC_OPTIONS[0]);

  // Dual Phone Numbers (Calling vs WhatsApp) - Default unticked as requested
  const [sameWhatsapp, setSameWhatsapp] = useState(false);

  // Active Target for Direct Live Camera Modal
  const [activeCameraTarget, setActiveCameraTarget] = useState<
    'aadhaarFront' | 'aadhaarBack' | 'dl' | 'cert' | 'prop' | null
  >(null);

  // Upload & Form Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [govtIdPhotoBack, setGovtIdPhotoBack] = useState('');
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);
  const [isUploadingDl, setIsUploadingDl] = useState(false);
  const [isUploadingCert, setIsUploadingCert] = useState(false);
  const [isUploadingProp, setIsUploadingProp] = useState(false);
  const [serverError, setServerError] = useState('');

  // Device Gallery File Refs (Triggers Mobile/Desktop File & Gallery Picker)
  const aadhaarFrontGalleryRef = useRef<HTMLInputElement>(null);
  const aadhaarBackGalleryRef = useRef<HTMLInputElement>(null);
  const dlGalleryRef = useRef<HTMLInputElement>(null);
  const certGalleryRef = useRef<HTMLInputElement>(null);
  const propGalleryRef = useRef<HTMLInputElement>(null);

  // Direct Camera Capture Refs (Mobile Native Camera trigger with capture="environment")
  const aadhaarFrontCameraRef = useRef<HTMLInputElement>(null);
  const aadhaarBackCameraRef = useRef<HTMLInputElement>(null);
  const dlCameraRef = useRef<HTMLInputElement>(null);
  const certCameraRef = useRef<HTMLInputElement>(null);
  const propCameraRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProviderRegisterInput>({
    resolver: zodResolver(providerRegisterSchema),
    defaultValues: {
      businessName: '',
      businessType: 'SERVICE',
      ownerName: '',
      email: '',
      phone: '',
      whatsapp: '',
      password: '',
      govtIdType: 'AADHAAR',
      govtIdNumber: '',
      govtIdPhoto: '',
      drivingLicenseNumber: '',
      drivingLicensePhoto: '',
      qualification: '',
      medicalRegNumber: '',
      certificatePhoto: '',
      clinicAddress: '',
      doesHomeVisit: true,
      bio: '',
      subjectsOrSpeciality: '',
      legalAgreed: true,
    },
  });

  const govtIdPhoto = watch('govtIdPhoto');
  const drivingLicensePhoto = watch('drivingLicensePhoto');
  const certificatePhoto = watch('certificatePhoto');

  // Filter services by search
  const filteredCatalog = useMemo(() => {
    if (!searchQuery.trim()) return SERVICES_CATALOG;
    const q = searchQuery.toLowerCase().trim();
    return SERVICES_CATALOG.filter(
      (s) => s.name.toLowerCase().includes(q) || s.tag.toLowerCase().includes(q) || s.keywords.some((k) => k.includes(q))
    );
  }, [searchQuery]);

  // Unified File Upload & WebP HD Compression Helper
  const uploadImageFile = async (file: File): Promise<string> => {
    const compressed = await compressImageToWebP(file);
    const formData = new FormData();
    formData.append('files', compressed);

    const res = await fetch('/api/v1/upload', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    if (!json.success || !json.data?.urls?.[0]) {
      throw new Error(json.error?.message || 'Could not upload image.');
    }
    return json.data.urls[0];
  };

  // Upload Aadhaar Front Side
  const handleUploadFront = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFront(true);
    setServerError('');
    try {
      const url = await uploadImageFile(file);
      setValue('govtIdPhoto', url, { shouldValidate: true });
    } catch {
      setServerError('Failed to upload Aadhaar front photo. Please try again.');
    } finally {
      setIsUploadingFront(false);
    }
  };

  // Upload Aadhaar Back Side
  const handleUploadBack = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBack(true);
    setServerError('');
    try {
      const url = await uploadImageFile(file);
      setGovtIdPhotoBack(url);
    } catch {
      setServerError('Failed to upload Aadhaar back photo. Please try again.');
    } finally {
      setIsUploadingBack(false);
    }
  };

  // Upload Driving Licence
  const handleDlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingDl(true);
    setServerError('');
    try {
      const url = await uploadImageFile(file);
      setValue('drivingLicensePhoto', url, { shouldValidate: true });
    } catch {
      setServerError('Failed to upload Driving Licence photo.');
    } finally {
      setIsUploadingDl(false);
    }
  };

  // Upload Certificate
  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCert(true);
    setServerError('');
    try {
      const url = await uploadImageFile(file);
      setValue('certificatePhoto', url, { shouldValidate: true });
    } catch {
      setServerError('Failed to upload Certificate photo.');
    } finally {
      setIsUploadingCert(false);
    }
  };

  // Upload Property Verification Document
  const handlePropUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingProp(true);
    setServerError('');
    try {
      const url = await uploadImageFile(file);
      setValue('govtIdPhoto', url, { shouldValidate: true });
    } catch {
      setServerError('Failed to upload Property Document photo.');
    } finally {
      setIsUploadingProp(false);
    }
  };

  // Direct Live Camera Frame Capture Handler
  const handleCameraCapture = async (file: File) => {
    if (!activeCameraTarget) return;

    if (activeCameraTarget === 'aadhaarFront') {
      setIsUploadingFront(true);
      setServerError('');
      try {
        const url = await uploadImageFile(file);
        setValue('govtIdPhoto', url, { shouldValidate: true });
      } catch {
        setServerError('Failed to process and upload Aadhaar front photo.');
      } finally {
        setIsUploadingFront(false);
      }
    } else if (activeCameraTarget === 'aadhaarBack') {
      setIsUploadingBack(true);
      setServerError('');
      try {
        const url = await uploadImageFile(file);
        setGovtIdPhotoBack(url);
      } catch {
        setServerError('Failed to process and upload Aadhaar back photo.');
      } finally {
        setIsUploadingBack(false);
      }
    } else if (activeCameraTarget === 'dl') {
      setIsUploadingDl(true);
      setServerError('');
      try {
        const url = await uploadImageFile(file);
        setValue('drivingLicensePhoto', url, { shouldValidate: true });
      } catch {
        setServerError('Failed to process and upload Driving Licence photo.');
      } finally {
        setIsUploadingDl(false);
      }
    } else if (activeCameraTarget === 'cert') {
      setIsUploadingCert(true);
      setServerError('');
      try {
        const url = await uploadImageFile(file);
        setValue('certificatePhoto', url, { shouldValidate: true });
      } catch {
        setServerError('Failed to process and upload Certificate photo.');
      } finally {
        setIsUploadingCert(false);
      }
    } else if (activeCameraTarget === 'prop') {
      setIsUploadingProp(true);
      setServerError('');
      try {
        const url = await uploadImageFile(file);
        setValue('govtIdPhoto', url, { shouldValidate: true });
      } catch {
        setServerError('Failed to process and upload Property Document photo.');
      } finally {
        setIsUploadingProp(false);
      }
    }
  };

  // Switch Track
  const handleSelectTrack = (newTrack: PartnerTrack) => {
    setTrack(newTrack);
    setServerError('');
    setValue('businessName', ''); // Reset so property track is clean
    if (newTrack === 'SERVICE') {
      setValue('businessType', 'SERVICE');
      setValue('govtIdType', 'AADHAAR');
    } else {
      setValue('businessType', 'HOURLY_HOTEL');
      setSelectedPropDoc(PROPERTY_DOC_OPTIONS[0]);
      setValue('govtIdType', PROPERTY_DOC_OPTIONS[0].govtType as any);
    }
  };

  // Pick Service
  const handlePickService = (s: ServiceItem) => {
    setSelectedService(s);
    if (s.id === 'driver') {
      setValue('govtIdType', 'DRIVING_LICENSE');
    } else {
      setValue('govtIdType', 'AADHAAR');
    }
    if (s.id !== 'other-service') {
      setCustomOtherText('');
    }
  };

  // Pick Quick Chip for "Other"
  const handlePickOtherChip = (chip: typeof OTHER_QUICK_CHIPS[0]) => {
    setCustomOtherText(chip.value);
  };

  // Submit Handler
  const onSubmit = async (data: ProviderRegisterInput) => {
    setIsSubmitting(true);
    setServerError('');

    let bName = data.businessName.trim();
    if (!bName) {
      if (track === 'SERVICE') {
        const tradeName = customOtherText.trim() || selectedService.name;
        bName = data.ownerName.trim() ? `${data.ownerName.trim()} (${tradeName})` : tradeName;
      } else {
        bName = `${data.ownerName.trim()} Stays`;
      }
    }

    // Driver on Call Statutory Legal Check (Section 180 Motor Vehicles Act, 1988)
    if (track === 'SERVICE' && selectedService.id === 'driver') {
      if (!data.drivingLicenseNumber?.trim()) {
        setServerError('Driving Licence (DL) number is mandatory for Driver on Call under MV Act, 1988.');
        setIsSubmitting(false);
        return;
      }
      if (!data.drivingLicensePhoto) {
        setServerError('Driving Licence card photo proof is mandatory for Driver on Call.');
        setIsSubmitting(false);
        return;
      }
    }

    // Doctor & Nurse Medical Regulation Check (National Medical Commission Act)
    if (track === 'SERVICE' && selectedService.id === 'doctor-nurse') {
      if (!data.medicalRegNumber?.trim()) {
        setServerError('Medical / Nursing Council Registration Number is mandatory for verified medical professionals.');
        setIsSubmitting(false);
        return;
      }
      if (!data.certificatePhoto) {
        setServerError('Medical Degree or Council Registration Certificate photo is required.');
        setIsSubmitting(false);
        return;
      }
    }

    // Home Tutor Educational Qualification Check
    if (track === 'SERVICE' && selectedService.id === 'home-tutor') {
      if (!data.qualification?.trim()) {
        setServerError('Highest Educational Qualification (e.g. B.Sc, B.Tech, M.A, B.Ed) is required for Home Tutors.');
        setIsSubmitting(false);
        return;
      }
      if (!data.subjectsOrSpeciality?.trim()) {
        setServerError('Please specify the classes and subjects you teach.');
        setIsSubmitting(false);
        return;
      }
    }

    // Profile Description / Bio Mandatory Check for Services
    if (track === 'SERVICE') {
      if (!data.bio?.trim() || data.bio.trim().length < 10) {
        setServerError('Profile Description is mandatory (minimum 10 characters). You can click "Auto-Generate Description" to create it instantly.');
        setIsSubmitting(false);
        return;
      }
    }

    // Aadhaar Front & Back Photo Mandatory Check for Service Track
    if (track === 'SERVICE') {
      if (!data.govtIdPhoto) {
        setServerError('Aadhaar Card Front Photo is required (आधार सामने की फोटो अनिवार्य है)।');
        setIsSubmitting(false);
        return;
      }
      if (!govtIdPhotoBack) {
        setServerError('Aadhaar Card Back Photo (with address) is required (आधार पीछे की फोटो पता सहित अनिवार्य है)।');
        setIsSubmitting(false);
        return;
      }
    }

    const cleanPhone = data.phone.replace(/\D/g, '').trim();
    const cleanWhatsapp = sameWhatsapp 
      ? cleanPhone 
      : (data.whatsapp?.replace(/\D/g, '').trim() || '');

    if (!cleanWhatsapp || cleanWhatsapp.length !== 10) {
      setServerError('10-digit WhatsApp Number is mandatory / 10 अंकों का व्हाट्सएप नंबर अनिवार्य है।');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...data,
      businessName: bName,
      email: data.email.toLowerCase().trim(),
      phone: cleanPhone,
      whatsapp: cleanWhatsapp,
      govtIdPhoto: govtIdPhotoBack ? `${data.govtIdPhoto},${govtIdPhotoBack}` : data.govtIdPhoto,
      govtIdPhotoBack: govtIdPhotoBack || undefined,
    };

    try {
      const res = await fetch('/api/v1/auth/provider/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        setServerError(json.error?.message || 'Failed to complete registration.');
        return;
      }

      setUser(json.data);
      router.push('/provider/onboarding');
    } catch {
      setServerError('Network connection issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-zinc-900 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── HEADER ── */}
        <div className="text-center space-y-2">
          <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">SearchBook Partner Portal</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Register as a Verified Partner
          </h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto font-normal">
            Zero registration fees. Connect directly with thousands of verified clients in your city.
          </p>
        </div>

        {/* ── DUAL TRACK SELECTOR (CARDS) ── */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          
          {/* Card A: Service */}
          <button
            type="button"
            onClick={() => handleSelectTrack('SERVICE')}
            className={`p-5 rounded-2xl text-left border-2 transition-all cursor-pointer relative ${
              track === 'SERVICE'
                ? 'border-zinc-950 bg-white shadow-md ring-1 ring-zinc-950'
                : 'border-zinc-200 bg-zinc-50/70 hover:bg-white hover:border-zinc-300'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
              track === 'SERVICE' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-800'
            }`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Option 1</span>
              <h2 className="text-sm sm:text-base font-extrabold text-zinc-900">Home & Daily Services</h2>
              <p className="text-xs text-zinc-500 font-normal leading-relaxed">
                Puncture, Plumber, Electrician, Cook, Maid, AC & all trades
              </p>
            </div>
            {track === 'SERVICE' && (
              <div className="absolute top-4 right-4 w-5 h-5 bg-zinc-950 rounded-full flex items-center justify-center text-white">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Card B: Property */}
          <button
            type="button"
            onClick={() => handleSelectTrack('PROPERTY')}
            className={`p-5 rounded-2xl text-left border-2 transition-all cursor-pointer relative ${
              track === 'PROPERTY'
                ? 'border-zinc-950 bg-white shadow-md ring-1 ring-zinc-950'
                : 'border-zinc-200 bg-zinc-50/70 hover:bg-white hover:border-zinc-300'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
              track === 'PROPERTY' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-800'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Option 2</span>
              <h2 className="text-sm sm:text-base font-extrabold text-zinc-900">Hotels, PGs & Flats</h2>
              <p className="text-xs text-zinc-500 font-normal leading-relaxed">
                Hourly hotels, student hostels, PG rooms & rental apartments
              </p>
            </div>
            {track === 'PROPERTY' && (
              <div className="absolute top-4 right-4 w-5 h-5 bg-zinc-950 rounded-full flex items-center justify-center text-white">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>

        </div>

        {/* ── ERROR ALERT ── */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{serverError}</span>
          </div>
        )}

        {/* ── MAIN REGISTRATION CONTAINER ── */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* ═══════════ TRACK 1: SERVICE PARTNER (MASTER 12 SERVICES + SMART OTHER CHIPS) ═══════════ */}
            {track === 'SERVICE' ? (
              <div className="space-y-7">
                
                {/* 1. Open Visual Service Grid (NO DROPDOWN!) */}
                <div className="space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
                        Select Your Service Trade (अपनी सेवा / ट्रेड चुनें)
                      </span>
                      <span className="text-xs text-zinc-500 font-normal">
                        Tap your service to activate your profile on SearchBook
                      </span>
                    </div>

                    {/* Quick Search */}
                    <div className="relative w-full sm:w-56">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search service..."
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                      />
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Open Grid of 12 Master Services or Not Found State */}
                  {filteredCatalog.length === 0 ? (
                    <div className="p-6 sm:p-8 bg-zinc-50 border border-zinc-200 rounded-2xl text-center space-y-3">
                      <div className="w-11 h-11 rounded-2xl bg-zinc-200/80 text-zinc-700 flex items-center justify-center mx-auto">
                        <Search className="w-5 h-5 text-zinc-600" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-zinc-900">
                          &quot;{searchQuery}&quot; list mein nahi mila? (Service Not in List?)
                        </h4>
                        <p className="text-xs text-zinc-500 max-w-md mx-auto font-normal leading-relaxed">
                          Koi baat nahi! Aap kisi bhi service ya business ko <strong>Other Work (अन्य काम)</strong> ke roop mein register kar sakte hain.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const otherService = SERVICES_CATALOG.find((s) => s.id === 'other-service') || SERVICES_CATALOG[SERVICES_CATALOG.length - 1];
                          setSelectedService(otherService);
                          const cleanQuery = searchQuery.trim();
                          setCustomOtherText(cleanQuery);
                          const owner = watch('ownerName');
                          setValue('businessName', owner ? `${owner} (${cleanQuery})` : cleanQuery);
                          setSearchQuery('');
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <span>Register with &quot;{searchQuery}&quot; as your trade</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {filteredCatalog.map((item) => {
                        const isSelected = selectedService.id === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handlePickService(item)}
                            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between group ${
                              isSelected
                                ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                                : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50/70'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-800'
                              }`}>
                                {item.renderIcon(isSelected)}
                              </div>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-white text-zinc-950 flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>

                            <div>
                              <span className="text-xs font-bold block leading-tight">{item.name}</span>
                              <span className={`text-[10px] block mt-0.5 font-normal ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                {item.tag}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ── SMART "OTHER WORK" HELPER (1-TAP CHIPS + KEYWORD AUTO-ENRICHMENT) ── */}
                  {selectedService.id === 'other-service' && (
                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-zinc-900 shrink-0" />
                        <span className="text-xs font-bold text-zinc-900">
                          Select or Specify Your Trade Speciality (व्यवसाय / ट्रेड चुनें):
                        </span>
                      </div>

                      {/* 1-Tap Quick Sub-Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {OTHER_QUICK_CHIPS.map((chip) => {
                          const isChipActive = customOtherText === chip.value;
                          return (
                            <button
                              key={chip.value}
                              type="button"
                              onClick={() => handlePickOtherChip(chip)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                isChipActive
                                  ? 'bg-zinc-950 text-white border-zinc-950'
                                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                              }`}
                            >
                              {chip.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Or write custom work */}
                      <div>
                        <input
                          type="text"
                          value={customOtherText}
                          onChange={(e) => {
                            setCustomOtherText(e.target.value);
                            const owner = watch('ownerName');
                            setValue('businessName', e.target.value ? `${owner || 'Partner'} (${e.target.value})` : 'Services');
                          }}
                          placeholder="Enter your trade name (e.g. Aluminium Fabrication, Tent House, Dry Cleaning)..."
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none"
                        />
                        <p className="text-[11px] text-zinc-400 mt-1">
                          💡 SearchBook automatically indexes relevant vernacular and phonetic search terms for maximum client discoverability.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Personal & Contact Information */}
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
                    Contact & Account Information
                  </span>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Legal Name (पूरा नाम) *</label>
                    <input
                      type="text"
                      {...register('ownerName')}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                    />
                    {errors.ownerName && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.ownerName.message}</p>
                    )}
                  </div>

                  {/* Calling & WhatsApp in 2 cols */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Calling Number */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Primary Calling Number (कॉलिंग नंबर) *</span>
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          {...register('phone', {
                            onChange: (e) => {
                              if (sameWhatsapp) {
                                setValue('whatsapp', e.target.value);
                              }
                            },
                          })}
                          placeholder="10-digit calling mobile number"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                        />
                        {errors.phone && (
                          <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* WhatsApp Number */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <span>WhatsApp Number (व्हाट्सएप नंबर)</span>
                            <span className="text-red-500 font-bold">*</span>
                          </span>
                          {sameWhatsapp && (
                            <span className="text-[10px] text-zinc-400 font-normal">(Same as Calling)</span>
                          )}
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          disabled={sameWhatsapp}
                          {...register('whatsapp')}
                          placeholder="10-digit WhatsApp number"
                          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                            sameWhatsapp
                              ? 'bg-zinc-100/70 border-zinc-200 text-zinc-400 cursor-not-allowed'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none'
                          }`}
                        />
                        {errors.whatsapp && (
                          <p className="text-[11px] text-red-600 mt-1">{errors.whatsapp.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Same WhatsApp Checkbox */}
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sameWhatsapp}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSameWhatsapp(checked);
                          if (checked) {
                            setValue('whatsapp', watch('phone'), { shouldValidate: true });
                          }
                        }}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-950 accent-zinc-950 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-600 font-medium">
                        WhatsApp number is same as calling number (व्हाट्सएप और कॉलिंग नंबर एक ही हैं)
                      </span>
                    </label>
                  </div>

                  {/* Email & Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Business Email Address (ईमेल आईडी) *</label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="name@gmail.com"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Create Account Password (पासवर्ड) *</label>
                      <input
                        type="password"
                        {...register('password')}
                        placeholder="Minimum 6 characters"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                      />
                      {errors.password && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.password.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Professional Profile, Trust & Credentials (Dynamic based on selected trade) */}
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
                        Professional Profile & Service Availability
                      </span>
                      <span className="text-xs text-zinc-500 font-normal">
                        Helps customers trust your credentials and know if you do home visits
                      </span>
                    </div>
                  </div>

                  {/* ── CASE A: DOCTOR & NURSE SPECIFIC CREDENTIALS ── */}
                  {selectedService.id === 'doctor-nurse' && (
                    <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🩺</span>
                          <div>
                            <span className="text-xs font-bold text-sky-950 block">
                              Medical Council / Nursing Council Verification *
                            </span>
                            <span className="text-[11px] text-sky-800 font-normal">
                              Compulsory under National Medical Commission (NMC) Act for patient safety
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-sky-200/80 text-sky-900 px-2 py-0.5 rounded-md">
                          Verified Badge
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Degree / Qualification */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-800 mb-1">
                            Medical Qualification / Degree *
                          </label>
                          <select
                            {...register('qualification')}
                            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2.5 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none transition-all cursor-pointer"
                          >
                            <option value="">-- Select Medical Degree / Specialization --</option>
                            {INDIAN_DOCTOR_QUALIFICATIONS.map((q) => (
                              <option key={q} value={q}>
                                {q}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Medical Reg Number */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-800 mb-1">
                            Medical Council / Nursing Reg. No. *
                          </label>
                          <input
                            type="text"
                            {...register('medicalRegNumber')}
                            placeholder="e.g. JMC-18293 or NMC-49201"
                            className="w-full bg-white border border-sky-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 tracking-wider focus:border-zinc-950 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Clinic / Hospital Address */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-800 mb-1">
                          Clinic / Hospital Name & Address (If applicable)
                        </label>
                        <input
                          type="text"
                          {...register('clinicAddress')}
                          placeholder="e.g. Life Care Clinic, Main Road, Circular Road, Ranchi"
                          className="w-full bg-white border border-sky-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none transition-all"
                        />
                      </div>

                      {/* Doctor Home Visit Checkbox */}
                      <label className="flex items-center gap-2.5 p-3.5 bg-white border border-sky-200 rounded-xl cursor-pointer select-none hover:bg-sky-50/50 transition-colors">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          {...register('doesHomeVisit')}
                          className="w-4 h-4 rounded border-zinc-300 text-sky-600 accent-sky-600 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-zinc-900 block">
                            Haan, main patient ke ghar jaakar checkup / injection de sakta hoon (Home Visit)
                          </span>
                          <span className="text-[11px] text-zinc-500 font-normal">
                            Tick karein agar aap mareez ke ghar par jaakar ilaaj/injection dene ke liye tayyar hain
                          </span>
                        </div>
                      </label>

                      {/* Medical Degree / Certificate Upload with Camera & Gallery */}
                      <div>
                        <input
                          type="file"
                          ref={certCameraRef}
                          onChange={handleCertUpload}
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                        />
                        <input
                          type="file"
                          ref={certGalleryRef}
                          onChange={handleCertUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <DocumentPhotoInput
                          label="Medical Degree or Council Registration Certificate Photo"
                          sublabel="Council Reg / Degree Proof"
                          photoUrl={certificatePhoto}
                          isUploading={isUploadingCert}
                          onCameraClick={() => setActiveCameraTarget('cert')}
                          onGalleryClick={() => certGalleryRef.current?.click()}
                          errorMessage={errors.certificatePhoto?.message}
                        />
                      </div>

                      {/* Doctor / Nurse Bio */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-zinc-900 flex items-center gap-1">
                            <span>Profile Description (कार्य विवरण)</span>
                            <span className="text-red-500 font-bold">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const text = generateSmartBio({
                                serviceId: selectedService.id,
                                serviceName: selectedService.name,
                                customOtherText,
                                ownerName: watch('ownerName'),
                                qualification: watch('qualification'),
                                subjectsOrSpeciality: watch('subjectsOrSpeciality'),
                                doesHomeVisit: watch('doesHomeVisit'),
                              });
                              setValue('bio', text, { shouldValidate: true });
                            }}
                            className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 cursor-pointer"
                          >
                            ⚡ Auto-Fill (खुद भरें)
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          maxLength={400}
                          {...register('bio')}
                          placeholder="Click Auto-Fill above or write your experience..."
                          className="w-full bg-white border border-sky-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none transition-all resize-none leading-relaxed min-h-[105px] overflow-hidden"
                        />
                        <div className="flex justify-end mt-0.5">
                          <span className="text-[10px] text-zinc-400">{(watch('bio') || '').length}/400 chars</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── CASE B: HOME TUTOR SPECIFIC CREDENTIALS ── */}
                  {selectedService.id === 'home-tutor' && (
                    <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📚</span>
                          <div>
                            <span className="text-xs font-bold text-purple-950 block">
                              Home Tutor Educational Profile & Board Speciality *
                            </span>
                            <span className="text-[11px] text-purple-800 font-normal">
                              Parents verify your degree & subjects before hiring for home tuition
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-md">
                          Verified Tutor
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Qualification */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-800 mb-1">
                            Highest Educational Qualification *
                          </label>
                          <select
                            {...register('qualification')}
                            className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2.5 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none transition-all cursor-pointer"
                          >
                            <option value="">-- Select Highest Degree --</option>
                            {INDIAN_TUTOR_QUALIFICATIONS.map((q) => (
                              <option key={q} value={q}>
                                {q}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Classes & Subjects */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-800 mb-1">
                            Classes & Subjects Taught *
                          </label>
                          <select
                            {...register('subjectsOrSpeciality')}
                            className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2.5 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none transition-all cursor-pointer"
                          >
                            <option value="">-- Select Classes & Subjects Taught --</option>
                            {INDIAN_CLASSES_SUBJECTS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Tuition Location / Center */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-800 mb-1">
                          Tuition Center / Locality (Where you teach)
                        </label>
                        <input
                          type="text"
                          {...register('clinicAddress')}
                          placeholder="e.g. Kadru, Ashok Nagar, Morabadi, Ranchi"
                          className="w-full bg-white border border-purple-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none transition-all"
                        />
                      </div>

                      {/* Home Tuition Visit Checkbox */}
                      <label className="flex items-center gap-2.5 p-3.5 bg-white border border-purple-200 rounded-xl cursor-pointer select-none hover:bg-purple-50/50 transition-colors">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          {...register('doesHomeVisit')}
                          className="w-4 h-4 rounded border-zinc-300 text-purple-600 accent-purple-600 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-zinc-900 block">
                            Haan, main student ke ghar jaakar padha sakta hoon (Home Tuition Available)
                          </span>
                          <span className="text-[11px] text-zinc-500 font-normal">
                            Tick karein agar aap bache ke ghar jaakar tuition padhane ke liye tayyar hain
                          </span>
                        </div>
                      </label>

                      {/* Degree / College ID Photo with Camera & Gallery */}
                      <div>
                        <input
                          type="file"
                          ref={certCameraRef}
                          onChange={handleCertUpload}
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                        />
                        <input
                          type="file"
                          ref={certGalleryRef}
                          onChange={handleCertUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <DocumentPhotoInput
                          label="Degree Certificate or College ID Card Photo"
                          sublabel="Degree or ID Card Proof"
                          photoUrl={certificatePhoto}
                          isUploading={isUploadingCert}
                          onCameraClick={() => setActiveCameraTarget('cert')}
                          onGalleryClick={() => certGalleryRef.current?.click()}
                          errorMessage={errors.certificatePhoto?.message}
                        />
                      </div>

                      {/* Tutor Bio */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-zinc-900 flex items-center gap-1">
                            <span>Profile Description (कार्य विवरण)</span>
                            <span className="text-red-500 font-bold">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const text = generateSmartBio({
                                serviceId: selectedService.id,
                                serviceName: selectedService.name,
                                customOtherText,
                                ownerName: watch('ownerName'),
                                qualification: watch('qualification'),
                                subjectsOrSpeciality: watch('subjectsOrSpeciality'),
                                doesHomeVisit: watch('doesHomeVisit'),
                              });
                              setValue('bio', text, { shouldValidate: true });
                            }}
                            className="text-[11px] font-bold text-purple-700 hover:text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 cursor-pointer"
                          >
                            ⚡ Auto-Fill (खुद भरें)
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          maxLength={400}
                          {...register('bio')}
                          placeholder="Click Auto-Fill above or write your teaching methodology..."
                          className="w-full bg-white border border-purple-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none transition-all resize-none leading-relaxed min-h-[105px] overflow-hidden"
                        />
                        <div className="flex justify-end mt-0.5">
                          <span className="text-[10px] text-zinc-400">{(watch('bio') || '').length}/400 chars</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── CASE C: GENERAL HOME TRADES (PLUMBER, ELECTRICIAN, DRIVER, COOK, MAID, AC, ETC.) ── */}
                  {selectedService.id !== 'doctor-nurse' && selectedService.id !== 'home-tutor' && (
                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3.5">
                      <label className="flex items-center gap-2.5 p-3.5 bg-white border border-zinc-200 rounded-xl cursor-pointer select-none hover:bg-zinc-100/50 transition-colors">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          {...register('doesHomeVisit')}
                          className="w-4 h-4 rounded border-zinc-300 text-zinc-950 accent-zinc-950 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-zinc-900 block">
                            Doorstep Service Available (घर पर सेवा उपलब्ध है)
                          </span>
                          <span className="text-[11px] text-zinc-500 font-normal">
                            Check if you provide on-site services at customer premises (ग्राहक के परिसर में सेवा)
                          </span>
                        </div>
                      </label>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-zinc-900 flex items-center gap-1">
                            <span>Profile Description (कार्य विवरण)</span>
                            <span className="text-red-500 font-bold">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const text = generateSmartBio({
                                serviceId: selectedService.id,
                                serviceName: selectedService.name,
                                customOtherText,
                                ownerName: watch('ownerName'),
                                qualification: watch('qualification'),
                                subjectsOrSpeciality: watch('subjectsOrSpeciality'),
                                doesHomeVisit: watch('doesHomeVisit'),
                              });
                              setValue('bio', text, { shouldValidate: true });
                            }}
                            className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 cursor-pointer"
                          >
                            ⚡ Auto-Fill (खुद भरें)
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          maxLength={400}
                          {...register('bio')}
                          placeholder="Click Auto-Fill above or write your experience..."
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all resize-none leading-relaxed min-h-[105px] overflow-hidden"
                        />
                        <div className="flex justify-end mt-0.5">
                          <span className="text-[10px] text-zinc-400">{(watch('bio') || '').length}/400 chars</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Mandatory Aadhaar ID (Safety & Police Protection) */}
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
                      Aadhaar Identity Verification (आधार पहचान सत्यापन)
                    </span>
                    <span className="text-xs text-zinc-500 font-normal">
                      Mandatory statutory verification for customer safety (ग्राहक सुरक्षा एवं वैधानिक रिकॉर्ड के लिए अनिवार्य)
                    </span>
                  </div>

                  {/* Aadhaar Number */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      12-Digit Aadhaar Card Number (12 अंकों का आधार कार्ड नंबर) *
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      {...register('govtIdNumber')}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 tracking-wider focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                    />
                    {errors.govtIdNumber && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.govtIdNumber.message}</p>
                    )}
                  </div>

                  {/* Aadhaar Photo Upload: Front & Back Dual Inputs */}
                  <div className="space-y-2">
                    {/* Hidden Inputs for Aadhaar Front */}
                    <input
                      type="file"
                      ref={aadhaarFrontCameraRef}
                      onChange={handleUploadFront}
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                    />
                    <input
                      type="file"
                      ref={aadhaarFrontGalleryRef}
                      onChange={handleUploadFront}
                      accept="image/*"
                      className="hidden"
                    />

                    {/* Hidden Inputs for Aadhaar Back */}
                    <input
                      type="file"
                      ref={aadhaarBackCameraRef}
                      onChange={handleUploadBack}
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                    />
                    <input
                      type="file"
                      ref={aadhaarBackGalleryRef}
                      onChange={handleUploadBack}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Aadhaar Front */}
                      <DocumentPhotoInput
                        label="Aadhaar Front Side (सामने की फोटो)"
                        sublabel="Photo & Name Side"
                        photoUrl={govtIdPhoto}
                        isUploading={isUploadingFront}
                        onCameraClick={() => setActiveCameraTarget('aadhaarFront')}
                        onGalleryClick={() => aadhaarFrontGalleryRef.current?.click()}
                        errorMessage={errors.govtIdPhoto?.message}
                      />

                      {/* Aadhaar Back */}
                      <DocumentPhotoInput
                        label="Aadhaar Back Side (पीछे की फोटो)"
                        sublabel="Address & QR Side"
                        photoUrl={govtIdPhotoBack}
                        isUploading={isUploadingBack}
                        onCameraClick={() => setActiveCameraTarget('aadhaarBack')}
                        onGalleryClick={() => aadhaarBackGalleryRef.current?.click()}
                      />
                    </div>
                  </div>

                  {/* ── DRIVER ON CALL SPECIFIC KYC (MOTOR VEHICLES ACT 1988 COMPULSORY) ── */}
                  {selectedService.id === 'driver' && (
                    <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🚗</span>
                          <div>
                            <span className="text-xs font-bold text-amber-950 block">
                              Driving Licence (DL) Verification (ड्राइविंग लाइसेंस सत्यापन) *
                            </span>
                            <span className="text-[11px] text-amber-800 font-normal">
                              Compulsory under Motor Vehicles Act, 1988 (मोटर वाहन अधिनियम 1988 के तहत अनिवार्य)
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
                          Mandatory (अनिवार्य)
                        </span>
                      </div>

                      {/* Driving License Number */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-800 mb-1 flex items-center gap-1">
                          <span>Driving Licence (DL) Number (ड्राइविंग लाइसेंस संख्या)</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          {...register('drivingLicenseNumber')}
                          placeholder="e.g. DL-0420110012345 or JH01-202100456"
                          className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 tracking-wider focus:border-zinc-950 focus:outline-none transition-all"
                        />
                      </div>

                      {/* Driving License Photo Upload with Camera & Gallery */}
                      <div>
                        <input
                          type="file"
                          ref={dlCameraRef}
                          onChange={handleDlUpload}
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                        />
                        <input
                          type="file"
                          ref={dlGalleryRef}
                          onChange={handleDlUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <DocumentPhotoInput
                          label="Driving Licence Card Photo (लाइसेंस फोटो)"
                          sublabel="Front & Back Clear Photo"
                          photoUrl={drivingLicensePhoto}
                          isUploading={isUploadingDl}
                          onCameraClick={() => setActiveCameraTarget('dl')}
                          onGalleryClick={() => dlGalleryRef.current?.click()}
                          errorMessage={errors.drivingLicensePhoto?.message}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] disabled:opacity-50 mt-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Now (रजिस्टर करें)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </div>
            ) : (
              /* ═══════════ TRACK 2: PROPERTY OWNER (HOTELS, PGS, FLATS) ═══════════ */
              <div className="space-y-6">
                <div className="space-y-1 border-b border-zinc-100 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Property Details</h2>
                  <p className="text-xs text-zinc-500 font-normal">For hotels, guest houses, PGs & apartment rentals</p>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Property Type *</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'HOURLY_HOTEL', label: 'Hourly Hotel' },
                      { id: 'PG_HOSTEL', label: 'PG & Hostel' },
                      { id: 'FLAT', label: 'Flat / Rental' },
                    ].map((t) => {
                      const isSelected = watch('businessType') === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setValue('businessType', t.id as any)}
                          className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                              : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Property Name */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1 flex items-center gap-1">
                    <span>Establishment / Property Name</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('businessName')}
                    placeholder="e.g. Hotel Grand Residency or Shiv PG"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                  />
                  {errors.businessName && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.businessName.message}</p>
                  )}
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1 flex items-center gap-1">
                    <span>Owner / Manager Full Legal Name</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('ownerName')}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                  />
                  {errors.ownerName && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.ownerName.message}</p>
                  )}
                </div>

                {/* Calling & WhatsApp in 2 cols */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Calling Number */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-800 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Calling Number</span>
                          <span className="text-red-500 font-bold">*</span>
                        </span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        {...register('phone', {
                          onChange: (e) => {
                            if (sameWhatsapp) {
                              setValue('whatsapp', e.target.value);
                            }
                          },
                        })}
                        placeholder="10-digit mobile number"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-800 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span>WhatsApp Number</span>
                          <span className="text-red-500 font-bold">*</span>
                        </span>
                        {sameWhatsapp && (
                          <span className="text-[10px] text-zinc-400 font-normal">(Same as Calling)</span>
                        )}
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        disabled={sameWhatsapp}
                        {...register('whatsapp')}
                        placeholder="10-digit WhatsApp number"
                        className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                          sameWhatsapp
                            ? 'bg-zinc-100/70 border-zinc-200 text-zinc-400 cursor-not-allowed'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none'
                        }`}
                      />
                      {errors.whatsapp && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.whatsapp.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Same WhatsApp Checkbox */}
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sameWhatsapp}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSameWhatsapp(checked);
                        if (checked) {
                          setValue('whatsapp', watch('phone'), { shouldValidate: true });
                        }
                      }}
                      className="w-4 h-4 rounded border-zinc-300 text-zinc-950 accent-zinc-950 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-600 font-medium">
                      WhatsApp number is same as calling number (व्हाट्सएप और कॉलिंग नंबर एक ही हैं)
                    </span>
                  </label>
                </div>

                {/* Email & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1 flex items-center gap-1">
                      <span>Business Email</span>
                      <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="manager@myhotel.com"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1 flex items-center gap-1">
                      <span>Account Password</span>
                      <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="password"
                      {...register('password')}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                    />
                    {errors.password && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                {/* ── PROPERTY LEGAL KYC & VERIFICATION PROOF ── */}
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
                        Property Verification Document (प्रॉपर्टी सत्यापन दस्तावेज)
                      </span>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Select any 1 valid document to verify establishment ownership or tenancy
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Any 1 Document
                    </span>
                  </div>

                  {/* 1. Document Type Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1.5 flex items-center gap-1">
                      <span>Choose Document Type (दस्तावेज का प्रकार चुनें)</span>
                      <span className="text-red-500 font-bold">*</span>
                    </label>
                    <select
                      value={selectedPropDoc.id}
                      onChange={(e) => {
                        const doc = PROPERTY_DOC_OPTIONS.find((d) => d.id === e.target.value) || PROPERTY_DOC_OPTIONS[0];
                        setSelectedPropDoc(doc);
                        setValue('govtIdType', doc.govtType as any);
                      }}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all cursor-pointer"
                    >
                      {PROPERTY_DOC_OPTIONS.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} — ({doc.tag})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-zinc-500 mt-1.5 flex items-start gap-1">
                      <span>💡</span>
                      <span><strong>Detail Guide:</strong> {selectedPropDoc.hint}</span>
                    </p>
                  </div>

                  {/* 2. Dynamic Document Number & Photo Upload Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-800 mb-1.5 flex items-center gap-1">
                        <span>{selectedPropDoc.numberLabel}</span>
                        <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('govtIdNumber')}
                        placeholder={selectedPropDoc.numberPlaceholder}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none transition-all"
                      />
                      {errors.govtIdNumber && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.govtIdNumber.message}</p>
                      )}
                    </div>

                    <div>
                      {/* Hidden Camera & Gallery Inputs for Property Document */}
                      <input
                        type="file"
                        ref={propCameraRef}
                        onChange={handlePropUpload}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                      />
                      <input
                        type="file"
                        ref={propGalleryRef}
                        onChange={handlePropUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <DocumentPhotoInput
                        label={selectedPropDoc.photoLabel}
                        sublabel="Camera or Gallery"
                        photoUrl={govtIdPhoto}
                        isUploading={isUploadingProp}
                        onCameraClick={() => setActiveCameraTarget('prop')}
                        onGalleryClick={() => propGalleryRef.current?.click()}
                        errorMessage={errors.govtIdPhoto?.message}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Property (रजिस्टर करें)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

          </form>
        </div>

        {/* ── FOOTER TRUST ── */}
        <div className="text-center text-xs text-zinc-400 space-y-1">
          <p>Already a registered partner? <a href="/provider/login" className="text-zinc-950 font-bold hover:underline">Host Login →</a></p>
          <p className="text-[11px]">Protected under Section 79 of the Information Technology Act, 2000.</p>
        </div>

        {/* ── LIVE DIRECT CAMERA MODAL (WEBCAM & MOBILE LIVE STREAM) ── */}
        <LiveCameraModal
          isOpen={activeCameraTarget !== null}
          title={
            activeCameraTarget === 'aadhaarFront'
              ? 'Aadhaar Front Side Camera (सामने की फोटो)'
              : activeCameraTarget === 'aadhaarBack'
              ? 'Aadhaar Back Side Camera (पीछे की फोटो)'
              : activeCameraTarget === 'dl'
              ? 'Driving Licence Camera (ड्राइविंग लाइसेंस)'
              : activeCameraTarget === 'cert'
              ? 'Certificate / Degree Camera (प्रमाण पत्र)'
              : 'Property Document Camera (प्रॉपर्टी दस्तावेज)'
          }
          onClose={() => setActiveCameraTarget(null)}
          onCapture={handleCameraCapture}
        />

      </div>
    </div>
  );
}
