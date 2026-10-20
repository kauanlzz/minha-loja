import type { Blog, BlogArticle } from "@/lib/blog/types";
import { getLocalBlog, getLocalBlogArticle } from "@/lib/catalog/content";

export async function getBlog({ handle }: { handle: string }): Promise<Blog | undefined> {
  return getLocalBlog(handle);
}

export async function getBlogArticle({
  articleHandle,
  blogHandle,
}: {
  articleHandle: string;
  blogHandle: string;
}): Promise<BlogArticle | undefined> {
  return getLocalBlogArticle(blogHandle, articleHandle);
}
