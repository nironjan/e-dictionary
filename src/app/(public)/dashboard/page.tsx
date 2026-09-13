"use client";
import { useState } from "react";
import { StatsOverview } from "../../../features/dashboard/presentation/components/stats-overview";
import { BookA, FolderTree, Languages, Terminal } from "lucide-react";
import { WordList } from "../../../features/dictionary/presentation/components/word/word-list";
import { CategoryList } from "../../../features/category/presentation/components/category-list";
import { LanguageList } from "../../../features/language/presentation/components/language-list";
import { ApiRoutesExplorer } from "../../../features/api-doc/components/api-routes";

export default function DashboardPage() {
  type NavigationSection = "words" | "categories" | "languages" | "api-routes";

  const [activeSection, setActiveSection] =
    useState<NavigationSection>("words");

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 font-sans flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Summary Metrics */}
        <StatsOverview
          onNavigateToTab={(tab) => setActiveSection(tab as NavigationSection)}
        />

        {/* Primary View Navigation Bar */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 mb-6">
          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveSection("words")}
              className={`flex items-center gap-2 pb-3 pt-1 px-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeSection === "words"
                  ? "border-zinc-900 text-zinc-900 font-semibold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
              }`}
            >
              <BookA className="h-4 w-4" />
              <span>Words & Meanings</span>
            </button>

            <button
              onClick={() => setActiveSection("categories")}
              className={`flex items-center gap-2 pb-3 pt-1 px-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeSection === "categories"
                  ? "border-zinc-900 text-zinc-900 font-semibold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
              }`}
            >
              <FolderTree className="h-4 w-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveSection("languages")}
              className={`flex items-center gap-2 pb-3 pt-1 px-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeSection === "languages"
                  ? "border-zinc-900 text-zinc-900 font-semibold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
              }`}
            >
              <Languages className="h-4 w-4" />
              <span>Languages & Scripts</span>
            </button>

            <button
              onClick={() => setActiveSection("api-routes")}
              className={`flex items-center gap-2 pb-3 pt-1 px-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeSection === "api-routes"
                  ? "border-zinc-900 text-zinc-900 font-semibold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>NestJS Router</span>
            </button>
          </nav>
        </div>

        {/* Dynamic View Mount */}
        <div>
          {activeSection === "words" && <WordList />}
          {activeSection === "categories" && <CategoryList />}
          {activeSection === "languages" && <LanguageList />}
          {activeSection === "api-routes" && <ApiRoutesExplorer />}
        </div>
      </main>
    </div>
  );
}
