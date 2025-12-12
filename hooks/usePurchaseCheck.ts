import { useState, useEffect } from "react";

export const usePurchaseCheck = (userId: string | null, productId: string, isLoggedIn: boolean) => {
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!isLoggedIn || !userId) {
        setHasPurchased(false);
        return;
      }
      
      setLoading(true);
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
        setLoading(false);
      }
    };
    
    if (isLoggedIn && userId) {
      checkPurchaseStatus();
    } else {
      setHasPurchased(false);
    }
  }, [isLoggedIn, userId, productId]);

  return { hasPurchased, loading };
};