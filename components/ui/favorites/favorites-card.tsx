import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FavoriteCardProps {
  favorite: {
    favorite_id: number;
    product_id: number;
    product_name: string;
    description: string;
    price: string | number;
  };
  onRemove: (productId: number) => void;
}

export function FavoriteCard({ favorite, onRemove }: FavoriteCardProps) {
  const formattedPrice = `₱${parseFloat(favorite.price.toString()).toLocaleString('en-PH')}`;

  return (
    <Card key={favorite.favorite_id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">
            {favorite.product_name}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(favorite.product_id)}
            title="Remove from favorites"
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {favorite.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-amber-900">
            {formattedPrice}
          </span>
          <Button asChild size="sm">
            <Link href={`/checkout?product=${favorite.product_id}`}>
              Buy Now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}