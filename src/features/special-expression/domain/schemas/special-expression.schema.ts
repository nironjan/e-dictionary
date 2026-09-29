import { z } from "zod";

export const specialExpressionTypeSchema = z.enum([
  "one_word_substitution",
  "idiom",
]);

export type SpecialExpressionType = z.infer<typeof specialExpressionTypeSchema>;

export const specialExpressionSchema = z
  .object({
    languageId: z.string().uuid(),

    type: specialExpressionTypeSchema,

    expression: z
      .string()
      .trim()
      .min(1, "Expression is required")
      .max(2000, "Expression must be 2000 characters or less"),

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

    notes: z
      .string()
      .trim()
      .max(2000, "Notes must be 2000 characters or less")
      .optional(),

    categoryIds: z.array(z.string().uuid()).default([]),

    sortOrder: z.number().int().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    const replacement = data.replacement?.trim();

    if (data.type === "one_word_substitution" && !replacement) {
      ctx.addIssue({
        code: "custom",
        path: ["replacement"],
        message: "Replacement is required for one-word substitutions",
      });
    }

    if (data.type === "idiom" && replacement) {
      ctx.addIssue({
        code: "custom",
        path: ["replacement"],
        message: "Replacement must not be provided for idioms",
      });
    }
  });

export type SpecialExpressionFormValues = z.infer<
  typeof specialExpressionSchema
>;
