// app/orders/page.tsx
"use client";

import { useAuth } from "@/lib/store/useAuth";
import { useMounted } from "@/hooks/useMounted";
import { useOrders } from "@/hooks/useOrders";
import { LoginRequired } from "@/components/ui/orders/login-required";
import { LoadingState } from "@/components/ui/orders/loading-state";
import { ErrorState } from "@/components/ui/orders/error-state";
import { PageHeader } from "@/components/ui/orders/page-header";
import { OrderStats } from "@/components/ui/orders/order-stats";
import { EmptyState } from "@/components/ui/orders/empty-state";
import { OrderCard } from "@/components/ui/orders/order-card";

export default function OrderHistory() {
  const { isLoggedIn, userId } = useAuth();
  const mounted = useMounted();

  const { orders, loading, error, refetchOrders } = useOrders({ userId });

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!mounted) return null;
  if (!isLoggedIn) return <LoginRequired />;
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetchOrders} />;

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader />

        <OrderStats orders={orders} />

        {orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                formatPrice={formatPrice}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
