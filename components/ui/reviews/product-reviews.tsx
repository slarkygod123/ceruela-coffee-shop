"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User, Calendar, AlertCircle, ShoppingBag, Lock, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/store/useAuth";
import toast from "react-hot-toast";
import { Review } from "@/lib/interface/review";
import { ProductReviewsProps } from "@/lib/interface/product-reviews";
import { useMounted } from "@/hooks/useMounted";

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { isLoggedIn, userId, profile_picture: authProfilePicture } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [purchaseChecking, setPurchaseChecking] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setError(null);
        const response = await fetch(`/api/reviews?product_id=${productId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Fetched reviews:', data);
        
        if (data.success) {
          setReviews(data.data || []);
        } else {
          setError(data.error || 'Failed to load reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [productId]);
  
  // Check if user has purchased this product
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!isLoggedIn || !userId) {
        setHasPurchased(false);
        return;
      }
      
      setPurchaseChecking(true);
      try {
        const response = await fetch(`/api/orders/has-purchased?user_id=${userId}&product_id=${productId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setHasPurchased(data.hasPurchased);
        } else {
          console.error('Failed to check purchase status:', data.error);
          setHasPurchased(false);
        }
      } catch (error) {
        console.error('Error checking purchase status:', error);
        setHasPurchased(false);
      } finally {
        setPurchaseChecking(false);
      }
    };
    
    if (isLoggedIn && userId) {
      checkPurchaseStatus();
    } else {
      setHasPurchased(false);
    }
  }, [isLoggedIn, userId, productId]);
  
  const handleSubmitReview = async () => {
    if (!isLoggedIn || !userId) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (!hasPurchased) {
      toast.error('You must purchase this product before submitting a review');
      return;
    }
    
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          rating,
          comment: comment.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Review submitted successfully!');
        
        // Refresh reviews
        const refreshResponse = await fetch(`/api/reviews?product_id=${productId}`);
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          setReviews(refreshData.data || []);
        }
        
        // Reset form
        setRating(5);
        setComment("");
        setShowReviewForm(false);
      } else {
        if (data.error === "You must purchase this product before reviewing") {
          toast.error('You need to purchase this product first');
          setHasPurchased(false);
        } else {
          toast.error(data.error || 'Failed to submit review');
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };
  
  // Function to get user initials for avatar fallback
  const getUserInitials = (email: string) => {
    if (!email) return 'U';
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase();
  };
  
  // Check if user has already reviewed this product
  const hasUserReviewed = isLoggedIn && reviews.some(review => review.user_id === userId);
  
  // Determine if user can review
  const canReview = isLoggedIn && hasPurchased && !hasUserReviewed;
  
  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-amber-900">Customer Reviews</h3>
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">Error Loading Reviews</h4>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-amber-900">Customer Reviews</h3>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${reviews.length} review${reviews.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        
        {isLoggedIn && !hasUserReviewed && !purchaseChecking && (
          <div className="flex flex-col items-end gap-2">
            {canReview ? (
              <Button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                variant="outline"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </Button>
            ) : !hasPurchased ? (
              <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-md">
                <Lock className="h-4 w-4" />
                <span className="text-sm">Purchase required to review</span>
              </div>
            ) : null}
          </div>
        )}
        
        {purchaseChecking && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-amber-500"></div>
            <span className="text-sm">Checking purchase status...</span>
          </div>
        )}
      </div>
      
      {/* Login Prompt */}
      {!isLoggedIn && (
        <Card className="border-amber-100 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-amber-600 mr-2" />
                <p className="text-amber-800">
                  Please <a href="/login" className="font-semibold underline">login</a> and purchase this product to submit a review
                </p>
              </div>
              <a href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}
          
      {/* Review Form */}
      {showReviewForm && canReview && (
        <Card className="border-amber-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="text-sm font-medium">✓ Verified Purchaser</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <Textarea
                  placeholder="Share your experience with this coffee..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Share what you liked or disliked about this product
                </p>
              </div>
              
              <Button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              
              <p className="text-xs text-center text-gray-500">
                Your review will be marked as "Verified Purchase"
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No reviews yet</h4>
            <p className="text-gray-500 mb-4">Be the first to share your thoughts!</p>
            
            {isLoggedIn ? (
              hasPurchased ? (
                <Button 
                  onClick={() => setShowReviewForm(true)}
                  variant="outline"
                >
                  Write the First Review
                </Button>
              ) : (
                  <div className="flex items-center justify-center gap-2 text-amber-700">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Purchase this product to leave the first review</span>
                  </div>
              )
            ) : (
              <p className="text-sm text-amber-600">
                Please login and purchase this product to leave a review
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.review_id} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    {/* Profile Picture Section */}
                    <div className="mr-3">
                      {review.profile_picture ? (
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-amber-200">
                          <img 
                            src={review.profile_picture} 
                            alt={`${review.user_email.split('@')[0]}'s profile`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              // If image fails to load, show fallback
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = `
                                <div class="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-200">
                                  <User class="h-6 w-6 text-amber-700" />
                                </div>
                              `;
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-200">
                          <User className="h-6 w-6 text-amber-700" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {review.user_email.split('@')[0]} 
                        </p>
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                          <ShoppingBag className="h-3 w-3" />
                          Verified Purchase
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(review.review_date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}