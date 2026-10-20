import type { Metadata } from "next";
import { Suspense } from "react";

import { Browse } from "@/components/collections/browse";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import { readBrowseState } from "@/lib/collections/server";
import { fetchSearchResults } from "@/lib/search/server";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(searchParams: SearchParams, key: string): string | undefined {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const resolved = await searchParams;
  const query = getParam(resolved, "q") ?? "";
  const title = query ? `Search results for "${query}"` : "Search";
  const description = query ? `Find products matching "${query}"` : "Search local products";
  return {
    title,
    description,
    alternates: {
      canonical: buildAlternates({ pathname: "/search", searchParams: resolved })?.canonical,
    },
    openGraph: buildOpenGraph({ title, description, url: "/search", type: "website" }),
    robots: { index: false, follow: false },
  };
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Page className="pt-2.5 md:pt-10">
      <Container>
        <Sections className="gap-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl">
            <Link href="/search">Search</Link>
            <Suspense fallback={null}>
              <SearchQueryLabel searchParams={searchParams} />
            </Suspense>
          </h1>
          <Suspense fallback={<div aria-busy="true" className="h-80 animate-pulse bg-muted" />}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </Sections>
      </Container>
    </Page>
  );
}

async function SearchResults({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const state = readBrowseState(searchParams);
  const query = getParam(await searchParams, "q") ?? "";
  return (
    <>
      <form action="/search" className="flex gap-2">
        <input
          aria-label="Search products"
          className="h-11 min-w-0 flex-1 rounded-md border border-border bg-background px-3"
          defaultValue={query}
          name="q"
          placeholder="Search products"
          type="search"
        />
        <button
          className="cursor-pointer rounded-md bg-primary px-5 text-primary-foreground"
          type="submit"
        >
          Search
        </button>
      </form>
      <Browse path="/search" results={fetchSearchResults({ query, statePromise: state })} />
    </>
  );
}

async function SearchQueryLabel({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = getParam(await searchParams, "q");
  return query ? ` for "${query}"` : null;
}
