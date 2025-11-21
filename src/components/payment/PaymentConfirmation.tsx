import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PaymentConfirmation as PaymentConfirmationType } from "@/types/payment";
import { TeamMember } from "@/types/team";
import { PaymentConfirmationTable } from "./PaymentConfirmationTable";
import { PaymentConfirmationForm } from "./PaymentConfirmationForm";

interface PaymentConfirmationProps {
  confirmations: PaymentConfirmationType[];
  onAdd: (confirmation: any) => void;
  onDelete: (id: string) => void;
  userId: string;
  teamMembers: TeamMember[];
  isAdmin: boolean;
}

export const PaymentConfirmation = ({
  confirmations,
  onAdd,
  onDelete,
  userId,
  teamMembers,
  isAdmin,
}: PaymentConfirmationProps) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Payment Confirmation</h2>
          <p className="text-muted-foreground mt-1">
            Confirmed celebrity payments for finance office
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {showForm ? "Cancel" : "Add Confirmation"}
          </Button>
        )}
      </div>

      {showForm && isAdmin && (
        <PaymentConfirmationForm
          onSubmit={onAdd}
          userId={userId}
          teamMembers={teamMembers}
          onCancel={() => setShowForm(false)}
        />
      )}

      <PaymentConfirmationTable
        confirmations={confirmations}
        onDelete={onDelete}
        isAdmin={isAdmin}
      />
    </div>
  );
};
