"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/store/useAuth";
import { useCheckout } from "@/hooks/useCheckout";
import { CheckoutLoading } from "./checkout-loading";
import { CheckoutNotFound } from "./checkout-not-found";
import { OrderComplete } from "./order-complete";
import { ShippingInformation } from "./delivery-information";
import { OrderSummary } from "./order-summary";

export default function CheckoutContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const { isLoggedIn, userId } = useAuth();

  const {
    product,
    loading,
    submitting,
    orderComplete,
    deliveryAddress,
    paymentMethod,
    quantity,
    setDeliveryAddress,
    setPaymentMethod,
    setQuantity,
    handleSubmitOrder,
    formatPrice,
  } = useCheckout({
    productId,
    userId,
    isLoggedIn,
  });

  if (loading) return <CheckoutLoading />;
  if (!product) return <CheckoutNotFound onBackToShop={() => router.push("/shop")} />;
  if (orderComplete) return <OrderComplete />;

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="md:col-span-2 space-y-6">
            <ShippingInformation
              deliveryAddress={deliveryAddress}
              paymentMethod={paymentMethod}
              onAddressChange={setDeliveryAddress}
              onPaymentChange={setPaymentMethod}
            />
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary
              product={product}
              quantity={quantity}
              shippingAddress={deliveryAddress}
              submitting={submitting}
              formatPrice={formatPrice}
              onQuantityChange={setQuantity}
              onSubmitOrder={handleSubmitOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}