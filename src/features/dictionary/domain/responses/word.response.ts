export enum PartOfSpeech {
  NOUN = "noun",
  VERB = "verb",
  ADJECTIVE = "adjective",
  ADVERB = "adverb",
  PRONOUN = "pronoun",
  PREPOSITION = "preposition",
  CONJUNCTION = "conjunction",
  INTERJECTION = "interjection",
  DETERMINER = "determiner",
  NUMERAL = "numeral",
  OTHER = "other",
}

export enum RelationType {
  SYNONYM = "synonym",
  ANTONYM = "antonym",
}

export interface WordLanguageResponse {
  id: string;
  code: string;
  name: string;
  slug: string;
  nativeName: string;
  isActive: boolean;
  isRtl: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WordPhoneticResponse {
  id: string;
  wordId: string;
  text: string;
  type: string;
  accent: string;
  audioUrl: string | null;
  sourceUrl: string | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WordDefinitionResponse {
  id: string;
  languageId: string;
  text: string;
  usageNote: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WordTranslationResponse {
  id: string;
  meaningId: string;
  languageId: string;
  text: string;
  targetWordId: string | null;
  isVerified: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WordExampleResponse {
  id: string;
  languageId: string;
  text: string;
  translationId: string | null;
  isVerified: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WordRelationResponse {
  id: string;
  relationType: RelationType;
  relatedMeaningId: string;
  sortOrder: number;
  createdAt: string;
}

export interface WordMeaningPublicResponse {
  id: string;
  wordId: string;
  partOfSpeech: PartOfSpeech;
  isArchaic: boolean;
  definitions: WordDefinitionResponse[];
  translations: WordTranslationResponse[];
  examples: WordExampleResponse[];
  relations: WordRelationResponse[];
}

export interface WordMeaningAdminResponse extends WordMeaningPublicResponse {
  isVerified: boolean;
  version: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WordEtymologyResponse {
  id: string;
  wordId: string;
  origin: string | null;
  originWord: string | null;
  originLanguage: string | null;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WordSourceResponse {
  id: string;
  wordId: string;
  sourceUrl: string;
  sourceName: string;
  sourceType: string;
  retrievedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface WordMediaResponse {
  id: string;
  wordId: string;
  imageUrl: string;
  altText: string | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
