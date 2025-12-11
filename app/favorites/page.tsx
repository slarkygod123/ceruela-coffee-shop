// app/favorites/page.tsx - User's favorite coffees
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Heart, Star } from "lucide-react";
import { useAuth } from "@/lib/store/useAuth";
import Link from "next/link";
import { useMounted } from "@/hooks/useMounted";

export default function FavoritesPage() {
  const { isLoggedIn, userId } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !userId) {
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
    try {
      await fetch(`/api/favorites?user_id=${userId}&product_id=${productId}`, {
        method: 'DELETE'
      });
      
      setFavorites(favorites.filter(fav => fav.product_id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Please login to view favorites</h2>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const mounted = useMounted();
  if (!mounted) return null;
  
  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8 flex items-center">
          <Heart className="h-8 w-8 mr-2 fill-red-500 text-red-500" />
          My Favorite Coffees
        </h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-4">Start adding coffees to your favorites!</p>
            <Button asChild>
              <Link href="/shop">Browse Coffees</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.favorite_id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{favorite.product_name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromFavorites(favorite.product_id)}
                      title="Remove from favorites"
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{favorite.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-900">
                      ₱{parseFloat(favorite.price).toLocaleString('en-PH')}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/checkout?product=${favorite.product_id}`}>
                        Buy Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}