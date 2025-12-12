import { Calendar, MapPin } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Order } from "@/lib/interface/order";
import { StatusBadge } from "./status-badge";
import { OrderItem } from "./order-item";
import { PaymentMethodDisplay } from "./payment-method-display";

interface OrderCardProps {
  order: Order;
  formatPrice: (price: number) => string;
  formatDate: (dateString: string) => string;
}

export function OrderCard({ order, formatPrice, formatDate }: OrderCardProps) {
  return (
    <Card key={order.order_id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="bg-amber-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">
              Order #{order.order_id.toString().padStart(6, '0')}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(order.order_date)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-xl font-bold text-amber-900">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {/* Order Items */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Items ({order.item_count})</h3>
          <div className="space-y-3">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <OrderItem key={index} item={{
                  order_id: item.product_id,
                  product_name: item.product_name,
                  quantity: item.quantity,
                  unit_price: item.unit_price,
                }} formatPrice={formatPrice} />
              ))
            ) : (
              <p className="text-gray-500 text-sm">No items found</p>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Delivery Address
            </h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {order.shipping_address || 'No address provided'}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Payment Method
            </h3>
            <PaymentMethodDisplay method={order.payment_method} />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-3">
          <div className="text-sm text-gray-500">
            Order placed on {new Date(order.order_date).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/checkout?product=${order.items?.[0]?.product_id || ''}`}>
                Buy Again
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/shop">Shop More</Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}