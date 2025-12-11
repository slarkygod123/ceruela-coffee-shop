import CheckoutContainer from "@/components/ui/checkout/checkout-container";
import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <Suspense fallback={"Loading...."}>
      <CheckoutContainer />
    </Suspense>
  );
}