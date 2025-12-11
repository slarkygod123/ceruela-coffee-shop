import { CoffeeProduct } from "@/lib/types/coffee-product";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card";
import { Button } from "../button";
import { Badge } from "../badge";
import { Heart, Star } from "lucide-react";
import { useAuth } from "@/lib/store/useAuth";
import Link from "next/link";
import { useMounted } from "@/hooks/useMounted";

// Coffee Card Component
export default function CoffeeCard({ 
    coffee, 
    wishlist,
    onToggleWishlist, 
    onBuyNow,
    formatPrice 
  }: { 
    coffee: CoffeeProduct; 
    wishlist: number[];
    onToggleWishlist: (id: number) => void;
    onBuyNow: (id: number) => void;
    formatPrice: (price: number) => string;
  }) {
    const { isLoggedIn } = useAuth();
    const isInWishlist = wishlist.includes(coffee.id);
  
    const mounted = useMounted();
    if (!mounted) return null;

    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-amber-200">
        <CardHeader className="p-4 pb-2 bg-amber-50">
          <div className="flex justify-between items-start">
            <div>
            <CardTitle className="text-lg font-bold text-amber-900 line-clamp-1 hover:underline">
              <Link href={`/products/${coffee.id}`}>
                {coffee.name}
              </Link>
            </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  Ceruela {coffee.roast}
                </span>
                <span className="mx-2">•</span>
                <span className="text-xs text-gray-500">{coffee.weight}</span>
              </CardDescription>
            </div>
            {isLoggedIn && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleWishlist(coffee.id)}
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} 
              />
            </Button>
          )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.floor(coffee.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 ml-2">
                {coffee.rating} ({coffee.reviews} reviews)
              </span>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{coffee.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="outline" className="text-xs border-amber-300">
                {coffee.origin}
              </Badge>
              {coffee.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-2xl font-bold text-amber-900">{formatPrice(coffee.price)}</span>
              </div>
              {!coffee.inStock && (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            <Button 
              className="w-full text-amber-100 bg-amber-700 hover:bg-amber-800"
              onClick={() => onBuyNow(coffee.id)}
              disabled={!coffee.inStock}
            >
              {!coffee.inStock ? "Out of Stock" : "Buy Now"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }