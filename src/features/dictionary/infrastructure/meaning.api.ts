import apiClient from "../../../lib/api/api-client";
import type {
  SetMeaningVerifiedDto,
  WordMeaning,
} from "../domain/types/word.types";
import { WORD_ENDPOINTS } from "./word.endpoints";

const ADMIN_MEANING_ENDPOINT = WORD_ENDPOINTS.meaning.admin.meanings;

export interface QueryMeaningsDto {
  wordId: string;
}

function buildQueryString(query: QueryMeaningsDto): string {
  const searchParams = new URLSearchParams();

  if (query.wordId) {
    searchParams.set("wordId", query.wordId);
  }

  const queryString = searchParams.toString();

  return queryString
    ? `${ADMIN_MEANING_ENDPOINT}?${queryString}`
    : ADMIN_MEANING_ENDPOINT;
}

export const meaningApi = {
  list: (query: QueryMeaningsDto): Promise<WordMeaning[]> => {
    return apiClient.get<WordMeaning[]>(buildQueryString(query));
  },

  getById: (id: string): Promise<WordMeaning> => {
    return apiClient.get<WordMeaning>(WORD_ENDPOINTS.meaning.admin.meaning(id));
  },

  verify: (id: string, dto: SetMeaningVerifiedDto): Promise<WordMeaning> => {
    return apiClient.patch<WordMeaning>(
      WORD_ENDPOINTS.meaning.admin.verify(id),
      dto,
    );
  },

  remove: (id: string): Promise<void> => {
    return apiClient.delete<void>(WORD_ENDPOINTS.meaning.admin.meaning(id));
  },
};
