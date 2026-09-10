import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().min(1).max(200),
  })
  .strict();

export const refreshSchema = z
  .object({ refreshToken: z.string().min(20) })
  .strict();
export const logoutSchema = refreshSchema;
