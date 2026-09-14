import { z } from "zod";

export const languageFormSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 chars (e.g. en, as, hi, brx)")
    .max(10),

  name: z.string().min(1, "Name is required").max(100),

  nativeName: z.string().optional(),

  isActive: z.boolean(),

  isRtl: z.boolean(),

  sortOrder: z.number().int(),
});

export type LanguageFormData = z.infer<typeof languageFormSchema>;

export const defaultLanguageFormValues: LanguageFormData = {
  code: "",
  name: "",
  nativeName: "",
  isActive: true,
  isRtl: false,
  sortOrder: 0,
};
