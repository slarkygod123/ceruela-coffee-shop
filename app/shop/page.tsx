// app/shop/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coffee, Star, Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import CoffeeCard from "@/components/ui/cards/coffee-card";
import { useAuth } from "@/lib/store/useAuth"; // Import auth
import toast from "react-hot-toast";
import { CoffeeProduct } from "@/lib/types/coffee-product";
import { useMounted } from "@/hooks/useMounted";

export default function ShopNow() {
  const [coffeeProducts, setCoffeeProducts] = useState<CoffeeProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoast, setSelectedRoast] = useState("all");
  const [selectedOrigin, setSelectedOrigin] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isLoggedIn, userId } = useAuth();

  // Fetch coffee products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");
        const data = await response.json();

        if (data.success && data.data) {
          setCoffeeProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch user's favorites when logged in
  useEffect(() => {
    if (isLoggedIn && userId) {
      const fetchFavorites = async () => {
        try {
          const response = await fetch(`/api/favorites?user_id=${userId}`);
          const data = await response.json();

          if (data.success && data.data) {
            // Extract product IDs from favorites
            const favoriteIds = data.data.map((fav: any) => fav.product_id);
            setWishlist(favoriteIds);
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };

      fetchFavorites();
    }
  }, [isLoggedIn, userId]);

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

  // Get unique roasts and origins for filters
  const roasts = Array.from(
    new Set(coffeeProducts.map((coffee) => coffee.roast))
  );
  const origins = Array.from(
    new Set(coffeeProducts.map((coffee) => coffee.origin))
  );

  const toggleWishlist = async (productId: number) => {
    if (!isLoggedIn || !userId) {
      toast.error("Please login to add favorites");
      return;
    }

    const isInWishlist = wishlist.includes(productId);

    try {
      if (isInWishlist) {
        // Remove from favorites API
        const response = await fetch(
          `/api/favorites?user_id=${userId}&product_id=${productId}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to remove from favorites");
        }

        // Update local state
        setWishlist((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from favorites");
      } else {
        // Add to favorites API
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            product_id: productId,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to add to favorites");
        }

        // Update local state
        setWishlist((prev) => [...prev, productId]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update favorites"
      );
    }
  };

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

  const mounted = useMounted();
  if (!mounted) return null;
  
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Ceruela Coffee Collection
              </h1>
              <p className="text-xl text-amber-100 max-w-2xl">
                Experience the art of coffee with our carefully curated
                selection of Ceruela signature roasts. Each batch is roasted
                with precision to highlight unique flavor profiles.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-4">
                <Coffee className="h-16 w-16 text-amber-200 mr-4" />
                <div>
                  <p className="text-sm text-amber-200">Est. 2010</p>
                  <p className="text-xl font-bold">Artisanal Roasting</p>
                  <p className="text-amber-200 text-sm">Since Day One</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Shop Introduction */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Our Coffee Philosophy
          </h2>
          <p className="text-gray-700 text-lg">
            At Ceruela Coffee Shop, we believe great coffee starts with
            exceptional beans and ends with perfect roasting. Each of our blends
            is crafted by our master roaster to deliver a consistent, memorable
            experience in every cup.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search Ceruela coffees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={selectedRoast} onValueChange={setSelectedRoast}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Roast Type" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={5}
                  className="bg-white"
                >
                  <SelectItem value="all">All Roasts</SelectItem>
                  {roasts.map((roast) => (
                    <SelectItem key={roast} value={roast.toLowerCase()}>
                      {roast}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Origin" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={5}
                  className="bg-white"
                >
                  <SelectItem value="all">All Origins</SelectItem>
                  {origins.map((origin) => (
                    <SelectItem key={origin} value={origin.toLowerCase()}>
                      {origin}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={5}
                  className="bg-white"
                >
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
                onClick={() => setSelectedRoast("all")}
              >
                Roast: {selectedRoast} ×
              </Badge>
            )}
            {selectedOrigin !== "all" && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedOrigin("all")}
              >
                Origin: {selectedOrigin} ×
              </Badge>
            )}
            {searchTerm && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSearchTerm("")}
              >
                Search: {searchTerm} ×
              </Badge>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          {loading ? (
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-bold">{filteredCoffees.length}</span> of{" "}
              {coffeeProducts.length} Ceruela coffees
            </p>
          )}
        </div>

        {/* Coffee Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading coffees...</p>
          </div>
        ) : filteredCoffees.length === 0 ? (
          <div className="text-center py-12">
            <Coffee className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No coffees found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </div>
        ) : (
          <>
            {/* Featured Coffees */}
            {filteredCoffees.filter((coffee) => coffee.isFeatured).length >
              0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-amber-500 fill-amber-500" />
                  Ceruela Featured Roasts
                </h2>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {filteredCoffees
                    .filter((coffee) => coffee.isFeatured)
                    .map((coffee) => (
                      <CoffeeCard
                        key={coffee.id}
                        coffee={coffee}
                        wishlist={wishlist}
                        onToggleWishlist={toggleWishlist}
                        onBuyNow={handleBuyNow}
                        formatPrice={formatPrice}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* All Coffees */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">
                All Ceruela Coffees
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCoffees.map((coffee) => (
                  <CoffeeCard
                    key={coffee.id}
                    coffee={coffee}
                    wishlist={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onBuyNow={handleBuyNow}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Ceruela Story Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                The Ceruela Story
              </h2>
              <p className="text-gray-700 mb-4">
                Founded in 2010, Ceruela Coffee Shop began as a small artisanal
                roastery with a simple mission: to bring exceptional coffee to
                discerning palates. Today, we continue that tradition with every
                batch we roast.
              </p>
              <p className="text-gray-700">
                Our name "Ceruela" comes from the Spanish word for "cherry" - a
                nod to the coffee cherry that starts every great cup. From bean
                selection to final roast, we honor this fruit and the farmers
                who cultivate it with care and respect.
              </p>
            </div>

            <div className="bg-amber-100 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-amber-900 mb-4">
                Our Roasting Promise
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-amber-600 text-white rounded-full p-1 mr-3 mt-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Small batch roasting for quality control</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-600 text-white rounded-full p-1 mr-3 mt-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Direct trade relationships with farmers</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-600 text-white rounded-full p-1 mr-3 mt-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Freshness guaranteed - always roasted to order</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-600 text-white rounded-full p-1 mr-3 mt-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>30-day freshness guarantee for every bag</span>
                </li>
              </ul>
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
}
