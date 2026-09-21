import apiClient from "../../../lib/api/api-client";
import type {
  CreateWordDto,
  QueryWordsDto,
  SetVerifiedDto,
  UpdateWordDto,
  WordDetail,
  WordListResponse,
} from "../domain/types/word.types";
import { WORD_ENDPOINTS } from "./word.endpoints";

const ADMIN_WORD_ENDPOINT = WORD_ENDPOINTS.word.admin.words;

function buildQueryString(query: QueryWordsDto): string {
  const searchParams = new URLSearchParams();

  if (query.page !== undefined) {
    searchParams.set("page", String(query.page));
  }

  if (query.limit !== undefined) {
    searchParams.set("limit", String(query.limit));
  }

  if (query.search?.trim()) {
    searchParams.set("search", query.search.trim());
  }

  if (query.languageCode) {
    searchParams.set("languageCode", query.languageCode);
  }

  if (query.isVerified !== undefined) {
    searchParams.set("isVerified", String(query.isVerified));
  }

  if (query.categoryId) {
    searchParams.set("categoryId", query.categoryId);
  }

  const queryString = searchParams.toString();
  return queryString
    ? `${ADMIN_WORD_ENDPOINT}?${queryString}`
    : ADMIN_WORD_ENDPOINT;
}

export const wordApi = {
  list: (query: QueryWordsDto = {}): Promise<WordListResponse> => {
    return apiClient.get<WordListResponse>(buildQueryString(query));
  },

  getById: (id: string): Promise<WordDetail> => {
    return apiClient.get<WordDetail>(WORD_ENDPOINTS.word.admin.word(id));
  },

  create: (dto: CreateWordDto): Promise<WordDetail> => {
    return apiClient.post<WordDetail>(ADMIN_WORD_ENDPOINT, dto);
  },

  update: (id: string, dto: UpdateWordDto): Promise<WordDetail> => {
    return apiClient.patch<WordDetail>(WORD_ENDPOINTS.word.admin.word(id), dto);
  },

  verify: (id: string, dto: SetVerifiedDto): Promise<WordDetail> => {
    return apiClient.patch<WordDetail>(
      WORD_ENDPOINTS.word.admin.verify(id),
      dto,
    );
  },

  remove: (id: string): Promise<void> => {
    return apiClient.delete<void>(WORD_ENDPOINTS.word.admin.word(id));
  },
};
