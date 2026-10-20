import { getLocalPolicies, getLocalPolicy } from "@/lib/catalog/content";
import type { ShopPolicy } from "@/lib/policies/types";

export async function getShopPolicies(): Promise<ShopPolicy[]> {
  return getLocalPolicies();
}

export async function getShopPolicy({
  handle,
}: {
  handle: string;
}): Promise<ShopPolicy | undefined> {
  return getLocalPolicy(handle);
}
