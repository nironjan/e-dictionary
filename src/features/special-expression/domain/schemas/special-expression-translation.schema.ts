import { z } from "zod";

export const specialExpressionTranslationSchema = z.object({
  languageId: z.string().uuid(),

  meaning: z
    .string()
    .trim()
    .min(1, "Meaning is required")
    .max(2000, "Meaning must be 2000 characters or less"),

  replacement: z
    .string()
    .trim()
    .max(255, "Replacement must be 255 characters or less")
    .optional(),

  literalMeaning: z
    .string()
    .trim()
    .max(2000, "Literal meaning must be 2000 characters or less")
    .optional(),

  example: z
    .string()
    .trim()
    .max(2000, "Example must be 2000 characters or less")
    .optional(),

  isVerified: z.boolean().optional(),

  sortOrder: z.number().int().min(0).optional(),
});

export type SpecialExpressionTranslationFormValues = z.infer<
  typeof specialExpressionTranslationSchema
>;
