"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/useAuth";
import { useMounted } from "@/hooks/useMounted";
import { useShop } from "@/hooks/useShop";
import { ShopHero } from "@/components/ui/shop/shop-hero";
import { ShopIntroduction } from "@/components/ui/shop/shop-introduction";
import { ShopFilters } from "@/components/ui/shop/shop-filters";
import { ResultsSummary } from "@/components/ui/shop/results-summary";
import { LoadingState } from "@/components/ui/shop/loading-state";
import { EmptyState } from "@/components/ui/shop/empty-state";
import { CoffeeGrid } from "@/components/ui/shop/coffee-grid";
import { ShopStory } from "@/components/ui/shop/shop-story";


export default function ShopNow() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoast, setSelectedRoast] = useState("all");
  const [selectedOrigin, setSelectedOrigin] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  
  const router = useRouter();
  const { isLoggedIn, userId } = useAuth();
  const mounted = useMounted();
  
  const { coffeeProducts, wishlist, loading, toggleWishlist } = useShop({
    userId,
    isLoggedIn,
  });

  // Filter and sort coffees
  const filteredCoffees = coffeeProducts
    .filter((coffee) => {
      const matchesSearch =
        coffee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coffee.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRoast =
        selectedRoast === "all" || coffee.roast.toLowerCase() === selectedRoast;
      const matchesOrigin =
        selectedOrigin === "all" ||
        coffee.origin.toLowerCase() === selectedOrigin;

      return matchesSearch && matchesRoast && matchesOrigin;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default: // featured
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

  const featuredCoffees = filteredCoffees.filter((coffee) => coffee.isFeatured);
  const regularCoffees = filteredCoffees.filter((coffee) => !coffee.isFeatured);

  // get unique roasts and origins for filters
  const roasts = Array.from(
    new Set(coffeeProducts.map((coffee) => coffee.roast))
  );
  const origins = Array.from(
    new Set(coffeeProducts.map((coffee) => coffee.origin))
  );

  const handleBuyNow = (coffeeId: number) => {
    router.push(`/checkout?product=${coffeeId}`);
  };

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString("en-PH")}`;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRoast("all");
    setSelectedOrigin("all");
  };

  if (!mounted) return null;
  
  return (
    <div className="min-h-screen bg-amber-50">
      <ShopHero />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ShopIntroduction />
        
        <ShopFilters
          searchTerm={searchTerm}
          selectedRoast={selectedRoast}
          selectedOrigin={selectedOrigin}
          sortBy={sortBy}
          roasts={roasts}
          origins={origins}
          onSearchChange={setSearchTerm}
          onRoastChange={setSelectedRoast}
          onOriginChange={setSelectedOrigin}
          onSortChange={setSortBy}
          onResetFilters={resetFilters}
        />
        
        <ResultsSummary
          loading={loading}
          filteredCount={filteredCoffees.length}
          totalCount={coffeeProducts.length}
        />
        
        {loading ? (
          <LoadingState />
        ) : filteredCoffees.length === 0 ? (
          <EmptyState onResetFilters={resetFilters} />
        ) : (
          <CoffeeGrid
            coffees={regularCoffees}
            featuredCoffees={featuredCoffees}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onBuyNow={handleBuyNow}
            formatPrice={formatPrice}
          />
        )}
        
        <ShopStory />
      </div>
    </div>
  );
}