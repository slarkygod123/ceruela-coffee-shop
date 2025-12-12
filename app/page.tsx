"use client";

import { FormattedReview } from "@/lib/interface/app-review";
import { FeaturedCoffee } from "@/lib/interface/featured-coffee";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/useAuth";
import { useMounted } from "@/hooks/useMounted";
import FeaturesSection from "@/components/ui/landing-page/features";
import CoffeeCollectionSection from "@/components/ui/landing-page/coffee-collections";
import TestimonialsSection from "@/components/ui/landing-page/testimonials";
import CTASection from "@/components/ui/landing-page/cta";
import HeroSection from "@/components/ui/landing-page/hero";

export default function Home() {
  const [featuredCoffees, setFeaturedCoffees] = useState<FeaturedCoffee[]>([]);
  const [featuredCoffeeIndex, setFeaturedCoffeeIndex] = useState(0);
  const [reviews, setReviews] = useState<FormattedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  // fetch featured coffees
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

  // fetch featured reviews
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

  // auto rotate featured coffee
  useEffect(() => {
    if (featuredCoffees.length > 0) {
      const interval = setInterval(() => {
        setFeaturedCoffeeIndex((prev) => (prev + 1) % featuredCoffees.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [featuredCoffees]);

  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        loading={loading}
        isLoggedIn={isLoggedIn}
        error={error}
        featuredCoffeeIndex={featuredCoffeeIndex}
        setFeaturedCoffeeIndex={setFeaturedCoffeeIndex}
        featuredCoffees={featuredCoffees}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Coffee Collections */}
      <CoffeeCollectionSection />

      {/* Testimonials */}
      <TestimonialsSection
        reviews={reviews}
        loadingReviews={loadingReviews}
        reviewError={reviewError}
      />

      {/* CTA Section */}
      <CTASection isLoggedIn={isLoggedIn} />
    </div>
  );
}
