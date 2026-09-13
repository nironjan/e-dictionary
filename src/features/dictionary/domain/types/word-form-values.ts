import type {
  WordPhoneticInput,
  WordMeaningInput,
  WordEtymologyInput,
  WordSourceInput,
  WordMediaInput,
} from "../schema/word.schema";

export interface WordFormValues {
  id?: string;
  languageId: string;
  text: string;
  phonetics: WordPhoneticInput[];
  meanings: WordMeaningInput[];
  etymologies: WordEtymologyInput[];
  sources: WordSourceInput[];
  media: WordMediaInput[];
  categoryIds: string[];
  version?: number;
}
