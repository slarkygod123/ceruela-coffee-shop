import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginRequired() {
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