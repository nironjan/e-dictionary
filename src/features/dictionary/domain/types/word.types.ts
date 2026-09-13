import type { Category } from "../../../category/domain/types/category.type";
import type { Language } from "../../../language/domain/types/language.type";
import {
  Accent,
  PartOfSpeech,
  PhoneticType,
  RelationType,
  SourceType,
} from "./enums/word.enum.types";
export interface Phonetic {
  id?: string;
  wordId?: string;
  text: string;
  type?: PhoneticType;
  accent?: Accent;
  audioUrl?: string;
  sourceUrl?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WordDefinition {
  id?: string;
  text: string;
  usageNote?: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WordTranslation {
  id?: string;
  meaningId?: string;
  languageId: string;
  clientKey?: string;
  text: string;
  targetWordId?: string | null;
  isVerified?: boolean;
  sortOrder?: number;
  language?: Language;
  createdAt?: string;
  updatedAt?: string;
}

export interface WordExample {
  id?: string;
  languageId: string;
  text: string;
  translationId?: string | null;
  translationClientKey?: string;
  isVerified: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WordRelation {
  id?: string;
  relationType: RelationType;
  relatedMeaningId: string;
  sortOrder?: number;
  createdAt?: string;
}

export interface WordMeaning {
  id?: string;
  wordId?: string;
  version?: number;
  partOfSpeech: PartOfSpeech;
  isArchaic?: boolean;
  isVerified?: boolean;
  sortOrder?: number;
  definitions?: WordDefinition[];
  translations?: WordTranslation[];
  examples?: WordExample[];
  relations?: WordRelation[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Etymology {
  id?: string;
  wordId?: string;
  origin: string;
  originWord?: string;
  originLanguage?: string;
  description?: string;
  sortOrder?: number;
  etymologies?: Etymology[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WordSource {
  id?: string;
  wordId?: string;
  sourceUrl?: string;
  sourceName: string;
  sourceType: SourceType;
  retrievedAt?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface WordMedia {
  id?: string;
  wordId?: string;
  imageUrl: string;
  altText?: string;
  mimeType?: string;
  width?: number | null;
  height?: number | null;
  isPrimary?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// export interface WordListItem {
//   id: string;
//   text: string;
//   language: Pick<Language, "id" | "code" | "name">;
//   isVerified: boolean;
//   version: number;
//   updatedAt: string;
// }

export interface WordListItem {
  id: string;
  text: string;

  language: Pick<Language, "id" | "code" | "name">;

  isVerified: boolean;
  version: number;
  updatedAt: string;

  phonetics?: Pick<Phonetic, "id" | "text" | "audioUrl" | "isPrimary">[];

  categories?: Pick<Category, "id" | "name">[];

  meanings?: Pick<WordMeaning, "id" | "partOfSpeech" | "translations">[];
}

export interface WordDetail {
  id: string;
  languageId: string;
  text: string;
  isVerified: boolean;
  normalizedText?: string;
  viewCount?: number;
  version: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  language?: Language;
  phonetics?: Phonetic[];
  meanings?: WordMeaning[];
  etymologies?: Etymology[];
  sources?: WordSource[];
  media?: WordMedia[];
  categories?: Category[];
  categoryIds?: string[];
}

export interface CreateWordDto {
  languageId: string;
  text: string;
  phonetics?: Phonetic[];
  meanings?: WordMeaning[];
  etymologies?: Etymology[];
  sources?: WordSource[];
  media?: WordMedia[];
  categoryIds?: string[];
}

export interface UpdateWordDto extends Partial<CreateWordDto> {
  version: number;
}

export interface QueryWordsDto {
  search?: string;
  languageCode?: string;
  isVerified?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface WordListResponse {
  data: WordListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SetVerifiedDto {
  isVerified: boolean;
}

export interface SetMeaningVerifiedDto {
  isVerified: boolean;
}

export type WordSummary = WordListItem;
