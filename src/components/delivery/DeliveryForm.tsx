import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DELIVERY_STATUSES } from "@/types/delivery";
import { TeamMember } from "@/types/team";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryFormProps {
  onSubmit: (delivery: any) => void;
  userId: string;
  teamMembers: TeamMember[];
}

export const DeliveryForm = ({ onSubmit, userId, teamMembers }: DeliveryFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    celebId: "",
    celebName: "",
    productName: "",
    quantity: 1,
    dateSent: new Date().toISOString().split("T")[0],
    deliveryStatus: "Pending",
    deliveryPrice: 0,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      userId,
      dateSent: new Date(formData.dateSent).toISOString(),
    });
    setFormData({
      celebId: "",
      celebName: "",
      productName: "",
      quantity: 1,
      dateSent: new Date().toISOString().split("T")[0],
      deliveryStatus: "Pending",
      deliveryPrice: 0,
      notes: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Delivery</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Celebrity/Influencer *</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {formData.celebId
                      ? teamMembers.find((member) => member.id === formData.celebId)?.description
                      : "Select celebrity..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search celebrity..." />
                    <CommandList>
                      <CommandEmpty>No celebrity found.</CommandEmpty>
                      <CommandGroup>
                        {teamMembers.map((member) => (
                          <CommandItem
                            key={member.id}
                            value={member.description}
                            onSelect={() => {
                              setFormData({ 
                                ...formData, 
                                celebId: member.id,
                                celebName: member.description 
                              });
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.celebId === member.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {member.description}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateSent">Date Sent *</Label>
              <Input
                id="dateSent"
                type="date"
                value={formData.dateSent}
                onChange={(e) => setFormData({ ...formData, dateSent: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryStatus">Delivery Status *</Label>
              <Select
                value={formData.deliveryStatus}
                onValueChange={(value) => setFormData({ ...formData, deliveryStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryPrice">Delivery Price *</Label>
              <Input
                id="deliveryPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.deliveryPrice}
                onChange={(e) => setFormData({ ...formData, deliveryPrice: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
            />
          </div>

          <Button type="submit" className="w-full">Add Delivery</Button>
        </form>
      </CardContent>
    </Card>
  );
};
