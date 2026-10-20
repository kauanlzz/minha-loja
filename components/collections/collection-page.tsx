import { type ReactNode, Suspense } from "react";

import { BrowseResultsFallback } from "@/components/collections/browse";
import { BreadcrumbSchema } from "@/components/schema/breadcrumb-schema";
import { CollectionSchema } from "@/components/schema/collection-schema";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import { Skeleton } from "@/components/ui/skeleton";
import type { Collection } from "@/lib/collections/types";

interface CollectionLayoutProps {
  children: ReactNode;
  collection: Collection;
  handle: string;
}

export function CollectionLayout({ children, collection, handle }: CollectionLayoutProps) {
  return (
    <Page className="pt-2.5 md:pt-10">
      <Container>
        <Sections className="gap-5">
          <BreadcrumbSchema
            items={[
              { name: "Home", path: "/" },
              { name: collection.title, path: `/collections/${handle}` },
            ]}
          />
          <CollectionSchema
            collection={{ handle, title: collection.title, description: collection.description }}
          />
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl">
              <Link href={`/collections/${handle}`}>{collection.title}</Link>
            </h1>
            {collection.description ? (
              <p className="mt-1 leading-6 text-muted-foreground">{collection.description}</p>
            ) : null}
          </div>
          {children}
        </Sections>
      </Container>
    </Page>
  );
}

export function CollectionBrowseBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<BrowseResultsFallback />}>{children}</Suspense>;
}

export function SearchParamsProbe({ searchParams }: { searchParams: Promise<unknown> }) {
  return (
    <Suspense fallback={null}>
      <SearchParamsRead searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchParamsRead({ searchParams }: { searchParams: Promise<unknown> }) {
  await searchParams;
  return null;
}

export function CollectionDetailSkeleton() {
  return (
    <Page aria-busy="true" className="pt-2.5 md:pt-10">
      <Container>
        <Sections className="gap-5">
          <div className="grid gap-2.5">
            <Skeleton className="h-9 w-64 sm:h-10 md:h-12 md:w-80" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <BrowseResultsFallback />
        </Sections>
      </Container>
    </Page>
  );
}
