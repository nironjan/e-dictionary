"use client";
import { useState } from "react";
import { Terminal, Copy, Check, ShieldCheck } from "lucide-react";

interface EndpointDef {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  domain: "Languages" | "Categories" | "Words";
  description: string;
  auth: boolean;
}

const ENDPOINTS: EndpointDef[] = [
  // Languages
  {
    method: "GET",
    path: "/api/v1/dictionary/languages",
    domain: "Languages",
    description: "List active public dictionary languages",
    auth: false,
  },
  {
    method: "GET",
    path: "/api/v1/dictionary/languages/:id",
    domain: "Languages",
    description: "Get language details by ID",
    auth: false,
  },
  {
    method: "GET",
    path: "/api/v1/dictionary/admin/languages",
    domain: "Languages",
    description: "Admin query all languages with sort and RTL flags",
    auth: true,
  },
  {
    method: "GET",
    path: "/api/v1/dictionary/admin/languages/:id",
    domain: "Languages",
    description: "Admin fetch single language configuration",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/v1/dictionary/admin/languages",
    domain: "Languages",
    description: "Create new language with ISO code & script",
    auth: true,
  },
  {
    method: "PATCH",
    path: "/api/v1/dictionary/admin/languages/:id",
    domain: "Languages",
    description: "Update language metadata and active status",
    auth: true,
  },
  {
    method: "DELETE",
    path: "/api/v1/dictionary/admin/languages/:id",
    domain: "Languages",
    description: "Delete language from dictionary registry",
    auth: true,
  },

  // Categories
  {
    method: "GET",
    path: "/api/v1/categories",
    domain: "Categories",
    description: "Public category tree and localized labels",
    auth: false,
  },
  {
    method: "GET",
    path: "/api/v1/admin/categories",
    domain: "Categories",
    description: "Admin paginated categories with translation count",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/v1/admin/categories",
    domain: "Categories",
    description: "Create new category topic with optional image",
    auth: true,
  },
  {
    method: "PATCH",
    path: "/api/v1/admin/categories/:id",
    domain: "Categories",
    description: "Update category properties or default language",
    auth: true,
  },
  {
    method: "DELETE",
    path: "/api/v1/admin/categories/:id",
    domain: "Categories",
    description: "Delete category and disassociate words",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/v1/admin/categories/:categoryId/translations",
    domain: "Categories",
    description: "Add localized translation to category",
    auth: true,
  },
  {
    method: "PATCH",
    path: "/api/v1/admin/categories/:categoryId/translations/:id",
    domain: "Categories",
    description: "Update localized category translation",
    auth: true,
  },
  {
    method: "DELETE",
    path: "/api/v1/admin/categories/:categoryId/translations/:id",
    domain: "Categories",
    description: "Remove category translation in specific language",
    auth: true,
  },

  // Words
  {
    method: "GET",
    path: "/api/v1/dictionary/words",
    domain: "Words",
    description: "Public dictionary search by lemma, language & category",
    auth: false,
  },
  {
    method: "GET",
    path: "/api/v1/dictionary/admin/words",
    domain: "Words",
    description: "Admin paginated words query with verification filter",
    auth: true,
  },
  {
    method: "GET",
    path: "/api/v1/dictionary/admin/words/:id",
    domain: "Words",
    description:
      "Get full word detail with nested meanings, phonetics & citations",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/v1/dictionary/admin/words",
    domain: "Words",
    description: "Create word entry with tabbed multi-step DTO payload",
    auth: true,
  },
  {
    method: "PATCH",
    path: "/api/v1/dictionary/admin/words/:id",
    domain: "Words",
    description: "Update word entry and nested linguistic entities",
    auth: true,
  },
  {
    method: "PATCH",
    path: "/api/v1/dictionary/admin/words/:id/verify",
    domain: "Words",
    description: "Toggle lexicographical verification approval status",
    auth: true,
  },
  {
    method: "DELETE",
    path: "/api/v1/dictionary/admin/words/:id",
    domain: "Words",
    description: "Permanently remove word from dictionary index",
    auth: true,
  },
];

export function ApiRoutesExplorer() {
  const [filterDomain, setFilterDomain] = useState<string>("All");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const filtered = ENDPOINTS.filter((ep) =>
    filterDomain === "All" ? true : ep.domain === filterDomain,
  );

  const methodColors: Record<string, string> = {
    GET: "bg-emerald-50 text-emerald-700 border-emerald-200",
    POST: "bg-blue-50 text-blue-700 border-blue-200",
    PATCH: "bg-amber-50 text-amber-700 border-amber-200",
    DELETE: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-zinc-900" />
            <h2 className="text-base font-bold text-zinc-900">
              NestJS Route Mapping Explorer
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            21 mapped endpoints discovered from your NestJS RouterExplorer logs,
            wired with TanStack Query & Zod contracts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["All", "Words", "Categories", "Languages"].map((dom) => (
            <button
              key={dom}
              onClick={() => setFilterDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                filterDomain === dom
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Routes List */}
      <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100 overflow-hidden shadow-xs">
        {filtered.map((ep, idx) => (
          <div
            key={idx}
            className="p-3.5 hover:bg-zinc-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${methodColors[ep.method]}`}
              >
                {ep.method}
              </span>
              <span className="font-mono text-xs font-semibold text-zinc-800">
                {ep.path}
              </span>
              {ep.auth && (
                <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" /> Auth
                </span>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs text-zinc-500">{ep.description}</span>
              <button
                onClick={() => handleCopy(ep.path)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
                title="Copy Path"
              >
                {copiedPath === ep.path ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
