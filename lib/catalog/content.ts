import type { Blog, BlogArticle } from "@/lib/blog/types";
import { collections, products } from "@/lib/catalog";
import type { ContentPage } from "@/lib/pages/types";
import type { ShopPolicy } from "@/lib/policies/types";

const journalHandle = "journal";

const articles: BlogArticle[] = [
  {
    author: "Studio Supply",
    blogHandle: journalHandle,
    blogTitle: "The Journal",
    body: "<p>A considered home is built slowly. Start with objects you use every day, choose materials that age well, and leave room for the things that make a space your own.</p>",
    excerpt: "Small rituals and useful objects can make everyday spaces feel more personal.",
    handle: "making-room-for-the-everyday",
    image: {
      altText: "Ceramic mug and candle on a quiet table",
      height: 1200,
      url: "/products/stoneware-mug.svg",
      width: 1200,
    },
    publishedAt: "2026-02-12T09:00:00.000Z",
    seo: {
      description: "Ideas for creating a thoughtful home with useful everyday objects.",
      title: "Making room for the everyday",
    },
    title: "Making room for the everyday",
  },
  {
    author: "Studio Supply",
    blogHandle: journalHandle,
    blogTitle: "The Journal",
    body: "<p>The best carry pieces are simple, durable, and easy to reach for. A small set of thoughtful essentials can move comfortably from a busy morning to a slower afternoon.</p>",
    excerpt: "A few well-made essentials go a long way, wherever the day takes you.",
    handle: "carry-less-choose-well",
    image: {
      altText: "Cognac leather tote",
      height: 1200,
      url: "/products/cognac-tote.svg",
      width: 1200,
    },
    publishedAt: "2026-01-24T09:00:00.000Z",
    seo: {
      description: "A short guide to choosing useful, durable everyday accessories.",
      title: "Carry less, choose well",
    },
    title: "Carry less, choose well",
  },
];

const blog: Blog = {
  articles,
  handle: journalHandle,
  seo: {
    description: "Notes on thoughtful spaces, useful objects, and daily rituals.",
    title: "The Journal",
  },
  title: "The Journal",
};

const pages: ContentPage[] = [
  {
    body: "<p>Studio Supply brings together useful, well-made pieces for everyday life. Our fictional collection is a local demonstration catalog; products and prices are sample data.</p>",
    handle: "about",
    seo: {
      description: "Learn about Studio Supply and our locally curated demonstration catalog.",
      title: "About Studio Supply",
    },
    title: "About Studio Supply",
  },
  {
    body: "<p>This storefront is a visual demo. It does not accept orders, process payments, or collect customer account information.</p><h2>Where do products ship?</h2><p>No shipping is available because checkout is disabled in this demo.</p>",
    handle: "faq",
    seo: {
      description: "Answers about the Studio Supply demonstration storefront.",
      title: "Frequently asked questions",
    },
    title: "Frequently asked questions",
  },
];

const policies: ShopPolicy[] = [
  {
    body: "<p>Studio Supply is a demonstration storefront. No orders are submitted and no products are shipped.</p>",
    handle: "shipping",
    title: "Shipping policy",
  },
  {
    body: "<p>Because this is a local product demo with no checkout, no purchases or returns are processed.</p>",
    handle: "refund",
    title: "Returns policy",
  },
  {
    body: "<p>The storefront stores cart items in your browser's local storage only. It does not send cart details or customer data to a commerce service.</p>",
    handle: "privacy",
    title: "Privacy policy",
  },
];

export function getLocalBlog(handle: string): Blog | undefined {
  return handle === blog.handle ? blog : undefined;
}

export function getLocalBlogArticle(
  blogHandle: string,
  articleHandle: string,
): BlogArticle | undefined {
  return blogHandle === blog.handle
    ? articles.find((article) => article.handle === articleHandle)
    : undefined;
}

export function getLocalContentPage(handle: string): ContentPage | undefined {
  return pages.find((page) => page.handle === handle);
}

export function getLocalPolicy(handle: string): ShopPolicy | undefined {
  return policies.find((policy) => policy.handle === handle);
}

export function getLocalPolicies(): ShopPolicy[] {
  return policies;
}

export function getLocalSitemapResources(type: SitemapType) {
  if (type === "ARTICLE") {
    return articles.map((article) => ({
      handle: article.handle,
      pathname: `/blogs/${article.blogHandle}/${article.handle}`,
      updatedAt: article.publishedAt,
    }));
  }
  if (type === "BLOG") {
    return [
      {
        handle: blog.handle,
        pathname: `/blogs/${blog.handle}`,
        updatedAt: "2026-02-12T09:00:00.000Z",
      },
    ];
  }
  if (type === "COLLECTION") {
    return collectionsForSitemap();
  }
  if (type === "PAGE") {
    return pages.map((page) => ({
      handle: page.handle,
      pathname: `/pages/${page.handle}`,
      updatedAt: "2026-01-01T00:00:00.000Z",
    }));
  }
  return productsForSitemap();
}

export type SitemapType = "ARTICLE" | "BLOG" | "COLLECTION" | "PAGE" | "PRODUCT";

function collectionsForSitemap() {
  return [
    { handle: "all", pathname: "/collections/all", updatedAt: "2026-01-01T00:00:00.000Z" },
    ...collections.map((collection) => ({
      handle: collection.handle,
      pathname: collection.path,
      updatedAt: collection.updatedAt ?? "2026-01-01T00:00:00.000Z",
    })),
  ];
}

function productsForSitemap() {
  return products.map((product) => ({
    handle: product.handle,
    pathname: `/products/${product.handle}`,
    updatedAt: "2026-01-01T00:00:00.000Z",
  }));
}
