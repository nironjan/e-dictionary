import apiClient from "../../../lib/api/api-client";

import type { DailyUsageSentenceFormValues } from "../domain/schemas/daily-usage-sentence.schema";

import type {
  DailyUsageSentence,
  DailyUsageSentenceListResponse,
  DailyUsageSentenceTranslation,
} from "../domain/types/daily-usage-sentence.type";

import type { DailyUsageSentenceListQuery } from "../domain/types/daily-usage-sentence-query.type";

import { buildDailyUsageSentenceQuery } from "./daily-usage-sentence.query";
import { DAILY_USAGE_SENTENCE_ENDPOINTS } from "./daily-usage.endpoint";
import type { DailyUsageSentenceTranslationForm } from "../domain/types/daily-usage-sentence-form.type";

export const dailyUsageSentenceApi = {
  // ---------------------------------------------------------------------------
  // Sentences
  // ---------------------------------------------------------------------------

  async findAll(
    query: DailyUsageSentenceListQuery,
  ): Promise<DailyUsageSentenceListResponse> {
    const params = buildDailyUsageSentenceQuery(query);

    return apiClient.get<DailyUsageSentenceListResponse>(
      DAILY_USAGE_SENTENCE_ENDPOINTS.admin.list,
      {
        params,
      },
    );
  },

  async findOne(id: string): Promise<DailyUsageSentence> {
    return apiClient.get<DailyUsageSentence>(
      DAILY_USAGE_SENTENCE_ENDPOINTS.admin.byId(id),
    );
  },

  async create(
    data: DailyUsageSentenceFormValues,
  ): Promise<DailyUsageSentence> {
    return apiClient.post<DailyUsageSentence>(
      DAILY_USAGE_SENTENCE_ENDPOINTS.admin.create,
      data,
    );
  },

  async update(
    id: string,
    data: DailyUsageSentenceFormValues,
  ): Promise<DailyUsageSentence> {
    return apiClient.patch<DailyUsageSentence>(
      DAILY_USAGE_SENTENCE_ENDPOINTS.admin.update(id),
      data,
    );
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(DAILY_USAGE_SENTENCE_ENDPOINTS.admin.delete(id));
  },

  // ---------------------------------------------------------------------------
  // Translations
  // ---------------------------------------------------------------------------

  async addTranslation(
    sentenceId: string,
    data: DailyUsageSentenceTranslationForm,
  ): Promise<DailyUsageSentenceTranslation> {
    return apiClient.post<DailyUsageSentenceTranslation>(
      DAILY_USAGE_SENTENCE_ENDPOINTS.admin.translations.create(sentenceId),
      data,
    );
  },

  async updateTranslation(
    sentenceId: string,
    translationId: string,
    data: DailyUsageSentenceTranslationForm,
  ): Promise<DailyUsageSentenceTranslation> {
    return apiClient.patch<DailyUsageSentenceTranslation>(
      DAILY_USAGE_SENTENCE_ENDPOINTS.admin.translations.update(
        sentenceId,
        translationId,
      ),
      data,
    );
  },

  async removeTranslation(
    sentenceId: string,
    translationId: string,
  ): Promise<void> {
    await apiClient.delete(
      DAILY_USAGE_SENTENCE_ENDPOINTS.admin.translations.delete(
        sentenceId,
        translationId,
      ),
    );
  },
};
