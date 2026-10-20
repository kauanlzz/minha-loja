# Studio Supply

A Next.js storefront demo backed entirely by local sample data. The catalog, collections, editorial pages, policies, and sitemap are served from files in the repository. Product illustrations are stored in `public/products/`.

The cart is a browser-only demonstration saved in local storage. Checkout, payment processing, customer accounts, and external commerce integrations are not available.

## Development

Requires Node.js 24 and pnpm 12.

```sh
pnpm install
pnpm dev
```

No API keys or external service credentials are required.

Set `NEXT_PUBLIC_SITE_URL` to the site's public origin when deploying outside Vercel. It is used for canonical URLs, metadata, and sitemaps. The default build output is `.next-build/` so it does not conflict with OneDrive-managed `.next/` placeholders.

## Local catalog

- Product and collection fixtures: `lib/catalog/index.ts`
- Editorial, page, and policy fixtures: `lib/catalog/content.ts`
- Product images: `public/products/`
