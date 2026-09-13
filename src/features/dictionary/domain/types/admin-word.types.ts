import type {
  WordEtymologyInput,
  WordMeaningInput,
  WordMediaInput,
  WordPhoneticInput,
  WordSourceInput,
  CreateWordInput,
  UpdateWordInput,
} from "../schema/word.schema";
import type { PartOfSpeech, RelationType } from "../schema/word.schema";

export interface WordPhonetic {
  id: string;
  text: string;
  type: string;
  accent?: string;
  audioUrl?: string;
  sourceUrl?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface WordDefinition {
  id: string;
  languageId: string;
  text: string;
  usageNote?: string;
  sortOrder?: number;
}

export interface WordTranslation {
  id: string;
  languageId: string;
  text: string;
  targetWordId?: string;
  sortOrder?: number;
}

export interface WordExample {
  id: string;
  languageId: string;
  text: string;
  translationId?: string;
  sortOrder?: number;
}

export interface WordRelation {
  id: string;
  relationType: RelationType;
  relatedMeaningId: string;
  sortOrder?: number;
}

export interface WordMeaning {
  id: string;
  partOfSpeech: PartOfSpeech;
  isArchaic?: boolean;
  sortOrder?: number;
  version: number;
  definitions: WordDefinition[];
  translations: WordTranslation[];
  examples: WordExample[];
  relations: WordRelation[];
}

export interface WordEtymology {
  id: string;
  origin?: string;
  originWord?: string;
  originLanguage?: string;
  description?: string;
  sortOrder?: number;
}

export interface WordSource {
  id: string;
  sourceUrl: string;
  sourceName: string;
  sourceType: string;
  retrievedAt?: string;
}

export interface WordMedia {
  id: string;
  imageUrl: string;
  altText?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface WordDetail {
  id: string;
  languageId: string;
  languageCode?: string;
  languageName?: string;
  text: string;
  phonetics: WordPhoneticInput[];
  meanings: WordMeaningInput[];
  etymologies: WordEtymologyInput[];
  sources: WordSourceInput[];
  media: WordMediaInput[];
  categoryIds: string[];
  version: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type { CreateWordInput, UpdateWordInput };
