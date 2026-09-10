import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3030),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().min(60).default(900),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),
  SESSION_IDLE_TIMEOUT_SECONDS: z.coerce.number().int().min(60).default(120),
  WEB_ORIGIN: z.string().default('http://localhost:3100'),
  UPLOAD_DIR: z.string().default('uploads'),
});

export const env = schema.parse(process.env);
