import { OrderItem } from "./order-item";

export interface Order {
    order_id: number;
    user_id: number;
    order_date: string;
    total_amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    shipping_address: string;
    payment_method: string;
    item_count: number;
    items: OrderItem[];
  }