import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Review } from "@/lib/interface/review";

export const useReviews = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/reviews?product_id=${productId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
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
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async (rating: number, comment: string, userId: string) => {
    if (!userId) {
      toast.error('Please login to submit a review');
      return false;
    }
    
    if (!rating) {
      toast.error('Please select a rating');
      return false;
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
        return true;
      } else {
        if (data.error === "You must purchase this product before reviewing") {
          toast.error('You need to purchase this product first');
        } else {
          toast.error(data.error || 'Failed to submit review');
        }
        return false;
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reviews,
    loading,
    error,
    submitting,
    submitReview,
    refreshReviews: fetchReviews
  };
};