// components/products/RelatedProducts.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RelatedProducts() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">
        You Might Also Like
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <CardContent>
            <Coffee className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Explore More Coffees</h3>
            <p className="text-gray-600 text-sm mb-4">
              Discover other premium blends in our collection
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/shop">Browse All</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}