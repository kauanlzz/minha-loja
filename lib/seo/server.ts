import { getLocalSitemapResources, type SitemapType } from "@/lib/catalog/content";

const SITEMAP_PAGE_SIZE = 500;

export async function getSitemapPagesCount(type: SitemapType): Promise<number> {
  return Math.ceil(getLocalSitemapResources(type).length / SITEMAP_PAGE_SIZE);
}

export async function getSitemapPage(
  type: SitemapType,
  page: number,
): Promise<{ items: Array<{ handle: string; pathname: string; updatedAt: string }> }> {
  const start = Math.max(0, page - 1) * SITEMAP_PAGE_SIZE;
  return {
    items: getLocalSitemapResources(type).slice(start, start + SITEMAP_PAGE_SIZE),
  };
}
