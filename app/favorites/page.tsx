"use client";

import { Heart } from "lucide-react";
import { useAuth } from "@/lib/store/useAuth";
import { useMounted } from "@/hooks/useMounted";
import { useFavorites } from "@/hooks/useFavorites";
import { LoginPrompt } from "@/components/ui/favorites/login-prompt";
import { LoadingState } from "@/components/ui/favorites/loading-state";
import { EmptyState } from "@/components/ui/favorites/empty-state";
import { FavoritesGrid } from "@/components/ui/favorites/favorites-grid";

export default function FavoritesPage() {
  const { isLoggedIn, userId } = useAuth();
  const mounted = useMounted();
  
  const { favorites, loading, removeFromFavorites } = useFavorites({
    isLoggedIn,
    userId,
  });

  if (!mounted) return null;
  if (!isLoggedIn) return <LoginPrompt />;

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900 flex items-center">
            <Heart className="h-8 w-8 mr-2 fill-red-500 text-red-500" />
            My Favorite Coffees
          </h1>
          <p className="text-gray-600 mt-2">
            {favorites.length > 0 
              ? `You have ${favorites.length} favorite coffee${favorites.length !== 1 ? 's' : ''}`
              : "Your favorite coffees will appear here"}
          </p>
        </div>
        
        {loading ? (
          <LoadingState />
        ) : favorites.length === 0 ? (
          <EmptyState />
        ) : (
          <FavoritesGrid
            favorites={favorites}
            onRemoveFavorite={removeFromFavorites}
          />
        )}
      </div>
    </div>
  );
}