import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Reads from environment variable with build-time fallback for client generation
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/searchbook',
  },
});
