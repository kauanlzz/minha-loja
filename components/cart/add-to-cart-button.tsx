"use client";

import { useState } from "react";

import { useLocalCart } from "@/components/cart/local-cart";
import { Button } from "@/components/ui/button";
import type { Money } from "@/lib/money/types";

export function AddToCartButton({
  product,
}: {
  product: { handle: string; image: string; price: Money; title: string };
}) {
  const { addItem, openCart } = useLocalCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    openCart();
  }

  return (
    <Button className="h-12 w-full justify-center" onClick={handleAdd} type="button">
      {added ? "Added to cart" : "Add to cart"}
    </Button>
  );
}
