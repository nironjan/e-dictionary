export const CATEGORY_ENDPOINTS = {
  admin: {
    list: "/admin/categories",
    create: "/admin/categories",
    byId: (id: string) => `/admin/categories/${id}`,
    update: (id: string) => `/admin/categories/${id}`,
    delete: (id: string) => `/admin/categories/${id}`,

    translations: {
      list: (categoryId: string) =>
        `/admin/categories/${categoryId}/translations`,
      create: (categoryId: string) =>
        `/admin/categories/${categoryId}/translations`,
      update: (categoryId: string, translationId: string) =>
        `/admin/categories/${categoryId}/translations/${translationId}`,
      delete: (categoryId: string, translationId: string) =>
        `/admin/categories/${categoryId}/translations/${translationId}`,
    },
  },
} as const;
