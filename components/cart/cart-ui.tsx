"use client";

import { XIcon } from "lucide-react";

import { useLocalCart } from "@/components/cart/local-cart";
import { LocalCartLines, LocalCartSummary } from "@/components/cart/local-cart-presentation";
import { Link } from "@/components/ui/link";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";

export function CartUI() {
  const { closeCart, isCartOpen, lines, openCart } = useLocalCart();
  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <SheetContent
        closeButton={false}
        className="overflow-y-auto bg-background p-5 shadow-xl"
        side="right"
      >
        <header className="flex items-center justify-between">
          <SheetTitle className="text-xl font-medium">Cart</SheetTitle>
          <SheetClose
            aria-label="Close cart"
            className="cursor-pointer rounded-full p-2 hover:bg-muted"
          >
            <XIcon className="size-5" />
          </SheetClose>
        </header>
        {lines.length ? (
          <>
            <LocalCartLines />
            <div className="mt-auto grid gap-4">
              <LocalCartSummary />
              <Link className="text-center text-sm underline" href="/cart" onClick={closeCart}>
                View cart
              </Link>
            </div>
          </>
        ) : (
          <div className="grid flex-1 content-center justify-items-center gap-4">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <button className="cursor-pointer underline" onClick={closeCart} type="button">
              Continue shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
