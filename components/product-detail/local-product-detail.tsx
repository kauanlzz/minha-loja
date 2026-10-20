import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductMedia } from "@/components/product-detail/product-media";
import { ProductPrice } from "@/components/product-detail/product-price";
import { ProductSchema } from "@/components/product-detail/schema";
import { BreadcrumbSchema } from "@/components/schema/breadcrumb-schema";
import { shopConfig } from "@/lib/config";
import type { ProductDetails } from "@/lib/product/types";

export function LocalProductDetail({ product }: { product: ProductDetails }) {
  return (
    <>
      <ProductSchema
        product={{
          handle: product.handle,
          title: product.title,
          description: product.description,
          images: product.images,
          vendor: product.vendor,
          currencyCode: product.currencyCode,
          priceRange: product.priceRange,
          offerCount: product.variantsCount,
          availableForSale: product.availableForSale,
          sku: product.defaultVariantSku,
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: shopConfig.site.name, path: "/" },
          { name: product.title, path: `/products/${product.handle}` },
        ]}
      />
      <div className="grid gap-10 lg:grid-cols-10 lg:items-start lg:gap-5">
        <ProductMedia
          otherImages={product.images}
          videos={product.videos}
          title={product.title}
          className="lg:col-span-6"
        />
        <div className="grid content-start gap-5 lg:sticky lg:top-20 lg:col-span-4">
          <div className="grid gap-2.5">
            {product.vendor ? (
              <p className="text-sm text-muted-foreground">{product.vendor}</p>
            ) : null}
            <h1 className="text-3xl text-foreground">{product.title}</h1>
            <ProductPrice amount={product.price.amount} currencyCode={product.price.currencyCode} />
          </div>
          <p className="leading-6 text-muted-foreground">{product.description}</p>
          <AddToCartButton
            product={{
              handle: product.handle,
              image: product.featuredImage?.url ?? "",
              price: product.price,
              title: product.title,
            }}
          />
          <p className="text-xs text-muted-foreground">
            Demo storefront: orders and payments are not processed.
          </p>
        </div>
      </div>
    </>
  );
}
