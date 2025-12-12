import { Badge } from "@/components/ui/badge";
import { CoffeeProduct } from "@/lib/types/coffee-product";

interface ProductDetailsProps {
  product: CoffeeProduct;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center">
        <span className="font-medium text-gray-700 w-32">Roast Level:</span>
        <Badge variant="outline" className="border-amber-300">
          {product.roast}
        </Badge>
      </div>

      <div className="flex items-center">
        <span className="font-medium text-gray-700 w-32">Origin:</span>
        <span className="text-gray-600">{product.origin}</span>
      </div>

      <div className="flex items-center">
        <span className="font-medium text-gray-700 w-32">Weight:</span>
        <span className="text-gray-600">{product.weight}</span>
      </div>

      <div className="flex items-center">
        <span className="font-medium text-gray-700 w-32">Availability:</span>
        <span
          className={`font-medium ${
            product.inStock ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>
    </div>
  );
}