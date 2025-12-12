import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No favorites yet
      </h3>
      <p className="text-gray-500 mb-4">
        Start adding coffees to your favorites!
      </p>
      <Button asChild>
        <Link href="/shop">Browse Coffees</Link>
      </Button>
    </div>
  );
}