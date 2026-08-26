import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/agentichire'),
  JWT_SECRET: z.string().min(16).default('development-only-secret'),
  QDRANT_URL: z.string().url().default('http://localhost:6333'),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Recruiting <onboarding@resend.dev>')
});

export const env = schema.parse(process.env);
