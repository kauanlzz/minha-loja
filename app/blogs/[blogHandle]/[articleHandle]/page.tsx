import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArticlePage, ArticlePageSkeleton } from "@/components/blog/article-page";
import { getBlog, getBlogArticle } from "@/lib/blog/server";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { getSitemapPage } from "@/lib/seo/server";

export async function generateStaticParams() {
  const { items } = await getSitemapPage("ARTICLE", 1);
  return items.map((item) => ({
    articleHandle: item.handle,
    blogHandle: item.pathname.split("/")[2],
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[blogHandle]/[articleHandle]">): Promise<Metadata> {
  const { blogHandle, articleHandle } = await params;
  const article = await getBlogArticle({
    articleHandle,
    blogHandle,
  });
  if (!article) notFound();
  const pathname = `/blogs/${article.blogHandle}/${article.handle}`;
  const images = article.image
    ? [
        {
          alt: article.image.altText,
          height: article.image.height,
          url: article.image.url,
          width: article.image.width,
        },
      ]
    : ["/og-default.png"];
  return {
    alternates: buildAlternates({ pathname }),
    description: article.seo.description,
    openGraph: buildOpenGraph({
      description: article.seo.description,
      images,
      title: article.seo.title,
      type: "article",
      url: pathname,
    }),
    title: article.seo.title,
    twitter: {
      card: "summary_large_image",
      description: article.seo.description,
      images,
      title: article.seo.title,
    },
  };
}

export default function BlogArticlePage({
  params,
}: PageProps<"/blogs/[blogHandle]/[articleHandle]">) {
  return (
    <Suspense fallback={<ArticlePageSkeleton />}>
      <BlogArticlePageContent params={params} />
    </Suspense>
  );
}

async function BlogArticlePageContent({
  params,
}: Pick<PageProps<"/blogs/[blogHandle]/[articleHandle]">, "params">) {
  const { blogHandle, articleHandle } = await params;
  const article = await getBlogArticle({
    articleHandle,
    blogHandle,
  });
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
