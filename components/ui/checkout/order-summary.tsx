import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CoffeeProduct } from "@/lib/types/coffee-product";
import { OrderItem } from "./order-item";

interface OrderSummaryProps {
  product: CoffeeProduct;
  quantity: number;
  shippingAddress: string;
  submitting: boolean;
  formatPrice: (price: number) => string;
  onQuantityChange: (quantity: number) => void;
  onSubmitOrder: () => void;
}

export function OrderSummary({
  product,
  quantity,
  shippingAddress,
  submitting,
  formatPrice,
  onQuantityChange,
  onSubmitOrder,
}: OrderSummaryProps) {
  const totalPrice = product.price * quantity;

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <OrderItem 
          product={product} 
          quantity={quantity} 
          onQuantityChange={onQuantityChange} 
        />

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="text-green-600">FREE</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        <Button
          className="w-full mt-6"
          size="lg"
          onClick={onSubmitOrder}
          disabled={submitting || !shippingAddress}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Place Order - ${formatPrice(totalPrice)}`
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By placing your order, you agree to our Terms of Service and
          Privacy Policy.
        </p>
      </CardContent>
    </Card>
  );
}