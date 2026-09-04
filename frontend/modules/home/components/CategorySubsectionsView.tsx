/**
 * ═══════════════════════════════════════════════════════════
 * 📱 CATEGORY SUBSECTIONS VIEW (Mobile Dedicated Categories)
 * ═══════════════════════════════════════════════════════════
 *
 * When user selects a specific category tab on mobile (e.g., "PG & Hostel"):
 * - The generic "All" sections are hidden.
 * - This view renders 4 targeted sub-sections for that category.
 * - Each sub-section renders a horizontal scroll row of 10 rich cards.
 * - "See More →" button navigates cleanly to /listings with infinite scroll.
 *
 * Performance:
 * - Optimized with React.memo on items to eliminate redrawing and re-rendering.
 * - Lazy loaded images with decoding="async".
 * - 60 FPS mobile scrolling via mobile-scroll-x and will-change-scroll.
 * ═══════════════════════════════════════════════════════════
 */
'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Star, MapPin, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { MobileCategoryKey, CATEGORY_THEMES } from '@frontend/stores/categoryNavStore';

export interface SubsectionCardItem {
  id: string;
  title: string;
  location: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewsCount: number;
  tag: string;
  image: string;
  href: string;
  feature: string;
}

export interface SubsectionGroup {
  id: string;
  title: string;
  subtitle: string;
  seeMoreHref: string;
  cards: SubsectionCardItem[];
}

/* ── Sample 10-Card Generators for Each Category ── */
const SUBSECTIONS_BY_CATEGORY: Record<Exclude<MobileCategoryKey, 'all'>, SubsectionGroup[]> = {
  'pg-hostel': [
    {
      id: 'top-pgs',
      title: 'Top Rated Boys & Girls PGs',
      subtitle: '3-Time Meals, High-Speed WiFi & AC · Zero Brokerage',
      seeMoreHref: '/listings?category=pg-hostel&search=pg',
      cards: [
        {
          id: 'pg-1',
          title: 'Stanza Living Austin House',
          location: 'Lalpur, Ranchi',
          price: '₹5,999/mo',
          originalPrice: '₹7,500',
          rating: 4.9,
          reviewsCount: 142,
          tag: 'Top Pick',
          image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=stanza',
          feature: 'Food + AC + Gym',
        },
        {
          id: 'pg-2',
          title: 'Zolo Stay Starlight Hub',
          location: 'Harmu Housing, Ranchi',
          price: '₹5,200/mo',
          originalPrice: '₹6,800',
          rating: 4.8,
          reviewsCount: 98,
          tag: 'Boys & Girls',
          image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=zolo',
          feature: 'Daily Housekeeping',
        },
        {
          id: 'pg-3',
          title: 'Saraswati Girls Executive PG',
          location: 'Circular Road, Ranchi',
          price: '₹4,999/mo',
          originalPrice: '₹6,200',
          rating: 4.9,
          reviewsCount: 112,
          tag: 'Girls Only',
          image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=girls',
          feature: 'CCTV & Bio-metric',
        },
        {
          id: 'pg-4',
          title: 'Oxford Boys Premium PG',
          location: 'Kanke Road, Ranchi',
          price: '₹4,499/mo',
          originalPrice: '₹5,500',
          rating: 4.7,
          reviewsCount: 76,
          tag: 'Boys Only',
          image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=boys',
          feature: 'RO Water + WiFi',
        },
        {
          id: 'pg-5',
          title: 'Green Glen Deluxe Stay',
          location: 'Sector 62, Noida',
          price: '₹7,500/mo',
          originalPrice: '₹9,000',
          rating: 4.8,
          reviewsCount: 89,
          tag: 'Verified',
          image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=noida',
          feature: 'Metro 200m',
        },
        {
          id: 'pg-6',
          title: 'Royal Palace Men Residency',
          location: 'Cyber Hub, Gurugram',
          price: '₹8,999/mo',
          originalPrice: '₹11,500',
          rating: 4.9,
          reviewsCount: 164,
          tag: 'Luxury',
          image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=gurugram',
          feature: 'Chef Cooked Food',
        },
        {
          id: 'pg-7',
          title: 'Angel Villa Stay for Girls',
          location: 'Ashok Nagar, Ranchi',
          price: '₹5,400/mo',
          originalPrice: '₹6,500',
          rating: 4.8,
          reviewsCount: 54,
          tag: 'Safe & Secure',
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=angel',
          feature: 'Attached Balcony',
        },
        {
          id: 'pg-8',
          title: 'Youth Hub Student Living',
          location: 'South Extension, Delhi',
          price: '₹6,800/mo',
          originalPrice: '₹8,200',
          rating: 4.7,
          reviewsCount: 92,
          tag: 'Student Friendly',
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=delhi',
          feature: 'Library & Study Pods',
        },
        {
          id: 'pg-9',
          title: 'Sunrise Executive PG',
          location: 'Morabadi, Ranchi',
          price: '₹4,200/mo',
          originalPrice: '₹5,000',
          rating: 4.6,
          reviewsCount: 45,
          tag: 'Budget',
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=morabadi',
          feature: 'Ground Facing Park',
        },
        {
          id: 'pg-10',
          title: 'Prime Comfort Co-Stay',
          location: 'Hinoo, Ranchi',
          price: '₹4,800/mo',
          originalPrice: '₹5,900',
          rating: 4.8,
          reviewsCount: 68,
          tag: 'Airport Road',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=hinoo',
          feature: '24/7 Power Backup',
        },
      ],
    },
    {
      id: 'coliving-spaces',
      title: 'Modern Co-Living & Gen-Z Hubs',
      subtitle: 'Playstation Lounge, High-Speed WiFi & Community Events',
      seeMoreHref: '/listings?category=pg-hostel&search=co-living',
      cards: [
        {
          id: 'cl-1',
          title: 'Hive Co-Living Spaces',
          location: 'Golf Course Road, Gurugram',
          price: '₹9,999/mo',
          originalPrice: '₹12,500',
          rating: 4.9,
          reviewsCount: 180,
          tag: 'Gaming Hub',
          image: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=hive',
          feature: 'Rooftop Cafe',
        },
        {
          id: 'cl-2',
          title: 'Boston Living Gen-Z Hub',
          location: 'Sector 62, Noida',
          price: '₹8,499/mo',
          originalPrice: '₹10,500',
          rating: 4.8,
          reviewsCount: 135,
          tag: 'Co-Work',
          image: 'https://images.unsplash.com/photo-1502005229762-ee1b2b93e083?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=boston',
          feature: 'Workstation Included',
        },
        {
          id: 'cl-3',
          title: 'Tribe Urban Shared Suites',
          location: 'Bariatu, Ranchi',
          price: '₹6,999/mo',
          originalPrice: '₹8,500',
          rating: 4.8,
          reviewsCount: 78,
          tag: 'Trending',
          image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=tribe',
          feature: 'Smart TV + OTT',
        },
        {
          id: 'cl-4',
          title: 'Nomad Community Living',
          location: 'Hauz Khas Village, Delhi',
          price: '₹11,500/mo',
          originalPrice: '₹14,000',
          rating: 4.9,
          reviewsCount: 210,
          tag: 'Creative Hub',
          image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=nomad',
          feature: 'Lake View Terrace',
        },
        {
          id: 'cl-5',
          title: 'Nexus Co-Stay & Lounge',
          location: 'Sector 29, Gurugram',
          price: '₹10,200/mo',
          originalPrice: '₹12,800',
          rating: 4.8,
          reviewsCount: 95,
          tag: 'Events Weekly',
          image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=nexus',
          feature: 'Foosball & Pool Table',
        },
        {
          id: 'cl-6',
          title: 'The Millennial House',
          location: 'Morabadi, Ranchi',
          price: '₹7,499/mo',
          originalPrice: '₹9,200',
          rating: 4.7,
          reviewsCount: 62,
          tag: 'Co-Living',
          image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=millennial',
          feature: 'Bi-Weekly Movie Nights',
        },
        {
          id: 'cl-7',
          title: 'Urban Nest Shared Studio',
          location: 'DLF Phase 3, Gurugram',
          price: '₹8,999/mo',
          originalPrice: '₹11,000',
          rating: 4.8,
          reviewsCount: 114,
          tag: 'Instant Key',
          image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=urban-nest',
          feature: 'App-Based Entry',
        },
        {
          id: 'cl-8',
          title: 'Olive Co-Living Stays',
          location: 'Lajpat Nagar, Delhi',
          price: '₹9,200/mo',
          originalPrice: '₹11,200',
          rating: 4.7,
          reviewsCount: 88,
          tag: 'Near Metro',
          image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=olive',
          feature: 'Modern Kitchenette',
        },
        {
          id: 'cl-9',
          title: 'Spaces Hub Gen-Z Suite',
          location: 'Harmu, Ranchi',
          price: '₹6,500/mo',
          originalPrice: '₹7,800',
          rating: 4.9,
          reviewsCount: 51,
          tag: 'Top Rated',
          image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=spaces',
          feature: 'Gym & Yoga Deck',
        },
        {
          id: 'cl-10',
          title: 'Canvas Urban Shared Suites',
          location: 'Sector 18, Noida',
          price: '₹8,700/mo',
          originalPrice: '₹10,500',
          rating: 4.8,
          reviewsCount: 73,
          tag: 'Premium',
          image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=canvas',
          feature: 'Speedy Fiber Net',
        },
      ],
    },
    {
      id: 'student-hostels',
      title: 'Budget Student Hostels near Colleges',
      subtitle: 'Walking distance from coaching institutes & universities',
      seeMoreHref: '/listings?category=pg-hostel&search=student',
      cards: [
        {
          id: 'sh-1',
          title: 'Vidyapeeth Boys Hostel',
          location: 'Circular Road (Near Aakash), Ranchi',
          price: '₹3,499/mo',
          originalPrice: '₹4,500',
          rating: 4.7,
          reviewsCount: 83,
          tag: 'Coaching Hub',
          image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=vidyapeeth',
          feature: 'Silent Study Hall',
        },
        {
          id: 'sh-2',
          title: 'Savitribai Phule Girls Hostel',
          location: 'Near St. Xavier College, Ranchi',
          price: '₹3,699/mo',
          originalPrice: '₹4,800',
          rating: 4.9,
          reviewsCount: 110,
          tag: 'Warden 24/7',
          image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=xavier',
          feature: 'Home Cooked Meals',
        },
        {
          id: 'sh-3',
          title: 'Mesra Campus Lodge for Boys',
          location: 'BIT Mesra Gate, Ranchi',
          price: '₹3,800/mo',
          originalPrice: '₹4,900',
          rating: 4.6,
          reviewsCount: 94,
          tag: 'Campus Facing',
          image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=mesra',
          feature: 'Cycle Parking Free',
        },
        {
          id: 'sh-4',
          title: 'North Campus Scholars Haven',
          location: 'GTB Nagar, Delhi University',
          price: '₹5,500/mo',
          originalPrice: '₹7,000',
          rating: 4.8,
          reviewsCount: 167,
          tag: 'DU North',
          image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=gtb',
          feature: '5 Mins to Metro',
        },
        {
          id: 'sh-5',
          title: 'Amity Express Student Residence',
          location: 'Sector 125, Noida',
          price: '₹5,800/mo',
          originalPrice: '₹7,200',
          rating: 4.7,
          reviewsCount: 122,
          tag: 'Shuttle Bus',
          image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=amity',
          feature: 'Laundry Included',
        },
        {
          id: 'sh-6',
          title: 'Career Point Boys Hostel',
          location: 'Lalpur Chowk, Ranchi',
          price: '₹3,500/mo',
          originalPrice: '₹4,600',
          rating: 4.6,
          reviewsCount: 65,
          tag: 'FIITJEE/Allen Near',
          image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=lalpur-hostel',
          feature: 'Mess Included',
        },
        {
          id: 'sh-7',
          title: 'Gargi Villa Girls Hostel',
          location: 'South Campus, Anand Niketan',
          price: '₹6,200/mo',
          originalPrice: '₹7,800',
          rating: 4.9,
          reviewsCount: 140,
          tag: 'Gated Society',
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=south-campus',
          feature: 'Attached Bathrooms',
        },
        {
          id: 'sh-8',
          title: 'Pragati Boys Student Lodge',
          location: 'Ratu Road, Ranchi',
          price: '₹3,200/mo',
          originalPrice: '₹4,200',
          rating: 4.5,
          reviewsCount: 48,
          tag: 'Pocket Friendly',
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=pragati',
          feature: 'Filtered Cold Water',
        },
        {
          id: 'sh-9',
          title: 'Knowledge Park Student Inn',
          location: 'Greater Noida',
          price: '₹4,999/mo',
          originalPrice: '₹6,500',
          rating: 4.7,
          reviewsCount: 91,
          tag: 'All Colleges',
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=greater-noida',
          feature: 'Gym & Mess',
        },
        {
          id: 'sh-10',
          title: 'Adarsh Boys Study Lodge',
          location: 'Morabadi University Gate, Ranchi',
          price: '₹3,300/mo',
          originalPrice: '₹4,300',
          rating: 4.6,
          reviewsCount: 52,
          tag: 'RU Campus',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=adarsh',
          feature: '24/7 Power',
        },
      ],
    },
    {
      id: 'zero-deposit',
      title: 'Zero Deposit & Private AC Rooms',
      subtitle: 'Instant Move-in with Private Attached Washroom & Balcony',
      seeMoreHref: '/listings?category=pg-hostel&search=single',
      cards: [
        {
          id: 'zd-1',
          title: 'Single Executive Studio PG',
          location: 'Ashok Nagar, Ranchi',
          price: '₹6,999/mo',
          originalPrice: '₹8,500',
          rating: 4.9,
          reviewsCount: 75,
          tag: '0 Deposit',
          image: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=zero-deposit-1',
          feature: 'Split AC + Balcony',
        },
        {
          id: 'zd-2',
          title: 'Grand Solo Private Room',
          location: 'Golf Course Road, Gurugram',
          price: '₹12,000/mo',
          originalPrice: '₹14,500',
          rating: 4.8,
          reviewsCount: 88,
          tag: 'Executive',
          image: 'https://images.unsplash.com/photo-1502005229762-ee1b2b93e083?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=zero-deposit-2',
          feature: 'Smart TV + Geyser',
        },
        {
          id: 'zd-3',
          title: 'Cozy Haven Single AC Stay',
          location: 'Harmu Colony, Ranchi',
          price: '₹5,800/mo',
          originalPrice: '₹7,000',
          rating: 4.7,
          reviewsCount: 61,
          tag: 'Private Bath',
          image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=zero-deposit-3',
          feature: 'Daily Housekeeping',
        },
        {
          id: 'zd-4',
          title: 'Signature Solo Suite',
          location: 'Sector 50, Noida',
          price: '₹9,500/mo',
          originalPrice: '₹11,500',
          rating: 4.9,
          reviewsCount: 104,
          tag: 'Ready to Move',
          image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=zero-deposit-4',
          feature: 'Full Furnished',
        },
        {
          id: 'zd-5',
          title: 'Park View Single Suite',
          location: 'Morabadi, Ranchi',
          price: '₹6,200/mo',
          originalPrice: '₹7,500',
          rating: 4.8,
          reviewsCount: 42,
          tag: 'Green View',
          image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=zero-deposit-5',
          feature: 'Attached Terrace',
        },
        {
          id: 'zd-6',
          title: 'Metroline Solo AC Chamber',
          location: 'Saket, Delhi',
          price: '₹10,500/mo',
          originalPrice: '₹13,000',
          rating: 4.7,
          reviewsCount: 89,
          tag: 'Zero Deposit',
          image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=zero-deposit-6',
          feature: 'Refrigerator in Room',
        },
        {
          id: 'zd-7',
          title: 'Silver Oak AC Single Room',
          location: 'Kanke Road, Ranchi',
          price: '₹5,500/mo',
          originalPrice: '₹6,800',
          rating: 4.8,
          reviewsCount: 53,
          tag: 'Safe Gated',
          image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=zero-deposit-7',
          feature: 'Dedicated Parking',
        },
        {
          id: 'zd-8',
          title: 'Cyber City Solo Pad',
          location: 'Udyog Vihar, Gurugram',
          price: '₹9,800/mo',
          originalPrice: '₹12,000',
          rating: 4.9,
          reviewsCount: 118,
          tag: 'Top Rated',
          image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=zero-deposit-8',
          feature: 'Walk to Offices',
        },
        {
          id: 'zd-9',
          title: 'Bariatu Hill Single Suite',
          location: 'Bariatu, Ranchi',
          price: '₹5,200/mo',
          originalPrice: '₹6,400',
          rating: 4.7,
          reviewsCount: 39,
          tag: 'Quiet Location',
          image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=zero-deposit-9',
          feature: 'Study Table & Wardrobe',
        },
        {
          id: 'zd-10',
          title: 'Urban Core Single AC Hub',
          location: 'Lalpur, Ranchi',
          price: '₹5,999/mo',
          originalPrice: '₹7,200',
          rating: 4.8,
          reviewsCount: 67,
          tag: 'Fast WiFi',
          image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
          href: '/listings?category=pg-hostel&search=zero-deposit-10',
          feature: 'Instant Key Handover',
        },
      ],
    },
  ],

  'hourly-hotels': [
    {
      id: 'couple-friendly',
      title: 'Couple Friendly Hourly Hotels',
      subtitle: 'Local IDs accepted · 100% Private & Discreet · Pay at Check-in',
      seeMoreHref: '/listings?category=hourly-hotels&search=couple',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `hh-couple-${i}`,
        title: `Hotel Grand Blossom - Pack ${i + 1}`,
        location: 'Harmu Bypass / MG Road',
        price: '₹299 / 3hr',
        originalPrice: '₹799',
        rating: 4.9,
        reviewsCount: 60 + i * 8,
        tag: 'Couple Safe',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
        href: '/listings?category=hourly-hotels',
        feature: 'Instant Check-in',
      })),
    },
    {
      id: 'day-use',
      title: 'Day-Use & Quick Rest Rooms',
      subtitle: 'Pay only for the hours you stay · 2 to 4 hour flexible packs',
      seeMoreHref: '/listings?category=hourly-hotels&search=day-use',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `hh-day-${i}`,
        title: `Transit Express Inn Room ${i + 1}`,
        location: 'Station Road / Main Road',
        price: '₹199 / 2hr',
        originalPrice: '₹599',
        rating: 4.7,
        reviewsCount: 45 + i * 6,
        tag: 'Instant Rest',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop',
        href: '/listings?category=hourly-hotels',
        feature: 'Shower & AC',
      })),
    },
    {
      id: 'transit-stays',
      title: 'Transit Stays Near Station & Airport',
      subtitle: 'Quick rest before flight or train with luggage safety',
      seeMoreHref: '/listings?category=hourly-hotels&search=transit',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `hh-transit-${i}`,
        title: `Airport Plaza Transit ${i + 1}`,
        location: 'Hinoo Airport Road',
        price: '₹349 / 3hr',
        originalPrice: '₹899',
        rating: 4.8,
        reviewsCount: 50 + i * 5,
        tag: 'Airport 500m',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
        href: '/listings?category=hourly-hotels',
        feature: 'Luggage Storage',
      })),
    },
    {
      id: 'luxury-suites',
      title: '4 & 5 Star Hourly Suites',
      subtitle: 'Premium micro-stays for corporate meetings & relaxation',
      seeMoreHref: '/listings?category=hourly-hotels&search=luxury',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `hh-luxury-${i}`,
        title: `Radisson Luxury Hourly Suite ${i + 1}`,
        location: 'Main Road / City Center',
        price: '₹699 / 4hr',
        originalPrice: '₹1,599',
        rating: 4.9,
        reviewsCount: 80 + i * 9,
        tag: '5 Star Rated',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop',
        href: '/listings?category=hourly-hotels',
        feature: 'Jacuzzi & Breakfast',
      })),
    },
  ],

  flats: [
    {
      id: 'studio-1rk',
      title: '1 RK & Studio Apartments',
      subtitle: 'Bachelors welcome · Direct from Owner · 0 Brokerage',
      seeMoreHref: '/listings?category=flats&search=1rk',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `flat-1rk-${i}`,
        title: `Cozy 1 RK Studio Apartment ${i + 1}`,
        location: 'Lalpur / Morabadi / Harmu',
        price: '₹5,499/mo',
        originalPrice: '₹7,500',
        rating: 4.8,
        reviewsCount: 30 + i * 4,
        tag: '0 Brokerage',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
        href: '/listings?category=flats',
        feature: 'Independent Kitchen',
      })),
    },
    {
      id: '1bhk-2bhk',
      title: '1 BHK & 2 BHK Flat Sharing',
      subtitle: 'Spacious flats for working professionals and small families',
      seeMoreHref: '/listings?category=flats&search=2bhk',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `flat-bhk-${i}`,
        title: `Modern 2 BHK Gated Society ${i + 1}`,
        location: 'Ashok Nagar / Kanke Rd',
        price: '₹9,999/mo',
        originalPrice: '₹13,000',
        rating: 4.9,
        reviewsCount: 42 + i * 5,
        tag: 'Gated Society',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
        href: '/listings?category=flats',
        feature: 'Lift + Car Parking',
      })),
    },
    {
      id: 'furnished',
      title: 'Fully Furnished Ready-to-Move Flats',
      subtitle: 'Includes AC, TV, Fridge, Beds & Sofa Set',
      seeMoreHref: '/listings?category=flats&search=furnished',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `flat-furn-${i}`,
        title: `Luxury Furnished Flat ${i + 1}`,
        location: 'Cyber City / Morabadi',
        price: '₹14,500/mo',
        originalPrice: '₹18,000',
        rating: 4.9,
        reviewsCount: 55 + i * 6,
        tag: 'Fully Furnished',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
        href: '/listings?category=flats',
        feature: 'Just Bring Clothes',
      })),
    },
    {
      id: '3bhk-villas',
      title: '3 BHK Apartments & Independent Floors',
      subtitle: 'Spacious family homes in safe residential societies',
      seeMoreHref: '/listings?category=flats&search=3bhk',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `flat-3bhk-${i}`,
        title: `Grand 3 BHK Residency ${i + 1}`,
        location: 'Harmu Housing / Bariatu',
        price: '₹18,000/mo',
        originalPrice: '₹22,000',
        rating: 4.8,
        reviewsCount: 38 + i * 3,
        tag: 'Family Verified',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
        href: '/listings?category=flats',
        feature: 'Park Facing + Guard',
      })),
    },
  ],

  services: [
    {
      id: 'cook-maid',
      title: 'Cook & Housemaid Services',
      subtitle: 'Background verified daily cooks, maids & cleaners',
      seeMoreHref: '/listings?category=services&search=maid',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `serv-maid-${i}`,
        title: `Certified Home Cook & Maid Service ${i + 1}`,
        location: 'Harmu / Lalpur / Kanke',
        price: '₹1,499/mo',
        originalPrice: '₹2,500',
        rating: 4.9,
        reviewsCount: 88 + i * 11,
        tag: 'Police Verified',
        image: '/services/maid.png',
        href: '/listings?category=services',
        feature: 'Cooking & Cleaning',
      })),
    },
    {
      id: 'water-supply',
      title: '20L RO Water Tanker & Can Supply',
      subtitle: 'Chilled & normal pure drinking water delivered to your floor',
      seeMoreHref: '/listings?category=services&search=water',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `serv-water-${i}`,
        title: `Pure 20L Water Can Delivery ${i + 1}`,
        location: 'All Localities in 20 Mins',
        price: '₹30 / Can',
        originalPrice: '₹50',
        rating: 4.8,
        reviewsCount: 140 + i * 15,
        tag: 'In 30 Mins',
        image: '/services/water.png',
        href: '/listings?category=services',
        feature: 'Doorstep Delivery',
      })),
    },
    {
      id: 'plumber-electrician',
      title: 'Plumber & Electrician Doorstep Repair',
      subtitle: 'Fixed ₹149 inspection charge with 30-day service guarantee',
      seeMoreHref: '/listings?category=services&search=repair',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `serv-repair-${i}`,
        title: `Expert Plumber & Electrician Unit ${i + 1}`,
        location: 'At Your Doorstep',
        price: '₹149 Visit',
        originalPrice: '₹299',
        rating: 4.8,
        reviewsCount: 95 + i * 8,
        tag: '30-Day Guarantee',
        image: '/services/plumber.png',
        href: '/listings?category=services',
        feature: 'Uniformed Technicians',
      })),
    },
    {
      id: 'ac-laundry',
      title: 'AC Service & Laundry Pick-Drop',
      subtitle: 'Jet wash deep cleaning and washed + ironed clothes in 24h',
      seeMoreHref: '/listings?category=services&search=ac',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `serv-ac-${i}`,
        title: `AC Jet Cleaning & Laundry Care ${i + 1}`,
        location: 'Within 5 KM Radius',
        price: '₹499 Service',
        originalPrice: '₹899',
        rating: 4.9,
        reviewsCount: 72 + i * 7,
        tag: 'Fast Service',
        image: '/services/ac.png',
        href: '/listings?category=services',
        feature: 'Same Day Pickup',
      })),
    },
  ],

  tiffin: [
    {
      id: 'daily-tiffin',
      title: 'Daily Ghar Jaisa Tiffin Services',
      subtitle: 'Warm, hygienic 4-course meals delivered right to your door',
      seeMoreHref: '/listings?category=tiffin&search=tiffin',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `tif-daily-${i}`,
        title: `Annapurna Ghar Ka Khana ${i + 1}`,
        location: 'Delivered in 30 Mins',
        price: '₹1,899/mo',
        originalPrice: '₹2,600',
        rating: 4.9,
        reviewsCount: 155 + i * 14,
        tag: 'Free Trial',
        image: '/services/cook.png',
        href: '/listings?category=tiffin',
        feature: 'Roti + Dal + 2 Sabzi',
      })),
    },
    {
      id: 'student-mess',
      title: 'Student Mess Monthly Packages',
      subtitle: 'Unlimited rice, hot rotis & special Sunday feast',
      seeMoreHref: '/listings?category=tiffin&search=student-mess',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `tif-mess-${i}`,
        title: `Student Special Mess Package ${i + 1}`,
        location: 'Coaching & College Hub',
        price: '₹2,400/mo',
        originalPrice: '₹3,200',
        rating: 4.8,
        reviewsCount: 120 + i * 12,
        tag: '2 Times Food',
        image: '/services/tiffin.jpg',
        href: '/listings?category=tiffin',
        feature: 'Sunday Sweet / Paneer',
      })),
    },
    {
      id: 'diet-gym',
      title: 'High Protein & Gym Diet Meal Boxes',
      subtitle: 'Boiled eggs, sprouts, grilled paneer & counted macros',
      seeMoreHref: '/listings?category=tiffin&search=diet',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `tif-diet-${i}`,
        title: `FitMeals Protein Box ${i + 1}`,
        location: 'Gym Center Delivery',
        price: '₹2,999/mo',
        originalPrice: '₹4,000',
        rating: 4.9,
        reviewsCount: 85 + i * 9,
        tag: 'High Protein',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
        href: '/listings?category=tiffin',
        feature: 'Custom Calorie Count',
      })),
    },
    {
      id: 'office-lunch',
      title: 'Corporate Office Lunch Boxes',
      subtitle: 'Timely 1:00 PM delivery to tech parks and office desks',
      seeMoreHref: '/listings?category=tiffin&search=office',
      cards: Array.from({ length: 10 }).map((_, i) => ({
        id: `tif-office-${i}`,
        title: `Executive Corporate Lunch Box ${i + 1}`,
        location: 'Office Desks Daily',
        price: '₹85 / Meal',
        originalPrice: '₹120',
        rating: 4.8,
        reviewsCount: 94 + i * 8,
        tag: 'Always On-Time',
        image: '/services/cook.png',
        href: '/listings?category=tiffin',
        feature: 'Leak-Proof Steel Box',
      })),
    },
  ],
};

/* ── Clean & Minimal Memoized Card (Zero nested spans, 100% SEO friendly) ── */
const HorizontalListingCard = memo(function HorizontalListingCard({
  card,
}: {
  card: SubsectionCardItem;
}) {
  return (
    <article className="w-[170px] shrink-0 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs flex flex-col active:scale-95 transition-transform">
      <Link href={card.href} className="block group">
        {/* Card Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle Rating Pill */}
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            {card.rating}
          </div>
        </div>

        {/* Minimal Details (No extra span clutter) */}
        <div className="p-2.5">
          <h4 className="text-[12px] font-bold text-gray-900 leading-snug line-clamp-1">
            {card.title}
          </h4>
          <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
            {card.location}
          </p>
          <p className="text-[12px] font-black text-gray-950 mt-1.5">
            {card.price}
          </p>
        </div>
      </Link>
    </article>
  );
});

export function CategorySubsectionsView({ category }: { category: Exclude<MobileCategoryKey, 'all'> }) {
  const sections = SUBSECTIONS_BY_CATEGORY[category] || [];
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES['pg-hostel'];

  return (
    <div className="md:hidden py-3 px-3.5 space-y-5 bg-gradient-to-b from-[#EDF8FD] via-white to-gray-50">
      {sections.map((sec, idx) => (
        <section key={sec.id || idx} className="space-y-2">
          {/* Clean Subsection Header */}
          <header className="flex items-end justify-between px-1">
            <div className="max-w-[75%]">
              <h3 className="text-sm font-extrabold text-gray-950 leading-tight">
                {sec.title}
              </h3>
              <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5 truncate">
                {sec.subtitle}
              </p>
            </div>

            {/* "See all →" link leading directly to infinite scroll page */}
            <Link
              href={sec.seeMoreHref}
              className="text-[11px] font-bold active:opacity-75 transition-opacity shrink-0 pb-0.5"
              style={{ color: theme.primary }}
            >
              See all →
            </Link>
          </header>

          {/* 10-Card Horizontal Scroll Row */}
          <div className="mobile-scroll-x will-change-scroll px-1 flex gap-2.5 pb-1">
            {sec.cards.map((card) => (
              <HorizontalListingCard
                key={card.id}
                card={card}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
