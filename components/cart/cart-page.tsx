"use client";

import { useLocalCart } from "@/components/cart/local-cart";
import { LocalCartLines, LocalCartSummary } from "@/components/cart/local-cart-presentation";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";

export function CartPageContent() {
  const { hasHydrated, lines, totalQuantity } = useLocalCart();
  if (!hasHydrated) {
    return <div aria-busy="true" className="min-h-80 animate-pulse bg-muted" />;
  }
  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-10 px-5">
        <h1 className="text-2xl sm:text-3xl">Your cart is empty</h1>
        <Link
          href="/collections/all"
          className="inline-flex cursor-pointer items-center justify-center h-12 px-8 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
  return (
    <Page>
      <Container>
        <Sections>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl">Cart</h1>
            <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-sm text-background">
              {totalQuantity}
            </span>
          </div>
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-8 xl:col-span-9">
              <LocalCartLines />
            </div>
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-20">
                <LocalCartSummary />
              </div>
            </aside>
          </div>
        </Sections>
      </Container>
    </Page>
  );
}
