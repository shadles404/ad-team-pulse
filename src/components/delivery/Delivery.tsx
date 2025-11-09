import { DeliveryForm } from "./DeliveryForm";
import { DeliveryTable } from "./DeliveryTable";
import { Delivery as DeliveryType } from "@/types/delivery";
import { TeamMember } from "@/types/team";

interface DeliveryProps {
  deliveries: DeliveryType[];
  onAdd: (delivery: any) => void;
  onUpdate: (id: string, updates: Partial<DeliveryType>) => void;
  onDelete: (id: string) => void;
  userId: string;
  teamMembers: TeamMember[];
}

export const Delivery = ({ deliveries, onAdd, onUpdate, onDelete, userId, teamMembers }: DeliveryProps) => {
  return (
    <div className="space-y-6">
      <DeliveryForm onSubmit={onAdd} userId={userId} teamMembers={teamMembers} />
      <DeliveryTable deliveries={deliveries} onUpdate={onUpdate} onDelete={onDelete} teamMembers={teamMembers} />
    </div>
  );
};
