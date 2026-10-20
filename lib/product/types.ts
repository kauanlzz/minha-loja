import type { Image, Video } from "@/lib/media/types";
import type { Money } from "@/lib/money/types";
import type { PageInfo } from "@/lib/pagination/types";
import type { SEO } from "@/lib/seo/types";

export interface ProductCard {
  availableForSale: boolean;
  compareAtPrice?: Money;
  defaultVariantSelectedOptions?: SelectedOption[];
  featuredImage: Image | null;
  handle: string;
  id: string;
  isGiftCard: boolean;
  maxPrice: Money;
  price: Money;
  title: string;
  vendor?: string;
}

export interface ProductDetails extends ProductCard {
  category?: Category | null;
  currencyCode: string;
  defaultVariantSku?: string;
  description: string;
  descriptionHtml: string;
  images: Image[];
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  seo: SEO;
  updatedAt: string;
  variantsCount: number;
  videos: Video[];
}

export interface ProductPage {
  pageInfo: PageInfo;
  products: ProductCard[];
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductOption {
  id: string;
  name: string;
  values: OptionValue[];
}

export interface OptionValue {
  id: string;
  image?: string;
  name: string;
  swatch?: OptionValueSwatch;
}

export interface OptionValueSwatch {
  color?: string;
  image?: string;
}

export interface Category {
  ancestors: Category[];
  id: string;
  name: string;
}

export interface OptionGroupState {
  name: string;
  values: Array<{
    available: boolean;
    crossProduct: boolean;
    exists: boolean;
    href: string;
    image?: string;
    name: string;
    selected: boolean;
    swatch?: OptionValueSwatch;
  }>;
}
