import { z } from "zod";

// ─── UI form shape ────────────────────────────────────────────────────────────
// The form holds a single `name` (for the default language). It is NOT sent
// to the API directly on create — the hook wraps it in `translations[]`.
// On update it's stripped entirely (backend derives it from the translation).

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name must be at most 100 characters"),

  image: z
    .string()
    .url("Must be a valid image URL")
    .optional()
    .or(z.literal("")),

  parentId: z.string().nullable(),

  defaultLanguageId: z.string().min(1, "Default language is required"),

  isActive: z.boolean(),

  sortOrder: z.number().int(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

export const defaultCategoryFormValues: CategoryFormData = {
  name: "",
  image: "",
  parentId: null,
  defaultLanguageId: "",
  isActive: true,
  sortOrder: 0,
};
