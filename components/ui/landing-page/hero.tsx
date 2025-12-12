import { FeaturedCoffee } from "@/lib/interface/featured-coffee";
import { ChevronRight, Coffee } from "lucide-react";
import Link from "next/link";
import { Button } from "../button";
import { formatPrice } from "@/lib/helper/format-price";

export default function HeroSection({
  loading,
  isLoggedIn,
  error,
  featuredCoffeeIndex,
  featuredCoffees,
  setFeaturedCoffeeIndex,
}: {
  featuredCoffeeIndex: number;
  loading: boolean;
  isLoggedIn: boolean;
  error: string | null;
  setFeaturedCoffeeIndex: (index: number) => void;
  featuredCoffees: FeaturedCoffee[];
}) {
  return (
    <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Start Your Day With Perfect{" "}
              <span className="text-amber-200">Brew</span>
            </h1>
            <p className="text-xl text-amber-100">
              Discover premium coffee beans from around the world, roasted to
              perfection and delivered fresh to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-white text-amber-900 hover:bg-amber-100 text-lg px-8 py-6"
              >
                <Link href="/shop" className="flex items-center">
                  Shop Coffee
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {!isLoggedIn && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-amber-900 hover:bg-amber-100 text-lg px-8 py-6"
                >
                  <Link href="/register" className="flex items-center">
                    Join Our Club
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative">
            {loading ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 animate-pulse">
                <div className="h-20 w-20 mx-auto bg-amber-200/30 rounded-full mb-4"></div>
                <div className="h-8 bg-amber-200/30 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-10 bg-amber-200/30 rounded"></div>
                  <div className="h-6 bg-amber-200/30 rounded"></div>
                  <div className="flex justify-center gap-4 pt-2">
                    <div className="h-6 w-20 bg-amber-200/30 rounded-full"></div>
                    <div className="h-6 w-24 bg-amber-200/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <Coffee className="h-20 w-20 mx-auto text-amber-200 mb-4" />
                <p className="text-amber-100">Featured coffees coming soon!</p>
              </div>
            ) : featuredCoffees.length > 0 ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center space-y-4">
                  <Coffee className="h-20 w-20 mx-auto text-amber-200" />
                  <h3 className="text-2xl font-bold">Featured Coffee</h3>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-bold text-amber-200">
                      {featuredCoffees[featuredCoffeeIndex].name}
                    </h4>
                    <p className="text-amber-100">
                      {featuredCoffees[featuredCoffeeIndex].description}
                    </p>
                    <div className="flex justify-center gap-4 pt-2">
                      <span className="bg-white/20 px-4 py-1 rounded-full">
                        {featuredCoffees[featuredCoffeeIndex].roast} Roast
                      </span>
                      <span className="bg-amber-600 px-4 py-1 rounded-full font-bold">
                        {formatPrice(
                          featuredCoffees[featuredCoffeeIndex].price
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <Coffee className="h-20 w-20 mx-auto text-amber-200 mb-4" />
                <p className="text-amber-100">No featured coffees available</p>
              </div>
            )}

            {featuredCoffees.length > 0 && (
              <div className="flex justify-center mt-6 space-x-2">
                {featuredCoffees.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setFeaturedCoffeeIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === featuredCoffeeIndex
                        ? "bg-white w-8"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
