export const languageKeys = {
  all: ["languages"] as const,

  lists: () => [...languageKeys.all, "list"] as const,

  list: () => [...languageKeys.lists()] as const,

  details: () => [...languageKeys.all, "detail"] as const,

  detail: (id: string) => [...languageKeys.details(), id] as const,
};
