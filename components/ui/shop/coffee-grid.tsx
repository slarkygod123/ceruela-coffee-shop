import { Star } from "lucide-react";
import CoffeeCard from "@/components/ui/cards/coffee-card";
import { CoffeeProduct } from "@/lib/types/coffee-product";

interface CoffeeGridProps {
  coffees: CoffeeProduct[];
  featuredCoffees: CoffeeProduct[];
  wishlist: number[];
  onToggleWishlist: (productId: number) => void;
  onBuyNow: (coffeeId: number) => void;
  formatPrice: (price: number) => string;
}

export function CoffeeGrid({
  coffees,
  featuredCoffees,
  wishlist,
  onToggleWishlist,
  onBuyNow,
  formatPrice,
}: CoffeeGridProps) {
  return (
    <>
      {/* Featured Coffees */}
      {featuredCoffees.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
            <Star className="h-6 w-6 mr-2 text-amber-500 fill-amber-500" />
            Ceruela Featured Roasts
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredCoffees.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
                onBuyNow={onBuyNow}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Coffees */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">
          Other Ceruela Coffees
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coffees.map((coffee) => (
            <CoffeeCard
              key={coffee.id}
              coffee={coffee}
              wishlist={wishlist}
              onToggleWishlist={onToggleWishlist}
              onBuyNow={onBuyNow}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      </div>
    </>
  );
}