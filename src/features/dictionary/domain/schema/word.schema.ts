import { z } from "zod";
import {
  Accent,
  PartOfSpeech,
  PhoneticType,
  RelationType,
  SourceType,
} from "../types/enums/word.enum.types";

export const phoneticSchema = z.object({
  id: z.string().optional(),
  text: z
    .string()
    .min(1, "Phonetic text is required")
    .max(200, "Max 200 characters"),
  type: z.nativeEnum(PhoneticType).optional().default(PhoneticType.IPA),
  accent: z.nativeEnum(Accent).optional().default(Accent.GENERIC),
  audioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  sourceUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isPrimary: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const definitionSchema = z.object({
  id: z.string().optional(),
  text: z
    .string()
    .min(1, "Definition text is required")
    .max(2000, "Max 2000 characters"),
  usageNote: z.string().optional(),
  sortOrder: z.number().int().optional().default(0),
});

export const translationSchema = z.object({
  id: z.string().optional(),
  clientKey: z.string().optional(),
  languageId: z.string().min(1, "Target language is required"),
  text: z
    .string()
    .min(1, "Translation text is required")
    .max(300, "Max 300 characters"),
  targetWordId: z.string().optional(),
  isVerified: z.boolean().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const exampleSchema = z.object({
  id: z.string().optional(),
  languageId: z.string().min(1, "Example language is required"),
  text: z
    .string()
    .min(1, "Example text is required")
    .max(1000, "Max 1000 characters"),
  translationId: z.string().nullable().optional(),
  translationClientKey: z.string().optional(),
  sortOrder: z.number().int().optional().default(0),
  isVerified: z.boolean().default(false),
});

export const relationSchema = z.object({
  id: z.string().optional(),
  relationType: z
    .nativeEnum(RelationType)
    .optional()
    .default(RelationType.SYNONYM),
  relatedMeaningId: z.string().min(1, "Related meaning ID is required"),
  sortOrder: z.number().int().optional().default(0),
});

export const meaningSchema = z.object({
  id: z.string().optional(),
  version: z.number().int().optional(),
  partOfSpeech: z.nativeEnum(PartOfSpeech),
  isArchaic: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
  definitions: z
    .array(definitionSchema)
    .max(20, "Max 20 definitions per meaning")
    .default([]),
  translations: z
    .array(translationSchema)
    .max(30, "Max 30 translations per meaning")
    .default([]),
  examples: z
    .array(exampleSchema)
    .max(30, "Max 30 examples per meaning")
    .default([]),
  relations: z
    .array(relationSchema)
    .max(40, "Max 40 relations per meaning")
    .default([]),
});

export const etymologySchema = z.object({
  id: z.string().optional(),
  origin: z.string().min(1, "Origin root/source is required").max(200),
  originWord: z.string().optional(),
  originLanguage: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.number().int().optional().default(0),
});

export const sourceSchema = z.object({
  id: z.string().optional(),
  sourceName: z.string().min(1, "Source name is required").max(200),
  sourceType: z
    .nativeEnum(SourceType)
    .optional()
    .default(SourceType.DICTIONARY),
  sourceUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const mediaSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL"),
  altText: z.string().max(300).optional(),
  mimeType: z.string().optional(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  isPrimary: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const createWordSchema = z.object({
  languageId: z.string().min(1, "Language is required"),
  text: z
    .string()
    .min(1, "Word text is required")
    .max(300, "Max 300 characters"),
  phonetics: z.array(phoneticSchema).default([]),
  meanings: z.array(meaningSchema).default([]),
  etymologies: z.array(etymologySchema).default([]),
  sources: z.array(sourceSchema).default([]),
  media: z.array(mediaSchema).default([]),
  categoryIds: z.array(z.string()).default([]),
});

export const updateWordSchema = createWordSchema.partial().extend({
  version: z.number().int().optional(),
});

export type CreateWordFormData = z.infer<typeof createWordSchema>;
export type UpdateWordFormData = z.infer<typeof updateWordSchema>;
