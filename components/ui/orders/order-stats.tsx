import { Card, CardContent } from "@/components/ui/card";
import { Package, CreditCard, CheckCircle } from "lucide-react";
import { Order } from "@/lib/interface/order";

interface OrderStatsProps {
  orders: Order[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  if (orders.length === 0) return null;

  const totalSpent = orders.reduce(
    (sum, order) => sum + parseFloat(order.total_amount.toString()), 
    0
  );
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <Package className="h-8 w-8 text-amber-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold">
                ₱{totalSpent.toLocaleString('en-PH')}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Orders</p>
              <p className="text-2xl font-bold">{completedOrders}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}