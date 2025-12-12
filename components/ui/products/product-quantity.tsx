import { Button } from "@/components/ui/button";

interface ProductQuantityProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function ProductQuantity({ quantity, onQuantityChange }: ProductQuantityProps) {
  return (
    <div className="flex items-center space-x-4">
      <span className="font-medium text-gray-700">Quantity:</span>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          -
        </Button>
        <span className="w-12 text-center text-lg font-semibold">
          {quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onQuantityChange(quantity + 1)}
        >
          +
        </Button>
      </div>
    </div>
  );
}