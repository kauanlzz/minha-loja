import type { SelectedOption } from "@/lib/product/types";

export function buildProductUrl(
  handle: string,
  selectedOptions: readonly SelectedOption[],
  base?: URLSearchParams,
): string {
  const searchParams = new URLSearchParams(base);
  for (const option of selectedOptions) {
    searchParams.set(option.name.toLowerCase(), option.value);
  }
  const query = searchParams.toString();
  return query ? `/products/${handle}?${query}` : `/products/${handle}`;
}

export function isMarkedDown(
  amount: string,
  compareAtAmount: string | undefined,
): compareAtAmount is string {
  return compareAtAmount !== undefined && Number(compareAtAmount) > Number(amount);
}
