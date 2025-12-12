"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/useAuth";
import ProductReviews from "@/components/ui/reviews/product-reviews";
import { useProduct } from "@/hooks/useProduct";
import { ProductLoading } from "@/components/ui/products/products-loading";
import { ProductNotFound } from "@/components/ui/products/product-not-found";
import { BackButton } from "@/components/ui/products/back-button";
import { ProductHeader } from "@/components/ui/products/product-header";
import { ProductRating } from "@/components/ui/products/product-rating";
import { ProductDetails } from "@/components/ui/products/product-details";
import { ProductTags } from "@/components/ui/products/product-tags";
import { ProductQuantity } from "@/components/ui/products/product-quantity";
import { BuyButton } from "@/components/ui/products/buy-button";
import { RelatedProducts } from "@/components/ui/products/related-products";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const productId = params.id as string;

  const { product, loading, quantity, setQuantity, formatPrice } = useProduct({
    productId,
  });

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/checkout?product=${productId}`);
      return;
    }
    if (!product) return;
    
    router.push(`/checkout?product=${productId}&quantity=${quantity}`);
  };

  if (loading) {
    return <ProductLoading />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BackButton />

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <ProductHeader product={product} formatPrice={formatPrice} />
              
              <ProductRating rating={product.rating} reviews={product.reviews} />

              <p className="text-gray-700 mb-6 text-lg">
                {product.description}
              </p>

              <ProductDetails product={product} />
              
              <ProductTags tags={product.tags || []} />

              {/* Quantity & Buy Button */}
              <div className="space-y-4">
                <ProductQuantity 
                  quantity={quantity} 
                  onQuantityChange={setQuantity} 
                />

                <BuyButton
                  inStock={product.inStock}
                  price={product.price}
                  quantity={quantity}
                  formatPrice={formatPrice}
                  onClick={handleBuyNow}
                />
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <div className="sticky top-8">
              <ProductReviews productId={parseInt(productId)} />
            </div>
          </div>
        </div>

        <RelatedProducts />
      </div>
    </div>
  );
}