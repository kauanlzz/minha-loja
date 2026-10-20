import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { LocalProductDetail } from "@/components/product-detail/local-product-detail";
import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import { products } from "@/lib/catalog";
import { getProduct } from "@/lib/product/server";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

export function generateStaticParams() {
  return products.map(({ handle }) => ({ handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct({ handle });
  if (!product) notFound();
  const pathname = `/products/${product.handle}`;
  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: buildAlternates({ pathname }),
    openGraph: buildOpenGraph({
      title: product.seo.title,
      description: product.seo.description,
      url: pathname,
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width,
              height: product.featuredImage.height,
              alt: product.featuredImage.altText,
            },
          ]
        : ["/og-default.png"],
    }),
  };
}

export default function ProductPage({ params }: PageProps<"/products/[handle]">) {
  return (
    <Page className="pt-0">
      <Container className="bg-background">
        <Sections>
          <Suspense
            fallback={
              <div aria-busy="true" className="grid gap-10 lg:grid-cols-10 lg:gap-5">
                <div className="aspect-square animate-pulse bg-muted lg:col-span-6" />
                <div className="grid content-start gap-5 lg:col-span-4">
                  <div className="h-8 w-2/3 animate-pulse bg-muted" />
                  <div className="h-5 w-1/3 animate-pulse bg-muted" />
                  <div className="h-12 animate-pulse bg-muted" />
                </div>
              </div>
            }
          >
            <ProductPageContent params={params} />
          </Suspense>
        </Sections>
      </Container>
    </Page>
  );
}

async function ProductPageContent({ params }: Pick<PageProps<"/products/[handle]">, "params">) {
  const { handle } = await params;
  const product = await getProduct({ handle });
  if (!product) notFound();
  return <LocalProductDetail product={product} />;
}
