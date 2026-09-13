import { z } from "zod";

const uuidSchema = z.uuid();

export const relationTypeSchema = z.enum(["synonym", "antonym"]);
export type RelationType = z.infer<typeof relationTypeSchema>;

export const partOfSpeechSchema = z.enum([
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "interjection",
  "determiner",
  "numeral",
  "other",
]);

export type PartOfSpeech = z.infer<typeof partOfSpeechSchema>;

export const wordDefinitionInputSchema = z.object({
  id: uuidSchema.optional(),
  languageId: uuidSchema,
  text: z.string().min(1).max(2000),
  usageNote: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const wordTranslationInputSchema = z.object({
  id: uuidSchema.optional(),
  clientKey: z.string().optional(),
  languageId: uuidSchema,
  text: z.string().min(1).max(300),
  targetWordId: uuidSchema.optional(),
  sortOrder: z.number().int().optional(),
});

export const wordExampleInputSchema = z.object({
  id: uuidSchema.optional(),
  languageId: uuidSchema,
  text: z.string().min(1).max(1000),
  translationId: uuidSchema.optional(),
  translationClientKey: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const wordRelationInputSchema = z.object({
  id: uuidSchema.optional(),
  relationType: relationTypeSchema,
  relatedMeaningId: uuidSchema,
  sortOrder: z.number().int().optional(),
});

export const wordPhoneticInputSchema = z.object({
  id: uuidSchema.optional(),
  text: z.string().min(1),
  type: z.string().min(1),
  accent: z.string().optional(),
  audioUrl: z.url().optional(),
  sourceUrl: z.url().optional(),
  isPrimary: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const wordMeaningInputSchema = z.object({
  id: uuidSchema.optional(),
  partOfSpeech: partOfSpeechSchema,
  isArchaic: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  version: z.number().int().optional(),

  definitions: z.array(wordDefinitionInputSchema).optional(),

  translations: z.array(wordTranslationInputSchema).optional(),

  examples: z.array(wordExampleInputSchema).optional(),

  relations: z.array(wordRelationInputSchema).optional(),
});

export const wordEtymologyInputSchema = z.object({
  id: uuidSchema.optional(),
  origin: z.string().optional(),
  originWord: z.string().optional(),
  originLanguage: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const wordSourceInputSchema = z.object({
  id: uuidSchema.optional(),
  sourceUrl: z.string().min(1),
  sourceName: z.string().min(1),
  sourceType: z.string().min(1),
  retrievedAt: z.string().optional(),
});

export const wordMediaInputSchema = z.object({
  id: uuidSchema.optional(),
  imageUrl: z.string().min(1),
  altText: z.string().optional(),
  mimeType: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const createWordSchema = z.object({
  languageId: uuidSchema,

  text: z.string().trim().min(1).max(300),

  phonetics: z.array(wordPhoneticInputSchema).optional(),

  meanings: z.array(wordMeaningInputSchema).optional(),

  etymologies: z.array(wordEtymologyInputSchema).optional(),

  sources: z.array(wordSourceInputSchema).optional(),

  media: z.array(wordMediaInputSchema).optional(),

  categoryIds: z
    .array(uuidSchema)
    .optional()
    .refine((ids) => ids === undefined || new Set(ids).size === ids.length, {
      message: "Category IDs must be unique",
    }),
});

export const updateWordSchema = createWordSchema.partial().extend({
  version: z.number().int(),
});

export const wordListQuerySchema = z.object({
  page: z.number().int().min(1).default(1),

  limit: z.number().int().min(1).max(100).default(20),

  search: z.string().optional(),

  languageCode: z.string().optional(),
});

export const wordAdminListQuerySchema = wordListQuerySchema.extend({
  isVerified: z.enum(["true", "false"]).optional(),
});

export type WordDefinitionInput = z.infer<typeof wordDefinitionInputSchema>;

export type WordTranslationInput = z.infer<typeof wordTranslationInputSchema>;

export type WordExampleInput = z.infer<typeof wordExampleInputSchema>;

export type WordRelationInput = z.infer<typeof wordRelationInputSchema>;

export type WordMeaningInput = z.infer<typeof wordMeaningInputSchema>;

export type WordPhoneticInput = z.infer<typeof wordPhoneticInputSchema>;

export type WordEtymologyInput = z.infer<typeof wordEtymologyInputSchema>;

export type WordSourceInput = z.infer<typeof wordSourceInputSchema>;

export type WordMediaInput = z.infer<typeof wordMediaInputSchema>;

export type CreateWordInput = z.infer<typeof createWordSchema>;

export type UpdateWordInput = z.infer<typeof updateWordSchema>;

export type WordListQuery = z.infer<typeof wordListQuerySchema>;

export type WordAdminListQuery = z.infer<typeof wordAdminListQuerySchema>;
export const updateWordFormSchema = createWordSchema.extend({
  version: z.number().int(),
});

export type UpdateWordFormValues = z.infer<typeof updateWordFormSchema>;
