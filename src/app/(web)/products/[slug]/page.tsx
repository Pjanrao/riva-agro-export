import { notFound } from "next/navigation";
import { getProducts } from "@/lib/models/Product";
import { getUsdRate } from "@/lib/getUsdRate";
import { ProductDetails } from "@/components/product-details";
import { ProductRecommendations } from "@/components/product-recommendations";
import type { Product } from "@/lib/types";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  const [products, usdRate] = await Promise.all([
    getProducts(),
    getUsdRate(),
  ]);

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(
      (p) =>
        p.categoryName === product.categoryName &&
        p.id !== product.id
    )
    .slice(0, 3);

  return (
    <>
      <ProductDetails product={product} usdRate={usdRate} />
      <ProductRecommendations
        products={relatedProducts}
        usdRate={usdRate}
      />
    </>
  );
}
