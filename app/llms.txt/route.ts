import { getCollections } from "@/lib/collections/server";
import { shopConfig } from "@/lib/config";
import { summarizeText } from "@/lib/content";
import { escapeMarkdown } from "@/lib/markdown";
import { getShopPolicies } from "@/lib/policies/server";

export async function GET(): Promise<Response> {
  const { description, name, url } = shopConfig.site;
  const [collections, policies] = await Promise.all([getCollections(), getShopPolicies()]);
  const collectionLinks = collections.map((collection) => {
    const link = `[${escapeMarkdown(collection.title)}](${url}${collection.path})`;
    const summary = summarizeText(collection.description);
    return summary ? `- ${link}: ${escapeMarkdown(summary)}` : `- ${link}`;
  });
  const policyLinks = policies.map(
    (policy) => `- [${escapeMarkdown(policy.title)}](${url}/policies/${policy.handle})`,
  );

  return new Response(
    `# ${escapeMarkdown(name)}

> ${escapeMarkdown(summarizeText(description))}

Product names, illustrations, prices, collections, and editorial copy on this site are local sample data. The demonstration cart stays in browser storage; there is no checkout, payment, customer account, or external commerce service.

## Browse

- [All products](${url}/collections/all): Browse the full sample catalog.
- [Search](${url}/search): Search local product names and brands.
${collectionLinks.length > 0 ? `\n## Collections\n\n${collectionLinks.join("\n")}\n` : ""}
## Policies

${policyLinks.join("\n")}

## Discovery

- [Sitemap](${url}/sitemap.xml)
- [Robots](${url}/robots.txt)
`,
    {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
