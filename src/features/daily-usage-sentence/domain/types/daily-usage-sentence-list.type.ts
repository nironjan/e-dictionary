export type DailyUsageSentenceActiveFilter = "all" | "active" | "inactive";

export type DailyUsageSentenceVerifiedFilter =
  | "all"
  | "verified"
  | "unverified";

export interface DailyUsageSentenceListFilters {
  search: string;
  activation: DailyUsageSentenceActiveFilter;
  verification: DailyUsageSentenceVerifiedFilter;
}
