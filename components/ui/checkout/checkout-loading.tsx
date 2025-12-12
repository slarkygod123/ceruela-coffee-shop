import { Loader2 } from "lucide-react";

export function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    </div>
  );
}