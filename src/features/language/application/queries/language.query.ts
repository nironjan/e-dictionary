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
