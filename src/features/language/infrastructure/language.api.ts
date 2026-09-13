import apiClient from "../../../lib/api/api-client";
import type {
  CreateLanguageInput,
  Language,
  UpdateLanguageInput,
} from "../domain/types/language.type";
import { LANGUAGE_ENDPOINTS } from "./language.endpoints";

export const languageApi = {
  lists(): Promise<Language[]> {
    return apiClient.get<Language[]>(LANGUAGE_ENDPOINTS.admin.list);
  },

  getById(id: string): Promise<Language> {
    return apiClient.get<Language>(LANGUAGE_ENDPOINTS.admin.byId(id));
  },

  crerate(input: CreateLanguageInput): Promise<Language> {
    return apiClient.post<Language>(LANGUAGE_ENDPOINTS.admin.create, input);
  },
  update(id: string, input: UpdateLanguageInput): Promise<Language> {
    return apiClient.patch<Language>(
      LANGUAGE_ENDPOINTS.admin.update(id),
      input,
    );
  },
  delete(id: string): Promise<void> {
    return apiClient.delete<void>(LANGUAGE_ENDPOINTS.admin.delete(id));
  },
};
