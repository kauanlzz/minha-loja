import type { Collection, CollectionWithThumbnail } from "@/lib/collections/types";
import type { Image } from "@/lib/media/types";
import type { ProductCard, ProductDetails } from "@/lib/product/types";
import type { SEO } from "@/lib/seo/types";

const currencyCode = "USD";
const updatedAt = "2026-01-01T00:00:00.000Z";

interface ProductSeed {
  category: string;
  description: string;
  handle: string;
  image: string;
  name: string;
  price: number;
  vendor: string;
}

function money(amount: number) {
  return { amount: amount.toFixed(2), currencyCode };
}

function image(path: string, altText: string): Image {
  return { altText, height: 1200, url: path, width: 1200 };
}

function createProduct(seed: ProductSeed): ProductDetails {
  const featuredImage = image(seed.image, seed.name);
  const price = money(seed.price);
  const seo: SEO = {
    description: seed.description,
    title: seed.name,
  };

  return {
    availableForSale: true,
    category: { ancestors: [], id: `local-category-${seed.category}`, name: seed.category },
    currencyCode,
    defaultVariantSku: `LOCAL-${seed.handle.toUpperCase()}`,
    description: seed.description,
    descriptionHtml: seed.description,
    featuredImage,
    handle: seed.handle,
    id: `local-${seed.handle}`,
    images: [featuredImage],
    isGiftCard: false,
    maxPrice: price,
    options: [],
    price,
    priceRange: { maxVariantPrice: price, minVariantPrice: price },
    seo,
    title: seed.name,
    updatedAt,
    variantsCount: 1,
    videos: [],
    vendor: seed.vendor,
  };
}

export const products: ProductDetails[] = [
  createProduct({
    category: "Accessories",
    description: "A sculptural everyday tote in supple cognac leather.",
    handle: "cognac-everyday-tote",
    image: "/products/cognac-tote.svg",
    name: "Cognac Everyday Tote",
    price: 128,
    vendor: "Atelier North",
  }),
  createProduct({
    category: "Home",
    description: "Hand-finished ceramic tableware for slow mornings.",
    handle: "stoneware-mug",
    image: "/products/stoneware-mug.svg",
    name: "Stoneware Mug",
    price: 34,
    vendor: "Still Form",
  }),
  createProduct({
    category: "Apparel",
    description: "A relaxed cotton shirt with an easy, considered fit.",
    handle: "linen-cotton-shirt",
    image: "/products/cotton-shirt.svg",
    name: "Linen Cotton Shirt",
    price: 86,
    vendor: "Common Thread",
  }),
  createProduct({
    category: "Home",
    description: "A warm, cedar-forward candle poured in small batches.",
    handle: "cedar-candle",
    image: "/products/cedar-candle.svg",
    name: "Cedar Candle",
    price: 42,
    vendor: "Sunday Objects",
  }),
  createProduct({
    category: "Accessories",
    description: "A lightweight daily bottle made for life on the move.",
    handle: "everyday-water-bottle",
    image: "/products/water-bottle.svg",
    name: "Everyday Water Bottle",
    price: 38,
    vendor: "Field Notes",
  }),
  createProduct({
    category: "Apparel",
    description: "Soft brushed fleece with a clean, oversized silhouette.",
    handle: "relaxed-fleece-sweatshirt",
    image: "/products/fleece-sweatshirt.svg",
    name: "Relaxed Fleece Sweatshirt",
    price: 94,
    vendor: "Common Thread",
  }),
  createProduct({
    category: "Home",
    description: "A timeless glass vase with a softly rounded profile.",
    handle: "clear-glass-vase",
    image: "/products/glass-vase.svg",
    name: "Clear Glass Vase",
    price: 56,
    vendor: "Still Form",
  }),
  createProduct({
    category: "Accessories",
    description: "A compact leather wallet with room for the essentials.",
    handle: "leather-card-holder",
    image: "/products/card-holder.svg",
    name: "Leather Card Holder",
    price: 48,
    vendor: "Atelier North",
  }),
];

function toProductCard(product: ProductDetails): ProductCard {
  return {
    availableForSale: product.availableForSale,
    featuredImage: product.featuredImage,
    handle: product.handle,
    id: product.id,
    isGiftCard: product.isGiftCard,
    maxPrice: product.maxPrice,
    price: product.price,
    title: product.title,
    vendor: product.vendor,
  };
}

export const productCards = products.map(toProductCard);

const collectionSeeds: Array<{
  description: string;
  handle: string;
  productHandles: string[];
  title: string;
}> = [
  {
    description: "Thoughtful pieces for the places you call home.",
    handle: "home-goods",
    productHandles: ["stoneware-mug", "cedar-candle", "clear-glass-vase"],
    title: "Home Goods",
  },
  {
    description: "Everyday layers, made to be worn on repeat.",
    handle: "everyday-wear",
    productHandles: ["linen-cotton-shirt", "relaxed-fleece-sweatshirt"],
    title: "Everyday Wear",
  },
  {
    description: "Useful details to take with you wherever you go.",
    handle: "daily-carry",
    productHandles: ["cognac-everyday-tote", "everyday-water-bottle", "leather-card-holder"],
    title: "Daily Carry",
  },
];

function collectionFromSeed(seed: (typeof collectionSeeds)[number]): Collection {
  return {
    description: seed.description,
    handle: seed.handle,
    image: null,
    path: `/collections/${seed.handle}`,
    seo: { description: seed.description, title: seed.title },
    title: seed.title,
    updatedAt,
  };
}

export const collections: Collection[] = collectionSeeds.map(collectionFromSeed);

export const collectionListings: CollectionWithThumbnail[] = collectionSeeds.map((seed) => {
  const firstProduct = products.find((product) => product.handle === seed.productHandles[0]);
  return {
    ...collectionFromSeed(seed),
    thumbnail: firstProduct?.featuredImage ?? null,
    thumbnailProductId: firstProduct?.id ?? null,
  };
});

export function getLocalProduct(handle: string): ProductDetails | undefined {
  return products.find((product) => product.handle === handle);
}

export function getLocalCollection(handle: string): Collection | undefined {
  return collections.find((collection) => collection.handle === handle);
}

export function getLocalCollectionProducts(handle: string): ProductCard[] {
  const collection = collectionSeeds.find((item) => item.handle === handle);
  if (!collection) return [];
  return collection.productHandles.flatMap((productHandle) => {
    const product = products.find((item) => item.handle === productHandle);
    return product ? [toProductCard(product)] : [];
  });
}

export function searchLocalProducts(query: string): ProductCard[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return productCards;
  return productCards.filter((product) =>
    `${product.title} ${product.vendor}`.toLocaleLowerCase().includes(normalizedQuery),
  );
}
