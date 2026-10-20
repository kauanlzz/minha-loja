import { NextResponse, type NextRequest } from "next/server";

import { getLocalCollection, getLocalProduct } from "@/lib/catalog";
import {
  getLocalBlog,
  getLocalBlogArticle,
  getLocalContentPage,
  getLocalPolicy,
} from "@/lib/catalog/content";
import { getMarkdownRewritePath } from "@/lib/markdown/representation";

export function proxy(request: NextRequest): Response {
  const rewritePath = getMarkdownRewritePath(request);
  if (rewritePath) {
    return NextResponse.rewrite(new URL(`${rewritePath}${request.nextUrl.search}`, request.url));
  }

  const { pathname } = request.nextUrl;
  const productHandle = /^\/products\/([^.]+)$/.exec(pathname)?.[1];
  const collectionHandle = /^\/collections\/([^/]+)$/.exec(pathname)?.[1];
  const blogPath = /^\/blogs\/([^/]+)(?:\/([^/]+))?$/.exec(pathname);
  const pageHandle = /^\/pages\/([^/]+)$/.exec(pathname)?.[1];
  const policyHandle = /^\/policies\/([^/]+)$/.exec(pathname)?.[1];
  const isRefinePath = /^\/collections\/[^/]+\/refine$/.test(pathname);
  const isInvalidProduct = productHandle !== undefined && !getLocalProduct(productHandle);
  const isInvalidCollection =
    collectionHandle !== undefined &&
    collectionHandle !== "all" &&
    !getLocalCollection(collectionHandle);
  const isInvalidBlog =
    blogPath !== null &&
    (blogPath[2] ? !getLocalBlogArticle(blogPath[1], blogPath[2]) : !getLocalBlog(blogPath[1]));
  const isInvalidPage = pageHandle !== undefined && !getLocalContentPage(pageHandle);
  const isInvalidPolicy = policyHandle !== undefined && !getLocalPolicy(policyHandle);

  if (
    isRefinePath ||
    isInvalidBlog ||
    isInvalidCollection ||
    isInvalidPage ||
    isInvalidPolicy ||
    isInvalidProduct
  ) {
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/data|_vercel|favicon.ico).*)"],
};
