import { useState, useEffect } from "react";
import { CoffeeProduct } from "@/lib/types/coffee-product";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UseCheckoutProps {
  productId: string | null;
  userId: number | null;
  isLoggedIn: boolean;
}

export function useCheckout({
  productId,
  userId,
  isLoggedIn,
}: UseCheckoutProps) {
  const [product, setProduct] = useState<CoffeeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("GCash");
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/checkout?product=" + productId);
      return;
    }

    if (!productId) {
      router.push("/shop");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products?id=${productId}`);
        const data = await response.json();

        console.log("Checkout API Response:", data);

        if (data.success) {
          if (data.data) {
            console.log("Product found for checkout:", data.data);
            setProduct(data.data);
          } else {
            console.log("Product not found for ID:", productId);
            toast.error("Product not found");
          }
        } else {
          toast.error(data.error || "Failed to load product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isLoggedIn, router]);

  const handleSubmitOrder = async () => {
    if (!userId || !productId || !deliveryAddress) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          quantity,
          shipping_address: deliveryAddress,
          payment_method: paymentMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderComplete(true);
        toast.success("Order placed successfully!");

        setTimeout(() => {
          router.push("/orders");
        }, 3000);
      } else {
        toast.error(data.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString("en-PH")}`;
  };

  return {
    product,
    loading,
    submitting,
    orderComplete,
    deliveryAddress,
    paymentMethod,
    quantity,
    setDeliveryAddress,
    setPaymentMethod,
    setQuantity,
    handleSubmitOrder,
    formatPrice,
  };
}
