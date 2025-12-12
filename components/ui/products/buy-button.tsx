import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuyButtonProps {
  inStock: boolean;
  price: number;
  quantity: number;
  formatPrice: (price: number) => string;
  onClick: () => void;
}

export function BuyButton({
  inStock,
  price,
  quantity,
  formatPrice,
  onClick,
}: BuyButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={!inStock}
      className="w-full py-6 text-lg"
      size="lg"
    >
      {!inStock ? (
        "Out of Stock"
      ) : (
        <>
          <Package className="h-5 w-5 mr-2" />
          Buy Now - {formatPrice(price * quantity)}
        </>
      )}
    </Button>
  );
}