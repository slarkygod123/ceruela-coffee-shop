import { useState, useEffect } from "react";
import { Order } from "@/lib/interface/order";

interface UseOrdersProps {
  userId: number | null;
}

export function useOrders({ userId }: UseOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/orders?user_id=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Parse the JSON string if items is stored as string
          const parsedOrders = data.data.map((order: any) => ({
            ...order,
            items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []
          }));
          setOrders(parsedOrders);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const refetchOrders = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/orders?user_id=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const parsedOrders = data.data.map((order: any) => ({
          ...order,
          items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []
        }));
        setOrders(parsedOrders);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error refetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    refetchOrders,
  };
}