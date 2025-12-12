import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onResetFilters: () => void;
}

export function EmptyState({ onResetFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Coffee className="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No coffees found
      </h3>
      <p className="text-gray-500 mb-4">
        Try adjusting your search or filters
      </p>
      <Button onClick={onResetFilters}>Reset Filters</Button>
    </div>
  );
}