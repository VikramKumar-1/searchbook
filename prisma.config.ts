import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Reads strictly from environment variables (never hardcoded in code)
    url: env('DATABASE_URL'),
  },
});
