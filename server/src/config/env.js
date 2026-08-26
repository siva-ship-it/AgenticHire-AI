import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/agentichire'),
  JWT_SECRET: z.string().min(16).default('development-only-secret'),
  QDRANT_URL: z.string().url().default('http://127.0.0.1:6333'),
  QDRANT_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Recruiting <onboarding@resend.dev>'),
  UPLOAD_DIR: z.string().default('uploads')
}).superRefine((value, context) => {
  if (value.NODE_ENV === 'production' && value.JWT_SECRET === 'development-only-secret') {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['JWT_SECRET'], message: 'A unique JWT_SECRET is required in production' });
  }
});

export const env = schema.parse(process.env);
