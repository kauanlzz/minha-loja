"use client";

import { HandbagIcon } from "lucide-react";

import { useLocalCart } from "@/components/cart/local-cart";
import { Link } from "@/components/ui/link";

export function CartIcon() {
  const { totalQuantity } = useLocalCart();
  return (
    <Link
      aria-label={totalQuantity ? `Cart, ${totalQuantity} items` : "Cart"}
      className="relative flex items-center justify-center gap-1.5 text-foreground"
      href="/cart"
    >
      <HandbagIcon className="size-5" />
      {totalQuantity > 0 ? (
        <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-xs text-background">
          {totalQuantity}
        </span>
      ) : null}
    </Link>
  );
}
