import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentConfirmation } from "@/types/payment";

export const usePaymentConfirmations = (userId: string | undefined) => {
  const [confirmations, setConfirmations] = useState<PaymentConfirmation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConfirmations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("payment_confirmations")
        .select("*")
        .order("confirmed_at", { ascending: false });

      if (error) throw error;

      setConfirmations(data?.map(d => ({
        ...d,
        payment_status: d.payment_status || 'pending'
      })) || []);
    } catch (error) {
      console.error("Error fetching payment confirmations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchConfirmations();
  }, [userId, fetchConfirmations]);

  const addConfirmation = async (confirmation: Omit<PaymentConfirmation, "id" | "created_at" | "updated_at" | "confirmed_at">) => {
    try {
      const { error } = await supabase
        .from("payment_confirmations")
        .insert([{
          ...confirmation,
          month: confirmation.month || new Date().getMonth() + 1,
          year: confirmation.year || new Date().getFullYear(),
          payment_status: confirmation.payment_status || 'pending'
        }]);

      if (error) throw error;

      await fetchConfirmations();
    } catch (error) {
      console.error("Error adding payment confirmation:", error);
      throw error;
    }
  };

  const updateConfirmation = async (id: string, updates: Partial<PaymentConfirmation>) => {
    try {
      const { error } = await supabase
        .from("payment_confirmations")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      await fetchConfirmations();
    } catch (error) {
      console.error("Error updating payment confirmation:", error);
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

  // Check if payment already exists for a member in a given month/year
  const hasPaymentForMonth = useCallback((celebrityId: string, month: number, year: number) => {
    return confirmations.some(c => 
      c.celebrity_id === celebrityId && 
      c.month === month && 
      c.year === year
    );
  }, [confirmations]);

  return {
    confirmations,
    loading,
    addConfirmation,
    updateConfirmation,
    deleteConfirmation,
    hasPaymentForMonth,
    refetch: fetchConfirmations,
  };
};
