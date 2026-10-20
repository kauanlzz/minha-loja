import { shopConfig } from "@/lib/config";
import type { Money } from "@/lib/money/types";

export function formatCurrencySymbol(
  currencyCode: string,
  locale: string = shopConfig.localization.locale,
): string {
  return (
    new Intl.NumberFormat(locale, { currency: currencyCode, style: "currency" })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currencyCode
  );
}

export function formatPrice(money: Money, locale: string = shopConfig.localization.locale): string {
  const amount = Number(money.amount);
  if (!Number.isFinite(amount)) throw new Error(`Invalid local product price: ${money.amount}`);
  return new Intl.NumberFormat(locale, {
    currency: money.currencyCode,
    style: "currency",
  }).format(amount);
}
