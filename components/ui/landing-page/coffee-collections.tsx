import { ChevronRight, Coffee } from "lucide-react";
import { Card, CardContent } from "../card";
import { Button } from "../button";
import Link from "next/link";

export default function CoffeeCollectionSection(){
    return (
        <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900">
              Our Collections
            </h2>
            <Button
              variant="outline"
              className="border-amber-700 text-amber-700"
            >
              <Link href="/shop" className="flex items-center">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Single Origin",
                desc: "Unique flavors from specific regions",
                color: "bg-amber-100",
                count: "12 Varieties",
                priceRange: "₱850 - ₱1,500",
              },
              {
                title: "Blends",
                desc: "Perfectly balanced everyday brews",
                color: "bg-brown-100",
                count: "8 Blends",
                priceRange: "₱750 - ₱1,200",
              },
              {
                title: "Decaf",
                desc: "Full flavor without caffeine",
                color: "bg-stone-100",
                count: "6 Options",
                priceRange: "₱900 - ₱1,350",
              },
            ].map((collection, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-0">
                  <div className={`h-48 ${collection.color} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Coffee className="h-20 w-20 text-amber-700/30" />
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-amber-900 mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{collection.desc}</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                          {collection.count}
                        </span>
                        <span className="text-sm font-bold text-amber-800">
                          {collection.priceRange}
                        </span>
                      </div>
                      <Link
                        href="/shop"
                        className="text-amber-700 font-medium hover:text-amber-800 flex items-center justify-center"
                      >
                        Explore Collection
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
}