import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutNotFoundProps {
  onBackToShop: () => void;
}

export function CheckoutNotFound({ onBackToShop }: CheckoutNotFoundProps) {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Coffee className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          Product not found
        </h2>
        <Button onClick={onBackToShop}>Back to Shop</Button>
      </div>
    </div>
  );
}