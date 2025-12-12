import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProductNotFound() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Coffee className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          Product not found
        </h2>
        <Button asChild>
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    </div>
  );
}