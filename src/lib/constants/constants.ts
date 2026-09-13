export const APP_CONSTANTS = {
  APP_BASE_URL: "http://localhost:3000/api/v1",
  APP_NAME: "e-Dictionary",
  STORAGE_KEYS: {
    ACCESS_TOKEN: "accessToken",
    USER: "user",
    THEME: "theme",
  },
  ROUTES: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    EMAIL_UPDATE: "/email-update",
    VERIFY_OTP: "/verify-otp",
    RESET_PASSWORD: "/reset-password",
    ADMIN: "/admin",
    SETTINGS: "/settings",
    PROFILE: "/profile",

    WORD_LIST: "/dashboard/dictionary/words",
    CREATE_WORD: "/dashboard/dictionary/words/create",
    EDIT_WORD: (id: string) => `/dashboard/dictionary/words/${id}/edit`,
    CATEGORY_LIST: "/dashboard/categories",
    CATEGORY_CREATE: "/dashboard/categories/create",
    CATEGORY_EDIT: (id: string) => `/dashboard/categories/${id}/edit`,

    DASHBOARD: "/admin/dashboard",
    WORD_PHONETICS: (wordId: string) =>
      `/admin/dictionary/words/${wordId}/phonetics`,
    WORD_PHONETIC: (wordId: string) =>
      `/admin/dictionary/words/word-phonetic/${wordId}`,
    WORD_MEANING_CREATE: (wordId: string) =>
      `/admin/dictionary/word-meaning/${wordId}`,
    WORD_DETAIL: (id: string) => `/admin/dictionary/words/${id}`,
    USERS: "/admin/users",
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
  },
} as const;
