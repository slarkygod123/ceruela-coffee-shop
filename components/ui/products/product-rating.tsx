import { Star } from "lucide-react";

interface ProductRatingProps {
  rating: number;
  reviews: number;
}

export function ProductRating({ rating, reviews }: ProductRatingProps) {
  return (
    <div className="flex items-center mb-6">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < Math.floor(rating)
                ? "text-amber-500 fill-amber-500"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-gray-600 ml-2">
        {rating} ({reviews} reviews)
      </span>
    </div>
  );
}