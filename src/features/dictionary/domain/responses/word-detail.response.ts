import type { WordCategoryResponse } from "./word-category.response";
import type {
  WordEtymologyResponse,
  WordLanguageResponse,
  WordMeaningPublicResponse,
  WordMediaResponse,
  WordPhoneticResponse,
  WordSourceResponse,
} from "./word.response";

export interface WordPublicResponse {
  id: string;
  languageId: string;
  text: string;

  language: WordLanguageResponse;
  phonetics: WordPhoneticResponse[];
  meanings: WordMeaningPublicResponse[];
  etymologies: WordEtymologyResponse[];
  sources: WordSourceResponse[];
  media: WordMediaResponse[];
  categories: WordCategoryResponse[];
}
