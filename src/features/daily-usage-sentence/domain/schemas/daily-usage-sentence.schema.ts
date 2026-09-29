import { z } from "zod";

export const dailyUsageSentenceTranslationSchema = z.object({
  id: z.string().uuid().optional(),

  languageId: z.string().uuid("Please select a language"),

  text: z
    .string()
    .trim()
    .min(1, "Translation text is required")
    .max(2000, "Translation text must not exceed 2000 characters"),

  isVerified: z.boolean(),

  sortOrder: z.number().int().min(0, "Sort order cannot be negative"),
});

export const dailyUsageSentenceSchema = z.object({
  slug: z
    .string()
    .trim()
    .max(150, "Slug must not exceed 150 characters")
    .optional(),

  isVerified: z.boolean(),

  isActive: z.boolean(),

  sortOrder: z.number().int().min(0, "Sort order cannot be negative"),

  categoryIds: z
    .array(z.string().uuid())
    .min(1, "At least one category is required"),
});

export type DailyUsageSentenceFormValues = z.infer<
  typeof dailyUsageSentenceSchema
>;

export type DailyUsageSentenceTranslationFormValues = z.infer<
  typeof dailyUsageSentenceTranslationSchema
>;
