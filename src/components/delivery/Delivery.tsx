import { DeliveryForm } from "./DeliveryForm";
import { DeliveryTable } from "./DeliveryTable";
import { Delivery as DeliveryType } from "@/types/delivery";

interface DeliveryProps {
  deliveries: DeliveryType[];
  onAdd: (delivery: any) => void;
  onUpdate: (id: string, updates: Partial<DeliveryType>) => void;
  onDelete: (id: string) => void;
  userId: string;
}

export const Delivery = ({ deliveries, onAdd, onUpdate, onDelete, userId }: DeliveryProps) => {
  return (
    <div className="space-y-6">
      <DeliveryForm onSubmit={onAdd} userId={userId} />
      <DeliveryTable deliveries={deliveries} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  );
};
