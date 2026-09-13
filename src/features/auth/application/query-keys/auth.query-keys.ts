export const authKeys = {
  all: ["auth"] as const,

  me: () => [...authKeys.all, "me"] as const,
  session: () => [...authKeys.all, "session"] as const,
  login: () => [...authKeys.all, "login"] as const,
  register: () => [...authKeys.all, "register"] as const,
} as const;

export const homeKeys = {
  health: ["home", "health"] as const,
} as const;
