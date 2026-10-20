import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BlogIndex, BlogIndexSkeleton } from "@/components/blog/blog-index";
import { getBlog } from "@/lib/blog/server";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { getSitemapPage } from "@/lib/seo/server";

export async function generateStaticParams() {
  const { items } = await getSitemapPage("BLOG", 1);
  return items.map(({ handle }) => ({ blogHandle: handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[blogHandle]">): Promise<Metadata> {
  const { blogHandle } = await params;
  const blog = await getBlog({
    handle: blogHandle,
  });
  if (!blog) notFound();
  const pathname = `/blogs/${blog.handle}`;
  return {
    alternates: buildAlternates({ pathname }),
    description: blog.seo.description,
    openGraph: buildOpenGraph({
      description: blog.seo.description,
      title: blog.seo.title,
      type: "website",
      url: pathname,
    }),
    title: blog.seo.title,
  };
}

export default function BlogPage({ params }: PageProps<"/blogs/[blogHandle]">) {
  return (
    <Suspense fallback={<BlogIndexSkeleton />}>
      <BlogPageContent params={params} />
    </Suspense>
  );
}

async function BlogPageContent({ params }: Pick<PageProps<"/blogs/[blogHandle]">, "params">) {
  const { blogHandle } = await params;
  const blog = await getBlog({
    handle: blogHandle,
  });
  if (!blog) notFound();
  return <BlogIndex blog={blog} />;
}
