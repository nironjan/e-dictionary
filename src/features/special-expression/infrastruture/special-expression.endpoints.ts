export const SPECIAL_EXPRESSION_ENDPOINTS = {
  admin: {
    list: "/special-expressions/admin",

    create: "/special-expressions",

    byId: (id: string) => `/special-expressions/admin/${id}`,

    update: (id: string) => `/special-expressions/${id}`,

    delete: (id: string) => `/special-expressions/${id}`,

    verification: (id: string) => `/special-expressions/${id}/verification`,

    translations: {
      create: (expressionId: string) =>
        `/special-expressions/${expressionId}/translations`,

      update: (expressionId: string, translationId: string) =>
        `/special-expressions/${expressionId}/translations/${translationId}`,

      delete: (expressionId: string, translationId: string) =>
        `/special-expressions/${expressionId}/translations/${translationId}`,
    },
  },
} as const;
