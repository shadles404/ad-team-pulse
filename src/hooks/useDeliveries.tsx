import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Delivery } from "@/types/delivery";
import { useToast } from "@/hooks/use-toast";

export const useDeliveries = (userId: string | undefined) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchDeliveries();
    }
  }, [userId]);

  const fetchDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from("deliveries")
        .select("*")
        .order("date_sent", { ascending: false });

      if (error) throw error;

      const mappedDeliveries: Delivery[] = (data || []).map((d) => ({
        id: d.id,
        userId: d.user_id,
        celebName: d.celebrity_name,
        celebId: d.celebrity_id,
        productName: d.product_name,
        quantity: d.quantity,
        dateSent: d.date_sent,
        deliveryStatus: d.delivery_status,
        deliveryPrice: d.delivery_price || 0,
        notes: d.notes,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));

      setDeliveries(mappedDeliveries);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addDelivery = async (delivery: Omit<Delivery, "id" | "createdAt" | "updatedAt">) => {
    try {
      const { error } = await supabase.from("deliveries").insert({
        user_id: delivery.userId,
        celebrity_name: delivery.celebName,
        celebrity_id: delivery.celebId,
        product_name: delivery.productName,
        quantity: delivery.quantity,
        date_sent: delivery.dateSent,
        delivery_status: delivery.deliveryStatus,
        delivery_price: delivery.deliveryPrice,
        notes: delivery.notes,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery record added successfully",
      });

      fetchDeliveries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateDelivery = async (id: string, updates: Partial<Delivery>) => {
    try {
      const { error } = await supabase
        .from("deliveries")
        .update({
          celebrity_name: updates.celebName,
          celebrity_id: updates.celebId,
          product_name: updates.productName,
          quantity: updates.quantity,
          date_sent: updates.dateSent,
          delivery_status: updates.deliveryStatus,
          delivery_price: updates.deliveryPrice,
          notes: updates.notes,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery updated successfully",
      });

      fetchDeliveries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteDelivery = async (id: string) => {
    try {
      const { error } = await supabase.from("deliveries").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery deleted successfully",
      });

      fetchDeliveries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    deliveries,
    loading,
    addDelivery,
    updateDelivery,
    deleteDelivery,
  };
};
