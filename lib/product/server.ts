import { getLocalProduct, productCards, products } from "@/lib/catalog";
import type { ProductCard, ProductDetails, ProductPage } from "@/lib/product/types";

export async function getProduct({
  handle,
}: {
  handle: string;
}): Promise<ProductDetails | undefined> {
  return getLocalProduct(handle);
}

export async function getSearchIndexProducts({
  limit = productCards.length,
}: {
  limit?: number;
} = {}): Promise<ProductPage> {
  const page = productCards.slice(0, limit);
  return {
    pageInfo: {
      endCursor: null,
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
    },
    products: page,
  };
}

export async function getProductRecommendations({
  handle,
  intent: _intent,
  limit = 4,
}: {
  handle: string;
  intent?: string;
  limit?: number;
}): Promise<ProductCard[]> {
  return products
    .filter((product) => product.handle !== handle)
    .slice(0, limit)
    .map(
      ({
        availableForSale,
        featuredImage,
        handle: productHandle,
        id,
        isGiftCard,
        maxPrice,
        price,
        title,
        vendor,
      }) => ({
        availableForSale,
        featuredImage,
        handle: productHandle,
        id,
        isGiftCard,
        maxPrice,
        price,
        title,
        vendor,
      }),
    );
}
