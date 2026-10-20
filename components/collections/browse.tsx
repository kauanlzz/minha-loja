import { Suspense } from "react";

import { ProductCard } from "@/components/product-card/product-card";
import { ProductsGridSkeleton } from "@/components/product/products-grid";
import { PRODUCTS_PER_PAGE } from "@/lib/collections";
import type { BrowseResults } from "@/lib/collections/types";

interface BrowseProps {
  path: string;
  results: Promise<BrowseResults>;
}

interface CollectionResultsProps {
  results: BrowseResults | Promise<BrowseResults>;
}

export function Browse({ path, results }: BrowseProps) {
  return (
    <div className="grid gap-5">
      <Suspense fallback={<BrowseResultsFallback />}>
        <ResolvedResults path={path} results={results} />
      </Suspense>
    </div>
  );
}

export function BrowseResultsFallback() {
  return (
    <ProductsGridSkeleton
      count={PRODUCTS_PER_PAGE}
      className="sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    />
  );
}

export async function CollectionResults({ results }: CollectionResultsProps) {
  const resolved = await results;
  const path =
    resolved.source.type === "collection"
      ? `/collections/${resolved.source.collection}`
      : "/search";
  return <BrowseResultsContent path={path} results={resolved} />;
}

async function ResolvedResults({
  path,
  results,
}: {
  path: string;
  results: Promise<BrowseResults>;
}) {
  return <BrowseResultsContent path={path} results={await results} />;
}

function BrowseResultsContent({ path, results }: { path: string; results: BrowseResults }) {
  const { products, source, total } = results;
  const query = source.type === "search" ? source.query : undefined;
  const selectedSort = new URLSearchParams(results.dataSearch).get("sort_by") ?? "manual";
  if (products.length === 0) {
    return (
      <div className="py-10 text-center">
        <h2 className="mb-2 text-2xl">No products found</h2>
        <p className="text-muted-foreground">
          {query ? `We couldn't find any products matching "${query}"` : "No products available"}
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-5">
      <div className="flex items-center gap-5">
        <p className="text-sm text-muted-foreground">{total ?? products.length} products</p>
        <BrowseSortForm path={path} query={query} selectedSort={selectedSort} />
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} outOfStockText="Out of Stock" />
        ))}
      </div>
    </div>
  );
}

function BrowseSortForm({
  path,
  query,
  selectedSort,
}: {
  path: string;
  query?: string;
  selectedSort: string;
}) {
  return (
    <form action={path} className="ml-auto flex items-center gap-2 text-sm">
      {query ? <input name="q" type="hidden" value={query} /> : null}
      <label htmlFor="sort_by">Sort</label>
      <select
        className="rounded-md border border-border bg-background px-2 py-1.5"
        defaultValue={selectedSort}
        id="sort_by"
        name="sort_by"
      >
        <option value="manual">Featured</option>
        <option value="title-ascending">Name: A to Z</option>
        <option value="title-descending">Name: Z to A</option>
        <option value="price-ascending">Price: low to high</option>
        <option value="price-descending">Price: high to low</option>
      </select>
      <button className="cursor-pointer font-medium" type="submit">
        Apply
      </button>
    </form>
  );
}
