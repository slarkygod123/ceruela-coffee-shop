import { useState, useEffect } from "react";
import { CoffeeProduct } from "@/lib/types/coffee-product";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UseProductProps {
  productId: string;
}

export function useProduct({ productId }: UseProductProps) {
  const [product, setProduct] = useState<CoffeeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log("Fetching product with ID:", productId);

        const response = await fetch(`/api/products?id=${productId}`);
        const data = await response.json();

        console.log("API Response:", data);

        if (data.success) {
          if (data.data) {
            console.log("Product found:", data.data);
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

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString("en-PH")}`;
  };

  return {
    product,
    loading,
    quantity,
    setQuantity,
    formatPrice,
  };
}