export const AUTH_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",

    google: "/auth/google",
    googleCallback: "/auth/google/callback",
    googleLink: "/auth/google/link",
    me: "/auth/me",
    logout: "/auth/logout",
    logoutAll: "/auth/logout-all",
  },
} as const;
