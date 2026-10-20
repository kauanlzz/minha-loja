import type { Metadata } from "next";

import { CartPageContent } from "@/components/cart/cart-page";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cart",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function CartPage() {
  return <CartPageContent />;
}
