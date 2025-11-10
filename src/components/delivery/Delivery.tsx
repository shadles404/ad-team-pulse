import { useState } from "react";
import { DeliveryForm } from "./DeliveryForm";
import { DeliveryTable } from "./DeliveryTable";
import { Delivery as DeliveryType } from "@/types/delivery";
import { TeamMember } from "@/types/team";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DeliveryProps {
  deliveries: DeliveryType[];
  onAdd: (delivery: any) => void;
  onUpdate: (id: string, updates: Partial<DeliveryType>) => void;
  onDelete: (id: string) => void;
  userId: string;
  teamMembers: TeamMember[];
  isAdmin: boolean;
}

export const Delivery = ({ deliveries, onAdd, onUpdate, onDelete, userId, teamMembers, isAdmin }: DeliveryProps) => {
  const [activeTab, setActiveTab] = useState(isAdmin ? "add" : "records");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          {isAdmin && <TabsTrigger value="add">Add New Delivery</TabsTrigger>}
          <TabsTrigger value="records">Delivery Records</TabsTrigger>
        </TabsList>
        
        {isAdmin && (
          <TabsContent value="add" className="mt-6">
            <DeliveryForm onSubmit={onAdd} userId={userId} teamMembers={teamMembers} />
          </TabsContent>
        )}
        
        <TabsContent value="records" className="mt-6">
          <DeliveryTable 
            deliveries={deliveries} 
            onUpdate={onUpdate} 
            onDelete={onDelete} 
            teamMembers={teamMembers}
            isAdmin={isAdmin}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
