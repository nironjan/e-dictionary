"use client";

import {
  BookA,
  Languages,
  FolderTree,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useWords } from "../../../dictionary/application/queries/word.query";
import { useLanguages } from "../../../language/application/queries/language.query";
import { useCategories } from "../../../category/application/queries/category.query";

interface StatsOverviewProps {
  onNavigateToTab?: (tab: string) => void;
}

export function StatsOverview({ onNavigateToTab }: StatsOverviewProps) {
  const { data: wordsRes } = useWords({ limit: 20 });
  const { data: languages = [] } = useLanguages();
  const { data: catRes } = useCategories({
    page: 1,
    limit: 20,
  });

  const words = wordsRes?.data || [];
  const totalWords = wordsRes?.pagination?.total || words.length;
  const verifiedCount = words.filter((w) => w.isVerified).length;
  const unverifiedCount = totalWords - verifiedCount;
  const categoriesCount =
    catRes?.pagination?.total || catRes?.data?.length || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* Words Card */}
      <div
        onClick={() => onNavigateToTab?.("words")}
        className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs hover:border-zinc-300 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">
            Dictionary Words
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
            <BookA className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-900">
            {totalWords}
          </span>
          <span className="text-[11px] text-zinc-500">headwords</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Active lexicon index</span>
        </div>
      </div>

      {/* Verification Queue */}
      <div
        onClick={() => onNavigateToTab?.("words")}
        className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs hover:border-zinc-300 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">
            Verification Status
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-emerald-700">
            {verifiedCount}
          </span>
          <span className="text-[11px] text-zinc-500">verified</span>
          {unverifiedCount > 0 && (
            <span className="ml-auto text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {unverifiedCount} pending
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-zinc-500">
          <Clock className="h-3 w-3 text-zinc-400" />
          <span>Admin review workflow</span>
        </div>
      </div>

      {/* Categories Card */}
      <div
        onClick={() => onNavigateToTab?.("categories")}
        className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs hover:border-zinc-300 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">
            Vocabulary Categories
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <FolderTree className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-900">
            {categoriesCount}
          </span>
          <span className="text-[11px] text-zinc-500">thematic topics</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-600">
          <span>Multilingual translations supported</span>
        </div>
      </div>

      {/* Languages Card */}
      <div
        onClick={() => onNavigateToTab?.("languages")}
        className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-2xs hover:border-zinc-300 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">
            Locales & Scripts
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
            <Languages className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-900">
            {languages.length}
          </span>
          <span className="text-[11px] text-zinc-500">active languages</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
            {languages.map((l) => l.code).join(" • ")}
          </span>
        </div>
      </div>
    </div>
  );
}
