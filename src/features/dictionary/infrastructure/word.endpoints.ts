export const WORD_ENDPOINTS = {
  word: {
    public: {
      words: "/dictionary/words",
      word: (id: string) => `/dictionary/words/${id}`,
    },
    admin: {
      words: "/dictionary/admin/words",
      word: (id: string) => `/dictionary/admin/words/${id}`,
      verify: (id: string) => `/dictionary/admin/words/${id}/verify`,
    },
  },
  meaning: {
    admin: {
      meanings: "/dictionary/admin/meanings",
      meaning: (id: string) => `/dictionary/admin/meanings/${id}`,
      verify: (id: string) => `/dictionary/admin/meanings/${id}/verify`,
    },
  },
} as const;
