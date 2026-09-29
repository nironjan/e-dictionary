export const DAILY_USAGE_SENTENCE_ENDPOINTS = {
  admin: {
    list: "/daily-usage-sentence/admin",
    create: "/daily-usage-sentence",
    byId: (id: string) => `/daily-usage-sentence/admin/${id}`,
    update: (id: string) => `/daily-usage-sentence/${id}`,
    delete: (id: string) => `/daily-usage-sentence/${id}`,

    translations: {
      create: (sentenceId: string) =>
        `/daily-usage-sentence/${sentenceId}/translations`,

      update: (sentenceId: string, translationId: string) =>
        `/daily-usage-sentence/${sentenceId}/translations/${translationId}`,

      delete: (sentenceId: string, translationId: string) =>
        `/daily-usage-sentence/${sentenceId}/translations/${translationId}`,
    },
  },
} as const;
