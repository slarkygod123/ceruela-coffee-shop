import { Coffee } from "lucide-react";
import Link from "next/link";

interface OrderItemProps {
  item: {
    order_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
  };
  formatPrice: (price: number) => string;
}

export function OrderItem({ item, formatPrice }: OrderItemProps) {
  console.log("Rendering OrderCard for order ID:", item.order_id);
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex items-center">
        <div className="bg-amber-100 p-2 rounded-lg mr-3">
          <Coffee className="h-5 w-5 text-amber-700" />
        </div>
        <div>
          <Link href={`/products/${item.order_id}`} className="font-medium hover:underline  ">{item.product_name}</Link>
          <p className="text-sm text-gray-500">
            Quantity: {item.quantity} × {formatPrice(item.unit_price)}
          </p>
        </div>
      </div>
      <span className="font-semibold">
        {formatPrice(item.quantity * item.unit_price)}
      </span>
    </div>
  );
}