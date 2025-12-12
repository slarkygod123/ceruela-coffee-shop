import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoffeeProduct } from "@/lib/types/coffee-product";

interface OrderItemProps {
  product: CoffeeProduct;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function OrderItem({ product, quantity, onQuantityChange }: OrderItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="bg-amber-100 p-3 rounded-lg">
        <Coffee className="h-8 w-8 text-amber-700" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">
          {product.description}
        </p>
        <div className="flex flex-col justify-between items-center mt-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}