import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
    </div>
  );
}