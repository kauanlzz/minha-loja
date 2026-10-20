"use client";

import Image from "next/image";

import { useLocalCart } from "@/components/cart/local-cart";
import { Price } from "@/components/product/price";
import { Button } from "@/components/ui/button";

export function LocalCartLines() {
  const { lines, removeItem, setQuantity } = useLocalCart();
  return (
    <ul className="grid gap-5">
      {lines.map((line, index) => (
        <li className="flex gap-2.5" key={line.handle}>
          <Image
            alt={line.title}
            className="size-18 shrink-0 object-cover"
            height={72}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="100vw"
            src={line.image}
            width={72}
          />
          <div className="grid min-h-18 min-w-0 flex-1 gap-2.5">
            <div className="grid gap-1">
              <p className="line-clamp-1 text-sm font-medium">{line.title}</p>
              <Price amount={line.price.amount} currencyCode={line.price.currencyCode} />
            </div>
            <div className="flex items-center gap-2.5 self-end">
              <button
                aria-label={`Decrease ${line.title} quantity`}
                className="cursor-pointer rounded border px-2"
                onClick={() => setQuantity(line.handle, line.quantity - 1)}
                type="button"
              >
                −
              </button>
              <span aria-live="polite" className="min-w-4 text-center text-sm">
                {line.quantity}
              </span>
              <button
                aria-label={`Increase ${line.title} quantity`}
                className="cursor-pointer rounded border px-2"
                onClick={() => setQuantity(line.handle, line.quantity + 1)}
                type="button"
              >
                +
              </button>
              <button
                className="cursor-pointer text-xs text-muted-foreground underline"
                onClick={() => removeItem(line.handle)}
                type="button"
              >
                Remove
              </button>
            </div>
          </div>
          <Price
            amount={(Number(line.price.amount) * line.quantity).toFixed(2)}
            className="text-sm"
            currencyCode={line.price.currencyCode}
          />
        </li>
      ))}
    </ul>
  );
}

export function LocalCartSummary() {
  const { totalAmount } = useLocalCart();
  return (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between text-base">
        <span>Estimated total</span>
        <Price
          amount={totalAmount.amount}
          className="text-xl font-medium"
          currencyCode={totalAmount.currencyCode}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Demonstration cart only. Checkout and payment are unavailable.
      </p>
      <Button className="h-12 w-full" disabled type="button">
        Checkout unavailable
      </Button>
    </div>
  );
}
