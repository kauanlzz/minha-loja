import type { ShopConfig } from "./types";

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  ? process.env.NEXT_PUBLIC_SITE_URL.trim()
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";
const siteUrl = new URL(defaultUrl);

if (siteUrl.protocol !== "https:" && siteUrl.protocol !== "http:") {
  throw new Error("NEXT_PUBLIC_SITE_URL must use HTTP or HTTPS.");
}

export const shopConfig = {
  localization: {
    locale: "en-US",
  },
  site: {
    description: "Thoughtful everyday objects, designed to be used and enjoyed.",
    name: "Studio Supply",
    url: siteUrl.origin,
  },
} satisfies ShopConfig;
