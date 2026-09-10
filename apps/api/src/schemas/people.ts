import { z } from "zod";

const status = z.enum(["ACTIVE", "INACTIVE"]);
export const personIdSchema = z.object({ id: z.uuid() }).strict();
const personFields = {
  name: z.string().trim().min(3).max(120),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  phone: z.string().trim().min(8).max(30),
  role: z.string().trim().min(2).max(80),
  status,
};
export const personCreateSchema = z
  .object({ ...personFields, status: status.default("ACTIVE") })
  .strict();
export const personUpdateSchema = z
  .object(personFields)
  .partial()
  .strict()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field is required",
  );
export const peopleQuerySchema = z
  .object({
    q: z.string().trim().max(120).optional(),
    status: status.optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();
