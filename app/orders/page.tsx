// app/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Package, Calendar, MapPin, CreditCard, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/lib/store/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Order } from "@/lib/interface/order";
import { useMounted } from "@/hooks/useMounted";

export default function OrderHistory() {
  const { isLoggedIn, userId } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/orders?user_id=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Parse the JSON string if items is stored as string
          const parsedOrders = data.data.map((order: any) => ({
            ...order,
            items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []
          }));
          setOrders(parsedOrders);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, userId, router]);

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'gcash':
        return '💳';
      case 'maya':
        return '📱';
      case 'credit_card':
        return '💳';
      case 'bank_transfer':
        return '🏦';
      case 'cash_on_delivery':
        return '💰';
      default:
        return '💳';
    }
  };

  const mounted = useMounted();
  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Please Login</h2>
            <p className="text-gray-600 mb-6">
              You need to login to view your order history.
            </p>
            <Button asChild>
              <Link href="/login">Login to Continue</Link>  
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Failed to load orders</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2 flex items-center">
            <Package className="h-8 w-8 mr-3" />
            Order History
          </h1>
          <p className="text-gray-600">
            View all your past orders
          </p>
        </div>

        {/* Stats Summary */}
        {orders.length > 0 && (
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
                      ₱{orders.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0).toLocaleString('en-PH')}
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
                    <p className="text-2xl font-bold">
                      {orders.filter(order => order.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-6">
                You haven't placed any orders yet. Start exploring our coffee collection!
              </p>
              <Button asChild>
                <Link href="/shop">Browse Coffee</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.order_id} className="overflow-hidden">
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
                      {getStatusBadge(order.status)}
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
                          <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
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
                      <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Method
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <span className="text-lg mr-2">
                          {getPaymentMethodIcon(order.payment_method)}
                        </span>
                        <span className="capitalize">
                          {order.payment_method.replace('_', ' ')}
                        </span>
                      </div>
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
                        <Link href="/shop">
                          Shop More
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}