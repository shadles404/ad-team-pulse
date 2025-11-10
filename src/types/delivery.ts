export interface Delivery {
  id: string;
  userId: string;
  celebName: string;
  celebId?: string;
  productName: string;
  quantity: number;
  dateSent: string;
  deliveryStatus: string;
  deliveryPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const DELIVERY_STATUSES = [
  "Pending",
  "Sent",
  "Delivered",
  "Cancelled"
] as const;
