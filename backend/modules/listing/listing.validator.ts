import { z } from 'zod';

export const listingQuerySchema = z.object({
  citySlug: z.string().optional(),
  categorySlug: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  search: z.string().trim().max(100).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(1).max(50).optional(), // in KM
}).strict();

export type ListingQuery = z.infer<typeof listingQuerySchema>;

export const createListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Please provide a detailed description (min 20 characters)').max(2000),
  
  categorySlug: z.string().min(1, 'Category is required'),
  
  // Location
  address: z.string().min(5, 'Address is required').max(500),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  citySlug: z.string().min(1, 'City is required'),
  localitySlug: z.string().optional(),
  
  // Dynamic fields
  price: z.coerce.number().nonnegative().optional(),
  priceType: z.enum(['PER_MONTH', 'PER_DAY', 'PER_HOUR', 'ONE_TIME', 'PER_MEAL']).optional(),
  serviceRadiusKm: z.coerce.number().positive().max(100).optional(),
  
  // Flat / PG specific
  tenantType: z.enum(['BACHELOR', 'FAMILY', 'GIRLS_ONLY', 'BOYS_ONLY', 'ANYONE']).optional(),
  furnishing: z.enum(['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED']).optional(),
  bhkType: z.enum(['RK_1', 'BHK_1', 'BHK_2', 'BHK_3', 'BHK_4_PLUS']).optional(),
  
  // "Something Else" custom category name
  customCategory: z.string().min(3).max(100).optional(),
  
  // Hourly Hotel timings & room capacity
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  totalRooms: z.coerce.number().int().min(1).max(500).optional(),
  
  amenities: z.array(z.string()).default([]),
  photos: z.array(z.string()).default([]),
  
  contactPhone: z.string().min(10, 'Valid 10-digit calling number required').max(15),
  contactWhatsApp: z.string().min(10, 'Valid 10-digit WhatsApp number required').max(15),
}).strict();

export type CreateListingInput = z.infer<typeof createListingSchema>;
