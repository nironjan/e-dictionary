export const LANGUAGE_ENDPOINTS = {
  admin: {
    list: "/dictionary/admin/languages",
    create: "/dictionary/admin/languages",
    byId: (id: string) => `/dictionary/admin/languages/${id}`,
    update: (id: string) => `/dictionary/admin/languages/${id}`,
    delete: (id: string) => `/dictionary/admin/languages/${id}`,
  },
} as const;
