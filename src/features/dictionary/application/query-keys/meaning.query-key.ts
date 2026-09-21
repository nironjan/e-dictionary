export const meaningKeys = {
  all: ["meanings"] as const,
  lists: () => [...meaningKeys.all, "list"] as const,
  list: (wordId: string) => [...meaningKeys.lists(), { wordId }] as const,
  details: () => [...meaningKeys.all, "detail"] as const,
  detail: (id: string) => [...meaningKeys.details(), id] as const,
};
