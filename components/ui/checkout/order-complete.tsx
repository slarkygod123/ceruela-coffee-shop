import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function OrderComplete() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to order history...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}