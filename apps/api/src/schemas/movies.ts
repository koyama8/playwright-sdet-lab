import { z } from "zod";

export const movieIdSchema = z.object({ id: z.uuid() }).strict();
const favorite = z.preprocess(
  (value) => (value === "true" ? true : value === "false" ? false : value),
  z.boolean(),
);
const movieFields = {
  title: z.string().trim().min(2).max(160),
  imageUrl: z.url().max(1000).optional().or(z.literal("")),
  genre: z.string().trim().min(2).max(80),
  year: z.coerce.number().int().min(1888).max(2100),
  rating: z.coerce.number().min(0).max(10),
  favorite,
  synopsis: z.string().trim().min(10).max(2000),
};
export const movieCreateSchema = z
  .object({ ...movieFields, favorite: favorite.default(false) })
  .strict();
export const movieUpdateSchema = z
  .object(movieFields)
  .partial()
  .strict()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field is required",
  );
export const moviesQuerySchema = z
  .object({
    q: z.string().trim().max(160).optional(),
    genre: z.string().trim().max(80).optional(),
    favorite: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();
