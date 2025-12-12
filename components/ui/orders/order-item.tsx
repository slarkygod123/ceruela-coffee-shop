import { Coffee } from "lucide-react";

interface OrderItemProps {
  item: {
    product_name: string;
    quantity: number;
    unit_price: number;
  };
  formatPrice: (price: number) => string;
}

export function OrderItem({ item, formatPrice }: OrderItemProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex items-center">
        <div className="bg-amber-100 p-2 rounded-lg mr-3">
          <Coffee className="h-5 w-5 text-amber-700" />
        </div>
        <div>
          <p className="font-medium">{item.product_name}</p>
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