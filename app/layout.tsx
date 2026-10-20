import type { Metadata, Viewport } from "next";

import "./globals.css";

import { CartUI } from "@/components/cart/cart-ui";
import { LocalCartProvider } from "@/components/cart/local-cart";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { SiteSchema } from "@/components/schema/site-schema";
import { shopConfig } from "@/lib/config";
import { buildAlternates } from "@/lib/seo";

export const ensureStatic = "prefetch";

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={shopConfig.localization.locale}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-background focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-foreground focus:outline-none"
        >
          Skip to content
        </a>
        <SiteSchema />

        <LocalCartProvider>
          <Nav />
          <main id="main-content" className="flex flex-1 flex-col min-w-0">
            {children}
          </main>
          <Footer />
          <CartUI />
        </LocalCartProvider>
      </body>
    </html>
  );
}

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    alternates: buildAlternates({ pathname: "/" }),
    description: `Shop premium products, curated collections, and latest offers from ${shopConfig.site.name}.`,
    generator: shopConfig.site.name,
    metadataBase: new URL(shopConfig.site.url),
    openGraph: {
      images: [{ url: "/og-default.png", width: 1200, height: 628 }],
    },
    title: {
      default: shopConfig.site.name,
      template: `%s | ${shopConfig.site.name}`,
    },
  };
};
