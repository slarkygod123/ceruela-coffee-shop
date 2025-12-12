import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BackButton() {
  return (
    <Button variant="ghost" className="mb-6" asChild>
      <Link href="/shop">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </Link>
    </Button>
  );
}