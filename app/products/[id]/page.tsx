// app/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Coffee, ArrowLeft, Package } from "lucide-react";
import { useAuth } from "@/lib/store/useAuth";
import ProductReviews from "@/components/ui/reviews/product-reviews";
import toast from "react-hot-toast";
import Link from "next/link";

export interface CoffeeProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  roast: string;
  origin: string;
  weight: string;
  tags: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const productId = params.id as string;

  const [product, setProduct] = useState<CoffeeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // In app/products/[id]/page.tsx, update the fetchProduct function:
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log("Fetching product with ID:", productId); // Debug log

        const response = await fetch(`/api/products?id=${productId}`);
        const data = await response.json();

        console.log("API Response:", data); // Debug log

        if (data.success) {
          // Now data.data is a single object or null
          if (data.data) {
            console.log("Product found:", data.data); // Debug log
            setProduct(data.data);
          } else {
            console.log("Product not found for ID:", productId);
            toast.error("Product not found");
            router.push("/shop");
          }
        } else {
          console.log("API returned error:", data.error);
          toast.error(data.error || "Product not found");
          router.push("/shop");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
        router.push("/shop");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/checkout?product=${productId}`);
      return;
    }
    router.push(`/checkout?product=${productId}&quantity=${quantity}`);
  };

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString("en-PH")}`;
  };

  // Change this part:
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Make sure product is loaded before rendering
  if (!product) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Coffee className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Product not found
          </h2>
          <Button asChild>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-amber-900">
                  {product.name}
                </h1>
                <span className="text-3xl font-bold text-amber-900">
                  {formatPrice(product.price)}
                </span>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-gray-700 mb-6 text-lg">
                {product.description}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-32">
                    Roast Level:
                  </span>
                  <Badge variant="outline" className="border-amber-300">
                    {product.roast}
                  </Badge>
                </div>

                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-32">
                    Origin:
                  </span>
                  <span className="text-gray-600">{product.origin}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-32">
                    Weight:
                  </span>
                  <span className="text-gray-600">{product.weight}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-32">
                    Availability:
                  </span>
                  <span
                    className={`font-medium ${
                      product.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium text-gray-700 mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-amber-100 text-amber-800"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Buy Button */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center text-lg font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="w-full py-6 text-lg"
                  size="lg"
                >
                  {!product.inStock ? (
                    "Out of Stock"
                  ) : (
                    <>
                      <Package className="h-5 w-5 mr-2" />
                      Buy Now - {formatPrice(product.price * quantity)}
                    </>
                  )}
                </Button>
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

        {/* Related Products Suggestion */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            You Might Also Like
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* You can fetch related products here */}
            <Card className="text-center p-6">
              <CardContent>
                <Coffee className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Explore More Coffees</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Discover other premium blends in our collection
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/shop">Browse All</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
