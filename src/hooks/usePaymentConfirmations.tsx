import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentConfirmation } from "@/types/payment";

export const usePaymentConfirmations = (userId: string | undefined) => {
  const [confirmations, setConfirmations] = useState<PaymentConfirmation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConfirmations = async () => {
    try {
      const { data, error } = await supabase
        .from("payment_confirmations")
        .select("*")
        .order("confirmed_at", { ascending: false });

      if (error) throw error;

      setConfirmations(data || []);
    } catch (error) {
      console.error("Error fetching payment confirmations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchConfirmations();
  }, [userId]);

  const addConfirmation = async (confirmation: Omit<PaymentConfirmation, "id" | "created_at" | "updated_at" | "confirmed_at">) => {
    try {
      const { error } = await supabase
        .from("payment_confirmations")
        .insert([confirmation]);

      if (error) throw error;

      await fetchConfirmations();
    } catch (error) {
      console.error("Error adding payment confirmation:", error);
      throw error;
    }
  };

  const deleteConfirmation = async (id: string) => {
    try {
      const { error } = await supabase
        .from("payment_confirmations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await fetchConfirmations();
    } catch (error) {
      console.error("Error deleting payment confirmation:", error);
      throw error;
    }
  };

  return {
    confirmations,
    loading,
    addConfirmation,
    deleteConfirmation,
    refetch: fetchConfirmations,
  };
};
