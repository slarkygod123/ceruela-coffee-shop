import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Search } from "lucide-react";

interface ShopFiltersProps {
  searchTerm: string;
  selectedRoast: string;
  selectedOrigin: string;
  sortBy: string;
  roasts: string[];
  origins: string[];
  onSearchChange: (value: string) => void;
  onRoastChange: (value: string) => void;
  onOriginChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
}

export function ShopFilters({
  searchTerm,
  selectedRoast,
  selectedOrigin,
  sortBy,
  roasts,
  origins,
  onSearchChange,
  onRoastChange,
  onOriginChange,
  onSortChange,
  onResetFilters,
}: ShopFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Ceruela coffees..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedRoast} onValueChange={onRoastChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Roast Type" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={5} className="bg-white">
              <SelectItem value="all">All Roasts</SelectItem>
              {roasts.map((roast) => (
                <SelectItem key={roast} value={roast.toLowerCase()}>
                  {roast}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedOrigin} onValueChange={onOriginChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Origin" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={5} className="bg-white">
              <SelectItem value="all">All Origins</SelectItem>
              {origins.map((origin) => (
                <SelectItem key={origin} value={origin.toLowerCase()}>
                  {origin}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={5} className="bg-white">
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {selectedRoast !== "all" && (
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onRoastChange("all")}
          >
            Roast: {selectedRoast} ×
          </Badge>
        )}
        {selectedOrigin !== "all" && (
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onOriginChange("all")}
          >
            Origin: {selectedOrigin} ×
          </Badge>
        )}
        {searchTerm && (
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => onSearchChange("")}
          >
            Search: {searchTerm} ×
          </Badge>
        )}
        {(selectedRoast !== "all" || selectedOrigin !== "all" || searchTerm) && (
          <Badge
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={onResetFilters}
          >
            Clear All ×
          </Badge>
        )}
      </div>
    </div>
  );
}