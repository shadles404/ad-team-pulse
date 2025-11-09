import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Delivery, DELIVERY_STATUSES } from "@/types/delivery";

interface EditDeliveryDialogProps {
  delivery: Delivery;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<Delivery>) => void;
}

export const EditDeliveryDialog = ({ delivery, open, onOpenChange, onSave }: EditDeliveryDialogProps) => {
  const [formData, setFormData] = useState({
    celebName: delivery.celebName,
    productName: delivery.productName,
    quantity: delivery.quantity,
    dateSent: new Date(delivery.dateSent).toISOString().split("T")[0],
    deliveryStatus: delivery.deliveryStatus,
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
              <Label htmlFor="edit-celebName">Celebrity Name</Label>
              <Input
                id="edit-celebName"
                value={formData.celebName}
                onChange={(e) => setFormData({ ...formData, celebName: e.target.value })}
                required
              />
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
