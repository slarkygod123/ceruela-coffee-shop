import { useState, useEffect } from "react";

interface UseFavoritesProps {
  isLoggedIn: boolean;
  userId: number | null;
}

export function useFavorites({ isLoggedIn, userId }: UseFavoritesProps) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setLoading(false);
      return;
    }
    
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/favorites?user_id=${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setFavorites(data.data);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [isLoggedIn, userId]);

  const removeFromFavorites = async (productId: number) => {
    if (!userId) return;

    try {
      await fetch(`/api/favorites?user_id=${userId}&product_id=${productId}`, {
        method: 'DELETE'
      });
      
      setFavorites(favorites.filter(fav => fav.product_id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return {
    favorites,
    loading,
    removeFromFavorites,
  };
}