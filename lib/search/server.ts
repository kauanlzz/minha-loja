import { searchLocalProducts } from "@/lib/catalog";
import { PRODUCTS_PER_PAGE } from "@/lib/collections";
import type { BrowseResults, BrowseState } from "@/lib/collections/types";

export async function fetchSearchResults({
  query,
  statePromise,
}: {
  query?: string;
  statePromise: Promise<BrowseState>;
}): Promise<BrowseResults> {
  const state = await statePromise;
  let products = searchLocalProducts(query ?? "");
  if (state.sort === "title-ascending")
    products = [...products].sort((a, b) => a.title.localeCompare(b.title));
  if (state.sort === "title-descending")
    products = [...products].sort((a, b) => b.title.localeCompare(a.title));
  if (state.sort === "price-ascending")
    products = [...products].sort((a, b) => Number(a.price.amount) - Number(b.price.amount));
  if (state.sort === "price-descending")
    products = [...products].sort((a, b) => Number(b.price.amount) - Number(a.price.amount));
  return {
    dataSearch: state.dataSearch,
    facets: { filters: [] },
    pageInfo: { endCursor: null, hasNextPage: false, hasPreviousPage: false, startCursor: null },
    products: products.slice(0, PRODUCTS_PER_PAGE),
    source: { query, type: "search" },
    total: products.length,
  };
}
