// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormattedReview } from "@/lib/interface/app-review";
import { FeaturedCoffee } from "@/lib/interface/featured-coffee";
import { Coffee, Clock, Star, ChevronRight, Leaf, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/useAuth"; // ADDED
import { useMounted } from "@/hooks/useMounted";

export default function Home() {
  const [featuredCoffees, setFeaturedCoffees] = useState<FeaturedCoffee[]>([]);
  const [featuredCoffeeIndex, setFeaturedCoffeeIndex] = useState(0);
  const [reviews, setReviews] = useState<FormattedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  // Fetch featured coffees from API
  useEffect(() => {
    const fetchFeaturedCoffees = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products/featured");

        if (!response.ok) {
          throw new Error("Failed to fetch featured coffees");
        }

        const data = await response.json();

        if (data.success && data.data) {
          setFeaturedCoffees(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCoffees();
  }, []);

  // Fetch featured reviews from API
  useEffect(() => {
    const fetchFeaturedReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await fetch("/api/reviews/featured?limit=3");

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();

        if (data.success && data.data) {
          setReviews(data.data);
        }
      } catch (err) {
        setReviewError(
          err instanceof Error ? err.message : "An error occurred"
        );
        console.error("Error fetching reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchFeaturedReviews();
  }, []);

  // Auto-rotate featured coffee
  useEffect(() => {
    if (featuredCoffees.length > 0) {
      const interval = setInterval(() => {
        setFeaturedCoffeeIndex((prev) => (prev + 1) % featuredCoffees.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [featuredCoffees]);

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString("en-PH")}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
                {!isLoggedIn && ( // ADDED CONDITION
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
                  <p className="text-amber-100">
                    Featured coffees coming soon!
                  </p>
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
                  <p className="text-amber-100">
                    No featured coffees available
                  </p>
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

      {/* Features Section */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-amber-900 mb-12">
            Why Choose Our Coffee?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  Premium Quality
                </h3>
                <p className="text-gray-600">
                  Directly sourced from sustainable farms worldwide, ensuring
                  the finest quality beans.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  Freshly Roasted
                </h3>
                <p className="text-gray-600">
                  Roasted in small batches and shipped within 24 hours for
                  maximum freshness.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  Ethically Sourced
                </h3>
                <p className="text-gray-600">
                  Directly partnered with sustainable farms ensuring fair wages
                  and environmental care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Coffee Collections */}
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

      {/* Testimonials - UPDATED WITH REAL REVIEWS */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900">
              What Our Customers Say
            </h2>
            <Button
              variant="outline"
              className="border-amber-700 text-amber-700"
            >
              <Link href="/shop" className="flex items-center">
                View All Reviews
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loadingReviews ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 bg-white shadow-lg">
                  <CardContent className="p-8">
                    <div className="animate-pulse space-y-4">
                      <div className="flex gap-1">
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-3 w-20 bg-gray-200 rounded"></div>
                          <div className="h-2 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : reviewError ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Maria S.",
                  quote:
                    "The Ethiopian Yirgacheffe is the best coffee I've ever had at home! Perfect for my morning routine in Manila.",
                  role: "Coffee Club Member",
                  location: "Manila",
                  rating: 5,
                },
                {
                  name: "Juan D.",
                  quote:
                    "Fresh delivery every month keeps my mornings perfect. Highly recommended for fellow coffee lovers in Cebu!",
                  role: "Subscription Member",
                  location: "Cebu",
                  rating: 5,
                },
                {
                  name: "Ana L.",
                  quote:
                    "Outstanding quality and customer service. My go-to for special gifts and corporate presents.",
                  role: "Regular Customer",
                  location: "Davao",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="border-0 bg-white shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg italic mb-6">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-bold text-amber-900">
                          {testimonial.name}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-600 text-sm">
                            {testimonial.role}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Maria S.",
                  quote:
                    "The Ethiopian Yirgacheffe is the best coffee I've ever had at home! Perfect for my morning routine in Manila.",
                  role: "Coffee Club Member",
                  location: "Manila",
                  rating: 5,
                },
                {
                  name: "Juan D.",
                  quote:
                    "Fresh delivery every month keeps my mornings perfect. Highly recommended for fellow coffee lovers in Cebu!",
                  role: "Subscription Member",
                  location: "Cebu",
                  rating: 5,
                },
                {
                  name: "Ana L.",
                  quote:
                    "Outstanding quality and customer service. My go-to for special gifts and corporate presents.",
                  role: "Regular Customer",
                  location: "Davao",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="border-0 bg-white shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg italic mb-6">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-bold text-amber-900">
                          {testimonial.name}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-600 text-sm">
                            {testimonial.role}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <Card
                  key={review.review_id}
                  className="border-0 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-8 h-full flex flex-col">
                    {/* Rating Stars */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {formatDate(review.review_date)}
                      </span>
                    </div>

                    {/* Review Comment */}
                    <p className="text-gray-700 text-lg italic mb-6 flex-grow">
                      "{review.comment || `Loved the ${review.product_name}`}"
                    </p>

                    {/* Product Info */}
                    <div className="mb-4">
                      <p className="text-sm text-amber-700 font-medium">
                        About:{" "}
                        <span className="font-bold">{review.product_name}</span>
                      </p>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div>
                        {review.profile_picture ? (
                          <img
                            src={review.profile_picture}
                            alt={review.user_name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-amber-700" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-amber-900">
                          {review.user_name}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-600 text-sm">
                            Verified Buyer
                          </p>
                          <p className="text-gray-500 text-xs">
                            {review.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Brew Something Amazing?
          </h2>
          <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto">
            Join thousands of Filipino coffee lovers who start their day with
            our premium beans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-amber-900 hover:bg-amber-100 text-lg px-8 py-6"
            >
              <Link href="/shop" className="flex items-center">
                Start Shopping
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {!isLoggedIn && (
              <Button
                size="lg"
                variant="outline"
                className="border-white text-amber-900 hover:bg-amber-100 text-lg px-8 py-6"
              >
                <Link href="/register">Create Free Account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
