import { FormattedReview } from "@/lib/interface/app-review";
import { Button } from "../button";
import { ChevronRight, Star, User } from "lucide-react";
import { Card, CardContent } from "../card";
import { formatDate } from "@/lib/helper/format-date";
import Link from "next/link";

export default function TestimonialsSection({
  reviews,
  loadingReviews,
  reviewError,
}: {
  reviews: FormattedReview[];
  loadingReviews: boolean;
  reviewError: string | null;
}) {
  return (
    <section className="py-16 px-4 bg-amber-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900">
            What Our Customers Say
          </h2>
          <Button variant="outline" className="border-amber-700 text-amber-700">
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
                        <p className="text-gray-600 text-sm">Verified Buyer</p>
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
  );
}
