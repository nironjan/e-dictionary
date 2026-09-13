"use client";

import { useQuery } from "@tanstack/react-query";
import { languageKeys } from "../query-kyes/language.query-keys";
import { languageApi } from "../../infrastructure/language.api";

export function useLanguages() {
  return useQuery({
    queryKey: languageKeys.lists(),
    queryFn: () => languageApi.lists(),
  });
}

export function useLanguage(id: string) {
  return useQuery({
    queryKey: languageKeys.detail(id),
    queryFn: () => languageApi.getById(id),
    enabled: Boolean(id),
  });
}

// export function useDefaultLanguageQuery() {
//   return useQuery({
//     queryKey: languageKeys.lists(),
//     queryFn: () => languageApi.lists(),
//     staleTime: Infinity,
//     select: (languages: LanguagePublic[]): LanguagePublic | undefined => {
//       if (languages.length === 0) return undefined;

//       const byCode = languages.find((l) => l.code === "en");
//       if (byCode) return byCode;

//       const bySlug = languages.find((l) => l.slug === "english");
//       if (bySlug) return bySlug;

//       return languages[0];
//     },
//   });
// }
