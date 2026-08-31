import { z } from 'zod';

export const locationSearchSchema = z.object({
  q: z.string().min(1, 'Search query cannot be empty').max(100),
});

export type LocationSearchInput = z.infer<typeof locationSearchSchema>;
