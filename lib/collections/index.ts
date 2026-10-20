import type { Collection, SortValue } from "@/lib/collections/types";
import { shopConfig } from "@/lib/config";
import { summarizeText } from "@/lib/content";

export const PRODUCTS_PER_PAGE = 40;
export const ALL_PRODUCTS_HANDLE = "all";

export const SORT_VALUES = [
  "manual",
  "best-selling",
  "title-ascending",
  "title-descending",
  "price-ascending",
  "price-descending",
  "created-ascending",
  "created-descending",
] as const;

export const SEARCH_SORT_EXCLUDE: SortValue[] = [
  "best-selling",
  "created-ascending",
  "created-descending",
  "title-ascending",
  "title-descending",
];

export function describeCollection(collection: Collection): string {
  return (
    summarizeText(collection.seo.description) ||
    summarizeText(collection.description) ||
    `Shop ${collection.title} at ${shopConfig.site.name}: browse products and compare prices.`
  );
}

export function resolveBrowseParams(search: string | URLSearchParams) {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const normalized = new URLSearchParams();
  const sort = params.get("sort_by");
  if (sort && SORT_VALUES.includes(sort as SortValue)) normalized.set("sort_by", sort);
  for (const [key, value] of params) {
    if (key.startsWith("filter.")) normalized.append(key, value);
  }
  return {
    dataSearch: normalized.toString(),
    filters: [],
    sort: SORT_VALUES.includes(sort as SortValue) ? (sort ?? undefined) : undefined,
  };
}

export function getBrowseSort(state: { reverse?: boolean; sortKey?: string }) {
  if (!state.sortKey) return undefined;
  if (state.sortKey === "PRICE") return state.reverse ? "price-descending" : "price-ascending";
  if (state.sortKey === "TITLE") return state.reverse ? "title-descending" : "title-ascending";
  return state.reverse ? "created-descending" : "created-ascending";
}

export function getBrowseSearch(state: {
  filters?: Array<{ key: string; value: string }>;
  reverse?: boolean;
  sortKey?: string;
}) {
  return getBrowseSort(state) ? `sort_by=${getBrowseSort(state)}` : "";
}

export function parseFilterInput(input: string): { key: string; value: string } | undefined {
  try {
    const parsed: unknown = JSON.parse(input);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("key" in parsed) ||
      typeof parsed.key !== "string" ||
      !("value" in parsed) ||
      typeof parsed.value !== "string"
    ) {
      return undefined;
    }
    return { key: parsed.key, value: parsed.value };
  } catch {
    return undefined;
  }
}
