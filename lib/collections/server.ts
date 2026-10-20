import type { Metadata } from "next";

import {
  collections,
  collectionListings,
  getLocalCollection,
  getLocalCollectionProducts,
  productCards,
} from "@/lib/catalog";
import { describeCollection, PRODUCTS_PER_PAGE, resolveBrowseParams } from "@/lib/collections";
import type {
  BrowseResults,
  BrowseState,
  Collection,
  CollectionWithThumbnail,
  SortValue,
} from "@/lib/collections/types";
import { shopConfig } from "@/lib/config";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

export const ALL_PRODUCTS_HANDLE = "all";

export async function getCollections({
  limit,
}: {
  limit?: number;
} = {}): Promise<Collection[]> {
  return limit === undefined ? collections : collections.slice(0, limit);
}

export async function getCollection({
  handle,
}: {
  handle: string;
}): Promise<Collection | undefined> {
  return getLocalCollection(handle);
}

export async function getCollectionsListing({
  limit,
}: {
  limit?: number;
} = {}): Promise<CollectionWithThumbnail[]> {
  return limit === undefined ? collectionListings : collectionListings.slice(0, limit);
}

export async function readBrowseState(
  searchParamsPromise: Promise<Record<string, string | string[] | undefined>>,
): Promise<BrowseState> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParamsPromise)) {
    if (Array.isArray(value)) {
      for (const item of value) searchParams.append(key, item);
    } else if (value !== undefined) {
      searchParams.set(key, value);
    }
  }
  return resolveBrowseParams(searchParams);
}

export async function getCollectionResults({ handle }: { handle: string }): Promise<BrowseResults> {
  const products =
    handle === ALL_PRODUCTS_HANDLE ? productCards : getLocalCollectionProducts(handle);
  return {
    dataSearch: "",
    facets: { filters: [] },
    pageInfo: { endCursor: null, hasNextPage: false, hasPreviousPage: false, startCursor: null },
    products: products.slice(0, PRODUCTS_PER_PAGE),
    source: { collection: handle, type: "collection" },
    total: products.length,
  };
}

export async function getAllProductsResults(): Promise<BrowseResults> {
  return getCollectionResults({ handle: ALL_PRODUCTS_HANDLE });
}

export async function fetchCollectionResults({
  handle,
  statePromise,
}: {
  handle: string;
  statePromise: Promise<BrowseState>;
}): Promise<BrowseResults> {
  const state = await statePromise;
  const results = await getCollectionResults({ handle });
  const sort = state.sort as SortValue | undefined;
  const products = [...results.products];
  if (sort === "title-ascending") products.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "title-descending") products.sort((a, b) => b.title.localeCompare(a.title));
  if (sort === "price-ascending")
    products.sort((a, b) => Number(a.price.amount) - Number(b.price.amount));
  if (sort === "price-descending")
    products.sort((a, b) => Number(b.price.amount) - Number(a.price.amount));
  return { ...results, dataSearch: state.dataSearch, products };
}

export async function getAllProductsCollection(): Promise<Collection> {
  const title = "Products";
  const description = "Browse the complete collection of thoughtfully designed everyday goods.";
  return {
    handle: ALL_PRODUCTS_HANDLE,
    title,
    description,
    image: null,
    path: `/collections/${ALL_PRODUCTS_HANDLE}`,
    seo: {
      description: `Browse every product at ${shopConfig.site.name}.`,
      title,
    },
  };
}

function browseMetadata(handle: string, title: string, description: string): Metadata {
  const url = `/collections/${handle}`;
  return {
    title,
    description,
    alternates: buildAlternates({ pathname: url }),
    openGraph: buildOpenGraph({ title, description, url, type: "website" }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-default.png"],
    },
  };
}

export async function getCollectionMetadata(handle: string): Promise<Metadata> {
  const collection = await getCollection({ handle });
  if (!collection) return browseMetadata(handle, "Collection", "Browse collection products.");
  return browseMetadata(collection.handle, collection.seo.title, describeCollection(collection));
}

export async function getAllProductsMetadata(): Promise<Metadata> {
  return browseMetadata(
    ALL_PRODUCTS_HANDLE,
    "Products",
    describeCollection(await getAllProductsCollection()),
  );
}
