import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "../card";
import { Button } from "../button";
import Link from "next/link";
import Image from "next/image";

export default function CoffeeCollectionSection() {
  const collections = [
    {
      title: "Single Origin",
      desc: "Unique flavors from specific regions",
      color: "bg-amber-100",
      src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center",
    },
    {
      title: "Blends",
      desc: "Perfectly balanced everyday brews",
      color: "bg-amber-50",
      src: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=400&h=400&fit=crop&crop=center",
    },
    {
      title: "Decaf",
      desc: "Full flavor without caffeine",
      color: "bg-amber-50",
      src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&crop=center",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900">Our Collections</h2>
          <Button variant="outline" className="border-amber-700 text-amber-700">
            <Link href="/shop" className="flex items-center">
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              <CardContent className="p-0">
                {/* Image Container */}
                <div className={`h-48 ${collection.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <Image
                        src={collection.src}
                        alt={collection.title}
                        width={150}
                        height={150}
                        className="object-cover rounded-full border-4 border-white shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=400&h=400&fit=crop&crop=center&auto=format&fit=crop`;
                          e.currentTarget.alt = `${collection.title} - Coffee beans`;
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="px-6 py-4">
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">
                    {collection.title}
                  </h3>
                  <p className="text-gray-600">{collection.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}