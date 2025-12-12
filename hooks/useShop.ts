import { useState, useEffect, useCallback } from "react";
import { CoffeeProduct } from "@/lib/types/coffee-product";
import toast from "react-hot-toast";

interface UseShopProps {
  userId: number | null;
  isLoggedIn: boolean;
}

export function useShop({ userId, isLoggedIn }: UseShopProps) {
  const [coffeeProducts, setCoffeeProducts] = useState<CoffeeProduct[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch coffee products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");
        const data = await response.json();

        if (data.success && data.data) {
          setCoffeeProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // fetch users favorites
  useEffect(() => {
    if (isLoggedIn && userId) {
      const fetchFavorites = async () => {
        try {
          const response = await fetch(`/api/favorites?user_id=${userId}`);
          const data = await response.json();

          if (data.success && data.data) {
            const favoriteIds = data.data.map((fav: any) => fav.product_id);
            setWishlist(favoriteIds);
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };

      fetchFavorites();
    }
  }, [isLoggedIn, userId]);

  // toggle wishlist function
  const toggleWishlist = useCallback(async (productId: number) => {
    if (!isLoggedIn || !userId) {
      toast.error("Please login to add favorites");
      return;
    }

    const isInWishlist = wishlist.includes(productId);

    try {
      if (isInWishlist) {
        const response = await fetch(
          `/api/favorites?user_id=${userId}&product_id=${productId}`,
          { method: "DELETE" }
        );
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Failed to remove from favorites");
        }

        setWishlist((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from favorites");
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, product_id: productId }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Failed to add to favorites");
        }

        setWishlist((prev) => [...prev, productId]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update favorites"
      );
    }
  }, [isLoggedIn, userId, wishlist]);

  return {
    coffeeProducts,
    wishlist,
    loading,
    toggleWishlist,
  };
}