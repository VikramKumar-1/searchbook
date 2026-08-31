import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // For migrations (CLI), we MUST use the DIRECT_URL. 
    // The pooling URL (DATABASE_URL) is used in the app code via the Prisma adapter.
    url: env('DIRECT_URL'),
  },
});
