import { shopConfig } from "@/lib/config";
import { escapeMarkdown, markdownFrontmatter } from "@/lib/markdown";

export function searchToMarkdown(query: string | undefined): string {
  const siteUrl = shopConfig.site.url;
  const term = query?.trim();
  const shopPath = term ? `/search?q=${encodeURIComponent(term)}` : "/search";
  const title = term ? `Search: ${term}` : "Search";
  const description = "Search the local sample catalog.";

  return [
    markdownFrontmatter({
      canonicalUrl: new URL(shopPath, siteUrl).toString(),
      description,
      title,
    }),
    "",
    `# ${escapeMarkdown(title)}`,
    "",
    description,
    "",
    "## Search",
    "",
    `- Browse products: ${new URL(shopPath, siteUrl)}`,
    "- Product names, images, and prices are local sample data.",
  ].join("\n");
}
