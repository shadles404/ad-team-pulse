import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Delivery, DELIVERY_STATUSES } from "@/types/delivery";
import { TeamMember } from "@/types/team";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditDeliveryDialogProps {
  delivery: Delivery;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<Delivery>) => void;
  teamMembers: TeamMember[];
}

export const EditDeliveryDialog = ({ delivery, open, onOpenChange, onSave, teamMembers }: EditDeliveryDialogProps) => {
  const [comboOpen, setComboOpen] = useState(false);
  const [formData, setFormData] = useState({
    celebId: delivery.celebId || "",
    celebName: delivery.celebName,
    productName: delivery.productName,
    quantity: delivery.quantity,
    dateSent: new Date(delivery.dateSent).toISOString().split("T")[0],
    deliveryStatus: delivery.deliveryStatus,
    deliveryPrice: delivery.deliveryPrice || 0,
    notes: delivery.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      dateSent: new Date(formData.dateSent).toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Delivery</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Celebrity/Influencer</Label>
              <Popover open={comboOpen} onOpenChange={setComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboOpen}
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
                              setComboOpen(false);
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
              <Label htmlFor="edit-productName">Product Name</Label>
              <Input
                id="edit-productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dateSent">Date Sent</Label>
              <Input
                id="edit-dateSent"
                type="date"
                value={formData.dateSent}
                onChange={(e) => setFormData({ ...formData, dateSent: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-deliveryStatus">Delivery Status</Label>
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
              <Label htmlFor="edit-deliveryPrice">Delivery Price</Label>
              <Input
                id="edit-deliveryPrice"
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
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
