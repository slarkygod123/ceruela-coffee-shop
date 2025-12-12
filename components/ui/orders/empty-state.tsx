import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState() {
  return (
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
  );
}