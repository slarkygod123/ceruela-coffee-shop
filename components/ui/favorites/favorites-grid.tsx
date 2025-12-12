import { FavoriteCard } from "./favorites-card";

interface FavoritesGridProps {
  favorites: any[];
  onRemoveFavorite: (productId: number) => void;
}

export function FavoritesGrid({ favorites, onRemoveFavorite }: FavoritesGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((favorite) => (
        <FavoriteCard
          key={favorite.favorite_id}
          favorite={favorite}
          onRemove={onRemoveFavorite}
        />
      ))}
    </div>
  );
}